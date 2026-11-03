import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Building2, User, Mail, Lock, Phone, MapPin, Globe, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerCandidate, registerCompany } = useAuth();
  const { addToast } = useToast();

  const [role, setRole] = useState('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Candidate fields
  const [candData, setCandData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    headline: 'Software Engineer',
    location: 'Bengaluru, India',
  });

  // Company fields
  const [compData, setCompData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    website: '',
    industry: 'Technology & Software',
    companySize: '50-200 employees',
    headquarters: 'Bengaluru, India',
  });

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await registerCandidate(candData);
    setIsLoading(false);

    if (res.success) {
      addToast('Candidate account created! Welcome to Campus Plus.', 'success');
      navigate('/candidate/dashboard');
    } else {
      setErrorMessage(res.message);
      addToast(res.message, 'error');
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await registerCompany(compData);
    setIsLoading(false);

    if (res.success) {
      addToast('Company account registered! Welcome to your recruiter portal.', 'success');
      navigate('/company/dashboard');
    } else {
      setErrorMessage(res.message);
      addToast(res.message, 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-card space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo variant="image" size="lg" className="h-12" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Create Your Account</h1>
          <p className="text-xs text-brand-muted">Choose your role to get started with Campus Plus</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-brand-bg border border-brand-border text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'candidate'
                ? 'bg-white text-brand-navy shadow-subtle border border-brand-border'
                : 'text-brand-muted hover:text-brand-navy'
            }`}
          >
            <User className="w-4 h-4 text-brand-primary" /> Candidate / Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole('company')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'company'
                ? 'bg-white text-brand-navy shadow-subtle border border-brand-border'
                : 'text-brand-muted hover:text-brand-navy'
            }`}
          >
            <Building2 className="w-4 h-4 text-brand-primary" /> Employer / Recruiter
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* CANDIDATE REGISTRATION FORM */}
        {role === 'candidate' ? (
          <form onSubmit={handleCandidateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                icon={User}
                placeholder="Ayush Sharma"
                value={candData.fullName}
                onChange={(e) => setCandData({ ...candData, fullName: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                required
                icon={Mail}
                placeholder="ayush@example.com"
                value={candData.email}
                onChange={(e) => setCandData({ ...candData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                required
                icon={Lock}
                placeholder="Minimum 8 characters"
                value={candData.password}
                onChange={(e) => setCandData({ ...candData, password: e.target.value })}
              />
              <Input
                label="Phone Number"
                icon={Phone}
                placeholder="+91 98765 43210"
                value={candData.phone}
                onChange={(e) => setCandData({ ...candData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Professional Headline"
                placeholder="Full Stack Engineer | React, Node.js"
                value={candData.headline}
                onChange={(e) => setCandData({ ...candData, headline: e.target.value })}
              />
              <Input
                label="City / Preferred Location"
                icon={MapPin}
                placeholder="Bengaluru, India"
                value={candData.location}
                onChange={(e) => setCandData({ ...candData, location: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
              Create Candidate Account
            </Button>
          </form>
        ) : (
          /* COMPANY REGISTRATION FORM */
          <form onSubmit={handleCompanySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Recruiter Full Name"
                required
                icon={User}
                placeholder="Priya Verma"
                value={compData.fullName}
                onChange={(e) => setCompData({ ...compData, fullName: e.target.value })}
              />
              <Input
                label="Work Email"
                type="email"
                required
                icon={Mail}
                placeholder="priya@company.com"
                value={compData.email}
                onChange={(e) => setCompData({ ...compData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                required
                icon={Building2}
                placeholder="Nexus Cloud Systems"
                value={compData.companyName}
                onChange={(e) => setCompData({ ...compData, companyName: e.target.value })}
              />
              <Input
                label="Company Website"
                icon={Globe}
                placeholder="https://nexuscloud.io"
                value={compData.website}
                onChange={(e) => setCompData({ ...compData, website: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                required
                icon={Lock}
                placeholder="Minimum 8 characters"
                value={compData.password}
                onChange={(e) => setCompData({ ...compData, password: e.target.value })}
              />
              <Input
                label="Contact Phone"
                icon={Phone}
                placeholder="+91 80 4123 4567"
                value={compData.phone}
                onChange={(e) => setCompData({ ...compData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                  Industry
                </label>
                <select
                  value={compData.industry}
                  onChange={(e) => setCompData({ ...compData, industry: e.target.value })}
                  className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary transition-all"
                >
                  <option>Technology & Software</option>
                  <option>Fintech & Banking</option>
                  <option>AI & Machine Learning</option>
                  <option>HealthTech</option>
                  <option>E-Commerce & Retail</option>
                </select>
              </div>

              <Input
                label="Headquarters Location"
                icon={MapPin}
                placeholder="Bengaluru, India"
                value={compData.headquarters}
                onChange={(e) => setCompData({ ...compData, headquarters: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
              Register Employer Account
            </Button>
          </form>
        )}

        {/* Existing account link */}
        <div className="text-xs text-brand-muted text-center pt-2">
          Already registered on Campus Plus?{' '}
          <Link to="/login" className="font-bold text-brand-primary hover:underline">
            Sign In here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
