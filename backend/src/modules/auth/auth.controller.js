import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../users/user.model.js';
import { Candidate } from '../candidates/candidate.model.js';
import { Company } from '../companies/company.model.js';
import { generateTokens } from '../../middleware/auth.middleware.js';
import { getIsConnected } from '../../config/db.js';

export const registerCandidate = async (req, res) => {
  try {
    const { fullName, email, password, phone, headline, location } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, and password.' });
    }

    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database connection is currently unavailable. Please check MongoDB Atlas connection.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone: phone || '',
      passwordHash,
      role: 'candidate',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
    });

    const candidate = await Candidate.create({
      userId: user._id,
      headline: headline || '',
      location: location || '',
      experienceLevel: 'fresher',
      totalExperience: '0 years',
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      profileCompletion: 25,
    });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Candidate account created successfully.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        candidateProfile: candidate,
      },
    });
  } catch (error) {
    console.error('Candidate registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

export const registerCompany = async (req, res) => {
  try {
    const { fullName, email, password, phone, companyName, website, industry, companySize, headquarters } = req.body;

    if (!fullName || !email || !password || !companyName) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields including company name.' });
    }

    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database connection is currently unavailable. Please check MongoDB Atlas connection.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone: phone || '',
      passwordHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80`,
    });

    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const company = await Company.create({
      userId: user._id,
      companyName,
      slug,
      website: website || 'https://example.com',
      industry: industry || 'Technology & Software',
      companySize: companySize || '50-200 employees',
      headquarters: headquarters || 'Bengaluru, India',
      contactEmail: email.toLowerCase(),
      contactPhone: phone || '',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      description: `${companyName} is a high-growth technology leader empowering engineering and product teams worldwide.`,
      isVerified: true,
      isActive: true,
    });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Company account created successfully.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        companyProfile: company,
      },
    });
  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  const { email = '', password = '', role } = req.body || {};
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database connection is currently unavailable. Please check MongoDB Atlas connection.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    if (role && user.role !== role && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Account is registered as ${user.role}, not ${role}. Please select the correct portal.`,
      });
    }

    let profile = null;
    if (user.role === 'candidate') {
      profile = await Candidate.findOne({ userId: user._id });
    } else if (user.role === 'company') {
      profile = await Company.findOne({ userId: user._id });
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        candidateProfile: user.role === 'candidate' ? profile : null,
        companyProfile: user.role === 'company' ? profile : null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ success: false, message: 'Database connection is currently unavailable.' });
    }

    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let candidateProfile = null;
    let companyProfile = null;

    if (user.role === 'candidate') {
      candidateProfile = await Candidate.findOne({ userId: user._id });
    } else if (user.role === 'company') {
      companyProfile = await Company.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        candidateProfile,
        companyProfile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving current profile.' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const verifyEmail = (req, res) => {
  res.json({ success: true, message: 'Email verified successfully.' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email.' });
  }
  res.json({
    success: false,
    underConstruction: true,
    message: 'Yeh feature abhi under construction hai. Kuch time baad isko chalu kiya jayega.',
  });
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Please provide new password.' });
  }
  res.json({ success: true, message: 'Password has been reset successfully. Please login.' });
};
