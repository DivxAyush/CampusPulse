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
            IILM University Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">University Dashboard</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            IILM University — MBA, HR, Marketing & Business Analytics platform overview.
          </p>
        </div>
      </div>

      {/* 4 Interactive Stat Cards with Skeleton Loading */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Students & Staff"
          value={stats?.totalUsers}
          subtitle="Registered accounts"
          icon={Users}
          to="/admin/users"
          isLoading={isLoading}
        />
        <StatCard
          title="Corporate Partners"
          value={stats?.totalCompanies}
          subtitle="Verified partners"
          icon={Building2}
          to="/admin/companies"
          isLoading={isLoading}
        />
        <StatCard
          title="Active Opportunities"
          value={stats?.activeJobs}
          subtitle="Open for applications"
          icon={Briefcase}
          trend="Live"
          to="/admin/jobs"
          isLoading={isLoading}
        />
        <StatCard
          title="Student Applications"
          value={stats?.totalApplications}
          subtitle="Submitted by students"
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
              Review students who enrolled for mock interviews, schedule sessions, and assign meeting links.
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

      {/* University Academic Programs & Domains */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">IILM Academic Domains & Placement Tracks</h2>
            <p className="text-xs text-brand-muted">Explore curriculum-aligned career opportunities across specialized business faculties.</p>
          </div>
          <Link to="/admin/jobs" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            View All Opportunities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-3 hover:border-brand-primary transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy">MBA & Management</h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Strategic Management, Operations, Leadership & Business Administration.
              </p>
            </div>
            <Link to="/admin/jobs?search=MBA" className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1 pt-1">
              Filter Track Opportunities &rarr;
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-3 hover:border-brand-primary transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy">Human Resources (HR)</h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Talent Acquisition, People Analytics, Employee Engagement & HRBP.
              </p>
            </div>
            <Link to="/admin/jobs?search=HR" className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1 pt-1">
              Filter Track Opportunities &rarr;
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-3 hover:border-brand-primary transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy">Marketing & Brand</h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Brand Strategy, Consumer Behavior, Market Research & Growth Marketing.
              </p>
            </div>
            <Link to="/admin/jobs?search=Marketing" className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1 pt-1">
              Filter Track Opportunities &rarr;
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-3 hover:border-brand-primary transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy">Business & Data Analytics</h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Power BI, Financial Modeling, Statistical Analysis & BI Reporting.
              </p>
            </div>
            <Link to="/admin/jobs?search=Analytics" className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1 pt-1">
              Filter Track Opportunities &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* University Administration Quick Navigation */}
      <div className="bg-gradient-to-r from-brand-primary-light/50 via-white to-brand-primary-light/30 border border-brand-border rounded-3xl p-6 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-brand-navy border border-brand-border">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
            <span>TPO Executive Center</span>
          </div>
          <h3 className="text-base font-bold text-brand-navy">Looking for Full Cohort Employability Analytics?</h3>
          <p className="text-xs text-brand-muted max-w-xl">
            Access the dedicated University Placement & Employability Intelligence Dashboard for batch-level yield, CTC distributions, and corporate drive tracking.
          </p>
        </div>
        <Link
          to="/university/dashboard"
          className="px-5 py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-md"
        >
          <span>Open TPO Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
