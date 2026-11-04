import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase, MapPin, IndianRupee, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { jobsAPI } from '../../services/api';

export const CreateJobPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    education: "Bachelor's Degree in Computer Science or related engineering field",
    openings: 2,
    status: 'published', // immediate publish without mandatory admin approval
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      addToast('Please provide job title and description.', 'error');
      return;
    }

    setIsSubmitting(true);
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
          isDisclosed: true,
        },
        jobType: formData.jobType,
        workMode: formData.workMode,
        location: formData.location,
        education: formData.education,
        openings: Number(formData.openings),
        status: formData.status,
      };

      const res = await jobsAPI.createJob(payload);
      if (res.success) {
        addToast('Job published immediately and available to candidates!', 'success');
        navigate('/company/jobs');
      }
    } catch (err) {
      addToast(err.message || 'Error creating job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Instant Publishing
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Post a New Job</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Jobs are published immediately without mandatory admin wait-times.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => navigate('/company/jobs')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} icon={PlusCircle}>
            Publish Job Opening
          </Button>
        </div>
      </div>

      {/* 1. Basic Job Details */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-primary" /> Core Position Details
        </h2>

        <Input
          label="Job Title"
          required
          placeholder="e.g. Senior Frontend Engineer (React & TypeScript)"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Employment Type
            </label>
            <select
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary"
            >
              <option value="full-time">Full-Time</option>
              <option value="internship">Internship</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
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
            label="Location / City"
            icon={MapPin}
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Experience Level"
            placeholder="0-2 years, 2-5 years..."
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />
          <Input
            label="Minimum Annual Salary (INR)"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
          />
          <Input
            label="Maximum Annual Salary (INR)"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Role Overview & Description
          </label>
          <textarea
            rows={4}
            required
            placeholder="Describe the mission of this role, team context, and high level responsibilities..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light"
          />
        </div>
      </div>

      {/* 2. Responsibilities and Requirements */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-navy">Candidate Expectations</h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Key Responsibilities (One per line)
          </label>
          <textarea
            rows={4}
            placeholder={`Architect and maintain responsive web applications with React\nCollaborate with product designers to implement pixel-perfect user flows\nWrite automated unit and integration tests`}
            value={formData.responsibilities}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-text outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Requirements & Qualifications (One per line)
          </label>
          <textarea
            rows={4}
            placeholder={`2+ years of professional software engineering experience\nDeep proficiency in modern JavaScript, HTML5, and Tailwind CSS\nSolid foundation in data structures, algorithms, and REST APIs`}
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-text outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {/* 3. Skills and AI Matching Criteria */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-primary" /> Technical Skills & AI Matching Criteria
        </h2>

        <Input
          label="Required Core Skills (Comma separated)"
          placeholder="React.js, Node.js, JavaScript, Tailwind CSS, REST APIs"
          value={formData.requiredSkills}
          onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
          helperText="These skills form the primary matching criteria for our PulseAI candidate scoring"
        />

        <Input
          label="Preferred Bonus Skills (Comma separated)"
          placeholder="TypeScript, Docker, GraphQL, Redis"
          value={formData.preferredSkills}
          onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" size="lg" onClick={() => navigate('/company/jobs')}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} icon={PlusCircle}>
          Publish Job Immediately
        </Button>
      </div>
    </form>
  );
};
