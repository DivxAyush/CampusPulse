import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { FileText, CheckCircle2, Sparkles, Building2, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { candidateAPI, jobsAPI } from '../../services/api';

export const ApplyModal = ({ isOpen, onClose, job, onSuccess }) => {
  const { user, isAuthenticated, role } = useAuth();
  const { addToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated && role === 'candidate') {
      loadResumes();
    }
  }, [isOpen, isAuthenticated, role]);

  const loadResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const res = await candidateAPI.getResumes();
      if (res.success && res.resumes) {
        setResumes(res.resumes);
        const primary = res.resumes.find((r) => r.isPrimary) || res.resumes[0];
        if (primary) setSelectedResumeId(primary._id);
      }
    } catch (err) {
      console.warn('Could not load resumes:', err.message);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;

    setIsSubmitting(true);
    try {
      const res = await jobsAPI.applyToJob(job._id, {
        resumeId: selectedResumeId || undefined,
        coverLetter,
      });

      addToast(res.message || 'Application submitted successfully!', 'success');
      if (onSuccess) onSuccess(job);
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to submit application.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job || role === 'admin' || role === 'company') return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Application" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Job Brief */}
        <div className="p-4 rounded-xl bg-brand-bg border border-brand-border flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-primary-light flex items-center justify-center text-brand-navy flex-shrink-0">
            <Building2 className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-navy">{job.title}</h4>
            <div className="text-xs text-brand-muted">{job.companyId?.companyName || 'Campus Plus Verified Partner'}</div>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="primary" size="sm">
                {job.jobType ? job.jobType.replace('-', ' ') : 'Full Time'}
              </Badge>
              <Badge variant="default" size="sm">
                {job.location}
              </Badge>
            </div>
          </div>
        </div>

        {/* Resume Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
            Select Resume for this Role
          </label>
          {resumes.length > 0 ? (
            <div className="space-y-2">
              {resumes.map((r) => (
                <label
                  key={r._id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedResumeId === r._id
                      ? 'border-brand-primary bg-brand-primary-light/40 shadow-subtle'
                      : 'border-brand-border hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="resumeSelection"
                      checked={selectedResumeId === r._id}
                      onChange={() => setSelectedResumeId(r._id)}
                      className="text-brand-primary focus:ring-brand-primary h-4 w-4"
                    />
                    <div>
                      <div className="text-sm font-bold text-brand-navy">{r.fileName}</div>
                      <div className="text-xs text-brand-muted">Uploaded resume v{r.version}</div>
                    </div>
                  </div>
                  {r.isPrimary && (
                    <Badge variant="success" size="sm">
                      Default
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-brand-border text-center bg-brand-bg/50">
              <FileText className="w-6 h-6 text-brand-muted mx-auto mb-1" />
              <div className="text-xs font-semibold text-brand-text">Default Profile Resume will be attached</div>
              <div className="text-[11px] text-brand-muted">You can upload custom PDF resumes in your Resume Manager</div>
            </div>
          )}
        </div>

        {/* Cover Letter / Note */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
            Cover Letter / Note to Recruiter (Optional)
          </label>
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Introduce yourself, key strengths, and why you are excited for this opportunity..."
            className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-text placeholder-gray-400 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light transition-all"
          />
        </div>

        {/* AI Match notice */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-900 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Your profile will be automatically matched with the position requirements using PulseAI.</span>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-brand-border">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} icon={CheckCircle2}>
            Confirm & Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
