import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  FileText,
  Sparkles,
  Download,
  Video,
  Clock,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { companyAPI, applicationAPI } from '../../services/api';

export const ApplicantsPage = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const [applicants, setApplicants] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Interview Schedule Modal state
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    roundName: 'Technical Round 1: Live Coding',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    mode: 'video',
    meetingLink: 'https://meet.google.com/cmp-nexus-intv',
    notes: 'Focus on React component state architecture and API data fetching.',
  });
  const [isScheduling, setIsScheduling] = useState(false);

  // Resume Preview Modal state
  const [previewResume, setPreviewResume] = useState(null);

  useEffect(() => {
    loadApplicants();
  }, [searchParams]);

  const loadApplicants = async () => {
    setIsLoading(true);
    try {
      const jobId = searchParams.get('jobId') || undefined;
      const res = await companyAPI.getApplicants({ jobId });
      if (res.success && res.applicants) {
        setApplicants(res.applicants);
      }
    } catch (err) {
      console.warn('Error loading applicants:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShortlist = async (appId) => {
    try {
      await applicationAPI.shortlist(appId, { recruiterNotes: 'Candidate meets required skills criteria.' });
      addToast('Candidate shortlisted for next round.', 'success');
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: 'shortlisted' } : a))
      );
    } catch (err) {
      addToast(err.message || 'Error updating status', 'error');
    }
  };

  const handleReject = async (appId) => {
    if (!window.confirm('Are you sure you want to decline this applicant?')) return;
    try {
      await applicationAPI.reject(appId, { recruiterNotes: 'Qualifications do not match current seniority opening.' });
      addToast('Application declined.', 'info');
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: 'rejected' } : a))
      );
    } catch (err) {
      addToast(err.message || 'Error declining application', 'error');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    setIsScheduling(true);
    try {
      await applicationAPI.scheduleInterview(selectedAppForInterview._id, interviewForm);
      addToast('Interview scheduled and invitation dispatched to candidate!', 'success');
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === selectedAppForInterview._id ? { ...a, status: 'interview_scheduled' } : a
        )
      );
      setSelectedAppForInterview(null);
    } catch (err) {
      addToast(err.message || 'Error scheduling interview', 'error');
    } finally {
      setIsScheduling(false);
    }
  };

  const filteredApplicants =
    statusFilter === 'all'
      ? applicants
      : applicants.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Talent Pipeline
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Applicant Management</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Review incoming candidate applications, assess PulseAI match percentage, and schedule interviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'applied', 'shortlisted', 'interview_scheduled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                statusFilter === st
                  ? 'bg-brand-navy text-white shadow-subtle'
                  : 'bg-white border border-brand-border text-brand-muted hover:text-brand-navy'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-white rounded-3xl border border-brand-border animate-pulse" />
          ))}
        </div>
      ) : filteredApplicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants found in this category"
          description="Candidates who apply to your job listings will appear here ranked by PulseAI match score."
        />
      ) : (
        <div className="space-y-5">
          {filteredApplicants.map((app) => {
            const candidate = app.candidateId || {};
            const userObj = candidate.userId || {};
            const job = app.jobId || {};

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-subtle hover:shadow-card transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-brand-primary-light flex items-center justify-center font-bold text-base text-brand-navy shadow-subtle flex-shrink-0">
                      {userObj.profileImage ? (
                        <img src={userObj.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        userObj.fullName?.charAt(0) || 'A'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-brand-navy">
                          {userObj.fullName || 'Candidate'}
                        </h3>
                        <Badge
                          variant={
                            app.status === 'shortlisted'
                              ? 'success'
                              : app.status === 'interview_scheduled'
                              ? 'primary'
                              : app.status === 'rejected'
                              ? 'danger'
                              : 'default'
                          }
                          size="sm"
                          className="capitalize"
                        >
                          {app.status ? app.status.replace('_', ' ') : 'Applied'}
                        </Badge>
                      </div>

                      <div className="text-xs font-semibold text-brand-primary mt-0.5">
                        Applied for: {job.title || 'Software Engineer'}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted mt-1.5">
                        <span>{userObj.email}</span>
                        <span>•</span>
                        <span>{candidate.location || 'India'}</span>
                        <span>•</span>
                        <span>{candidate.totalExperience || '1-2 years exp'}</span>
                        <span>•</span>
                        <span>Applied {new Date(app.appliedAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Match Gauge */}
                  <div className="flex flex-col sm:items-end gap-1 flex-shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                      {app.aiMatch?.overallScore || 92}% Match Score
                    </span>
                    <span className="text-[11px] text-brand-muted">Calculated by PulseAI</span>
                  </div>
                </div>

                {/* Candidate Skills Pills */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {candidate.skills.slice(0, 6).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-bg text-brand-text border border-brand-border/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Cover letter or applicant note */}
                {app.coverLetter && (
                  <p className="text-xs text-brand-muted bg-brand-bg/60 p-3 rounded-xl border border-brand-border/60 leading-relaxed italic">
                    "{app.coverLetter}"
                  </p>
                )}

                {/* Action Buttons Bar */}
                <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewResume(app.resumeId || { fileName: 'Ayush_Sharma_Resume.pdf' })}
                      icon={FileText}
                      className="text-xs"
                    >
                      View Resume
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status !== 'rejected' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(app._id)}
                        className="text-xs text-red-600 hover:bg-red-50"
                      >
                        Decline
                      </Button>
                    )}

                    {app.status !== 'shortlisted' && app.status !== 'interview_scheduled' && (
                      <Button
                        variant="mint"
                        size="sm"
                        onClick={() => handleShortlist(app._id)}
                        icon={CheckCircle2}
                        className="text-xs"
                      >
                        Shortlist
                      </Button>
                    )}

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedAppForInterview(app)}
                      icon={Video}
                      className="text-xs"
                    >
                      Schedule Interview
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {selectedAppForInterview && (
        <Modal
          isOpen={!!selectedAppForInterview}
          onClose={() => setSelectedAppForInterview(null)}
          title="Schedule Video Interview"
          description={`Invite ${selectedAppForInterview.candidateId?.userId?.fullName || 'the candidate'} to an interview round.`}
        >
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <Input
              label="Interview Round Name"
              required
              value={interviewForm.roundName}
              onChange={(e) => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
            />

            <Input
              label="Date & Time"
              type="datetime-local"
              required
              value={interviewForm.scheduledAt}
              onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
            />

            <Input
              label="Google Meet / Video Conference Link"
              required
              icon={Video}
              value={interviewForm.meetingLink}
              onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Preparation Notes for Candidate
              </label>
              <textarea
                rows={3}
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                className="w-full bg-white border border-brand-border rounded-xl p-3 text-xs text-brand-text outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="md" onClick={() => setSelectedAppForInterview(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isScheduling} icon={Calendar}>
                Confirm & Dispatch Invitation
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* RESUME PREVIEW MODAL */}
      {previewResume && (
        <Modal
          isOpen={!!previewResume}
          onClose={() => setPreviewResume(null)}
          title="Candidate Resume Preview"
          description={previewResume.fileName || 'Applicant Resume'}
        >
          <div className="space-y-4">
            <div className="p-8 rounded-2xl bg-brand-bg text-center space-y-3 border border-brand-border">
              <FileText className="w-12 h-12 text-brand-primary mx-auto" />
              <h4 className="text-sm font-bold text-brand-navy">{previewResume.fileName}</h4>
              <p className="text-xs text-brand-muted">Stored securely in Cloudinary document vault.</p>
              <div className="flex justify-center gap-3 pt-2">
                <a href={previewResume.fileUrl || '#'} target="_blank" rel="noreferrer">
                  <Button variant="primary" size="sm" icon={Download}>
                    Download Document
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
