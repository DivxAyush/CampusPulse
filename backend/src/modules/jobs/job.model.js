import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [String],
    requirements: [String],
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredSkills: [String],
    experience: {
      type: String,
      default: '0-2 years',
    },
    salary: {
      min: { type: Number, default: 600000 },
      max: { type: Number, default: 1200000 },
      currency: { type: String, default: 'INR' },
      period: { type: String, default: 'per annum' },
      isDisclosed: { type: Boolean, default: true },
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      default: 'full-time',
    },
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'on-site'],
      default: 'hybrid',
    },
    location: {
      type: String,
      default: 'Bengaluru, India',
    },
    education: {
      type: String,
      default: "Bachelor's Degree in Computer Science or related field",
    },
    openings: {
      type: Number,
      default: 2,
    },
    applicationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'paused', 'closed', 'expired'],
      default: 'published',
      index: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'unlisted'],
      default: 'public',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model('Job', jobSchema);
