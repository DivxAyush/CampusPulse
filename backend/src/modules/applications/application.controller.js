import { Application } from './application.model.js';
import { Company } from '../companies/company.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { Interview } from '../interviews/interview.model.js';
import { Notification } from '../notifications/notification.model.js';
import { getIsConnected } from '../../config/db.js';

export const getApplicationById = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('companyId')
      .populate('resumeId')
      .populate({
        path: 'candidateId',
        populate: { path: 'userId', select: 'fullName email phone profileImage' },
      });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const { status, recruiterNotes } = req.body;
    const company = await Company.findOne({ userId: req.user._id });

    const application = await Application.findOne({
      _id: req.params.id,
      companyId: company._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized.' });
    }

    if (status) application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;

    await application.save();

    res.json({ success: true, message: `Application status updated to ${status}.`, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const shortlistCandidate = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const company = await Company.findOne({ userId: req.user._id });
    const application = await Application.findOne({ _id: req.params.id, companyId: company._id });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    application.status = 'shortlisted';
    if (req.body.recruiterNotes) application.recruiterNotes = req.body.recruiterNotes;
    await application.save();

    res.json({ success: true, message: 'Candidate shortlisted successfully.', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectCandidate = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const company = await Company.findOne({ userId: req.user._id });
    const application = await Application.findOne({ _id: req.params.id, companyId: company._id });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    application.status = 'rejected';
    if (req.body.recruiterNotes) application.recruiterNotes = req.body.recruiterNotes;
    await application.save();

    res.json({ success: true, message: 'Candidate application rejected.', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const { roundName, scheduledAt, mode, meetingLink, location, notes, interviewerName } = req.body;
    const company = await Company.findOne({ userId: req.user._id });
    const application = await Application.findOne({ _id: req.params.id, companyId: company._id })
      .populate('candidateId')
      .populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const interview = await Interview.create({
      applicationId: application._id,
      candidateId: application.candidateId._id,
      companyId: company._id,
      jobId: application.jobId._id,
      roundName: roundName || 'Technical Interview Round 1',
      scheduledAt: scheduledAt || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      mode: mode || 'video',
      meetingLink: meetingLink || 'https://meet.google.com/cmp-plus-intv',
      location: location || '',
      interviewerName: interviewerName || req.user.fullName,
      notes: notes || '',
      status: 'scheduled',
    });

    application.status = 'interview_scheduled';
    await application.save();

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully and applicant notified.',
      interview,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyInterviews = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    const interviews = await Interview.find({ companyId: company._id })
      .populate({
        path: 'candidateId',
        populate: { path: 'userId', select: 'fullName email phone profileImage' },
      })
      .populate('jobId', 'title')
      .sort({ scheduledAt: 1 });

    res.json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
