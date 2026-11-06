import { Resume } from '../resumes/resume.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { Job } from '../jobs/job.model.js';
import { Application } from '../applications/application.model.js';
import { ResumeAnalysis } from './resumeAnalysis.model.js';
import {
  analyzeResumeAI,
  matchCandidateWithJobs,
  generateRecommendedJobsForProfile,
} from '../../services/ai.service.js';
import { extractTextFromBuffer } from '../../services/textExtractor.service.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';
import { calculateJobMatch } from '../../services/gemini.service.js';
import { getIsConnected } from '../../config/db.js';

/**
 * Upload and directly Analyze Resume with PulseAI
 * Extracts Location, Skills, Experience, Education, ATS score, and matches jobs
 */
export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a resume file (PDF or DOCX).' });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    // 1. Upload to storage
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'campusplus/resumes'
    );

    // 2. Extract text from resume buffer
    const extractedText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);

    // 3. Run AI analysis (Dataman Qwen 27B + intelligent heuristic parsing)
    const analysisResult = await analyzeResumeAI(extractedText, candidate.headline || 'Software Engineer');

    // 4. Create/update Resume document
    const existingCount = await Resume.countDocuments({ candidateId: candidate._id });
    const resume = await Resume.create({
      candidateId: candidate._id,
      fileName: req.file.originalname,
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      fileType: req.file.mimetype,
      fileSize: uploadResult.bytes || req.file.size,
      version: existingCount + 1,
      isPrimary: true, // Make newly analyzed resume primary
      parsingStatus: 'completed',
    });

    // Unset other primary resumes if any
    await Resume.updateMany(
      { candidateId: candidate._id, _id: { $ne: resume._id } },
      { $set: { isPrimary: false } }
    );

    // 5. Save Analysis to DB
    const resumeAnalysis = await ResumeAnalysis.create({
      resumeId: resume._id,
      candidateId: candidate._id,
      overallScore: analysisResult.overallScore,
      extractedData: analysisResult.candidate,
      analysis: analysisResult.analysis,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      suggestions: analysisResult.suggestions,
      missingSections: analysisResult.missingSections,
      careerRecommendations: analysisResult.careerRecommendations,
      model: analysisResult.model || 'qwen3.8-27b',
    });

    // 6. Automatically sync Candidate profile with real extracted data
    if (analysisResult.candidate?.skills?.length) {
      const existingSkills = new Set(candidate.skills || []);
      analysisResult.candidate.skills.forEach(s => existingSkills.add(s));
      candidate.skills = Array.from(existingSkills);
    }
    if (analysisResult.candidate?.location && (!candidate.location || candidate.location === '')) {
      candidate.location = analysisResult.candidate.location;
    }
    if (analysisResult.candidate?.totalExperienceYears !== undefined) {
      candidate.totalExperience = `${analysisResult.candidate.totalExperienceYears} years`;
      candidate.experienceLevel = analysisResult.candidate.totalExperienceYears > 4 ? 'senior' : analysisResult.candidate.totalExperienceYears > 1 ? 'mid' : 'junior';
    }
    await candidate.save();

    // 7. Find matching positions from published DB jobs + AI recommended positions
    const publishedJobs = await Job.find({ status: 'published' })
      .populate('companyId', 'companyName logo industry headquarters location')
      .limit(10);

    const matchedJobs = matchCandidateWithJobs(analysisResult.candidate, publishedJobs);

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully with PulseAI Engine.',
      resume,
      analysis: resumeAnalysis,
      candidateProfile: analysisResult.candidate,
      matchedJobs,
    });
  } catch (error) {
    console.error('PulseAI upload and analyze error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error running PulseAI analysis.' });
  }
};

/**
 * Re-Analyze existing resume or text
 */
export const analyzeResume = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const { resumeId, resumeText, targetRole } = req.body;
    let textToAnalyze = resumeText;
    let candidate = null;

    if (req.user && req.user.role === 'candidate') {
      candidate = await Candidate.findOne({ userId: req.user._id });
    }

    let resume = null;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else if (candidate) {
      resume = await Resume.findOne({ candidateId: candidate._id, isPrimary: true }) ||
                     await Resume.findOne({ candidateId: candidate._id }).sort({ createdAt: -1 });
    }

    if (!textToAnalyze && resume) {
      textToAnalyze = `Candidate resume: ${resume.fileName}.`;
    }

    if (!textToAnalyze && candidate && (candidate.skills?.length > 0 || candidate.headline)) {
      textToAnalyze = `Candidate: ${req.user.fullName}. Headline: ${candidate.headline}. Location: ${candidate.location}. Skills: ${(candidate.skills || []).join(', ')}. Experience: ${candidate.totalExperience}.`;
    }

    if (!textToAnalyze) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file to run PulseAI diagnostics.' });
    }

    const analysisResult = await analyzeResumeAI(textToAnalyze, targetRole || candidate?.headline || 'Software Engineer');

    let resumeAnalysis = null;
    if (candidate && resume) {
      resumeAnalysis = await ResumeAnalysis.findOneAndUpdate(
        { resumeId: resume._id },
        {
          resumeId: resume._id,
          candidateId: candidate._id,
          overallScore: analysisResult.overallScore,
          extractedData: analysisResult.candidate,
          analysis: analysisResult.analysis,
          strengths: analysisResult.strengths,
          weaknesses: analysisResult.weaknesses,
          suggestions: analysisResult.suggestions,
          missingSections: analysisResult.missingSections,
          careerRecommendations: analysisResult.careerRecommendations,
          model: analysisResult.model || 'qwen3.8-27b',
        },
        { upsert: true, new: true }
      );

      // Update candidate skills
      if (analysisResult.candidate?.skills?.length) {
        const existingSkills = new Set(candidate.skills || []);
        analysisResult.candidate.skills.forEach(s => existingSkills.add(s));
        candidate.skills = Array.from(existingSkills);
        if (analysisResult.candidate?.location && !candidate.location) {
          candidate.location = analysisResult.candidate.location;
        }
        await candidate.save();
      }
    }

    // Fetch matching jobs
    const publishedJobs = await Job.find({ status: 'published' })
      .populate('companyId', 'companyName logo industry headquarters location')
      .limit(10);

    const matchedJobs = matchCandidateWithJobs(analysisResult.candidate || { skills: candidate?.skills, location: candidate?.location }, publishedJobs);

    res.json({
      success: true,
      analysis: resumeAnalysis || analysisResult,
      candidateProfile: analysisResult.candidate,
      matchedJobs,
    });
  } catch (error) {
    console.error('PulseAI re-analyze error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get latest analysis for logged-in candidate with live matched jobs
 */
export const getLatestAnalysis = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const primaryResume = await Resume.findOne({ candidateId: candidate._id, isPrimary: true }) ||
                          await Resume.findOne({ candidateId: candidate._id }).sort({ createdAt: -1 });

    const allResumes = await Resume.find({ candidateId: candidate._id }).sort({ createdAt: -1 });

    let latestAnalysis = null;
    if (primaryResume) {
      latestAnalysis = await ResumeAnalysis.findOne({ resumeId: primaryResume._id }).sort({ createdAt: -1 });
    }

    const candidateProfile = latestAnalysis?.extractedData || {
      skills: candidate.skills || [],
      location: candidate.location || '',
      totalExperienceYears: parseFloat(candidate.totalExperience) || 0,
    };

    const publishedJobs = await Job.find({ status: 'published' })
      .populate('companyId', 'companyName logo industry headquarters location')
      .limit(10);

    const matchedJobs = matchCandidateWithJobs(candidateProfile, publishedJobs);

    res.json({
      success: true,
      analysis: latestAnalysis,
      primaryResume,
      resumes: allResumes,
      candidateProfile,
      matchedJobs,
    });
  } catch (error) {
    console.error('Get latest analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const matchJobForCandidate = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const { jobId } = req.body;
    const candidate = await Candidate.findOne({ userId: req.user._id });
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const matchResult = await calculateJobMatch(candidate, job);
    res.json({ success: true, match: matchResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const matchCandidatesForJob = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const applications = await Application.find({ jobId })
      .populate({
        path: 'candidateId',
        populate: { path: 'userId', select: 'fullName email phone profileImage' },
      })
      .populate('resumeId');

    const matchedApplicants = await Promise.all(
      applications.map(async (app) => {
        const match = await calculateJobMatch(app.candidateId, job);
        return {
          application: app,
          matchScore: match.overallMatchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          explanation: match.explanation,
        };
      })
    );

    matchedApplicants.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, candidates: matchedApplicants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
