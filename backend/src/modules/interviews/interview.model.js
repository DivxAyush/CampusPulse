import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    roundName: {
      type: String,
      default: 'Technical Round 1',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      enum: ['video', 'in-person', 'phone'],
      default: 'video',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/abc-defg-hij',
    },
    location: {
      type: String,
      default: '',
    },
    interviewerName: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

export const Interview = mongoose.model('Interview', interviewSchema);
