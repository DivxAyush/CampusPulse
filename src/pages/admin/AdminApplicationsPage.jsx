import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Building2, Briefcase, User, Calendar, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { adminAPI } from '../../services/api';

export const AdminApplicationsPage = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getApplications();
      if (res.success && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.warn('Error loading applications:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary-light text-brand-primary mb-1">
            <Send className="w-3 h-3" /> Platform Pipeline Audit
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Candidate Applications</h1>
          <p className="text-xs text-brand-muted mt-1">
            Audit candidate submissions, employer routing, and AI resume match signals across organizations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadApplications} isLoading={isLoading} className="text-xs self-start sm:self-auto">
          Refresh List
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 bg-white rounded-2xl border border-brand-border animate-pulse" />
          <div className="h-64 bg-white rounded-3xl border border-brand-border animate-pulse" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-border p-12 text-center shadow-subtle space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary-light flex items-center justify-center text-brand-primary mx-auto">
            <Send className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-navy">No Applications Recorded Yet</h3>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Candidate submissions submitted across employer job postings will appear here in real-time with full telemetry and status tracking.
            </p>
          </div>
          <Link to="/admin/jobs">
            <Button variant="primary" size="sm" className="mt-2">
              Inspect Active Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Target Role</th>
                <th className="pb-3">Hiring Company</th>
                <th className="pb-3">Applied On</th>
                <th className="pb-3">AI Score</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-xs">
              {applications.map((app) => {
                const candidateUser = app.candidateId?.userId || app.userId || {};
                const candidateName = candidateUser.fullName || 'Candidate';
                const candidateEmail = candidateUser.email || '';
                const jobTitle = app.jobId?.title || 'Open Position';
                const companyName = app.companyId?.companyName || 'Verified Partner';
                const appliedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent';

                return (
                  <tr key={app._id} className="hover:bg-brand-bg/40">
                    <td className="py-3.5">
                      <div className="font-bold text-brand-navy">{candidateName}</div>
                      <div className="text-brand-muted text-[11px]">{candidateEmail}</div>
                    </td>
                    <td className="py-3.5 font-semibold text-brand-navy">
                      {jobTitle}
                    </td>
                    <td className="py-3.5 text-brand-muted">
                      {companyName}
                    </td>
                    <td className="py-3.5 text-brand-muted text-[11px]">
                      {appliedDate}
                    </td>
                    <td className="py-3.5">
                      {app.aiMatch?.overallScore ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                          <Sparkles className="w-3 h-3" /> {app.aiMatch.overallScore}%
                        </span>
                      ) : (
                        <span className="text-brand-muted text-[11px]">Direct</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <Badge
                        variant={
                          app.status === 'selected' || app.status === 'shortlisted'
                            ? 'success'
                            : app.status === 'rejected'
                            ? 'danger'
                            : 'primary'
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {app.status || 'applied'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

