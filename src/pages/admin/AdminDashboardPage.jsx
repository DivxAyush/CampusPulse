import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Building2, Briefcase, BarChart3, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { adminAPI } from '../../services/api';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 4,
    totalCandidates: 1,
    totalCompanies: 2,
    totalJobs: 6,
    activeJobs: 6,
    totalApplications: 2,
    totalAnalyses: 1,
  });

  useEffect(() => {
    adminAPI.getStats().then((res) => {
      if (res.success && res.stats) setStats(res.stats);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Internal Governance
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Admin System Console</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Platform moderation, user management, and health telemetry overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Platform Users" value={stats.totalUsers} subtitle="Registered accounts" icon={Users} />
        <StatCard title="Active Companies" value={stats.totalCompanies} subtitle="Verified employers" icon={Building2} />
        <StatCard title="Published Jobs" value={stats.activeJobs} subtitle="Publicly accessible" icon={Briefcase} trend="Live" />
        <StatCard title="Total Applications" value={stats.totalApplications} subtitle="Processed by platform" icon={Send} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users" className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">User Management</h3>
          <p className="text-xs text-brand-muted leading-relaxed">Inspect candidate accounts, verification status, and moderation.</p>
        </Link>

        <Link to="/admin/companies" className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">Company Verification</h3>
          <p className="text-xs text-brand-muted leading-relaxed">Review corporate credentials, assign verification badges, and monitor hiring.</p>
        </Link>

        <Link to="/admin/jobs" className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">Job Moderation</h3>
          <p className="text-xs text-brand-muted leading-relaxed">Monitor listings, enforce content standards, and manage expired positions.</p>
        </Link>
      </div>
    </div>
  );
};
