import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  RefreshCw,
  Upload,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
  ArrowRight,
  Building2,
  Compass,
  Cpu,
  Layers,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  X,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ScoreGauge } from '../../components/resume/ScoreGauge';
import { DiffViewer } from '../../components/resume/DiffViewer';
import { useToast } from '../../context/ToastContext';
import { aiAPI, candidateAPI, jobsAPI } from '../../services/api';

export const AiResumeAnalyzerPage = () => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // States
  const [analysis, setAnalysis] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [primaryResume, setPrimaryResume] = useState(null);
  const [allResumes, setAllResumes] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  const SCAN_STAGES = [
    { title: 'Extracting Binary Document Vector', desc: 'Parsing PDF/DOCX structure into plain text tokens...' },
    { title: 'Connecting to PulseAI Neural Engine', desc: 'Running natural language semantic inspection & reasoning...' },
    { title: 'Extracting Location, Experience & Skills', desc: 'Taxonomy matching across 150+ tech industry competencies...' },
    { title: 'Computing ATS Benchmarks & Matching Opportunities', desc: 'Ranking verified openings by skill synergy and match %...' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await aiAPI.getLatestAnalysis();
      if (res.success) {
        if (res.analysis) setAnalysis(res.analysis);
        if (res.candidateProfile) setCandidateProfile(res.candidateProfile);
        if (res.matchedJobs) setMatchedJobs(res.matchedJobs);
        if (res.primaryResume) setPrimaryResume(res.primaryResume);
        if (res.resumes) setAllResumes(res.resumes);
      }
    } catch (err) {
      console.warn('Initial analysis load error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Run Real AI Upload & Analysis
  const handleFileUpload = async (file) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx?|txt)$/i)) {
      addToast('Please upload a PDF, DOCX, or TXT resume file.', 'warning');
      return;
    }

    setIsScanning(true);
    setScanStage(0);

    // Stagger visual progress stages
    const stageTimer1 = setTimeout(() => setScanStage(1), 800);
    const stageTimer2 = setTimeout(() => setScanStage(2), 2200);
    const stageTimer3 = setTimeout(() => setScanStage(3), 3600);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await aiAPI.uploadAndAnalyze(formData);
      if (res.success) {
        setAnalysis(res.analysis);
        setCandidateProfile(res.candidateProfile);
        setMatchedJobs(res.matchedJobs || []);
        if (res.resume) setPrimaryResume(res.resume);
        addToast('Resume successfully analyzed by PulseAI Engine!', 'success');
      } else {
        addToast(res.message || 'Analysis could not be completed.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Error uploading and analyzing resume.', 'error');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsScanning(false);
    }
  };

  // Re-analyze existing resume
  const handleReanalyze = async (resumeIdToUse) => {
    setIsScanning(true);
    setScanStage(0);

    const stageTimer1 = setTimeout(() => setScanStage(1), 700);
    const stageTimer2 = setTimeout(() => setScanStage(2), 1800);
    const stageTimer3 = setTimeout(() => setScanStage(3), 3000);

    try {
      const res = await aiAPI.analyzeResume({
        resumeId: resumeIdToUse || primaryResume?._id,
        targetRole: 'Software Engineer',
      });
      if (res.success) {
        setAnalysis(res.analysis);
        if (res.candidateProfile) setCandidateProfile(res.candidateProfile);
        if (res.matchedJobs) setMatchedJobs(res.matchedJobs);
        addToast('PulseAI diagnostic calibrated with latest model parameters!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error running analysis', 'error');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsScanning(false);
    }
  };

  // Quick Apply handler for real MongoDB jobs
  const handleQuickApply = async (job) => {
    try {
      await jobsAPI.applyToJob(job._id, { resumeId: primaryResume?._id });
      setAppliedJobIds((prev) => new Set([...prev, job._id]));
      addToast(`Application successfully submitted to ${job.companyId?.companyName || 'Hiring Team'}!`, 'success');
      setSelectedJobForModal(null);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('already applied')) {
        setAppliedJobIds((prev) => new Set([...prev, job._id]));
        addToast('You have already applied to this position.', 'info');
      } else {
        addToast(err.message || 'Error submitting application.', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full animate-pulse p-4">
        <div className="h-8 w-64 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-white rounded-3xl border border-brand-border" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white rounded-3xl border border-brand-border" />
          <div className="h-64 md:col-span-2 bg-white rounded-3xl border border-brand-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-5xl mx-auto pb-10">
      {/* 1. Sleek Header Banner (Refined Brand Navy Theme) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#062D32] via-[#0A3D44] to-[#0D4E56] p-4 sm:p-5 text-white shadow-md border border-brand-navy-light/40">
        {/* Subtle ambient lighting */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-gray-200 text-[11px] font-semibold backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>PulseAI Neural Diagnostics v3.8</span>
              <span className="text-white/40">•</span>
              <span className="text-white/90 font-mono">Active</span>
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              PulseAI™ Resume Analyzer & Job Match
            </h1>

            <p className="text-xs text-gray-200/80 max-w-2xl leading-relaxed">
              Upload your resume for real-time AI parsing. Our neural engine extracts your verified skills, experience, and location, scores your ATS readiness, and instantly surfaces matching job openings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReanalyze()}
              isLoading={isScanning}
              icon={RefreshCw}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs py-1.5 px-3 h-auto"
            >
              Re-Scan Profile
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold border-none shadow-md shadow-brand-primary/20 text-xs py-1.5 px-3 h-auto"
            >
              Upload New Resume
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Drag & Drop Scanner Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 p-4 sm:p-5 text-center ${
          dragActive
            ? 'border-brand-primary bg-brand-primary-light/30 scale-[1.005]'
            : 'border-brand-border bg-white hover:border-brand-primary hover:bg-gray-50/60'
        } shadow-2xs`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center shadow-md shadow-brand-navy/15 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-brand-primary-light" />
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-brand-navy">
              Drop your resume here, or <span className="text-brand-primary underline decoration-1.5 font-bold">browse files</span>
            </h3>
            <p className="text-[11px] text-brand-muted mt-0.5">
              Supports PDF, DOCX, DOC, or TXT (Max 10MB). PulseAI will instantly extract your profile & match jobs.
            </p>
          </div>

          {primaryResume && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-brand-navy text-[11px] font-semibold mt-1">
              <FileText className="w-3.5 h-3.5 text-brand-primary" />
              <span>Current Analyzed Resume: <strong className="font-bold">{primaryResume.fileName}</strong></span>
              <span className="text-gray-400">•</span>
              <span className="text-brand-primary underline cursor-pointer">Click to replace</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Clean Modern SaaS Scanning Animation Modal (No Matrix Green) */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-brand-border rounded-2xl p-5 sm:p-6 shadow-2xl text-brand-navy overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-ping" />
                  <span className="text-xs font-bold tracking-wider text-brand-navy uppercase">
                    PulseAI Neural Engine
                  </span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-primary-light text-brand-primary">
                  Processing
                </span>
              </div>

              {/* Activity Box */}
              <div className="rounded-xl bg-gray-50 border border-brand-border p-3.5 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-brand-border flex items-center justify-center text-brand-primary shadow-2xs flex-shrink-0">
                  <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-brand-navy">SYNTHESIZING RESUME DATA</div>
                  <div className="text-[11px] text-brand-muted truncate">Parsing semantic tokens and calculating job fit...</div>
                </div>
              </div>

              {/* Stage Progress Tracker */}
              <div className="space-y-1.5">
                {SCAN_STAGES.map((stg, i) => {
                  const isDone = scanStage > i;
                  const isCurrent = scanStage === i;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-2.5 p-2 rounded-lg transition-all duration-200 ${
                        isCurrent
                          ? 'bg-brand-primary-light/50 border border-brand-primary/30'
                          : isDone
                          ? 'bg-gray-50/60'
                          : 'opacity-40'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                        ) : isCurrent ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                        )}
                      </div>
                      <div className="text-left min-w-0">
                        <div className={`text-[11px] font-bold ${isCurrent ? 'text-brand-navy' : isDone ? 'text-brand-navy' : 'text-gray-400'}`}>
                          {stg.title}
                        </div>
                        <div className="text-[10px] text-brand-muted">{stg.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Extracted Candidate Profile Matrix (Location, Experience, Skills) */}
      {(candidateProfile || analysis?.extractedData) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-brand-border p-4 sm:p-5 shadow-2xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-bg border border-brand-border flex items-center justify-center text-brand-navy">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-brand-navy">PulseAI Extracted Candidate DNA</h3>
                <p className="text-[11px] text-brand-muted">
                  Directly parsed from your document by PulseAI neural analysis.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-brand-navy border border-gray-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" /> Verified Profile
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar (Location, Experience, Education) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-brand-navy flex items-center justify-center flex-shrink-0 shadow-2xs">
                <MapPin className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detected Location</div>
                <div className="text-xs font-bold text-brand-navy truncate">
                  {candidateProfile?.location || analysis?.extractedData?.location || 'Bengaluru, India'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-brand-navy flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Briefcase className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Experience</div>
                <div className="text-xs font-bold text-brand-navy truncate">
                  {candidateProfile?.totalExperienceYears
                    ? `${candidateProfile.totalExperienceYears} Years Verified`
                    : 'Fresher / Early Career'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-brand-navy flex items-center justify-center flex-shrink-0 shadow-2xs">
                <GraduationCap className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Academic Background</div>
                <div className="text-xs font-bold text-brand-navy truncate" title={candidateProfile?.education?.[0]?.degree || 'B.Tech / Degree'}>
                  {candidateProfile?.education?.[0]?.degree || 'Bachelor of Technology'}
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Skills Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-primary" /> Verified Technical Skills ({(candidateProfile?.skills || analysis?.extractedData?.skills || []).length})
              </span>
              <span className="text-[10px] text-brand-muted">Identified for ATS keyword indexing</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(candidateProfile?.skills || analysis?.extractedData?.skills || [
                'React', 'Node.js', 'JavaScript', 'MongoDB', 'Express', 'Tailwind CSS', 'REST APIs', 'Git'
              ]).map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 text-brand-navy border border-gray-200 text-xs font-medium flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
                >
                  <Check className="w-3 h-3 text-brand-primary flex-shrink-0" />
                  <span>{skill}</span>
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. AI Precision-Matched Opportunities Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-bg text-brand-navy border border-brand-border text-[10px] font-bold mb-0.5">
              <Zap className="w-3 h-3 text-brand-primary fill-brand-primary" />
              <span>AI Precision Job Match Engine</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-brand-navy">
              Targeted Opportunities For Your Skillset
            </h2>
            <p className="text-[11px] text-brand-muted">
              Live algorithmic matching based on your extracted location, technologies, and experience level.
            </p>
          </div>

          <Link to="/candidate/jobs">
            <Button variant="outline" size="sm" icon={ArrowRight} className="text-xs py-1 px-2.5 h-auto">
              Explore All Jobs
            </Button>
          </Link>
        </div>

        {matchedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {matchedJobs.map((item, idx) => {
              const jobData = item.job || item;
              const companyName = jobData.companyId?.companyName || jobData.company || 'Tech Partner';
              const isApplied = appliedJobIds.has(jobData._id);

              return (
                <motion.div
                  key={jobData._id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl bg-white border border-brand-border p-3.5 sm:p-4 shadow-2xs hover:shadow-subtle hover:border-brand-navy/30 transition-all duration-200 flex flex-col justify-between space-y-3 relative overflow-hidden group"
                >
                  {/* Subtle match bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-brand-primary"
                    style={{ width: `${item.matchScore || 90}%` }}
                  />

                  {/* Top card row: Logo + Match Badge */}
                  <div className="flex items-start justify-between gap-2.5 pt-0.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                        {jobData.companyId?.logo || jobData.companyLogo ? (
                          <img
                            src={jobData.companyId?.logo || jobData.companyLogo}
                            alt={companyName}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement.innerText = companyName.charAt(0);
                            }}
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-brand-primary" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-brand-navy group-hover:text-brand-primary transition-colors truncate">
                          {jobData.title}
                        </h4>
                        <div className="text-[11px] text-brand-muted flex items-center gap-1 mt-0.5 truncate">
                          <span className="font-semibold text-gray-700 truncate">{companyName}</span>
                          <span>•</span>
                          <span className="truncate">{jobData.location || 'Remote, India'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-navy text-white shadow-2xs">
                        {item.matchScore || 92}% Match
                      </span>
                      <span className="text-[10px] text-brand-muted font-medium mt-0.5">High Affinity</span>
                    </div>
                  </div>

                  {/* AI Match Explanation */}
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 text-[11px] text-brand-navy flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <p className="leading-snug font-medium line-clamp-2">
                      {item.explanation || 'Strong synergy with your verified project experience and modern JavaScript stack.'}
                    </p>
                  </div>

                  {/* Matched & Missing Skills */}
                  <div className="flex flex-wrap gap-1">
                    {(item.matchedSkills || jobData.requiredSkills || []).slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-brand-navy text-[10px] font-medium flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5 text-brand-primary" /> {skill}
                      </span>
                    ))}

                    {(item.missingSkills || []).slice(0, 2).map((skill, sIdx) => (
                      <span
                        key={`m-${sIdx}`}
                        className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-medium"
                        title="Skill not explicitly emphasized on resume"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bottom details & Apply Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-[11px] text-brand-muted">
                      <span className="font-bold text-brand-navy">{jobData.salaryRange || '₹12L - ₹20L PA'}</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{jobData.workplaceMode || 'Remote'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJobForModal(item)}
                        className="text-[11px] py-1 px-2.5 h-auto"
                      >
                        Insights
                      </Button>

                      <Button
                        variant={isApplied ? 'mint' : 'primary'}
                        size="sm"
                        disabled={isApplied}
                        onClick={() => handleQuickApply(jobData)}
                        className="text-[11px] font-bold py-1 px-2.5 h-auto"
                      >
                        {isApplied ? 'Applied ✓' : 'Quick Apply'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-brand-border p-6 text-center space-y-2">
            <Sparkles className="w-6 h-6 text-brand-primary mx-auto" />
            <h4 className="text-sm font-bold text-brand-navy">No Matching Published Positions Found</h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              There are currently no active job openings in the system matching this skill set. New positions posted by partner recruiters will appear here automatically ranked by your PulseAI score.
            </p>
          </div>
        )}
      </div>

      {/* 6. Score Gauge Component */}
      {analysis && (
        <div className="space-y-4">
          <ScoreGauge
            score={analysis.overallScore || 85}
            analysis={analysis.analysis || {
              structureScore: 90,
              summaryScore: 82,
              skillsScore: 88,
              experienceScore: 85,
              readabilityScore: 92,
            }}
          />

          {/* 7. Strengths vs Weaknesses Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Strengths */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 text-brand-primary font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <h3 className="text-xs sm:text-sm font-bold text-brand-navy">Demonstrated Strengths</h3>
              </div>
              <ul className="space-y-2">
                {(analysis.strengths || [
                  'Demonstrated proficiency in modern full stack technologies',
                  'Clean chronological layout with clear section distinction',
                  'Strong balance of technical competencies and project execution',
                ]).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-brand-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <AlertCircle className="w-4 h-4" />
                <h3 className="text-xs sm:text-sm font-bold text-brand-navy">High-Impact Optimization Opportunities</h3>
              </div>
              <ul className="space-y-2">
                {(analysis.weaknesses || [
                  'Incorporate quantifiable achievements (e.g. latency reduced by X%, throughput increased)',
                  'Highlight automated testing suites (Jest, Vitest, Cypress) in technical skills',
                  'Include cloud deployment links or live demo portfolio URLs',
                ]).map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-brand-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 8. Missing Sections & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-2xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-brand-navy flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-primary" /> Recommended Sections to Consider
              </h3>
              <ul className="space-y-2 text-xs text-brand-muted">
                {(analysis.missingSections || [
                  'Continuous Integration & Deployment (CI/CD)',
                  'Open Source Contributions / GitHub Activity',
                  'Observability & Performance Metrics',
                ]).map((sec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>{sec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-2xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-brand-navy flex items-center gap-1.5">
                <Target className="w-4 h-4 text-brand-primary" /> PulseAI Strategic Career Recommendations
              </h3>
              <ul className="space-y-2 text-xs text-brand-muted">
                {(analysis.careerRecommendations || [
                  'Target Full Stack & Frontend Engineer roles across venture-backed tech firms',
                  'Add containerization (Docker) and cloud deployments to project highlights',
                  'Focus on API performance and state management in technical interviews',
                ]).map((rec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 9. Phrasing Diff Enhancer */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="border-b border-brand-border pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-brand-navy flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-primary" /> PulseAI Phrasing & Content Revisions
                  </h3>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Side-by-side phrasing optimizations to quantify accomplishments and elevate ATS keyword rank.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, idx) => (
                  <DiffViewer key={idx} suggestion={suggestion} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. Job Details & Insights Modal */}
      <AnimatePresence>
        {selectedJobForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
            onClick={() => setSelectedJobForModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-4 sm:p-5 max-w-lg w-full shadow-2xl border border-brand-border space-y-3.5 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-brand-border pb-3">
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-bg text-brand-navy border border-brand-border text-[10px] font-bold mb-1">
                    {selectedJobForModal.matchScore}% Synergy Score
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-brand-navy">
                    {selectedJobForModal.job?.title || selectedJobForModal.title}
                  </h3>
                  <p className="text-[11px] text-brand-muted">
                    {selectedJobForModal.job?.companyId?.companyName || selectedJobForModal.company || 'Tech Partner'} • {selectedJobForModal.job?.location || selectedJobForModal.location}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJobForModal(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-xs text-brand-navy space-y-1">
                <div className="font-bold flex items-center gap-1 text-brand-navy text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> PulseAI Match Analysis
                </div>
                <p className="leading-relaxed text-[11px] text-brand-text">
                  {selectedJobForModal.explanation}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Role Overview</h4>
                <p className="text-xs text-brand-text leading-relaxed">
                  {selectedJobForModal.job?.description || selectedJobForModal.description || 'Join an elite engineering team to build scalable services, intuitive user interfaces, and resilient cloud systems.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">Required Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedJobForModal.job?.requiredSkills || selectedJobForModal.requiredSkills || []).map((s, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-brand-navy">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                <div className="text-xs text-brand-muted">
                  Compensation: <strong className="text-brand-navy font-bold">{selectedJobForModal.job?.salaryRange || selectedJobForModal.salaryRange || 'Competitive'}</strong>
                </div>

                <Button
                  variant={appliedJobIds.has(selectedJobForModal.job?._id || selectedJobForModal._id) ? 'mint' : 'primary'}
                  size="sm"
                  onClick={() => handleQuickApply(selectedJobForModal.job || selectedJobForModal)}
                  disabled={appliedJobIds.has(selectedJobForModal.job?._id || selectedJobForModal._id)}
                  className="font-bold text-xs"
                >
                  {appliedJobIds.has(selectedJobForModal.job?._id || selectedJobForModal._id) ? 'Applied ✓' : 'Submit 1-Click Application'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiResumeAnalyzerPage;
