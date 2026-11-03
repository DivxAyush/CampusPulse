import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  Bookmark,
  Sparkles,
  ArrowRight,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { jobsAPI } from '../../services/api';

export const JobCard = ({ job, onApplyClick, isSavedInitial = false }) => {
  const { isAuthenticated, role } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isSaving, setIsSaving] = useState(false);

  const formatSalary = (salary) => {
    if (!salary || !salary.min) return 'Competitive Compensation';
    const minLacs = (salary.min / 100000).toFixed(salary.min % 100000 === 0 ? 0 : 1);
    const maxLacs = salary.max ? (salary.max / 100000).toFixed(salary.max % 100000 === 0 ? 0 : 1) : null;
    return maxLacs ? `INR ${minLacs}L - ${maxLacs}L / yr` : `INR ${minLacs}L / yr`;
  };

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      addToast('Please sign in to save jobs to your profile', 'info');
      navigate('/login');
      return;
    }

    if (role !== 'candidate') {
      addToast('Only candidate accounts can save jobs', 'info');
      return;
    }

    setIsSaving(true);
    try {
      const res = await jobsAPI.toggleSaveJob(job._id);
      setIsSaved(res.saved);
      addToast(res.message, 'success');
    } catch (err) {
      addToast(err.message || 'Error saving job', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const company = job.companyId || {};

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-brand-border p-5 sm:p-6 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Top Header: Company info & bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-brand-border overflow-hidden bg-brand-bg flex items-center justify-center p-1.5 flex-shrink-0 group-hover:border-brand-primary transition-colors">
              {company.logo ? (
                <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="w-6 h-6 text-brand-primary" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                {company.companyName || 'Verified Partner'}
                {company.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
              </div>
              <Link to={`/jobs/${job.slug}`}>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy group-hover:text-brand-primary transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isSaved
                ? 'bg-brand-primary-light border-brand-primary text-brand-primary'
                : 'border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary bg-white'
            }`}
            aria-label="Save job"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badges Bar: Job type, work mode, experience */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="primary" size="sm">
            {job.jobType ? job.jobType.replace('-', ' ') : 'Full Time'}
          </Badge>
          <Badge variant="default" size="sm">
            {job.workMode || 'Hybrid'}
          </Badge>
          <Badge variant="default" size="sm">
            {job.experience || '0-2 years'}
          </Badge>
          {job.matchPercentage && (
            <Badge variant="success" size="sm" className="font-bold">
              <Sparkles className="w-3 h-3 text-emerald-600" /> {job.matchPercentage}% AI Match
            </Badge>
          )}
        </div>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-brand-muted line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Pills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.requiredSkills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-brand-bg text-brand-text border border-brand-border/70"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium text-brand-muted bg-gray-50 border border-brand-border/50">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Salary, location & action button */}
      <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold text-brand-navy flex items-center gap-1">
            {formatSalary(job.salary)}
          </div>
          <div className="text-[11px] text-brand-muted flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0" /> {job.location || 'India'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/jobs/${job.slug}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (onApplyClick) onApplyClick(job);
              else navigate(`/jobs/${job.slug}`);
            }}
            className="text-xs"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
