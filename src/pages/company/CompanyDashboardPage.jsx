import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Building2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { companyAPI } from '../../services/api';

export const CompanyDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await companyAPI.getDashboard();
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.warn('Company dashboard load error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = dashboardData?.stats || {
    totalJobs: 2,
    activeJobs: 2,
    totalApplicants: 3,
    shortlistedCandidates: 1,
  };

  const recentApplicants = dashboardData?.recentApplicants || [];
  const recentJobs = dashboardData?.recentJobs || [];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle">
        <div className="space-y-1">
          <Badge variant="primary" size="sm" className="mb-1">
            Recruiter Workspace
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            Employer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Manage your open positions, review AI-ranked applicants, and schedule video interviews.
          </p>
        </div>

        <Link to="/company/jobs/create">
          <Button variant="primary" size="lg" icon={PlusCircle}>
            Post a New Job
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Positions"
          value={stats.totalJobs}
          subtitle="All created jobs"
          icon={Briefcase}
        />
        <StatCard
          title="Active Listings"
          value={stats.activeJobs}
          subtitle="Published and accepting"
          icon={CheckCircle2}
          trend="Live"
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          subtitle="Across all job roles"
          icon={Users}
          trend="+3 new"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlistedCandidates}
          subtitle="Ready for interview round"
          icon={Sparkles}
        />
      </div>

      {/* Recent Applicants Section */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Recent Job Applicants</h2>
            <p className="text-xs text-brand-muted">Ranked with PulseAI candidate matching scores</p>
          </div>
          <Link to="/company/applicants" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            View All Applicants <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentApplicants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                  <th className="pb-3 font-semibold">Candidate</th>
                  <th className="pb-3 font-semibold">Applied Position</th>
                  <th className="pb-3 font-semibold">Match Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {recentApplicants.map((app) => {
                  const candidate = app.candidateId || {};
                  const userObj = candidate.userId || {};
                  const job = app.jobId || {};

                  return (
                    <tr key={app._id} className="hover:bg-brand-bg/40 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-brand-primary-light flex items-center justify-center font-bold text-xs text-brand-navy flex-shrink-0">
                            {userObj.profileImage ? (
                              <img src={userObj.profileImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              userObj.fullName?.charAt(0) || 'C'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-brand-navy">{userObj.fullName || 'Ayush Sharma'}</div>
                            <div className="text-[11px] text-brand-muted">{userObj.email || 'candidate@campusplus.com'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 text-xs font-semibold text-brand-navy">
                        {job.title || 'Senior Software Engineer'}
                      </td>

                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-brand-primary" />
                          {app.aiMatch?.overallScore || 92}%
                        </span>
                      </td>

                      <td className="py-3.5">
                        <Badge variant={app.status === 'shortlisted' ? 'success' : app.status === 'interview_scheduled' ? 'primary' : 'default'} size="sm" className="capitalize">
                          {app.status ? app.status.replace('_', ' ') : 'Applied'}
                        </Badge>
                      </td>

                      <td className="py-3.5 text-right">
                        <Link to={`/company/applicants`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Review Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-brand-muted border border-dashed border-brand-border rounded-2xl">
            No applicants received yet. Promote your listings to attract developers!
          </div>
        )}
      </div>

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-navy">Active Job Postings</h2>
          <Link to="/company/jobs" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            Manage All Jobs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentJobs.slice(0, 2).map((job) => (
            <div key={job._id} className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">{job.title}</h3>
                  <div className="text-xs text-brand-muted mt-0.5">
                    {job.location} • {job.workMode || 'Hybrid'}
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  {job.status || 'Published'}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-brand-border text-xs text-brand-muted">
                <span>{job.applicantsCount || 0} Total Applicants</span>
                <Link to={`/company/jobs/edit/${job._id}`}>
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-primary">
                    Edit Position
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
