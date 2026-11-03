import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';
import { authAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setIsSent(true);
      addToast('Reset instructions dispatched to your email address.', 'success');
    } catch (err) {
      addToast(err.message || 'Error requesting password reset.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6"
      >
        <div className="flex justify-between items-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          <Logo variant="image" size="sm" className="h-7" />
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary-light flex items-center justify-center text-brand-primary mx-auto mb-2">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-brand-navy">Reset Your Password</h1>
          <p className="text-xs text-brand-muted">
            Enter your account email and we will send you a password recovery verification link.
          </p>
        </div>

        {isSent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-brand-primary mx-auto" />
            <h3 className="text-sm font-bold text-emerald-950">Recovery Link Sent</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              If an account is associated with <span className="font-bold">{email}</span>, you will receive instructions in your inbox.
            </p>
            <Link to="/login" className="block pt-2">
              <Button variant="primary" size="sm" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Email"
              type="email"
              required
              icon={Mail}
              placeholder="candidate@campusplus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
              Send Password Reset Link
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
