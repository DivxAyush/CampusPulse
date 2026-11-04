import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilter } from '../../components/jobs/JobFilter';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { jobsAPI } from '../../services/api';

export const FindJobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || 'all',
    workMode: searchParams.get('workMode') || 'all',
    experience: searchParams.get('experience') || 'all',
    sort: 'newest',
    page: 1,
  });

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const res = await jobsAPI.getJobs(filters);
      if (res.success) {
        setJobs(res.jobs || []);
        setTotalJobs(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.warn('Error loading jobs:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: 'all',
      workMode: 'all',
      experience: 'all',
      sort: 'newest',
      page: 1,
    });
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Campus Plus Directory
          </Badge>
          <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">Explore Job Openings</h1>
          <p className="text-sm text-brand-muted mt-1">
            Discover verified tech roles across top startups and enterprises. Apply with 1 click.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ArrowUpDown className="w-4 h-4 text-brand-muted" />
          <span className="text-xs font-bold text-brand-muted uppercase">Sort By:</span>
          <select
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }))}
            className="bg-white border border-brand-border rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-navy outline-none focus:border-brand-primary cursor-pointer shadow-subtle"
          >
            <option value="newest">Most Recent</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
            <option value="popular">Most Applicants</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <JobFilter
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            totalJobs={totalJobs}
          />
        </div>

        {/* Right Job Cards Column */}
        <div className="lg:col-span-3 space-y-5">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-44 rounded-2xl bg-white border border-brand-border p-6 animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs found matching your criteria"
              description="Try adjusting your keyword, location, or experience filters to discover more open positions."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={(target) => setSelectedJobForApply(target)}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-6 flex items-center justify-between border-t border-brand-border">
                  <span className="text-xs text-brand-muted">
                    Page <span className="font-bold text-brand-navy">{filters.page}</span> of{' '}
                    <span className="font-bold text-brand-navy">{totalPages}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={filters.page <= 1}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                      className="px-3 py-1.5 rounded-xl border border-brand-border bg-white text-xs font-semibold text-brand-navy hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-subtle cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <button
                      disabled={filters.page >= totalPages}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                      className="px-3 py-1.5 rounded-xl border border-brand-border bg-white text-xs font-semibold text-brand-navy hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-subtle cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          job={selectedJobForApply}
          onSuccess={() => loadJobs()}
        />
      )}
    </div>
  );
};
