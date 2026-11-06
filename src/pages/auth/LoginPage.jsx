import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Briefcase, Building2, ArrowRight } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
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

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-4 overflow-hidden bg-brand-bg">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-card space-y-4"
      >
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="flex justify-center mb-1">
            <Logo variant="image" size="lg" className="h-10" />
          </div>
          <h1 className="text-xl font-bold text-brand-navy">Sign In to Your Workspace</h1>
          <p className="text-xs text-brand-muted">Select your portal role to continue</p>
        </div>

        {/* Role Selector Tabs (Candidate & Employer) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-brand-bg border border-brand-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setRole('candidate'); setErrorMessage(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'candidate' ? 'bg-white text-brand-navy font-bold shadow-subtle' : 'text-brand-muted hover:text-brand-navy'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-brand-primary" /> Candidate
          </button>
          <button
            type="button"
            onClick={() => { setRole('company'); setErrorMessage(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'company' ? 'bg-white text-brand-navy font-bold shadow-subtle' : 'text-brand-muted hover:text-brand-navy'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-brand-primary" /> Employer
          </button>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium leading-relaxed space-y-1.5">
            <div>{errorMessage}</div>
            {errorMessage.toLowerCase().includes('suspend') && (
              <div className="pt-1.5 border-t border-red-200/80">
                <Link to="/help" className="font-bold underline text-red-800 hover:text-red-950 inline-flex items-center gap-1">
                  Contact Help & Support Desk &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3 pt-1">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
            className="text-xs"
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-brand-navy">Password</label>
              <Link to="/forgot-password" tabIndex={-1} className="text-[11px] text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              className="text-xs"
            />
          </div>

          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full mt-2" icon={ArrowRight} iconPosition="right">
            Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </Button>
        </form>

        {/* Sign up redirect */}
        <div className="text-xs text-brand-muted text-center pt-2 border-t border-brand-border">
          Do not have an account?{' '}
          <Link to="/register" className="font-bold text-brand-primary hover:underline">
            Register free
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
