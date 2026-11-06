import mongoose from 'mongoose';

const mockInterviewSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: 'Full Stack Software Engineer',
    },
    techStack: {
      type: [String],
      default: [],
    },
    preferredSlot: {
      type: String,
      default: 'Flexible / Any Available Slot',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    scheduledAt: {
      type: Date,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    interviewerName: {
      type: String,
      default: 'CampusPulse Senior Interviewer',
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const MockInterview = mongoose.model('MockInterview', mockInterviewSchema);
