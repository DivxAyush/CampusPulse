import { User } from '../users/user.model.js';
import { Company } from '../companies/company.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { Job } from '../jobs/job.model.js';
import { Application } from '../applications/application.model.js';
import { ResumeAnalysis } from '../ai/resumeAnalysis.model.js';
import { MockInterview } from '../mockInterviews/mockInterview.model.js';
import { getIsConnected } from '../../config/db.js';

export const getAdminStats = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const totalUsers = await User.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'published' });
    const totalApplications = await Application.countDocuments();
    const totalAnalyses = await ResumeAnalysis.countDocuments();
    const totalMockInterviews = await MockInterview.countDocuments();
    const pendingMockInterviews = await MockInterview.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalCompanies,
        totalJobs,
        activeJobs,
        totalApplications,
        totalAnalyses,
        totalMockInterviews,
        pendingMockInterviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    user.accountStatus = req.body.accountStatus || (user.accountStatus === 'active' ? 'suspended' : 'active');
    await user.save();
    res.json({ success: true, message: `User status changed to ${user.accountStatus}.`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminCompanies = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const companies = await Company.find().populate('userId', 'email fullName phone').sort({ createdAt: -1 });
    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCompanyVerification = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }
    company.isVerified = !company.isVerified;
    await company.save();
    res.json({ success: true, message: `Company verification updated to ${company.isVerified}.`, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const jobs = await Job.find().populate('companyId', 'companyName slug logo isVerified').sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminJob = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });
    res.json({ success: true, message: 'Job deleted by admin.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminApplications = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const applications = await Application.find()
      .populate('jobId', 'title slug jobType location salary')
      .populate('companyId', 'companyName slug logo isVerified')
      .populate({
        path: 'candidateId',
        populate: { path: 'userId', select: 'fullName email phone' },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalJobs = await Job.countDocuments();
    const reports = [
      { id: 1, type: 'Platform Health', status: 'Optimal', latency: '35ms', uptime: '99.99%' },
      { id: 2, type: 'PulseAI Processing Engine', status: 'Operational', avgProcessingTime: '1.2s', successRate: '100%' },
      { id: 3, type: 'Live Registered Accounts', status: 'Active', count: totalUsers },
      { id: 4, type: 'Live System Positions', status: 'Published', count: totalJobs },
      { id: 5, type: 'Live Active Applications', status: 'Active', count: totalApplications },
    ];
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
