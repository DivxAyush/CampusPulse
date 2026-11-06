import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Building2, Briefcase, BarChart3, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { adminAPI } from '../../services/api';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    adminAPI
      .getStats()
      .then((res) => {
        if (res.success && res.stats) setStats(res.stats);
      })
      .catch((err) => {
        console.warn('Error loading admin stats:', err);
      })
      .finally(() => setIsLoading(false));
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

      {/* 4 Interactive Stat Cards with Skeleton Loading */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Platform Users"
          value={stats?.totalUsers}
          subtitle="Registered accounts"
          icon={Users}
          to="/admin/users"
          isLoading={isLoading}
        />
        <StatCard
          title="Active Companies"
          value={stats?.totalCompanies}
          subtitle="Verified employers"
          icon={Building2}
          to="/admin/companies"
          isLoading={isLoading}
        />
        <StatCard
          title="Published Jobs"
          value={stats?.activeJobs}
          subtitle="Publicly accessible"
          icon={Briefcase}
          trend="Live"
          to="/admin/jobs"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Applications"
          value={stats?.totalApplications}
          subtitle="Processed by platform"
          icon={Send}
          to="/admin/applications"
          isLoading={isLoading}
        />
      </div>

      {/* Deep Link Management Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/users" className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card hover:border-brand-primary transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-primary transition-colors">User Management</h3>
          <p className="text-xs text-brand-muted leading-relaxed">Inspect candidate accounts, verification status, and moderation.</p>
        </Link>

        <Link to="/admin/companies" className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card hover:border-brand-primary transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-primary transition-colors">Company Verification</h3>
          <p className="text-xs text-brand-muted leading-relaxed">Review corporate credentials, assign verification badges, and monitor hiring.</p>
        </Link>

        <Link to="/admin/jobs" className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card hover:border-brand-primary transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-primary transition-colors">Job Moderation</h3>
          <p className="text-xs text-brand-muted leading-relaxed">Monitor listings, enforce content standards, and manage expired positions.</p>
        </Link>

        <Link to="/admin/applications" className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card hover:border-brand-primary transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-primary transition-colors">Candidate Applications</h3>
          <p className="text-xs text-brand-muted leading-relaxed">Audit submissions, track application pipelines, and inspect hiring velocity.</p>
        </Link>
      </div>
    </div>
  );
};
