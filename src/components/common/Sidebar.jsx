import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Sparkles,
  Briefcase,
  Bookmark,
  Send,
  Settings,
  PlusCircle,
  Users,
  Calendar,
  Building2,
  BarChart3,
  X,
  HelpCircle,
} from 'lucide-react';

export const Sidebar = ({ role = 'candidate', onClose }) => {
  const candidateLinks = [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/candidate/profile', icon: User },
    { label: 'My Resume', path: '/candidate/resumes', icon: FileText },
    { label: 'PulseAI Analyzer', path: '/candidate/ai-analyzer', icon: Sparkles, badge: 'PulseAI' },
    { label: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Saved Jobs', path: '/candidate/saved', icon: Bookmark },
    { label: 'My Applications', path: '/candidate/applications', icon: Send },
    { label: 'Help & Support', path: '/help', icon: HelpCircle },
    { label: 'Settings', path: '/candidate/settings', icon: Settings },
  ];

  const companyLinks = [
    { label: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', path: '/company/profile', icon: Building2 },
    { label: 'Manage Jobs', path: '/company/jobs', icon: Briefcase },
    { label: 'Post a New Job', path: '/company/jobs/create', icon: PlusCircle, badge: 'New' },
    { label: 'Applicants', path: '/company/applicants', icon: Users },
    { label: 'Interviews', path: '/company/interviews', icon: Calendar },
    { label: 'Help & Support', path: '/help', icon: HelpCircle },
    { label: 'Settings', path: '/company/settings', icon: Settings },
  ];

  const adminLinks = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Users', path: '/admin/users', icon: Users },
    { label: 'Companies', path: '/admin/companies', icon: Building2 },
    { label: 'Job Moderation', path: '/admin/jobs', icon: Briefcase },
    { label: 'System Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Help & Support', path: '/help', icon: HelpCircle },
  ];

  const links = role === 'company' ? companyLinks : role === 'admin' ? adminLinks : candidateLinks;

  return (
    <aside className="w-64 bg-white border-r border-brand-border h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col justify-between py-4 px-3 overflow-y-auto flex-shrink-0">
      <div className="space-y-3">
        {onClose && (
          <div className="flex justify-end sm:hidden pb-1">
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-brand-muted hover:text-brand-navy hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-brand-muted uppercase tracking-wider px-3 mb-2">
            Navigation Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-primary-light text-brand-navy font-bold shadow-subtle'
                      : 'text-brand-text hover:bg-gray-100/70 hover:text-brand-primary'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-brand-primary" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-brand-primary text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom info */}
      <div className="pt-3 border-t border-brand-border/60 text-[11px] text-brand-muted px-2 flex items-center justify-between">
        <span className="font-medium">Campus Plus v1.0</span>
        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
        </span>
      </div>
    </aside>
  );
};
