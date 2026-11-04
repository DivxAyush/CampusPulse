import { User } from '../users/user.model.js';
import { Company } from '../companies/company.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { Job } from '../jobs/job.model.js';
import { Application } from '../applications/application.model.js';
import { ResumeAnalysis } from '../ai/resumeAnalysis.model.js';
import { getIsConnected } from '../../config/db.js';
import { mockUsers, mockCandidates, mockCompanies, mockJobs, mockApplications } from '../../utils/mockStore.js';

export const getAdminStats = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({
        success: true,
        stats: {
          totalUsers: mockUsers.length,
          totalCandidates: mockCandidates.length,
          totalCompanies: mockCompanies.length,
          totalJobs: mockJobs.length,
          activeJobs: mockJobs.filter((j) => j.status === 'published').length,
          totalApplications: mockApplications.length,
          totalAnalyses: 14,
        },
      });
    }

    const totalUsers = await User.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'published' });
    const totalApplications = await Application.countDocuments();
    const totalAnalyses = await ResumeAnalysis.countDocuments();

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
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({ success: true, users: mockUsers });
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
      const u = mockUsers.find((user) => user._id === req.params.id);
      if (u) {
        u.accountStatus = req.body.accountStatus || (u.accountStatus === 'active' ? 'suspended' : 'active');
        return res.json({ success: true, message: `User status changed to ${u.accountStatus}.`, user: u });
      }
      return res.status(404).json({ success: false, message: 'User not found.' });
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
      return res.json({ success: true, companies: mockCompanies });
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
      const c = mockCompanies.find((comp) => comp._id === req.params.id);
      if (c) {
        c.isVerified = !c.isVerified;
        return res.json({ success: true, message: `Company verification updated to ${c.isVerified}.`, company: c });
      }
      return res.status(404).json({ success: false, message: 'Company not found.' });
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
      return res.json({ success: true, jobs: mockJobs });
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
      const idx = mockJobs.findIndex((j) => j._id === req.params.id);
      if (idx !== -1) mockJobs.splice(idx, 1);
      return res.json({ success: true, message: 'Job deleted by admin.' });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });
    res.json({ success: true, message: 'Job deleted by admin.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminReports = async (req, res) => {
  try {
    const reports = [
      { id: 1, type: 'Platform Health', status: 'Optimal', latency: '38ms', uptime: '99.98%' },
      { id: 2, type: 'AI Processing Engine', status: 'Operational', avgProcessingTime: '1.2s', successRate: '99.4%' },
      { id: 3, type: 'Daily Active Placements', status: 'Growing', newMatchesToday: 48, rate: '+14%' },
      { id: 4, type: 'Security Audit', status: 'Compliant', zeroBreaches: true, sslStatus: 'Active' },
    ];
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
