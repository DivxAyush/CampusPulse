import { Job } from './job.model.js';
import { Company } from '../companies/company.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { Application } from '../applications/application.model.js';
import { SavedJob } from '../savedJobs/savedJob.model.js';
import { Resume } from '../resumes/resume.model.js';
import { calculateJobMatch } from '../../services/gemini.service.js';
import { getIsConnected } from '../../config/db.js';

export const getJobs = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }
    const {
      search,
      location,
      jobType,
      workMode,
      experience,
      sort = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }

    if (workMode && workMode !== 'all') {
      query.workMode = workMode;
    }

    if (experience && experience !== 'all') {
      query.experience = { $regex: experience, $options: 'i' };
    }

    let sortOptions = { publishedAt: -1 };
    if (sort === 'salary-high') {
      sortOptions = { 'salary.max': -1 };
    } else if (sort === 'salary-low') {
      sortOptions = { 'salary.min': 1 };
    } else if (sort === 'popular') {
      sortOptions = { applicantsCount: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('companyId', 'companyName slug logo industry headquarters isVerified')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    let savedJobIds = new Set();
    if (req.user && req.user._id) {
      try {
        let candidate = await Candidate.findOne({ userId: req.user._id });
        if (!candidate && req.user.role === 'candidate') {
          candidate = await Candidate.create({ userId: req.user._id });
        }
        if (candidate) {
          const userSaved = await SavedJob.find({ candidateId: candidate._id }).select('jobId');
          savedJobIds = new Set(userSaved.map((s) => s.jobId.toString()));
        }
      } catch (err) {
        console.warn('Could not populate saved jobs:', err.message);
      }
    }

    const transformedJobs = jobs.map((j) => {
      const obj = j.toObject();
      obj.isSaved = savedJobIds.has(j._id.toString());
      return obj;
    });

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      jobs: transformedJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const job = await Job.findOne({ slug }).populate(
      'companyId',
      'companyName slug logo coverImage website industry companySize foundedYear description headquarters contactEmail isVerified'
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    // Increment view count asynchronously
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    // Fetch similar jobs
    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      status: 'published',
      $or: [{ jobType: job.jobType }, { requiredSkills: { $in: job.requiredSkills } }],
    })
      .populate('companyId', 'companyName slug logo industry headquarters')
      .limit(3);

    let isSaved = false;
    if (req.user && req.user._id) {
      try {
        let candidate = await Candidate.findOne({ userId: req.user._id });
        if (!candidate && req.user.role === 'candidate') {
          candidate = await Candidate.create({ userId: req.user._id });
        }
        if (candidate) {
          const existing = await SavedJob.findOne({ candidateId: candidate._id, jobId: job._id });
          isSaved = !!existing;
        }
      } catch (err) {
        console.warn('Could not check if job is saved:', err.message);
      }
    }

    const jobObj = job.toObject();
    jobObj.isSaved = isSaved;

    res.json({ success: true, job: jobObj, similarJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(403).json({ success: false, message: 'Only registered companies can create jobs.' });
    }

    const {
      title,
      description,
      responsibilities,
      requirements,
      requiredSkills,
      preferredSkills,
      experience,
      salary,
      jobType,
      workMode,
      location,
      education,
      openings,
      applicationDeadline,
      status = 'published',
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Job title and description are required.' });
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${company.slug.slice(0, 10)}-${Date.now().toString().slice(-4)}`;

    const job = await Job.create({
      companyId: company._id,
      title,
      slug,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities || '').split('\n').filter(Boolean),
      requirements: Array.isArray(requirements) ? requirements : (requirements || '').split('\n').filter(Boolean),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
      experience: experience || '0-2 years',
      salary: salary || { min: 600000, max: 1200000, currency: 'INR', period: 'per annum' },
      jobType: jobType || 'full-time',
      workMode: workMode || 'hybrid',
      location: location || company.headquarters || 'Bengaluru, India',
      education: education || "Bachelor's Degree in Computer Science or related field",
      openings: openings || 1,
      applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status,
      publishedAt: new Date(),
    });

    res.status(201).json({ success: true, message: 'Job published successfully.', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const company = await Company.findOne({ userId: req.user._id });
    const job = await Job.findOne({ _id: req.params.id, companyId: company._id });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or permission denied.' });
    }

    const updatableFields = [
      'title',
      'description',
      'responsibilities',
      'requirements',
      'requiredSkills',
      'preferredSkills',
      'experience',
      'salary',
      'jobType',
      'workMode',
      'location',
      'education',
      'openings',
      'applicationDeadline',
      'status',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    res.json({ success: true, message: 'Job updated successfully.', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const company = await Company.findOne({ userId: req.user._id });
    const job = await Job.findOne({ _id: req.params.id, companyId: company._id });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or permission denied.' });
    }

    await Job.deleteOne({ _id: job._id });
    await Application.deleteMany({ jobId: job._id });

    res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyToJob = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(403).json({ success: false, message: 'Only candidates can apply to jobs.' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Check duplicate application
    const existing = await Application.findOne({ jobId: job._id, candidateId: candidate._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.',
      });
    }

    let resumeId = req.body.resumeId;
    if (!resumeId) {
      const primaryResume = await Resume.findOne({ candidateId: candidate._id, isPrimary: true });
      if (primaryResume) {
        resumeId = primaryResume._id;
      } else {
        const anyResume = await Resume.findOne({ candidateId: candidate._id });
        if (anyResume) resumeId = anyResume._id;
      }
    }

    // Calculate AI match score
    const aiMatchResult = await calculateJobMatch(candidate, job);

    const application = await Application.create({
      jobId: job._id,
      candidateId: candidate._id,
      companyId: job.companyId,
      resumeId,
      coverLetter: req.body.coverLetter || '',
      status: 'applied',
      aiMatch: {
        overallScore: aiMatchResult.overallMatchScore,
        matchedSkills: aiMatchResult.matchedSkills,
        missingSkills: aiMatchResult.missingSkills,
        explanation: aiMatchResult.explanation,
      },
    });

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Track your status on your dashboard.',
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    let candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate && req.user.role === 'candidate') {
      candidate = await Candidate.create({ userId: req.user._id });
    }
    if (!candidate) {
      return res.status(403).json({ success: false, message: 'Only candidates can save jobs.' });
    }

    const existing = await SavedJob.findOne({ candidateId: candidate._id, jobId });

    if (existing) {
      await SavedJob.deleteOne({ _id: existing._id });
      return res.json({ success: true, saved: false, message: 'Job removed from saved list.' });
    } else {
      await SavedJob.create({ candidateId: candidate._id, jobId });
      return res.json({ success: true, saved: true, message: 'Job saved to your list.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database service is currently unavailable.' });
    }

    let candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate && req.user.role === 'candidate') {
      candidate = await Candidate.create({ userId: req.user._id });
    }
    if (!candidate) {
      return res.status(403).json({ success: false, message: 'Candidate not found.' });
    }

    const saved = await SavedJob.find({ candidateId: candidate._id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'companyName slug logo industry headquarters' },
      })
      .sort({ savedAt: -1 });

    const jobs = saved.map((s) => s.jobId).filter(Boolean);

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
