import React, { useState, useEffect } from 'react';
import { Send, Building2, MapPin, Calendar, Clock, Video, Sparkles, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { candidateAPI } from '../../services/api';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const res = await candidateAPI.getApplications();
      if (res.success && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.warn('Error loading applications:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted':
        return <Badge variant="success">Shortlisted by Recruiter</Badge>;
      case 'interview_scheduled':
        return <Badge variant="primary">Interview Scheduled</Badge>;
      case 'selected':
        return <Badge variant="navy">Offer Extended</Badge>;
      case 'rejected':
        return <Badge variant="danger">Not Selected</Badge>;
      case 'viewed':
        return <Badge variant="info">Application Viewed</Badge>;
      default:
        return <Badge variant="default">Submitted</Badge>;
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          Tracking Center
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">My Job Applications</h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Monitor real-time recruiter status updates, interview schedules, and candidate feedback.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 bg-white rounded-3xl border border-brand-border animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No job applications submitted yet"
          description="Browse open roles in the Job Directory and apply to start tracking your interviews here."
        />
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const job = app.jobId || {};
            const company = job.companyId || {};

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-subtle hover:shadow-card transition-all space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center p-2 flex-shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building2 className="w-6 h-6 text-brand-primary" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-muted flex items-center gap-1.5">
                        {company.companyName || 'Verified Partner'}
                        {company.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
                      </div>
                      <h3 className="text-lg font-bold text-brand-navy mt-0.5">{job.title || 'Engineering Role'}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-primary" /> {job.location || 'India'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-primary" /> Applied on{' '}
                          {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
                    {getStatusBadge(app.status)}
                    {app.aiMatch?.overallScore && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {app.aiMatch.overallScore}% AI Match
                      </span>
                    )}
                  </div>
                </div>

                {/* Interview Scheduled Notice Box */}
                {app.status === 'interview_scheduled' && (
                  <div className="bg-brand-primary-light/50 border border-brand-primary/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                          Technical Interview Scheduled
                        </div>
                        <div className="text-xs text-brand-muted">
                          Round 1: Video Evaluation with Engineering Lead
                        </div>
                      </div>
                    </div>
                    <a
                      href="https://meet.google.com/cmp-nexus-intv"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="primary" size="sm" icon={Video}>
                        Join Google Meet Room
                      </Button>
                    </a>
                  </div>
                )}

                {/* Recruiter Notes */}
                {app.recruiterNotes && (
                  <div className="p-3 rounded-xl bg-brand-bg text-xs border border-brand-border/60">
                    <span className="font-bold text-brand-navy flex items-center gap-1 mb-0.5">
                      <MessageSquare className="w-3.5 h-3.5 text-brand-primary" /> Note from Recruiter:
                    </span>
                    <span className="text-brand-muted leading-relaxed">{app.recruiterNotes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
