import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, PlusCircle, Edit, Trash2, Eye, Pause, Play, CheckCircle2, Users } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { companyAPI, jobsAPI } from '../../services/api';

export const ManageJobsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const res = await companyAPI.getJobs();
      if (res.success && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (err) {
      console.warn('Error loading company jobs:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'published' ? 'paused' : 'published';
    try {
      await jobsAPI.updateJob(job._id, { status: nextStatus });
      addToast(`Job status changed to ${nextStatus}.`, 'success');
      setJobs((prev) =>
        prev.map((j) => (j._id === job._id ? { ...j, status: nextStatus } : j))
      );
    } catch (err) {
      addToast(err.message || 'Error updating job', 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;
    try {
      await jobsAPI.deleteJob(jobId);
      addToast('Job posting deleted successfully.', 'success');
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      addToast(err.message || 'Error deleting job', 'error');
    }
  };

  const filteredJobs =
    filterStatus === 'all' ? jobs : jobs.filter((j) => j.status === filterStatus);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Job Listings
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Manage Job Openings</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Create, update, pause, or view incoming applicants across your engineering listings.
          </p>
        </div>

        <Link to="/company/jobs/create">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3">
        {[
          { label: 'All Jobs', value: 'all' },
          { label: 'Published & Active', value: 'published' },
          { label: 'Paused', value: 'paused' },
          { label: 'Draft', value: 'draft' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === tab.value
                ? 'bg-brand-navy text-white shadow-subtle'
                : 'text-brand-muted hover:text-brand-navy hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-36 bg-white rounded-3xl border border-brand-border animate-pulse" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job postings found"
          description="You haven't posted any jobs in this category yet. Click 'Post New Job' to publish an opening immediately!"
          actionText="Create a Position"
          onAction={() => navigate('/company/jobs/create')}
        />
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-brand-navy">{job.title}</h3>
                  <Badge variant={job.status === 'published' ? 'primary' : 'warning'} size="sm" className="capitalize">
                    {job.status || 'Published'}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.jobType ? job.jobType.replace('-', ' ') : 'Full Time'}</span>
                  <span>•</span>
                  <span>{job.workMode || 'Hybrid'}</span>
                  <span>•</span>
                  <span>Posted {new Date(job.publishedAt || Date.now()).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-brand-navy pt-1">
                  <span className="flex items-center gap-1.5 text-brand-primary">
                    <Users className="w-4 h-4" /> {job.applicantsCount || 0} Total Applicants
                  </span>
                  <span>•</span>
                  <span>{job.viewsCount || 0} Total Views</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <Link to={`/company/applicants?jobId=${job._id}`}>
                  <Button variant="mint" size="sm" icon={Users} className="text-xs">
                    View Applicants
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(job)}
                  icon={job.status === 'published' ? Pause : Play}
                  className="text-xs"
                >
                  {job.status === 'published' ? 'Pause' : 'Activate'}
                </Button>

                <Link to={`/company/jobs/edit/${job._id}`}>
                  <button className="p-2 text-brand-muted hover:text-brand-primary rounded-xl border border-brand-border hover:border-brand-primary bg-white transition-all cursor-pointer" title="Edit Job">
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>

                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="p-2 text-brand-muted hover:text-red-600 rounded-xl border border-brand-border hover:border-red-400 bg-white transition-all cursor-pointer"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
