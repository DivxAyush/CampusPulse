import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Save, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { jobsAPI } from '../../services/api';

export const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    requiredSkills: '',
    preferredSkills: '',
    experience: '0-2 years',
    salaryMin: '800000',
    salaryMax: '1600000',
    jobType: 'full-time',
    workMode: 'hybrid',
    location: 'Bengaluru, India',
    status: 'published',
  });

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    setIsLoading(true);
    try {
      // In our mock or real endpoint, we can find by slug or ID
      const res = await jobsAPI.getJobs();
      if (res.success && res.jobs) {
        const found = res.jobs.find((j) => j._id === id) || res.jobs[0];
        if (found) {
          setFormData({
            title: found.title,
            description: found.description,
            responsibilities: (found.responsibilities || []).join('\n'),
            requirements: (found.requirements || []).join('\n'),
            requiredSkills: (found.requiredSkills || []).join(', '),
            preferredSkills: (found.preferredSkills || []).join(', '),
            experience: found.experience || '0-2 years',
            salaryMin: found.salary?.min?.toString() || '800000',
            salaryMax: found.salary?.max?.toString() || '1600000',
            jobType: found.jobType || 'full-time',
            workMode: found.workMode || 'hybrid',
            location: found.location || 'Bengaluru, India',
            status: found.status || 'published',
          });
        }
      }
    } catch (err) {
      console.warn('Error loading job for edit:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        responsibilities: formData.responsibilities.split('\n').filter(Boolean),
        requirements: formData.requirements.split('\n').filter(Boolean),
        requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSkills: formData.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        experience: formData.experience,
        salary: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax),
          currency: 'INR',
          period: 'per annum',
        },
        jobType: formData.jobType,
        workMode: formData.workMode,
        location: formData.location,
        status: formData.status,
      };

      await jobsAPI.updateJob(id, payload);
      addToast('Job updated successfully.', 'success');
      navigate('/company/jobs');
    } catch (err) {
      addToast(err.message || 'Error updating job', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="h-64 bg-white rounded-3xl border border-brand-border p-8 animate-pulse" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate('/company/jobs')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-primary mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Jobs
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Edit Job Opening</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Update job details, salary ranges, or pause incoming applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="md" isLoading={isSaving} icon={Save}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <Input
          label="Job Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary"
            >
              <option value="published">Published & Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Work Mode
            </label>
            <select
              value={formData.workMode}
              onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
              className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary"
            >
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
              <option value="on-site">On-site</option>
            </select>
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Role Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-text outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" size="md" onClick={() => navigate('/company/jobs')}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" isLoading={isSaving} icon={Save}>
          Update Job
        </Button>
      </div>
    </form>
  );
};
