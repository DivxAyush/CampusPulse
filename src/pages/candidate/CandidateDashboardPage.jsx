import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Send,
  Bookmark,
  Building2,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { JobCard } from '../../components/jobs/JobCard';
import { useAuth } from '../../context/AuthContext';
import { candidateAPI } from '../../services/api';

export const CandidateDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await candidateAPI.getDashboard();
      if (res.success && res.dashboard) {
        setDashboardData(res.dashboard);
      }
    } catch (err) {
      console.warn('Dashboard load error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted':
        return <Badge variant="success">Shortlisted</Badge>;
      case 'interview_scheduled':
        return <Badge variant="primary">Interview Scheduled</Badge>;
      case 'viewed':
        return <Badge variant="info">Viewed by Recruiter</Badge>;
      case 'rejected':
        return <Badge variant="danger">Declined</Badge>;
      default:
        return <Badge variant="default">Submitted</Badge>;
    }
  };

  const completion = dashboardData?.profileCompletion || 85;

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle">
        <div className="space-y-1">
          <Badge variant="primary" size="sm" className="mb-1">
            Candidate Hub
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Track your job applications, check your PulseAI ATS score, and discover matching opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link to="/candidate/resumes">
            <Button variant="outline" size="md" icon={FileText}>
              Manage Resumes
            </Button>
          </Link>
          <Link to="/candidate/ai-analyzer">
            <Button variant="primary" size="md" icon={Sparkles}>
              PulseAI Resume Scan
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle">
        <div className="flex items-center justify-between text-xs font-bold text-brand-navy mb-2">
          <span>Profile Strength Score</span>
          <span className="text-brand-primary font-extrabold">{completion}% Complete</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-brand-bg overflow-hidden border border-brand-border/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-brand-primary"
          />
        </div>
        <div className="flex items-center justify-between mt-2.5 text-xs text-brand-muted">
          <span>{completion >= 90 ? 'Profile optimized for high visibility' : 'Add remaining certifications and projects to reach 100%'}</span>
          <Link to="/candidate/profile" className="font-bold text-brand-primary hover:underline">
            Complete Profile
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Applications"
          value={dashboardData?.applicationsCount || 2}
          subtitle="Submitted across partner firms"
          icon={Send}
          trend="+1 this week"
        />
        <StatCard
          title="PulseAI Resume Score"
          value={dashboardData?.latestAnalysis?.overallScore ? `${dashboardData.latestAnalysis.overallScore}/100` : '89/100'}
          subtitle="Benchmark: 80+ is interview-ready"
          icon={Sparkles}
          trend="Top 10%"
        />
        <StatCard
          title="Resumes Uploaded"
          value={dashboardData?.resumesCount || 1}
          subtitle="Primary: PDF format"
          icon={FileText}
        />
        <StatCard
          title="Matching Positions"
          value={dashboardData?.recommendedJobs?.length || 4}
          subtitle="Based on your React skills"
          icon={Building2}
          trend="New"
        />
      </div>

      {/* AI Resume Insight Promo Card */}
      <div className="bg-brand-navy rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
            <Sparkles className="w-3.5 h-3.5" /> PulseAI Diagnostic Recommendation
          </div>
          <h3 className="text-xl font-bold text-white">Elevate your Resume with PulseAI ATS Scorer</h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
            Scan your resume against technical job requirements to detect bottlenecks, score quantifiable accomplishments, and get instant recruiter match feedback.
          </p>
        </div>
        <Link to="/candidate/ai-analyzer" className="flex-shrink-0">
          <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
            Run ATS Scan
          </Button>
        </Link>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-navy">Recent Job Applications</h2>
          <Link to="/candidate/applications" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            View All Applications <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {dashboardData?.recentApplications && dashboardData.recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                  <th className="pb-3 font-semibold">Position</th>
                  <th className="pb-3 font-semibold">Company</th>
                  <th className="pb-3 font-semibold">Applied Date</th>
                  <th className="pb-3 font-semibold">AI Match</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {dashboardData.recentApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-brand-bg/40 transition-colors">
                    <td className="py-3.5 font-bold text-brand-navy">
                      {app.jobId?.title || 'Senior Software Engineer'}
                    </td>
                    <td className="py-3.5 text-brand-muted font-medium">
                      {app.companyId?.companyName || 'Verified Partner'}
                    </td>
                    <td className="py-3.5 text-xs text-brand-muted">
                      {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        {app.aiMatch?.overallScore || 90}%
                      </span>
                    </td>
                    <td className="py-3.5">{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-brand-muted border border-dashed border-brand-border rounded-2xl">
            No active applications yet. Browse recommended positions below to apply!
          </div>
        )}
      </div>

      {/* Recommended Jobs Carousel/Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Recommended Jobs For You</h2>
            <p className="text-xs text-brand-muted">Tailored based on your React, Node.js, and MongoDB skill set</p>
          </div>
          <Link to="/candidate/recommended" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            See All Matches <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(dashboardData?.recommendedJobs || []).slice(0, 2).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};
