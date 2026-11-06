import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Building2, Briefcase, BarChart3, Sparkles, Send, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
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

      {/* Mock Interview Management Banner */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-navy">Mock Interview Enrollments</h3>
              {stats?.pendingMockInterviews > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                  {stats.pendingMockInterviews} Pending Action
                </span>
              )}
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              Review candidates who requested 1-on-1 technical mock interview rounds, schedule dates, and assign meeting links.
            </p>
          </div>
        </div>

        <Link
          to="/admin/mock-interviews"
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Manage Mock Interviews</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
