import React, { useState } from 'react';
import { Settings, Shield, Bell, Save, Building2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const CompanySettingsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState({
    newApplicantAlerts: true,
    dailyDigest: true,
    interviewConfirmations: true,
  });

  const handleSave = () => {
    addToast('Recruiter preferences updated.', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          Workspace Settings
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Recruiter Settings</h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Manage applicant email notifications, team access, and company security settings.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-primary" /> Recruiter Account
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-bg">
            <span className="text-brand-muted block">Signed in Admin</span>
            <span className="font-bold text-brand-navy mt-0.5 block">{user?.email}</span>
          </div>
          <div className="p-3 rounded-xl bg-brand-bg">
            <span className="text-brand-muted block">Organization Role</span>
            <span className="font-bold text-brand-navy mt-0.5 block">Employer Administrator</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-primary" /> Application Email Notifications
        </h2>

        <div className="space-y-3">
          {[
            {
              key: 'newApplicantAlerts',
              title: 'Instant Applicant Notifications',
              desc: 'Receive immediate email notifications whenever a developer submits an application.',
            },
            {
              key: 'dailyDigest',
              title: 'Daily Candidate Digest',
              desc: 'Summary of all top-matched applicants delivered every morning.',
            },
            {
              key: 'interviewConfirmations',
              title: 'Interview Attendee Confirmations',
              desc: 'Automated calendar sync alerts when candidates confirm scheduled video rounds.',
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

        <Button variant="outline" size="sm" onClick={handleSave} icon={Save}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};
