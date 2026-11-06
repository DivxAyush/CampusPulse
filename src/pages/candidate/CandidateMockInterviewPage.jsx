import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Video,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Code,
  AlertCircle,
} from 'lucide-react';
import { mockInterviewAPI, candidateAPI } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const CandidateMockInterviewPage = () => {
  const { addToast } = useToast();
  const [activeEnrollment, setActiveEnrollment] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Form State
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [techStack, setTechStack] = useState('React, Node.js, JavaScript, MongoDB');
  const [preferredSlot, setPreferredSlot] = useState('Weekend Morning (10:00 AM - 01:00 PM)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadStatus();
    loadCandidateProfile();
  }, []);

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      const res = await mockInterviewAPI.getMyStatus();
      if (res.success) {
        setActiveEnrollment(res.activeEnrollment);
        setHistory(res.mockInterviews || []);
      }
    } catch (err) {
      console.warn('Could not load mock interview status:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCandidateProfile = async () => {
    try {
      const res = await candidateAPI.getProfile();
      if (res.success && res.candidate) {
        if (res.candidate.headline) setTargetRole(res.candidate.headline);
        if (res.candidate.skills?.length) setTechStack(res.candidate.skills.slice(0, 5).join(', '));
      }
    } catch (e) {
      // ignore
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        targetRole,
        techStack: techStack.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSlot,
        notes,
      };

      const res = await mockInterviewAPI.enroll(payload);
      if (res.success) {
        addToast(res.message || 'Successfully enrolled for Mock Interview!', 'success');
        loadStatus();
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit mock interview request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this mock interview request?')) return;
    setIsCancelling(true);
    try {
      const res = await mockInterviewAPI.cancel(id);
      if (res.success) {
        addToast('Mock interview request cancelled.', 'info');
        loadStatus();
      }
    } catch (err) {
      addToast(err.message || 'Failed to cancel request', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navy-light to-brand-primary p-6 sm:p-8 rounded-3xl text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" /> PulseAI Career Readiness
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            1-on-1 Technical Mock Interviews
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            Practice real coding rounds, system architecture, and behavioral questions with verified senior engineers before your real job interviews.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-center">
            <div className="text-xs text-gray-300">Target Role Match</div>
            <div className="text-base font-extrabold text-white mt-0.5">Top Tech Firms</div>
          </div>
        </div>
      </div>

      {/* ACTIVE ENROLLMENT CARD (If candidate already enrolled) */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-3xl border border-brand-border text-center space-y-2">
          <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-brand-muted">Checking your mock interview enrollment status...</p>
        </div>
      ) : activeEnrollment ? (
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Current Request</span>
                {activeEnrollment.status === 'pending' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3.5 h-3.5" /> Pending Admin Scheduling
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Calendar className="w-3.5 h-3.5" /> Session Scheduled!
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-brand-navy mt-1">
                Mock Interview for: {activeEnrollment.targetRole}
              </h2>
            </div>

            {activeEnrollment.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancel(activeEnrollment._id)}
                isLoading={isCancelling}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 self-start sm:self-auto"
              >
                Cancel Request
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border/60">
              <span className="text-[11px] font-semibold text-brand-muted">Preferred Time Slot</span>
              <p className="text-xs font-bold text-brand-navy mt-1">{activeEnrollment.preferredSlot}</p>
            </div>

            <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border/60">
              <span className="text-[11px] font-semibold text-brand-muted">Tech Focus Areas</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(activeEnrollment.techStack || []).map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white text-[10px] font-semibold text-brand-navy border border-brand-border/60">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border/60">
              <span className="text-[11px] font-semibold text-brand-muted">Assigned Interviewer</span>
              <p className="text-xs font-bold text-brand-navy mt-1">
                {activeEnrollment.interviewerName || 'CampusPulse Senior Interviewer'}
              </p>
            </div>
          </div>

          {/* SCHEDULED DETAILS BANNER */}
          {activeEnrollment.status === 'scheduled' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <Video className="w-4 h-4 text-emerald-600" /> Live Mock Interview Session Confirmed
                </div>
                {activeEnrollment.scheduledAt && (
                  <p className="text-xs text-emerald-700">
                    Scheduled for:{' '}
                    <strong>
                      {new Date(activeEnrollment.scheduledAt).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(activeEnrollment.scheduledAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </strong>
                  </p>
                )}
              </div>

              {activeEnrollment.meetingLink && (
                <a
                  href={activeEnrollment.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Join Google Meet / Zoom
                </a>
              )}
            </div>
          )}

          {activeEnrollment.status === 'pending' && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Your enrollment is in the Admin queue. The team will review your profile, assign an expert interviewer, and email/update your meeting slot shortly.
              </span>
            </div>
          )}
        </div>
      ) : (
        /* ENROLLMENT FORM (If not currently enrolled) */
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="border-b border-brand-border pb-4">
            <h2 className="text-xl font-bold text-brand-navy">Enroll for a 1-on-1 Mock Interview</h2>
            <p className="text-xs text-brand-muted mt-1">
              Fill in your target position and preferred time slot. Our admin team will arrange a tailored technical mock session.
            </p>
          </div>

          <form onSubmit={handleEnroll} className="space-y-5">
            {/* Target Role */}
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                Target Job Role / Title <span className="text-brand-primary">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Developer, Full Stack Engineer, Backend Specialist"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary focus:bg-white transition-all text-brand-navy font-semibold"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                Primary Technologies & Skills (comma-separated) <span className="text-brand-primary">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. React, Node.js, JavaScript, Python, MongoDB, Docker"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary focus:bg-white transition-all text-brand-navy"
              />
            </div>

            {/* Preferred Slot */}
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                Preferred Time Slot
              </label>
              <select
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary focus:bg-white transition-all text-brand-navy font-medium"
              >
                <option value="Weekend Morning (10:00 AM - 01:00 PM)">Weekend Morning (10:00 AM - 01:00 PM)</option>
                <option value="Weekend Evening (05:00 PM - 08:00 PM)">Weekend Evening (05:00 PM - 08:00 PM)</option>
                <option value="Weekday Evening (06:00 PM - 09:00 PM)">Weekday Evening (06:00 PM - 09:00 PM)</option>
                <option value="Flexible / Any Available Slot">Flexible / Any Available Slot</option>
              </select>
            </div>

            {/* Preparation Notes */}
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                Specific Focus Areas or Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Want to focus on React system design, live coding DSA, or behavioral STAR interview questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-brand-bg border border-brand-border outline-none focus:border-brand-primary focus:bg-white transition-all text-brand-text resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                icon={Calendar}
                className="w-full sm:w-auto px-8"
              >
                I Want Mock Interview (Enroll Now)
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* WHY TAKE A MOCK INTERVIEW? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-bold">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-brand-navy">Live Technical Coding</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Practice hands-on coding rounds with live code-pair exercises mirroring FAANG and premier startup hiring bars.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-brand-navy">Detailed Feedback Score</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Get actionable feedback on problem-solving clarity, edge cases, time/space complexity, and communication.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-brand-navy">Direct Recruiter Referrals</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Top performers in mock rounds receive fast-track interview recommendations to verified hiring partner companies.
          </p>
        </div>
      </div>
    </div>
  );
};
