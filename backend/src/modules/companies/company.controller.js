import { Company } from './company.model.js';
import { Job } from '../jobs/job.model.js';
import { Application } from '../applications/application.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';
import { getIsConnected } from '../../config/db.js';

export const getCompanyProfile = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const company = await Company.findOne({ userId: req.user._id }).populate('userId', 'fullName email phone profileImage');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }
    res.json({ success: true, profile: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const {
      companyName,
      website,
      industry,
      companySize,
      companyType,
      foundedYear,
      description,
      headquarters,
      contactEmail,
      contactPhone,
      logo,
      coverImage,
    } = req.body;

    let company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }

    if (companyName) company.companyName = companyName;
    if (website !== undefined) company.website = website;
    if (industry !== undefined) company.industry = industry;
    if (companySize !== undefined) company.companySize = companySize;
    if (companyType !== undefined) company.companyType = companyType;
    if (foundedYear !== undefined) company.foundedYear = foundedYear;
    if (description !== undefined) company.description = description;
    if (headquarters !== undefined) company.headquarters = headquarters;
    if (contactEmail !== undefined) company.contactEmail = contactEmail;
    if (contactPhone !== undefined) company.contactPhone = contactPhone;
    if (logo !== undefined) company.logo = logo;
    if (coverImage !== undefined) company.coverImage = coverImage;

    await company.save();

    res.json({ success: true, message: 'Company profile updated successfully.', profile: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyDashboard = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }

    const totalJobs = await Job.countDocuments({ companyId: company._id });
    const activeJobs = await Job.countDocuments({ companyId: company._id, status: 'published' });
    const totalApplicants = await Application.countDocuments({ companyId: company._id });
    const shortlistedCandidates = await Application.countDocuments({
      companyId: company._id,
      status: { $in: ['shortlisted', 'interview_scheduled', 'selected'] },
    });

    const recentApplicants = await Application.find({ companyId: company._id })
      .populate({
        path: 'candidateId',
        populate: { path: 'userId', select: 'fullName email phone profileImage' },
      })
      .populate('jobId', 'title slug')
      .populate('resumeId')
      .sort({ appliedAt: -1 })
      .limit(6);

    const recentJobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalApplicants,
        shortlistedCandidates,
      },
      recentApplicants,
      recentJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }

    const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyApplicants = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }

    const { jobId, status } = req.query;
    const filter = { companyId: company._id };
    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;

    const applicants = await Application.find(filter)
      .populate({
        path: 'candidateId',
        populate: { path: 'userId', select: 'fullName email phone profileImage' },
      })
      .populate('jobId', 'title slug jobType location')
      .populate('resumeId')
      .sort({ appliedAt: -1 });

    res.json({ success: true, applicants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const query = {};
    if (req.query.industry && req.query.industry !== 'All') {
      query.industry = new RegExp(req.query.industry, 'i');
    }
    if (req.query.search) {
      query.companyName = new RegExp(req.query.search, 'i');
    }
    const companies = await Company.find(query).sort({ isVerified: -1, createdAt: -1 });
    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };
    const company = await Company.findOne(filter).populate('userId', 'fullName email phone profileImage');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
