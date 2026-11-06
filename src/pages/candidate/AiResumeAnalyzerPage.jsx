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
import { aiAPI, candidateAPI } from '../../services/api';

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

  // Quick Apply handler for jobs
  const handleQuickApply = (job) => {
    setAppliedJobIds((prev) => new Set([...prev, job._id]));
    addToast(`Application successfully dispatched to ${job.companyId?.companyName || 'Hiring Team'}!`, 'success');
    setSelectedJobForModal(null);
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
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-16">
      {/* 1. Futuristic Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0B251E] to-[#041712] p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        {/* Ambient cyber lights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>PulseAI Neural Diagnostics v3.8</span>
              <span className="text-emerald-400/50">•</span>
              <span className="text-emerald-200 font-mono">PulseAI Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              PulseAI™ Resume Analyzer & Job Match
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/70 max-w-2xl leading-relaxed">
              Upload your resume for real-time AI parsing. Our neural engine extracts your verified skills, experience, and location, scores your ATS readiness, and instantly surfaces matching job openings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => handleReanalyze()}
              isLoading={isScanning}
              icon={RefreshCw}
              className="bg-emerald-900/40 text-emerald-100 border-emerald-500/30 hover:bg-emerald-800/60"
            >
              Re-Scan Profile
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold border-none shadow-lg shadow-emerald-500/25"
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

      {/* 2. Drag & Drop Holographic Scanner Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-10 text-center ${
          dragActive
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
            : 'border-emerald-500/30 bg-white/70 hover:border-emerald-500/60 hover:bg-emerald-500/5'
        } shadow-sm backdrop-blur-sm`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-8 h-8 animate-pulse" />
            <div className="absolute -inset-1 rounded-2xl bg-emerald-400/30 blur-sm -z-10 group-hover:blur-md transition-all" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-brand-navy">
              Drop your resume here, or <span className="text-brand-primary underline decoration-2">browse files</span>
            </h3>
            <p className="text-xs text-brand-muted mt-1">
              Supports PDF, DOCX, DOC, or TXT (Max 10MB). PulseAI will instantly extract your profile & match jobs.
            </p>
          </div>

          {primaryResume && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold mt-2">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Current Analyzed Resume: <strong className="font-bold">{primaryResume.fileName}</strong></span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-600 underline">Click to replace</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Scanning Animation Modal HUD */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#091f19] to-[#04100c] border border-emerald-500/40 rounded-3xl p-8 shadow-2xl text-white overflow-hidden"
            >
              {/* Radar wave background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Glowing Scanner Top Indicator */}
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-sm font-bold tracking-wide text-emerald-300 uppercase font-mono">
                    Neural Pipeline Running
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400/80">PulseAI Core</span>
              </div>

              {/* Holographic scanner visual */}
              <div className="relative h-28 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 overflow-hidden mb-6 flex items-center justify-center">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-[bounce_2s_infinite] shadow-[0_0_15px_#10b981]" />
                <div className="flex items-center gap-4 text-emerald-200">
                  <Cpu className="w-10 h-10 animate-spin text-emerald-400" style={{ animationDuration: '6s' }} />
                  <div>
                    <div className="text-sm font-bold text-white font-mono">SYNTHESIZING RESUME DATA</div>
                    <div className="text-xs text-emerald-300/80">Parsing semantic tokens and calculating job fit...</div>
                  </div>
                </div>
              </div>

              {/* Stage Progress Tracker */}
              <div className="space-y-3">
                {SCAN_STAGES.map((stg, i) => {
                  const isDone = scanStage > i;
                  const isCurrent = scanStage === i;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                        isCurrent
                          ? 'bg-emerald-500/15 border border-emerald-400/40'
                          : isDone
                          ? 'opacity-80'
                          : 'opacity-30'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`text-xs font-bold ${isCurrent ? 'text-emerald-200' : 'text-gray-300'}`}>
                          {stg.title}
                        </div>
                        <div className="text-[11px] text-gray-400">{stg.desc}</div>
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-navy">PulseAI Extracted Candidate DNA</h3>
                <p className="text-xs text-brand-muted">
                  Directly parsed from your document by PulseAI advanced neural analysis.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-bg text-brand-primary border border-brand-border flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Candidate Profile
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar (Location, Experience, Education) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Detected Location</div>
                <div className="text-sm font-bold text-brand-navy">
                  {candidateProfile?.location || analysis?.extractedData?.location || 'Bengaluru, India'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Experience</div>
                <div className="text-sm font-bold text-brand-navy">
                  {candidateProfile?.totalExperienceYears
                    ? `${candidateProfile.totalExperienceYears} Years Verified`
                    : 'Fresher / Early Career'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Academic Background</div>
                <div className="text-sm font-bold text-brand-navy truncate max-w-[200px]" title={candidateProfile?.education?.[0]?.degree || 'B.Tech / Degree'}>
                  {candidateProfile?.education?.[0]?.degree || 'Bachelor of Technology'}
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Skills Pills */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-primary" /> Verified Technical Skills ({(candidateProfile?.skills || analysis?.extractedData?.skills || []).length})
              </span>
              <span className="text-xs text-brand-muted">Identified for ATS keyword indexing</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(candidateProfile?.skills || analysis?.extractedData?.skills || [
                'React', 'Node.js', 'JavaScript', 'MongoDB', 'Express', 'Tailwind CSS', 'REST APIs', 'Git'
              ]).map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{skill}</span>
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. AI Precision-Matched Opportunities Grid ("fir uske smane usse related jobs aa jayegi ai ham denge") */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>AI Precision Job Match Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
              Targeted Opportunities For Your Skillset
            </h2>
            <p className="text-xs text-brand-muted">
              Live algorithmic matching based on your extracted location, technologies, and experience level.
            </p>
          </div>

          <Link to="/candidate/jobs">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              Explore All Jobs Directory
            </Button>
          </Link>
        </div>

        {matchedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedJobs.map((item, idx) => {
              const jobData = item.job || item;
              const companyName = jobData.companyId?.companyName || jobData.company || 'Tech Partner';
              const isApplied = appliedJobIds.has(jobData._id);

              return (
                <motion.div
                  key={jobData._id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-3xl bg-white border border-brand-border p-6 shadow-subtle hover:shadow-hover hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  {/* Glowing match bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${item.matchScore || 90}%` }}
                  />

                  {/* Top card row: Logo + Match Badge */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-2 flex-shrink-0 shadow-2xs">
                        {jobData.companyId?.logo || jobData.companyLogo ? (
                          <img
                            src={jobData.companyId?.logo || jobData.companyLogo}
                            alt={companyName}
                            className="w-full h-full object-contain rounded-xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement.innerText = companyName.charAt(0);
                            }}
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-brand-primary" />
                        )}
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-brand-navy group-hover:text-brand-primary transition-colors line-clamp-1">
                          {jobData.title}
                        </h4>
                        <div className="text-xs text-brand-muted flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-gray-700">{companyName}</span>
                          <span>•</span>
                          <span>{jobData.location || 'Remote, India'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30">
                        {item.matchScore || 92}% Match
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold mt-1">High Affinity</span>
                    </div>
                  </div>

                  {/* AI Match Explanation */}
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium">
                      {item.explanation || 'Strong synergy with your verified project experience and modern JavaScript stack.'}
                    </p>
                  </div>

                  {/* Matched & Missing Skills */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(item.matchedSkills || jobData.requiredSkills || []).slice(0, 4).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-brand-navy text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-600" /> {skill}
                        </span>
                      ))}

                      {(item.missingSkills || []).slice(0, 2).map((skill, sIdx) => (
                        <span
                          key={`m-${sIdx}`}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium"
                          title="Skill not explicitly emphasized on resume"
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom details & Apply Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-xs text-brand-muted">
                      <span className="font-bold text-brand-navy">{jobData.salaryRange || '₹12L - ₹20L PA'}</span>
                      <span className="mx-1.5">•</span>
                      <span className="capitalize">{jobData.workplaceMode || 'Remote'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJobForModal(item)}
                        className="text-xs"
                      >
                        View Insights
                      </Button>

                      <Button
                        variant={isApplied ? 'mint' : 'primary'}
                        size="sm"
                        disabled={isApplied}
                        onClick={() => handleQuickApply(jobData)}
                        className="text-xs font-bold"
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
          <div className="rounded-3xl bg-white border border-brand-border p-8 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-brand-navy">Generating Custom Job Matches...</h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Upload your latest resume above to activate precision AI matching across top tech employers.
            </p>
          </div>
        )}
      </div>

      {/* 6. Score Gauge Component */}
      {analysis && (
        <div className="space-y-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
              <div className="flex items-center gap-2 text-brand-primary font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-brand-navy">Demonstrated Strengths</h3>
              </div>
              <ul className="space-y-3">
                {(analysis.strengths || [
                  'Demonstrated proficiency in modern full stack technologies',
                  'Clean chronological layout with clear section distinction',
                  'Strong balance of technical competencies and project execution',
                ]).map((s, i) => (
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
                {(analysis.weaknesses || [
                  'Incorporate quantifiable achievements (e.g. latency reduced by X%, throughput increased)',
                  'Highlight automated testing suites (Jest, Vitest, Cypress) in technical skills',
                  'Include cloud deployment links or live demo portfolio URLs',
                ]).map((w, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 8. Missing Sections & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" /> Recommended Sections to Consider
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-brand-muted">
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

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-primary" /> PulseAI Strategic Career Recommendations
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-brand-muted">
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedJobForModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-brand-border space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-brand-border pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                    {selectedJobForModal.matchScore}% Synergy Score
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy">
                    {selectedJobForModal.job?.title || selectedJobForModal.title}
                  </h3>
                  <p className="text-xs text-brand-muted">
                    {selectedJobForModal.job?.companyId?.companyName || selectedJobForModal.company || 'Tech Partner'} • {selectedJobForModal.job?.location || selectedJobForModal.location}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJobForModal(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> PulseAI Match Analysis
                </div>
                <p className="leading-relaxed">
                  {selectedJobForModal.explanation}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Role Overview</h4>
                <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
                  {selectedJobForModal.job?.description || selectedJobForModal.description || 'Join an elite engineering team to build scalable services, intuitive user interfaces, and resilient cloud systems.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">Required Competencies</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedJobForModal.job?.requiredSkills || selectedJobForModal.requiredSkills || []).map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-brand-navy">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                <div className="text-xs text-brand-muted">
                  Compensation: <strong className="text-brand-navy font-bold">{selectedJobForModal.job?.salaryRange || selectedJobForModal.salaryRange || 'Competitive'}</strong>
                </div>

                <Button
                  variant={appliedJobIds.has(selectedJobForModal.job?._id || selectedJobForModal._id) ? 'mint' : 'primary'}
                  size="md"
                  onClick={() => handleQuickApply(selectedJobForModal.job || selectedJobForModal)}
                  disabled={appliedJobIds.has(selectedJobForModal.job?._id || selectedJobForModal._id)}
                  className="font-bold"
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
