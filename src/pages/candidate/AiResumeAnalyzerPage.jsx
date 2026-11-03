import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  RefreshCw,
} from 'lucide-react';
import { ScoreGauge } from '../../components/resume/ScoreGauge';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
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
      const res = await aiAPI.analyzeResume({
        targetRole: 'Software Engineer',
      });
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
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
      const res = await aiAPI.analyzeResume({
        targetRole: 'Senior Full Stack Engineer',
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

  const defaultAnalysis = {
    overallScore: 89,
    analysis: {
      structureScore: 92,
      summaryScore: 85,
      skillsScore: 90,
      experienceScore: 87,
      readabilityScore: 94,
    },
    strengths: [
      'Comprehensive alignment with modern web standards (React 18, Node.js, Tailwind CSS)',
      'Clear distinction of quantifiable metrics in project bullet points',
      'Strong academic background with 8.85 CGPA from a premier institute',
      'Demonstrated cloud and containerization awareness (AWS, Docker)',
    ],
    weaknesses: [
      'Could include more details on automated unit testing frameworks (Jest, Vitest)',
      'Professional summary could detail specific industry domain knowledge',
      'Some older project descriptions lack explicit throughput or latency numbers',
    ],
    missingSections: [
      'Open Source Contributions & Public GitHub Repositories',
      'Technical Articles or Architecture Publications',
    ],
    careerRecommendations: [
      'Ideal candidate for Full Stack Developer & Frontend Engineer roles',
      'Target high-growth startups and tech enterprises using modern JavaScript stacks',
      'Highlight API latency optimizations during technical interviews',
    ],
    extractedSkills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs', 'Git', 'Docker'],
  };

  const data = analysis || defaultAnalysis;

  return (
    <div className="space-y-8 max-w-5xl">
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
          <Link to="/candidate/ai-suggestions">
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
              View Bullet Suggestions
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Score Gauge Component */}
      <ScoreGauge score={data.overallScore || 88} analysis={data.analysis} />

      {/* 2. Extracted Skills Grid */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-primary" /> Extracted Technical Competencies
          </h3>
          <span className="text-xs text-brand-muted">Detected automatically from uploaded document</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.extractedSkills || defaultAnalysis.extractedSkills).map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-primary-light text-brand-navy border border-emerald-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Strengths vs Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-brand-primary" />
            <h3 className="text-base font-bold text-brand-navy">Core Profile Strengths</h3>
          </div>
          <ul className="space-y-3">
            {(data.strengths || defaultAnalysis.strengths).map((s, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-text leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-brand-navy">Areas for Optimization</h3>
          </div>
          <ul className="space-y-3">
            {(data.weaknesses || defaultAnalysis.weaknesses).map((w, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-text leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Missing Sections & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing sections */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-primary" /> Missing Sections / Content Gaps
          </h3>
          <p className="text-xs text-brand-muted">Adding these sections will maximize ATS indexing completeness:</p>
          <div className="space-y-2">
            {(data.missingSections || defaultAnalysis.missingSections).map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold text-brand-navy flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Career recommendations */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-primary" /> Strategic Career Advice
          </h3>
          <p className="text-xs text-brand-muted">Hiring manager perspectives for your target roles:</p>
          <div className="space-y-2">
            {(data.careerRecommendations || defaultAnalysis.careerRecommendations).map((rec, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs font-medium text-emerald-950 leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-brand-primary-light/60 border border-brand-primary/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-brand-navy">Ready to rewrite your bullets with AI?</h3>
          <p className="text-xs text-brand-muted mt-0.5">
            Compare side-by-side phrasing improvements with quantifiable metrics and copy them with 1 click.
          </p>
        </div>
        <Link to="/candidate/ai-suggestions">
          <Button variant="primary" size="md" icon={Sparkles}>
            Explore Bullet Improver
          </Button>
        </Link>
      </div>
    </div>
  );
};
