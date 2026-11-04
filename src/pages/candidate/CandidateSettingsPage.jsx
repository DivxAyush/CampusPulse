import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock, CheckCircle2, Save } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const CandidateSettingsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    interviewReminders: true,
    marketAlerts: true,
    marketing: false,
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      addToast('Password updated successfully.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 600);
  };

  const handleSavePreferences = () => {
    addToast('Notification preferences saved.', 'success');
  };

  return (
    <div className="space-y-8 w-full max-w-5xl">
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          Security & Account
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Account Settings</h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Manage your account security, notification alerts, and data preferences.
        </p>
      </div>

      {/* Account Info Summary */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-primary" /> Account Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-brand-text">
          <div className="p-3 rounded-xl bg-brand-bg">
            <span className="text-brand-muted block">Signed in as</span>
            <span className="font-bold text-brand-navy mt-0.5 block">{user?.email}</span>
          </div>
          <div className="p-3 rounded-xl bg-brand-bg">
            <span className="text-brand-muted block">Account Role</span>
            <span className="font-bold text-brand-navy mt-0.5 block capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Password Reset */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-primary" /> Update Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            required
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            required
            placeholder="Minimum 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" variant="primary" size="md" isLoading={isUpdatingPassword}>
            Update Password
          </Button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-primary" /> Notification Alerts
        </h2>

        <div className="space-y-3">
          {[
            {
              key: 'emailAlerts',
              title: 'New Matching Job Alerts',
              desc: 'Receive alerts when high-match opportunities are posted in your location.',
            },
            {
              key: 'interviewReminders',
              title: 'Interview & Recruiter Updates',
              desc: 'Instant notifications when an application status updates or an interview is scheduled.',
            },
            {
              key: 'aiSuggestions',
              title: 'PulseAI Resume Tips',
              desc: 'Quarterly tips on ATS trending keywords and skills in demand.',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-start justify-between p-3.5 rounded-2xl bg-brand-bg/50 border border-brand-border/60 cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-brand-navy block">{item.title}</span>
                <span className="text-xs text-brand-muted mt-0.5 block">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                className="mt-1 h-4 w-4 text-brand-primary focus:ring-brand-primary rounded"
              />
            </label>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={handleSavePreferences} icon={Save}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};
