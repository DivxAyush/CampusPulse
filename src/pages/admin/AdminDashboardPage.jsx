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
    </div>
  );
};
