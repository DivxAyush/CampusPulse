import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    extractedData: {
      name: String,
      email: String,
      phone: String,
      summary: String,
      skills: [String],
      education: [mongoose.Schema.Types.Mixed],
      experience: [mongoose.Schema.Types.Mixed],
      projects: [mongoose.Schema.Types.Mixed],
      certifications: [mongoose.Schema.Types.Mixed],
    },
    analysis: {
      structureScore: Number,
      summaryScore: Number,
      skillsScore: Number,
      experienceScore: Number,
      readabilityScore: Number,
    },
    strengths: [String],
    weaknesses: [String],
    suggestions: [
      {
        section: String,
        original: String,
        improved: String,
        reason: String,
      },
    ],
    missingSections: [String],
    careerRecommendations: [String],
    model: {
      type: String,
      default: 'PulseAI Neural Engine',
    },
    promptVersion: {
      type: String,
      default: 'v1.0',
    },
  },
  {
    timestamps: true,
  }
);

export const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
