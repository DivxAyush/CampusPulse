import { MockInterview } from './mockInterview.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { User } from '../users/user.model.js';
import { getIsConnected } from '../../config/db.js';

/**
 * Candidate: Enroll / Request a 1-on-1 Mock Interview
 */
export const enrollMockInterview = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const { targetRole, techStack, preferredSlot, notes } = req.body;

    // Check if candidate already has an active pending request
    const existingPending = await MockInterview.findOne({
      candidateId: candidate._id,
      status: 'pending',
    });

    if (existingPending) {
      return res.status(200).json({
        success: true,
        isExisting: true,
        message: 'You already have an active mock interview request under review.',
        mockInterview: existingPending,
      });
    }

    const parsedSkills = Array.isArray(techStack)
      ? techStack
      : typeof techStack === 'string' && techStack.trim()
      ? techStack.split(',').map((s) => s.trim())
      : (candidate.skills || []).slice(0, 6);

    const mockInterview = await MockInterview.create({
      candidateId: candidate._id,
      userId: req.user._id,
      targetRole: targetRole || candidate.headline || 'Full Stack Software Engineer',
      techStack: parsedSkills,
      preferredSlot: preferredSlot || 'Flexible / Any Available Slot',
      notes: notes || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled for Mock Interview! Admin will review and schedule your session.',
      mockInterview,
    });
  } catch (err) {
    console.error('enrollMockInterview error:', err);
    res.status(500).json({ success: false, message: 'Failed to enroll for mock interview.', error: err.message });
  }
};

/**
 * Candidate: Get current candidate's mock interviews
 */
export const getMyMockInterviews = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const mockInterviews = await MockInterview.find({ candidateId: candidate._id })
      .sort({ createdAt: -1 });

    const activeEnrollment = mockInterviews.find((m) => m.status === 'pending' || m.status === 'scheduled');

    res.status(200).json({
      success: true,
      activeEnrollment: activeEnrollment || null,
      mockInterviews,
    });
  } catch (err) {
    console.error('getMyMockInterviews error:', err);
    res.status(500).json({ success: false, message: 'Failed to load mock interview status.', error: err.message });
  }
};

/**
 * Candidate: Cancel a pending mock interview
 */
export const cancelMockInterview = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const mockInterview = await MockInterview.findOne({
      _id: req.params.id,
      candidateId: candidate._id,
    });

    if (!mockInterview) {
      return res.status(404).json({ success: false, message: 'Mock interview request not found.' });
    }

    if (mockInterview.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Completed interviews cannot be cancelled.' });
    }

    mockInterview.status = 'cancelled';
    await mockInterview.save();

    res.status(200).json({
      success: true,
      message: 'Mock interview request cancelled.',
      mockInterview,
    });
  } catch (err) {
    console.error('cancelMockInterview error:', err);
    res.status(500).json({ success: false, message: 'Failed to cancel mock interview.', error: err.message });
  }
};

/**
 * Admin: Get all enrolled mock interviews with candidate details
 */
export const getAllMockInterviewsAdmin = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const { status, search } = req.query;
    const filter = {};

    if (status && ['pending', 'scheduled', 'completed', 'cancelled'].includes(status)) {
      filter.status = status;
    }

    let mockInterviews = await MockInterview.find(filter)
      .populate('userId', 'fullName email avatar phone')
      .populate('candidateId', 'headline skills phone currentLocation experienceYears')
      .sort({ createdAt: -1 });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      mockInterviews = mockInterviews.filter((item) => {
        const name = (item.userId?.fullName || '').toLowerCase();
        const email = (item.userId?.email || '').toLowerCase();
        const role = (item.targetRole || '').toLowerCase();
        return name.includes(q) || email.includes(q) || role.includes(q);
      });
    }

    const stats = {
      total: await MockInterview.countDocuments(),
      pending: await MockInterview.countDocuments({ status: 'pending' }),
      scheduled: await MockInterview.countDocuments({ status: 'scheduled' }),
      completed: await MockInterview.countDocuments({ status: 'completed' }),
    };

    res.status(200).json({
      success: true,
      stats,
      count: mockInterviews.length,
      mockInterviews,
    });
  } catch (err) {
    console.error('getAllMockInterviewsAdmin error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch mock interviews.', error: err.message });
  }
};

/**
 * Admin: Update mock interview status, scheduling, and meeting link
 */
export const updateMockInterviewStatusAdmin = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const { status, scheduledAt, meetingLink, interviewerName, notes, feedback } = req.body;

    const mockInterview = await MockInterview.findById(req.params.id)
      .populate('userId', 'fullName email phone')
      .populate('candidateId', 'headline skills phone');

    if (!mockInterview) {
      return res.status(404).json({ success: false, message: 'Mock interview record not found.' });
    }

    if (status) mockInterview.status = status;
    if (scheduledAt !== undefined) mockInterview.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (meetingLink !== undefined) mockInterview.meetingLink = meetingLink;
    if (interviewerName !== undefined) mockInterview.interviewerName = interviewerName;
    if (notes !== undefined) mockInterview.notes = notes;
    if (feedback !== undefined) mockInterview.feedback = feedback;

    await mockInterview.save();

    res.status(200).json({
      success: true,
      message: `Mock interview updated to ${mockInterview.status}.`,
      mockInterview,
    });
  } catch (err) {
    console.error('updateMockInterviewStatusAdmin error:', err);
    res.status(500).json({ success: false, message: 'Failed to update mock interview.', error: err.message });
  }
};
