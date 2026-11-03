import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  Download,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { candidateAPI } from '../../services/api';

export const CandidateResumePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const res = await candidateAPI.getResumes();
      if (res.success && res.resumes) {
        setResumes(res.resumes);
      }
    } catch (err) {
      console.warn('Error loading resumes:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      addToast('Please upload a valid PDF or DOCX resume.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('File size must be under 10MB.', 'error');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await candidateAPI.uploadResume(formData);
      if (res.success) {
        addToast('Resume uploaded and analyzed successfully with PulseAI!', 'success');
        loadResumes();
      }
    } catch (err) {
      addToast(err.message || 'Error uploading resume.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await candidateAPI.deleteResume(id);
      addToast('Resume removed.', 'success');
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      addToast(err.message || 'Error deleting resume.', 'error');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '180 KB';
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          Document Management
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Resume Management</h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Upload PDF/DOCX resumes to receive automated PulseAI ATS analysis, keyword extraction, and bullet point enhancements.
        </p>
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`bg-white rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all shadow-subtle ${
          dragActive ? 'border-brand-primary bg-brand-primary-light/30 scale-[1.01]' : 'border-brand-border hover:border-brand-primary'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-brand-primary-light text-brand-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-brand-navy">
          {dragActive ? 'Drop your resume file here' : 'Drag & drop your resume file here'}
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-sm mx-auto">
          Supports PDF, DOCX, and DOC documents up to 10MB in size.
        </p>

        <div className="mt-6">
          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center font-medium rounded-xl text-sm px-5 py-2.5 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm transition-all">
              {isUploading ? 'Analyzing with PulseAI...' : 'Browse Local Files'}
            </span>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              disabled={isUploading}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-brand-muted pt-4 border-t border-brand-border/60">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" /> Instant ATS Scoring
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" /> Cloudinary Secure Vault
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" /> No Public Exposure
          </span>
        </div>
      </div>

      {/* Uploaded Resumes List */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-primary" /> Uploaded Resumes ({resumes.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/candidate/ai-analyzer')}
            icon={Sparkles}
            className="text-xs font-bold text-brand-primary"
          >
            Launch AI Analyzer
          </Button>
        </div>

        {isLoading ? (
          <div className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
        ) : resumes.length === 0 ? (
          <div className="p-8 text-center text-xs text-brand-muted border border-dashed border-brand-border rounded-2xl">
            No resume uploaded yet. Upload your PDF above to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-brand-border bg-brand-bg/40 hover:bg-brand-bg transition-all gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center text-red-500 shadow-subtle flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-brand-navy truncate max-w-[240px] sm:max-w-md">
                        {resume.fileName}
                      </span>
                      {resume.isPrimary && (
                        <Badge variant="primary" size="sm">
                          Primary Resume
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-brand-muted mt-0.5">
                      Version {resume.version || 1} • {formatFileSize(resume.fileSize)} • Uploaded{' '}
                      {new Date(resume.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant="mint"
                    size="sm"
                    onClick={() => navigate('/candidate/ai-analyzer')}
                    icon={Sparkles}
                    className="text-xs"
                  >
                    View AI Score
                  </Button>
                  {resume.fileUrl && (
                    <a href={resume.fileUrl} target="_blank" rel="noreferrer" download>
                      <Button variant="outline" size="sm" icon={Download} className="text-xs">
                        Download
                      </Button>
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="p-2 text-brand-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
