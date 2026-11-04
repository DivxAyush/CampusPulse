import React, { useState, useEffect } from 'react';
import { Bookmark, Briefcase } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { JobCard } from '../../components/jobs/JobCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { jobsAPI } from '../../services/api';

export const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    setIsLoading(true);
    try {
      const res = await jobsAPI.getSavedJobs();
      if (res.success && res.jobs) {
        setSavedJobs(res.jobs);
      }
    } catch (err) {
      console.warn('Error loading saved jobs:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          Bookmarks
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Saved Jobs</h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Opportunities bookmarked for future review and application.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 bg-white rounded-3xl border border-brand-border animate-pulse" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Click the bookmark icon on any job card across the portal to save opportunities to your list."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isSavedInitial={true}
              onApplyClick={(target) => setSelectedJobForApply(target)}
            />
          ))}
        </div>
      )}

      {selectedJobForApply && (
        <ApplyModal
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          job={selectedJobForApply}
          onSuccess={() => loadSavedJobs()}
        />
      )}
    </div>
  );
};
