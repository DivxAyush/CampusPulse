import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Building2, ShieldCheck, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [role, setRole] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await login(email, password, role);
    setIsLoading(false);

    if (res.success) {
      addToast(`Welcome back, ${res.user.fullName}!`, 'success');
      if (res.user.role === 'company') {
        navigate('/company/dashboard');
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } else {
      setErrorMessage(res.message);
      addToast(res.message, 'error');
    }
  };

  const handleDemoFill = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'candidate') {
      setEmail('candidate@campusplus.com');
      setPassword('password123');
    } else if (demoRole === 'company') {
      setEmail('recruiter@nexus.com');
      setPassword('password123');
    } else if (demoRole === 'admin') {
      setEmail('admin@campusplus.com');
      setPassword('admin123');
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo variant="image" size="lg" className="h-12" />
          </div>
          <h1 className="text-xl font-bold text-brand-navy">Sign In to Your Workspace</h1>
          <p className="text-xs text-brand-muted">Select your portal role to continue</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-brand-bg border border-brand-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleDemoFill('candidate')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'candidate' ? 'bg-white text-brand-navy font-bold shadow-subtle' : 'text-brand-muted hover:text-brand-navy'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-brand-primary" /> Candidate
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('company')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'company' ? 'bg-white text-brand-navy font-bold shadow-subtle' : 'text-brand-muted hover:text-brand-navy'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-brand-primary" /> Employer
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('admin')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'admin' ? 'bg-white text-brand-navy font-bold shadow-subtle' : 'text-brand-muted hover:text-brand-navy'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" /> Admin
          </button>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            icon={Mail}
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </Button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="pt-4 border-t border-brand-border space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted text-center flex items-center justify-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-brand-primary" /> 1-Click Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('candidate')}
              className="py-1.5 px-2 rounded-lg border border-brand-border text-[11px] font-semibold text-brand-text bg-brand-bg hover:border-brand-primary hover:text-brand-primary transition-all text-center"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('company')}
              className="py-1.5 px-2 rounded-lg border border-brand-border text-[11px] font-semibold text-brand-text bg-brand-bg hover:border-brand-primary hover:text-brand-primary transition-all text-center"
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="py-1.5 px-2 rounded-lg border border-brand-border text-[11px] font-semibold text-brand-text bg-brand-bg hover:border-brand-primary hover:text-brand-primary transition-all text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Sign up redirect */}
        <div className="text-xs text-brand-muted text-center">
          Do not have an account?{' '}
          <Link to="/register" className="font-bold text-brand-primary hover:underline">
            Register free
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
