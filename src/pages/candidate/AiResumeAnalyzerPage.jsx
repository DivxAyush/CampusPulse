import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ScoreGauge } from '../../components/resume/ScoreGauge';
import { DiffViewer } from '../../components/resume/DiffViewer';
import { useToast } from '../../context/ToastContext';
import { aiAPI, candidateAPI } from '../../services/api';

export const AiResumeAnalyzerPage = () => {
  const { addToast } = useToast();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await candidateAPI.getDashboard();
      if (res.success && res.dashboard?.latestAnalysis) {
        setAnalysis(res.dashboard.latestAnalysis);
      }
    } catch (err) {
      console.warn('AI analysis load error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      const dash = await candidateAPI.getDashboard();
      if (!dash.dashboard?.primaryResume) {
        addToast('Please upload a resume first before analyzing.', 'warning');
        return;
      }
      const res = await aiAPI.analyzeResume({
        resumeId: dash.dashboard.primaryResume._id,
        targetRole: 'Software Engineer',
      });
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
        addToast('Resume re-analyzed with latest PulseAI model parameters!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error running analysis', 'error');
    } finally {
      setIsReanalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-64 bg-white rounded-3xl border border-brand-border" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-8 w-full">
        <div className="border-b border-brand-border pb-6">
          <Badge variant="primary" size="sm" className="mb-2">
            PulseAI Engine
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">PulseAI Resume Diagnostics</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Upload your resume to generate real-time ATS quality scores, skill keyword extraction, and actionable improvements.
          </p>
        </div>

        <EmptyState
          icon={FileText}
          title="No Resume Analyzed Yet"
          description="Upload your latest PDF or DOCX resume in the Resumes portal to generate your real PulseAI score and diagnostics."
          actionLabel="Upload Resume Now"
          onAction={() => (window.location.href = '/candidate/resumes')}
        />
      </div>
    );
  }

  const data = analysis;

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            PulseAI Engine
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">PulseAI Resume Diagnostics</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Comprehensive ATS compatibility, readability, strength assessment, and actionable improvements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleReanalyze}
            isLoading={isReanalyzing}
            icon={RefreshCw}
          >
            Re-Analyze Resume
          </Button>
          <Link to="/candidate/resumes">
            <Button variant="primary" size="md" icon={Upload}>
              Upload New Version
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Score Gauge Component */}
      <ScoreGauge score={data.overallScore || 85} analysis={data.analysis} />

      {/* 2. Extracted Skills Grid */}
      {data.extractedSkills?.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-brand-navy">PulseAI Detected Skills & Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {data.extractedSkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-brand-bg text-xs font-semibold text-brand-navy border border-brand-border flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" /> {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Strengths vs Weaknesses Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-brand-primary font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-brand-navy">Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-3">
            {(data.strengths || []).map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-text">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-base font-bold text-brand-navy">High-Impact Optimization Opportunities</h3>
          </div>
          <ul className="space-y-3">
            {(data.weaknesses || []).map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-text">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Missing Sections & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-primary" /> Recommended Sections to Consider
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-brand-muted">
            {(data.missingSections || []).map((sec, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span>{sec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-primary" /> PulseAI Strategic Career Recommendations
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-brand-muted">
            {(data.careerRecommendations || []).map((rec, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. PulseAI Phrasing Suggestions & Revisions */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="border-b border-brand-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-primary" /> PulseAI Phrasing & Content Revisions
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Side-by-side phrasing optimizations to quantify accomplishments and elevate ATS keyword rank.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {data.suggestions.map((suggestion, idx) => (
              <DiffViewer key={idx} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
