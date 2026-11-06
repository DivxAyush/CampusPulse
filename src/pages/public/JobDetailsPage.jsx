import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  IndianRupee,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Calendar,
  Users,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { JobCard } from '../../components/jobs/JobCard';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { jobsAPI } from '../../services/api';

export const JobDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadJobDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadJobDetails = async () => {
    setIsLoading(true);
    try {
      const res = await jobsAPI.getJobBySlug(slug);
      if (res.success && res.job) {
        setJob(res.job);
        setSimilarJobs(res.similarJobs || []);
      }
    } catch (err) {
      console.warn('Error loading job details:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      addToast('Please login to apply for this job opening.', 'info');
      navigate('/login');
      return;
    }
    if (role !== 'candidate') {
      addToast('Only candidate accounts can submit job applications.', 'info');
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      addToast('Please login to save this job.', 'info');
      navigate('/login');
      return;
    }
    try {
      const res = await jobsAPI.toggleSaveJob(job._id);
      setIsSaved(res.saved);
      addToast(res.message, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this opening at Campus Plus: ${job?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard!', 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1680px] mx-auto px-4 py-16 space-y-6">
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-white rounded-3xl border border-brand-border p-8 animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-brand-navy">Job Posting Not Found</h2>
        <p className="text-sm text-brand-muted mt-2">This job posting may have been paused, closed, or expired.</p>
        <Link to="/jobs">
          <Button variant="primary" size="md" className="mt-5">
            Back to Job Directory
          </Button>
        </Link>
      </div>
    );
  }

  const company = job.companyId || {};
  const isInsideWorkspace = isAuthenticated && role === 'candidate';

  return (
    <div className={`w-full space-y-6 ${isInsideWorkspace ? '' : 'max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
      {/* Back button */}
      <Link to={isInsideWorkspace ? "/candidate/jobs" : "/jobs"} className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all jobs
      </Link>

      {/* Main Job Header Hero Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-brand-border overflow-hidden bg-brand-bg flex items-center justify-center p-2 flex-shrink-0 shadow-subtle">
              {company.logo ? (
                <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Building2 className="w-8 h-8 text-brand-primary" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-brand-muted">{company.companyName}</span>
                {company.isVerified && (
                  <Badge variant="primary" size="sm">
                    <CheckCircle2 className="w-3 h-3" /> Verified Partner
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-brand-muted font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" /> {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-brand-primary" /> {job.workMode || 'Hybrid'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-primary" /> Posted{' '}
                  {new Date(job.publishedAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 self-start">
            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${isSaved
                  ? 'bg-brand-primary-light border-brand-primary text-brand-primary'
                  : 'border-brand-border text-brand-muted hover:border-brand-primary hover:text-brand-primary bg-white'
                }`}
              title="Save Job"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-brand-border text-brand-muted hover:border-brand-primary hover:text-brand-primary bg-white transition-all cursor-pointer"
              title="Share Opportunity"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <Button variant="primary" size="lg" onClick={handleApplyClick} icon={Sparkles}>
              Apply for Job
            </Button>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-brand-border">
          <div className="p-3 rounded-xl bg-brand-bg">
            <span className="text-[10px] uppercase tracking-wider font-bold text-brand-muted block">Salary Package</span>
            <span className="text-sm font-extrabold text-brand-navy mt-0.5 block">
              INR {job.salary?.min ? (job.salary.min / 100000).toFixed(0) + 'L' : '6L'} -{' '}
              {job.salary?.max ? (job.salary.max / 100000).toFixed(0) + 'L PA' : '12L PA'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-brand-bg">
            <span className="text-[10px] uppercase tracking-wider font-bold text-brand-muted block">Experience</span>
            <span className="text-sm font-extrabold text-brand-navy mt-0.5 block">{job.experience || '0-2 years'}</span>
          </div>
          <div className="p-3 rounded-xl bg-brand-bg">
            <span className="text-[10px] uppercase tracking-wider font-bold text-brand-muted block">Job Type</span>
            <span className="text-sm font-extrabold text-brand-navy mt-0.5 block capitalize">
              {job.jobType ? job.jobType.replace('-', ' ') : 'Full Time'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-brand-bg">
            <span className="text-[10px] uppercase tracking-wider font-bold text-brand-muted block">Open Openings</span>
            <span className="text-sm font-extrabold text-brand-navy mt-0.5 block">{job.openings || 1} Positions</span>
          </div>
        </div>
      </div>

      {/* Main Details Grid: Description, Responsibilities, Requirements vs Company card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Full Job Details */}
        <div className="lg:col-span-2 space-y-8 bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle">
          {/* Overview */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy">About the Role</h2>
            <p className="text-sm text-brand-text leading-relaxed whitespace-pre-line">{job.description}</p>
          </section>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-brand-navy">Key Responsibilities</h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-brand-text leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements & Qualifications */}
          {job.requirements && job.requirements.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-brand-navy">Requirements & Qualifications</h2>
              <ul className="space-y-2.5">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-brand-text leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills Required */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-brand-navy">Required Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-primary-light text-brand-navy border border-emerald-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Bottom Apply Action Bar */}
          <div className="pt-6 border-t border-brand-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-brand-navy">Interested in this position?</div>
              <div className="text-xs text-brand-muted">Applications are reviewed on a rolling basis.</div>
            </div>
            <Button variant="primary" size="md" onClick={handleApplyClick} icon={Sparkles}>
              Apply Now
            </Button>
          </div>
        </div>

        {/* Right Column: Company Info Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">About Hiring Company</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-border overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                {company.logo ? (
                  <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Building2 className="w-6 h-6 text-brand-primary" />
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-navy">{company.companyName}</h4>
                <p className="text-xs text-brand-muted">{company.industry || 'Technology'}</p>
              </div>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed line-clamp-4">
              {company.description ||
                `${company.companyName} is an industry leader building innovative solutions for global enterprises.`}
            </p>

            <div className="space-y-2 pt-2 border-t border-brand-border text-xs text-brand-text">
              <div className="flex justify-between">
                <span className="text-brand-muted">Company Size:</span>
                <span className="font-semibold text-brand-navy">{company.companySize || '100-250 employees'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Headquarters:</span>
                <span className="font-semibold text-brand-navy">{company.headquarters || 'Bengaluru, India'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Founded Year:</span>
                <span className="font-semibold text-brand-navy">{company.foundedYear || '2020'}</span>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-xs font-bold text-brand-primary hover:underline pt-2"
              >
                Visit Official Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {similarJobs.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-brand-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-brand-navy tracking-tight">Similar Opportunities</h2>
            <Link to="/jobs" className="text-xs font-bold text-brand-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarJobs.map((simJob) => (
              <JobCard key={simJob._id} job={simJob} onApplyClick={() => navigate(`/jobs/${simJob.slug}`)} />
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          job={job}
          onSuccess={() => loadJobDetails()}
        />
      )}
    </div>
  );
};
