import jwt from 'jsonwebtoken';
import { User } from '../modules/users/user.model.js';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'campus_plus_jwt_access_secret_super_secure_key_12345';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'campus_plus_jwt_refresh_secret_super_secure_key_67890';

export const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ id: userId, role }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, please login.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-passwordHash');
    } catch (e) {
      // offline mode
    }

    if (!user) {
      user = {
        _id: decoded.id,
        fullName: decoded.role === 'company' ? 'Priya Verma' : decoded.role === 'admin' ? 'System Administrator' : 'Ayush Sharma',
        email: decoded.role === 'company' ? 'recruiter@nexus.com' : decoded.role === 'admin' ? 'admin@campusplus.com' : 'candidate@campusplus.com',
        role: decoded.role || 'candidate',
      };
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid optional tokens
  }
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user ? req.user.role : 'guest'}' does not have permission.`,
      });
    }
    next();
  };
};
