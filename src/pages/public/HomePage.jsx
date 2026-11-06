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
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-[1680px] mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary-light border border-brand-primary/20 text-brand-navy text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Campus Plus Recruitment Platform 2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.15]"
          >
            Smart Job Search. <br className="hidden sm:inline" />
            <span className="text-brand-primary">Smarter Resumes.</span> Better Opportunities.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed"
          >
            Connect directly with verified tech enterprises, optimize your resume using frontier PulseAI, and land high-impact software engineering roles.
          </motion.p>

          {/* LARGE HERO SEARCH INTERFACE */}
          <motion.form
            onSubmit={handleHeroSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-card-hover border border-brand-border flex flex-col md:flex-row items-center gap-3 text-left max-w-4xl mx-auto mt-8"
          >
            <div className="flex-1 w-full flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-brand-border">
              <Search className="w-5 h-5 text-brand-primary flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keyword, or skill (e.g. React, Node.js)"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full text-sm text-brand-text placeholder-gray-400 bg-transparent outline-none"
              />
            </div>

            <div className="flex-1 w-full flex items-center gap-3 px-3 py-2">
              <MapPin className="w-5 h-5 text-brand-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="City or location (e.g. Bengaluru, Remote)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full text-sm text-brand-text placeholder-gray-400 bg-transparent outline-none"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" icon={Search} className="w-full md:w-auto px-8">
              Find Jobs
            </Button>
          </motion.form>

          {/* POPULAR SEARCH TAGS */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-brand-muted">
            <span className="font-semibold text-brand-navy">Trending Searches:</span>
            {['React Developer', 'Full Stack MERN', 'Node.js Backend', 'Internship 2024', 'Remote Jobs'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchKeyword(tag);
                  navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-brand-border text-brand-text hover:border-brand-primary hover:text-brand-primary transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* TRUSTED COMPANIES BANNER */}
        <div className="mt-14 pt-8 border-t border-brand-border/70 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-brand-muted mb-6">
            Trusted by hiring engineering teams across India & Global Tech
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
            {partnerLogos.map((name, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-extrabold text-brand-navy tracking-tight">
                <Building2 className="w-4 h-4 text-brand-primary" />
                {name}
              </div>
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
                Campus Plus integrates PulseAI to parse your PDF, detect ATS compatibility bottlenecks, score your quantifiable accomplishments, and provide role-targeted skill matches.
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
            How Campus Plus Works
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
            Join thousands of developers and top recruiters building their future with Campus Plus.
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
