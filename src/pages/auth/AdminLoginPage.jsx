import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Mail, Lock, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await login(email, password, 'admin');
    setIsLoading(false);

    if (res.success) {
      addToast(`Admin access granted. Welcome, ${res.user.fullName}!`, 'success');
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(res.message || 'Invalid administrator credentials');
      addToast(res.message || 'Login failed', 'error');
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@campusplus.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-4 overflow-hidden bg-brand-bg">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-card space-y-4"
      >
        {/* Admin Header */}
        <div className="text-center space-y-1.5">
          <div className="flex justify-center mb-1">
            <Logo variant="image" size="lg" className="h-10" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Dedicated Admin Portal
          </div>
          <h1 className="text-xl font-bold text-brand-navy">Administrator Sign In</h1>
          <p className="text-xs text-brand-muted">Enter administrative credentials to access moderation</p>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-3.5">
          <Input
            label="Admin Email"
            type="email"
            required
            icon={Mail}
            placeholder="admin@campusplus.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Admin Password"
            type="password"
            required
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            icon={ShieldCheck}
            className="w-full bg-brand-navy hover:bg-brand-navy/90"
          >
            Authenticate Admin
          </Button>
        </form>

        {/* 1-Click Demo Login */}
        <div className="pt-3 border-t border-brand-border space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted text-center flex items-center justify-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-brand-primary" /> Quick Demo Fill
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 px-3 rounded-xl border border-brand-border text-xs font-semibold text-brand-text bg-brand-bg hover:border-brand-primary hover:text-brand-primary transition-all text-center flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" /> Fill Admin Credentials (admin@campusplus.com)
          </button>
        </div>

        {/* Return to standard user login */}
        <div className="text-xs text-brand-muted text-center pt-1">
          Candidate or Employer?{' '}
          <Link to="/login" className="font-bold text-brand-primary hover:underline">
            Go to User Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

