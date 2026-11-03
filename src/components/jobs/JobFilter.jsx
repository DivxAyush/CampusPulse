import React from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export const JobFilter = ({ filters, setFilters, onReset, totalJobs = 0 }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const jobTypes = [
    { label: 'All Types', value: 'all' },
    { label: 'Full Time', value: 'full-time' },
    { label: 'Internship', value: 'internship' },
    { label: 'Contract', value: 'contract' },
  ];

  const workModes = [
    { label: 'All Modes', value: 'all' },
    { label: 'Remote', value: 'remote' },
    { label: 'Hybrid', value: 'hybrid' },
    { label: 'On-site', value: 'on-site' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-5">
      <div className="flex items-center justify-between border-b border-brand-border pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-brand-navy">
          <SlidersHorizontal className="w-4 h-4 text-brand-primary" /> Filter Opportunities
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-brand-muted hover:text-brand-primary flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Role / Keyword Search */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
          Job Title or Skill
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-brand-muted" />
          <input
            type="text"
            placeholder="e.g. React, Node.js, Frontend..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full bg-brand-bg/60 border border-brand-border rounded-xl pl-9 pr-3 py-2 text-sm text-brand-text outline-none focus:border-brand-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Location Search */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
          Location
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-3 text-brand-muted" />
          <input
            type="text"
            placeholder="e.g. Bengaluru, Mumbai, Remote..."
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-brand-bg/60 border border-brand-border rounded-xl pl-9 pr-3 py-2 text-sm text-brand-text outline-none focus:border-brand-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
          Employment Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {jobTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => handleChange('jobType', t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filters.jobType === t.value
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-brand-bg text-brand-text hover:bg-gray-200/80 border border-brand-border/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
          Workplace Mode
        </label>
        <div className="flex flex-wrap gap-1.5">
          {workModes.map((m) => (
            <button
              key={m.value}
              onClick={() => handleChange('workMode', m.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filters.workMode === m.value
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-brand-bg text-brand-text hover:bg-gray-200/80 border border-brand-border/60'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
          Experience Level
        </label>
        <select
          value={filters.experience || 'all'}
          onChange={(e) => handleChange('experience', e.target.value)}
          className="w-full bg-brand-bg/60 border border-brand-border rounded-xl px-3 py-2 text-sm text-brand-text outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
        >
          <option value="all">Any Experience</option>
          <option value="fresher">Fresher (0 years)</option>
          <option value="0-2 years">Junior (0-2 years)</option>
          <option value="2-5 years">Mid-Level (2-5 years)</option>
          <option value="5+ years">Senior (5+ years)</option>
        </select>
      </div>

      <div className="pt-2 text-xs font-medium text-brand-muted text-center border-t border-brand-border">
        Showing <span className="font-bold text-brand-navy">{totalJobs}</span> matching positions
      </div>
    </div>
  );
};
