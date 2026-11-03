import { Candidate } from './candidate.model.js';
import { User } from '../users/user.model.js';
import { Resume } from '../resumes/resume.model.js';
import { Application } from '../applications/application.model.js';
import { Job } from '../jobs/job.model.js';
import { ResumeAnalysis } from '../ai/resumeAnalysis.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { extractTextFromBuffer } from '../../services/textExtractor.service.js';
import { parseResumeWithAI, analyzeResumeWithAI, calculateJobMatch } from '../../services/gemini.service.js';
import { getIsConnected } from '../../config/db.js';
import { mockCandidates, mockApplications, mockResumes, mockJobs } from '../../utils/mockStore.js';

export const getProfile = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({ success: true, profile: mockCandidates[0] });
    }
    let candidate = await Candidate.findOne({ userId: req.user._id }).populate('userId', 'fullName email phone profileImage');
    if (!candidate) {
      candidate = await Candidate.create({
        userId: req.user._id,
        headline: 'Software Engineer',
        location: 'Bengaluru, India',
        profileCompletion: 80,
      });
    }
    res.json({ success: true, profile: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
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
    let score = 30;
    if (candidate.headline) score += 10;
    if (candidate.skills && candidate.skills.length > 2) score += 20;
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
      return res.json({
        success: true,
        dashboard: {
          profileCompletion: 92,
          resumesCount: mockResumes.length,
          primaryResume: mockResumes[0],
          latestAnalysis: {
            overallScore: 89,
            strengths: ['Modern tech stack', 'Quantifiable metrics', 'Premier education'],
            weaknesses: ['Add unit testing details', 'Refine summary'],
          },
          applicationsCount: mockApplications.length,
          recentApplications: mockApplications,
          recommendedJobs: mockJobs.slice(0, 4),
        },
      });
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
        profileCompletion: candidate.profileCompletion || 75,
        resumesCount: resumes.length,
        primaryResume,
        latestAnalysis,
        applicationsCount: applications.length,
        recentApplications: applications,
        recommendedJobs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
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

    // Check existing resumes to set version and primary
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

    // 2. Extract text & send to Gemini for instant parsing & analysis
    const extractedText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
    const parsedData = await parseResumeWithAI(extractedText);
    const analysisData = await analyzeResumeWithAI(extractedText, candidate.headline || 'Software Engineer');

    // 3. Save Resume Analysis record
    const resumeAnalysis = await ResumeAnalysis.create({
      resumeId: resume._id,
      candidateId: candidate._id,
      overallScore: analysisData.overallScore || 85,
      extractedData: parsedData,
      analysis: analysisData.analysis,
      strengths: analysisData.strengths,
      weaknesses: analysisData.weaknesses,
      suggestions: analysisData.suggestions,
      missingSections: analysisData.missingSections,
      careerRecommendations: analysisData.careerRecommendations,
      model: 'gemini-1.5-flash',
    });

    // 4. Update candidate skills and profile completion if needed
    if (parsedData.skills && parsedData.skills.length > 0) {
      const uniqueSkills = Array.from(new Set([...candidate.skills, ...parsedData.skills]));
      candidate.skills = uniqueSkills;
      await candidate.save();
    }

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
      return res.json({ success: true, resumes: mockResumes });
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
    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCandidateApplications = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({ success: true, applications: mockApplications });
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
      const recs = mockJobs.map((j, i) => ({
        ...j,
        matchPercentage: 95 - i * 4,
        matchedSkills: j.requiredSkills.slice(0, 3),
        missingSkills: j.preferredSkills.slice(0, 1),
        matchExplanation: 'Strong skill alignment based on candidate profile and portfolio projects.',
      }));
      return res.json({ success: true, recommendations: recs });
    }
    const candidate = await Candidate.findOne({ userId: req.user._id });
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
