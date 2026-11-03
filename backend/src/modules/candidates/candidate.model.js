import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ['fresher', 'junior', 'mid', 'senior', 'lead', ''],
      default: 'fresher',
    },
    totalExperience: {
      type: String,
      default: '0 years',
    },
    expectedSalary: {
      type: String,
      default: '',
    },
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
        grade: String,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
        techStack: [String],
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: String,
        credentialUrl: String,
      },
    ],
    preferredLocations: [String],
    profileCompletion: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const Candidate = mongoose.model('Candidate', candidateSchema);
