import { Resume } from '../resumes/resume.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { Job } from '../jobs/job.model.js';
import { Application } from '../applications/application.model.js';
import { ResumeAnalysis } from './resumeAnalysis.model.js';
import {
  analyzeResumeWithAI,
  generateResumeImprovements,
  calculateJobMatch,
  parseResumeWithAI,
} from '../../services/gemini.service.js';

export const analyzeResume = async (req, res) => {
  try {
    const { resumeId, resumeText, targetRole } = req.body;

    let textToAnalyze = resumeText;
    let candidate = null;

    if (req.user && req.user.role === 'candidate') {
      candidate = await Candidate.findOne({ userId: req.user._id });
    }

    if (!textToAnalyze && resumeId) {
      const resume = await Resume.findById(resumeId);
      if (resume) {
        textToAnalyze = `Resume: ${resume.fileName}`;
      }
    }

    if (!textToAnalyze && candidate) {
      textToAnalyze = `Candidate: ${req.user.fullName}. Headline: ${candidate.headline}. Bio: ${candidate.bio}. Skills: ${(candidate.skills || []).join(', ')}. Experience: ${JSON.stringify(candidate.experience || [])}. Projects: ${JSON.stringify(candidate.projects || [])}`;
    }

    if (!textToAnalyze) {
      textToAnalyze = 'Software Developer with 2 years of experience in JavaScript, React, Node.js, and MongoDB. Built full stack applications and REST APIs.';
    }

    const analysis = await analyzeResumeWithAI(textToAnalyze, targetRole || 'Software Engineer');

    if (candidate && resumeId) {
      await ResumeAnalysis.findOneAndUpdate(
        { resumeId },
        {
          resumeId,
          candidateId: candidate._id,
          overallScore: analysis.overallScore,
          analysis: analysis.analysis,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          suggestions: analysis.suggestions,
          missingSections: analysis.missingSections,
          careerRecommendations: analysis.careerRecommendations,
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const improveResumeSection = async (req, res) => {
  try {
    const { section, originalText } = req.body;
    if (!originalText) {
      return res.status(400).json({ success: false, message: 'Please provide original text to improve.' });
    }

    const improvement = await generateResumeImprovements(section || 'Work Experience', originalText);
    res.json({ success: true, improvement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const matchJobForCandidate = async (req, res) => {
  try {
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
