import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, Building2, MapPin } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { EmptyState } from '../../components/common/EmptyState';
import { candidateAPI } from '../../services/api';

export const RecommendedJobsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await candidateAPI.getRecommendations();
      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (err) {
      console.warn('Error loading recommendations:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          PulseAI-Matched Openings
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          Recommended Jobs For You
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          These openings are calculated by PulseAI based on your primary skills, verified experience, and profile preferences.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-white rounded-3xl border border-brand-border animate-pulse" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No recommendations found yet"
          description="Update your candidate profile skills and experience to receive personalized job suggestions."
        />
      ) : (
        <div className="space-y-5">
          {recommendations.map((job) => {
            const company = job.companyId || {};
            return (
              <div
                key={job._id}
                className="bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-subtle hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center p-1.5 flex-shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 className="w-6 h-6 text-brand-primary" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-muted flex items-center gap-1.5">
                        {company.companyName || 'Verified Partner'}
                        {company.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
                      </div>
                      <h3 className="text-lg font-bold text-brand-navy">{job.title}</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success" size="sm" className="font-extrabold">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> {job.matchPercentage || 92}% Match Score
                    </Badge>
                    <Badge variant="primary" size="sm">
                      {job.jobType ? job.jobType.replace('-', ' ') : 'Full Time'}
                    </Badge>
                    <span className="text-xs text-brand-muted flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                  </div>

                  {job.matchExplanation && (
                    <p className="text-xs text-brand-muted bg-brand-bg/60 p-2.5 rounded-xl border border-brand-border/60 leading-relaxed">
                      <span className="font-bold text-brand-navy">Match Rationale: </span>
                      {job.matchExplanation}
                    </p>
                  )}

                  {/* Matched vs Missing Skills */}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    {job.matchedSkills?.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/60 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-brand-primary" /> {s}
                      </span>
                    ))}
                    {job.missingSkills?.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-brand-muted block">Annual Compensation</span>
                    <span className="text-sm font-extrabold text-brand-navy">
                      INR {job.salary?.min ? (job.salary.min / 100000).toFixed(0) + 'L' : '6L'} -{' '}
                      {job.salary?.max ? (job.salary.max / 100000).toFixed(0) + 'L PA' : '12L PA'}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setSelectedJobForApply(job)}
                    icon={Sparkles}
                    className="w-full sm:w-auto"
                  >
                    1-Click Apply
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedJobForApply && (
        <ApplyModal
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          job={selectedJobForApply}
          onSuccess={() => loadRecommendations()}
        />
      )}
    </div>
  );
};
