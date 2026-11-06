import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ShieldAlert } from 'lucide-react';
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-700" /> Authorized Personnel Only
          </div>
          <h1 className="text-xl font-bold text-brand-navy">Administrator Sign In</h1>
          <p className="text-xs text-brand-muted">Secure access for system administrators & moderation team</p>
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
            placeholder="admin@campuspulse.com"
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

        {/* Security & Return navigation */}
        <div className="pt-3 border-t border-brand-border text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted">
            <Lock className="w-3 h-3 text-slate-400" /> 256-bit SSL encrypted administrative gateway
          </div>
          <div className="text-xs text-brand-muted">
            Candidate or Employer?{' '}
            <Link to="/login" className="font-bold text-brand-primary hover:underline">
              Go to User Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

