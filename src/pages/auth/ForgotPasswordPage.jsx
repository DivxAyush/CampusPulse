import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Construction, Clock, PhoneCall, HelpCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnderConstruction, setIsUnderConstruction] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsUnderConstruction(true);
      addToast(
        'Yeh feature abhi under construction hai. Kuch time baad isko chalu kiya jayega.',
        'warning'
      );
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-brand-bg">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6"
      >
        <div className="flex justify-between items-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          <Logo variant="image" size="sm" className="h-7" />
        </div>

        {isUnderConstruction ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3.5"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto shadow-sm">
              <Construction className="w-7 h-7 text-amber-600 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/70 text-amber-900">
              <Clock className="w-3 h-3" /> Under Maintenance
            </div>

            <h3 className="text-base font-bold text-amber-950">
              Feature Under Construction
            </h3>

            <div className="space-y-2 text-xs leading-relaxed text-amber-900/90 bg-white/80 p-3.5 rounded-xl border border-amber-200/60">
              <p className="font-semibold text-amber-900 text-[13px]">
                Yeh feature abhi under construction hai. Kuch time baad isko chalu kiya jayega.
              </p>
              <p className="text-[11px] text-amber-800/80">
                Password recovery module is currently undergoing system upgrades. For immediate access, please reach out to our support desk.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="primary" size="md" className="w-full">
                  Return to Login
                </Button>
              </Link>
              <Link to="/contact" className="flex-1">
                <Button variant="outline" size="md" className="w-full inline-flex items-center justify-center gap-1.5">
                  <PhoneCall className="w-4 h-4" /> Support Desk
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary-light flex items-center justify-center text-brand-primary mx-auto mb-2">
                <Mail className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-brand-navy">Reset Your Password</h1>
              <p className="text-xs text-brand-muted">
                Enter your account email to request recovery verification.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Account Email"
                type="email"
                required
                icon={Mail}
                placeholder="candidate@campuspulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Send Password Reset Link
              </Button>
            </form>

            <div className="pt-2 border-t border-brand-border/60 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                <Clock className="w-3 h-3 text-amber-600" />
                Service notice: Upgrades underway
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
