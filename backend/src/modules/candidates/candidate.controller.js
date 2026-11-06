import { Candidate } from './candidate.model.js';
import { User } from '../users/user.model.js';
import { Resume } from '../resumes/resume.model.js';
import { Application } from '../applications/application.model.js';
import { Job } from '../jobs/job.model.js';
import { ResumeAnalysis } from '../ai/resumeAnalysis.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { extractTextFromBuffer } from '../../services/textExtractor.service.js';
import { analyzeResumeAI, calculateJobMatch } from '../../services/ai.service.js';
import { getIsConnected } from '../../config/db.js';

export const getProfile = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    let candidate = await Candidate.findOne({ userId: req.user._id }).populate('userId', 'fullName email phone profileImage');
    if (!candidate) {
      candidate = await Candidate.create({
        userId: req.user._id,
        headline: '',
        location: '',
        skills: [],
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        profileCompletion: 25,
      });
    }
    res.json({ success: true, profile: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const { headline, bio, location, experienceLevel, totalExperience, expectedSalary, skills, education, experience, projects, certifications, preferredLocations } = req.body;

    let candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      candidate = new Candidate({ userId: req.user._id });
    }

    if (headline !== undefined) candidate.headline = headline;
    if (bio !== undefined) candidate.bio = bio;
    if (location !== undefined) candidate.location = location;
    if (experienceLevel !== undefined) candidate.experienceLevel = experienceLevel;
    if (totalExperience !== undefined) candidate.totalExperience = totalExperience;
    if (expectedSalary !== undefined) candidate.expectedSalary = expectedSalary;
    if (skills !== undefined) candidate.skills = skills;
    if (education !== undefined) candidate.education = education;
    if (experience !== undefined) candidate.experience = experience;
    if (projects !== undefined) candidate.projects = projects;
    if (certifications !== undefined) candidate.certifications = certifications;
    if (preferredLocations !== undefined) candidate.preferredLocations = preferredLocations;

    // Calculate profile completion score
    let score = 25;
    if (candidate.headline) score += 15;
    if (candidate.skills && candidate.skills.length > 0) score += 20;
    if (candidate.education && candidate.education.length > 0) score += 15;
    if (candidate.experience && candidate.experience.length > 0) score += 15;
    if (candidate.projects && candidate.projects.length > 0) score += 10;
    candidate.profileCompletion = Math.min(score, 100);

    await candidate.save();

    res.json({ success: true, message: 'Profile updated successfully.', profile: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCandidateDashboard = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const applications = await Application.find({ candidateId: candidate._id })
      .populate('jobId')
      .populate('companyId', 'companyName logo industry headquarters')
      .sort({ appliedAt: -1 })
      .limit(5);

    const resumes = await Resume.find({ candidateId: candidate._id }).sort({ createdAt: -1 });
    const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0] || null;

    let latestAnalysis = null;
    if (primaryResume) {
      latestAnalysis = await ResumeAnalysis.findOne({ resumeId: primaryResume._id }).sort({ createdAt: -1 });
    }

    const recommendedJobs = await Job.find({ status: 'published' })
      .populate('companyId', 'companyName logo industry headquarters')
      .limit(4);

    res.json({
      success: true,
      dashboard: {
        profileCompletion: candidate.profileCompletion ?? 25,
        resumesCount: resumes.length,
        primaryResume,
        latestAnalysis,
        applicationsCount: applications.length,
        recentApplications: applications,
        recommendedJobs,
        skills: candidate.skills || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadResume = async (req, res) => {
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

    // 1. Upload to Cloudinary / storage
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'campusplus/resumes'
    );

    // 2. Extract text & parse with PulseAI (Dataman Qwen 27B / Neural Engine)
    const extractedText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
    const analysisResult = await analyzeResumeAI(extractedText, candidate.headline || 'Software Engineer');

    const existingCount = await Resume.countDocuments({ candidateId: candidate._id });
    const resume = await Resume.create({
      candidateId: candidate._id,
      fileName: req.file.originalname,
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      fileType: req.file.mimetype,
      fileSize: uploadResult.bytes || req.file.size,
      version: existingCount + 1,
      isPrimary: existingCount === 0,
      parsingStatus: 'completed',
    });

    const resumeAnalysis = await ResumeAnalysis.create({
      resumeId: resume._id,
      candidateId: candidate._id,
      overallScore: analysisResult.overallScore || 75,
      extractedData: analysisResult.candidate,
      analysis: analysisResult.analysis,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      suggestions: analysisResult.suggestions,
      missingSections: analysisResult.missingSections,
      careerRecommendations: analysisResult.careerRecommendations,
      model: analysisResult.model || 'PulseAI Neural Engine',
    });

    // Sync candidate profile with actual extracted details
    if (analysisResult.candidate?.skills?.length) {
      const existingSkills = new Set(candidate.skills || []);
      analysisResult.candidate.skills.forEach((s) => existingSkills.add(s));
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

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully with PulseAI.',
      resume,
      analysis: resumeAnalysis,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error uploading resume.' });
  }
};

export const getResumes = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const resumes = await Resume.find({ candidateId: candidate._id }).sort({ createdAt: -1 });
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const { id } = req.params;

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const resume = await Resume.findOne({ _id: id, candidateId: candidate._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    if (resume.publicId) {
      try {
        await deleteFromCloudinary(resume.publicId);
      } catch (e) {
        console.warn('Cloudinary delete warning:', e.message);
      }
    }

    await Resume.deleteOne({ _id: resume._id });
    await ResumeAnalysis.deleteMany({ resumeId: resume._id });

    if (resume.isPrimary) {
      const nextResume = await Resume.findOne({ candidateId: candidate._id });
      if (nextResume) {
        nextResume.isPrimary = true;
        await nextResume.save();
      }
    }

    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCandidateApplications = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const applications = await Application.find({ candidateId: candidate._id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'companyName logo industry headquarters' },
      })
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCandidateRecommendations = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }
    const jobs = await Job.find({ status: 'published' })
      .populate('companyId', 'companyName logo industry headquarters')
      .limit(10);

    const recommendedJobs = await Promise.all(
      jobs.map(async (job) => {
        const match = await calculateJobMatch(candidate, job);
        return {
          ...job.toObject(),
          matchPercentage: match.overallMatchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          matchExplanation: match.explanation,
        };
      })
    );

    // Sort by match score descending
    recommendedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ success: true, recommendations: recommendedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
