import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Cpu,
  Layers,
  ChevronRight,
  Award,
  Users,
  Compass,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { JobCard } from '../../components/jobs/JobCard';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { jobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      const res = await jobsAPI.getJobs({ limit: 4 });
      if (res.success && res.jobs) {
        setFeaturedJobs(res.jobs);
      }
    } catch (err) {
      console.warn('Could not load featured jobs:', err.message);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchKeyword)}&location=${encodeURIComponent(searchLocation)}`);
  };

  const categories = [
    { title: 'Frontend Engineering', jobsCount: '140+ jobs', icon: Layers },
    { title: 'Backend & Microservices', jobsCount: '185+ jobs', icon: Cpu },
    { title: 'Full Stack Development', jobsCount: '210+ jobs', icon: Briefcase },
    { title: 'AI & Machine Learning', jobsCount: '95+ jobs', icon: Sparkles },
    { title: 'Cloud & DevOps', jobsCount: '110+ jobs', icon: Zap },
    { title: 'Product & UI/UX Design', jobsCount: '80+ jobs', icon: Compass },
  ];

  const partnerLogos = [
    'Nexus Cloud',
    'FinPulse Tech',
    'Zephyr AI',
    'Quantum Health',
    'Elevate Digital',
    'Vertex Dynamics',
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-[1680px] mx-auto">
        {/* BACKGROUND AMBIENT GRADIENTS & TECH GRID */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-primary/10 via-teal-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 -left-20 w-[350px] h-[350px] bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] bg-teal-300/8 rounded-full blur-3xl pointer-events-none" />

          {/* Precision Tech Grid SVG Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-tech-grid" width="38" height="38" patternUnits="userSpaceOnUse">
                <path d="M 38 0 L 0 0 0 38" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-border" />
                <circle cx="38" cy="38" r="1.2" className="text-brand-primary" fill="currentColor" opacity="0.4" />
              </pattern>
              <radialGradient id="hero-grid-fade" cx="50%" cy="38%" r="62%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="65%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <mask id="hero-mask-element">
                <rect width="100%" height="100%" fill="url(#hero-grid-fade)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-tech-grid)" mask="url(#hero-mask-element)" />
          </svg>
        </div>

        {/* UNIFIED 2-COLUMN HERO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Headings, Search & Actions (7 Columns) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary-light/80 backdrop-blur-xs border border-brand-primary/25 text-brand-navy text-xs font-bold shadow-2xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>CampusPulse AI Platform 2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.15]"
            >
              Smart Job Search.{' '}
              <span className="bg-gradient-to-r from-brand-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Smarter Resumes.
              </span>{' '}
              Better Opportunities.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-brand-muted max-w-xl leading-relaxed"
            >
              Connect directly with verified tech enterprises, optimize your resume using frontier PulseAI, and land high-impact software engineering roles.
            </motion.p>

            {/* SLEEK & COMPACT HERO SEARCH BAR */}
            <motion.form
              onSubmit={handleHeroSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-card hover:shadow-card-hover border border-brand-border transition-all flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-left max-w-2xl focus-within:border-brand-primary/60 focus-within:ring-2 focus-within:ring-brand-primary/10"
            >
              {/* Keyword Field */}
              <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-1.5 sm:py-2 border-b sm:border-b-0 sm:border-r border-brand-border/70 group">
                <Search className="w-4 h-4 text-brand-primary group-focus-within:scale-110 transition-transform shrink-0" />
                <input
                  type="text"
                  placeholder="Job title or skill (e.g. React, Python)"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full text-xs sm:text-sm text-brand-text placeholder-gray-400 bg-transparent outline-none"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword('')}
                    className="text-gray-400 hover:text-gray-600 text-xs px-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Location Field */}
              <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-1.5 sm:py-2 group">
                <MapPin className="w-4 h-4 text-brand-muted group-focus-within:text-brand-primary transition-colors shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g. Bengaluru, Remote)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm text-brand-text placeholder-gray-400 bg-transparent outline-none"
                />
                {searchLocation && (
                  <button
                    type="button"
                    onClick={() => setSearchLocation('')}
                    className="text-gray-400 hover:text-gray-600 text-xs px-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 sm:py-2.5 bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Find Jobs</span>
              </button>
            </motion.form>

            {/* TRENDING SEARCH TAGS */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-brand-muted pt-1">
              <span className="font-semibold text-brand-navy text-[11px] sm:text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-brand-primary" /> Trending:
              </span>
              {['React Developer', 'Full Stack MERN', 'Node.js Backend', 'Internship 2024', 'Remote Jobs'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchKeyword(tag);
                    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-brand-border text-[11px] sm:text-xs font-medium text-brand-text hover:border-brand-primary hover:text-brand-primary transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* TRUST HIGHLIGHTS ROW */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-brand-navy font-semibold">
              <div className="flex items-center gap-1.5 text-brand-navy">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                <span>100% Verified Roles</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-navy">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                <span>Direct HR Referrals</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-navy">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                <span>Instant ATS Scoring</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: COHESIVE PULSEAI PRODUCT SHOWCASE (5 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-primary/20 via-teal-400/15 to-emerald-400/20 rounded-3xl blur-xl opacity-75" />

            {/* Unified Showcase Card */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-brand-border/90 shadow-card-hover p-4 sm:p-5 space-y-3.5 text-left">
              
              {/* App Bar / Window Simulation */}
              <div className="flex items-center justify-between pb-3 border-b border-brand-border/70">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  <span className="text-[11px] font-bold text-brand-navy ml-2 tracking-wide">
                    PulseAI Career Radar
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Match
                </span>
              </div>

              {/* 1. Candidate ATS Diagnostic Snapshot */}
              <div className="bg-gradient-to-br from-brand-bg to-brand-primary-light/40 p-3 rounded-2xl border border-brand-border/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    AM
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-brand-navy">Arjun Mehta</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                    </div>
                    <p className="text-[11px] text-brand-muted">Full Stack Engineer (React • Node)</p>
                  </div>
                </div>

                {/* Circular SVG ATS Progress Gauge */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-brand-primary"
                        strokeDasharray="94, 100"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-[10px] font-extrabold text-brand-navy">94%</span>
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[9px] font-bold text-brand-primary uppercase tracking-wider">ATS Score</div>
                    <div className="text-[10px] text-brand-muted font-medium">Top Tier</div>
                  </div>
                </div>
              </div>

              {/* 2. Live Verified Job Recommendation */}
              <div className="bg-white p-3.5 rounded-2xl border border-brand-border shadow-xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-brand-primary shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-brand-navy">Nexus Cloud AI</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-brand-primary-light text-brand-navy">Verified</span>
                      </div>
                      <p className="text-xs font-semibold text-brand-text">Lead Full Stack Engineer</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                    ₹20L - ₹32L PA
                  </span>
                </div>

                {/* Skill Match Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {['React.js', 'Next.js', 'Node.js', 'TypeScript'].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-brand-bg text-[10px] font-medium text-brand-text border border-brand-border/60"
                    >
                      {skill}
                    </span>
                  ))}
                  <span className="text-[10px] font-bold text-brand-primary ml-auto flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> 98% Match
                  </span>
                </div>

                {/* 1-Click Fast-Track Apply */}
                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-brand-border/60">
                  <span className="text-brand-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-primary" /> Bengaluru • Remote
                  </span>
                  <Link
                    to="/jobs"
                    className="font-bold text-brand-primary hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Direct Apply <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* 3. Social Proof Platform Counters */}
              <div className="grid grid-cols-3 gap-2 text-center pt-0.5">
                <div className="bg-brand-bg p-2 rounded-xl border border-brand-border/60">
                  <div className="text-xs sm:text-sm font-extrabold text-brand-navy">500+</div>
                  <div className="text-[10px] text-brand-muted">Hiring Partners</div>
                </div>
                <div className="bg-brand-bg p-2 rounded-xl border border-brand-border/60">
                  <div className="text-xs sm:text-sm font-extrabold text-brand-primary">12,400+</div>
                  <div className="text-[10px] text-brand-muted">Active Roles</div>
                </div>
                <div className="bg-brand-bg p-2 rounded-xl border border-brand-border/60">
                  <div className="text-xs sm:text-sm font-extrabold text-brand-navy">98.8%</div>
                  <div className="text-[10px] text-brand-muted">Match Accuracy</div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* TRUSTED COMPANIES BANNER */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-brand-border/70 text-center relative z-10">
          <p className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-brand-muted mb-5 flex items-center justify-center gap-2">
            <Award className="w-3.5 h-3.5 text-brand-primary" />
            Trusted by hiring engineering teams across India & Global Tech
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-10 opacity-85">
            {partnerLogos.map((name, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-brand-navy tracking-tight px-3 py-1.5 rounded-xl hover:bg-white/80 transition-all cursor-default"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-primary-light flex items-center justify-center text-brand-primary">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. POPULAR JOB CATEGORIES */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="primary" size="sm" className="mb-2">
              Explore by Specialization
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Popular Engineering Categories
            </h2>
          </div>
          <Link to="/jobs" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
            Browse All Roles <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(cat.title.split(' ')[0])}`)}
                className="bg-white p-6 rounded-2xl border border-brand-border hover:border-brand-primary shadow-subtle hover:shadow-card transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform flex-shrink-0">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1 font-medium">{cat.jobsCount} open currently</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED JOBS SECTION */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="primary" size="sm" className="mb-2">
              Verified Openings
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-sm text-brand-muted mt-1">High-impact positions curated for software developers</p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Jobs
            </Button>
          </Link>
        </div>

        {isLoadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-white border border-brand-border p-6 animate-pulse" />
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-brand-border p-10 text-center space-y-3">
            <Briefcase className="w-8 h-8 text-brand-primary mx-auto opacity-70" />
            <h3 className="text-base font-bold text-brand-navy">No Published Openings Yet</h3>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Real-time job listings will appear here once verified employers publish their openings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSavedInitial={Boolean(job.isSaved)}
                onApplyClick={(targetJob) => setSelectedJobForApply(targetJob)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. AI RESUME PROMOTIONAL SECTION */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-navy rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-card-hover">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/20 text-brand-primary border border-brand-primary/40">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> PulseAI Resume Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Turn your resume into an interview magnet with AI
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                CampusPulse AI integrates PulseAI to parse your PDF, detect ATS compatibility bottlenecks, score your quantifiable accomplishments, and provide role-targeted skill matches.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-200">Real-time ATS Quality Scoring</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-200">ATS Keyword & Skill Extraction</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-200">Role-Specific Match Diagnostics</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-200">Zero Credential Fabrication</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/candidate/ai-analyzer">
                  <Button variant="primary" size="lg" icon={Sparkles}>
                    Analyze My Resume Free
                  </Button>
                </Link>
                
              </div>
            </div>

            {/* AI Visual Showcase Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Live AI Diagnostic Preview
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-primary text-white">
                  Score: 89 / 100
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
                  <div className="font-bold text-white mb-1">ATS Compatibility Scan:</div>
                  <div className="text-gray-300">Format: PDF | ATS Indexing: 96% Match | Readability: Clean</div>
                </div>

                <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/40 text-xs text-brand-primary-light">
                  <div className="font-bold text-brand-primary mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Extracted Core Competencies:
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-[11px] font-semibold text-white">React 18</span>
                    <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-[11px] font-semibold text-white">Node.js</span>
                    <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-[11px] font-semibold text-white">REST APIs</span>
                    <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-[11px] font-semibold text-white">MongoDB</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 text-center pt-2">
                Candidates with scores over 85% receive 3x more recruiter callbacks.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW CAMPUS PLUS WORKS */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="primary" size="sm" className="mb-2">
            Seamless 3-Step Process
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            How CampusPulse AI Works
          </h2>
          <p className="text-sm text-brand-muted mt-2">
            Accelerate your career journey from initial resume scan to interview offer letter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-brand-border text-center shadow-subtle space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-extrabold text-xl mx-auto">
              01
            </div>
            <h3 className="text-lg font-bold text-brand-navy">Build Profile & Upload Resume</h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Upload your PDF or DOCX resume. Our text parsing engine extracts education, skills, and projects in seconds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-brand-border text-center shadow-subtle space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-extrabold text-xl mx-auto">
              02
            </div>
            <h3 className="text-lg font-bold text-brand-navy">Optimize with PulseAI</h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Inspect your ATS quality score, review technical skill alignment, and identify keyword matches.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-brand-border text-center shadow-subtle space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-extrabold text-xl mx-auto">
              03
            </div>
            <h3 className="text-lg font-bold text-brand-navy">1-Click Apply & Track</h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Apply directly to verified companies. Track real-time recruiter review, shortlisting, and video interview rounds.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION - only if not authenticated */}
      {!isAuthenticated && (
        <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-primary to-brand-primary-hover rounded-3xl p-8 sm:p-12 text-white text-center shadow-glow space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to find your next software engineering opportunity?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of developers and top recruiters building their future with CampusPulse AI.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                Register as Candidate
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white/20">
                Register as Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          job={selectedJobForApply}
          onSuccess={() => {
            // refresh
          }}
        />
      )}
    </div>
  );
};
