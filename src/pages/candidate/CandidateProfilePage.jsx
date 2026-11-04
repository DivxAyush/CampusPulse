import React, { useState, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Code, Award, Plus, Trash2, Save, MapPin, IndianRupee, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { candidateAPI } from '../../services/api';

export const CandidateProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    location: '',
    expectedSalary: '',
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await candidateAPI.getProfile();
      if (res.success && res.profile) {
        setFormData({
          headline: res.profile.headline || '',
          bio: res.profile.bio || '',
          location: res.profile.location || '',
          expectedSalary: res.profile.expectedSalary || '',
          skills: Array.isArray(res.profile.skills) ? res.profile.skills : [],
          education: Array.isArray(res.profile.education) ? res.profile.education : [],
          experience: Array.isArray(res.profile.experience) ? res.profile.experience : [],
          projects: Array.isArray(res.profile.projects) ? res.profile.projects : [],
          certifications: Array.isArray(res.profile.certifications) ? res.profile.certifications : [],
        });
      }
    } catch (err) {
      console.warn('Error loading profile:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await candidateAPI.updateProfile(formData);
      if (res.success) {
        addToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error saving profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) {
      addToast('Skill already added', 'info');
      return;
    }
    setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  if (isLoading) {
    return <div className="h-64 bg-white rounded-3xl border border-brand-border p-8 animate-pulse" />;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 w-full max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Profile Settings
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Candidate Profile</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Keep your skills, experience, and education updated for accurate AI job matching.
          </p>
        </div>
        <Button type="submit" variant="primary" size="md" isLoading={isSaving} icon={Save}>
          Save All Changes
        </Button>
      </div>

      {/* 1. Basic Info Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
        <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
          <User className="w-5 h-5 text-brand-primary" /> Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            disabled
            value={user?.fullName || ''}
            helperText="To change name, contact support"
          />
          <Input
            label="Account Email"
            disabled
            value={user?.email || ''}
            helperText="Primary email used for job notifications"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Professional Headline"
            placeholder="e.g. Full Stack Engineer | React & Node.js"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
          />
          <Input
            label="Current Location"
            icon={MapPin}
            placeholder="Bengaluru, India"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Professional Bio & Summary
          </label>
          <textarea
            rows={3}
            placeholder="Brief summary of your technical background, passions, and achievements..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light transition-all"
          />
        </div>
      </div>

      {/* 2. Technical Skills Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <Code className="w-5 h-5 text-brand-primary" /> Technical Skills ({formData.skills.length})
          </h2>
          <span className="text-xs text-brand-muted">Used for PulseAI job matching algorithms</span>
        </div>

        {/* Add skill input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new skill (e.g. TypeScript, Docker, GraphQL)..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(e);
              }
            }}
            className="flex-1 bg-brand-bg/60 border border-brand-border rounded-xl px-3.5 py-2 text-sm text-brand-text outline-none focus:border-brand-primary focus:bg-white transition-all"
          />
          <Button variant="secondary" size="sm" onClick={handleAddSkill} icon={Plus}>
            Add Skill
          </Button>
        </div>

        {/* Skills Pills with delete button */}
        <div className="flex flex-wrap gap-2 pt-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-primary-light text-brand-navy border border-emerald-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-red-600 transition-colors cursor-pointer"
                title="Remove skill"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Education Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
        <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-primary" /> Education
        </h2>

        {formData.education && formData.education.length > 0 ? (
          formData.education.map((edu, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-brand-navy">{edu.institution}</span>
                <span className="text-xs font-bold text-brand-primary">{edu.grade}</span>
              </div>
              <div className="text-xs text-brand-text font-medium">
                {edu.degree} in {edu.fieldOfStudy}
              </div>
              <div className="text-[11px] text-brand-muted">
                {edu.startYear} - {edu.endYear}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-brand-muted py-1 italic">
            No education records added yet. Upload your resume via PulseAI to auto-populate or update your profile.
          </p>
        )}
      </div>

      {/* 4. Experience Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
        <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-primary" /> Work Experience
        </h2>

        {formData.experience && formData.experience.length > 0 ? (
          formData.experience.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-brand-navy">{exp.role}</span>
                <span className="text-xs font-bold text-brand-muted">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="text-xs font-semibold text-brand-primary">{exp.company} • {exp.location}</div>
              <p className="text-xs text-brand-muted leading-relaxed">{exp.description}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-brand-muted py-1 italic">
            No work experience records added yet. Fresher profile active.
          </p>
        )}
      </div>

      {/* 5. Projects Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
        <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-primary" /> Featured Projects
        </h2>

        {formData.projects && formData.projects.length > 0 ? (
          formData.projects.map((proj, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-brand-navy">{proj.title}</span>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-primary hover:underline">
                    Project Link
                  </a>
                )}
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">{proj.description}</p>
              {proj.techStack && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.techStack.map((tech, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-brand-border text-brand-navy">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-brand-muted py-1 italic">
            No projects added yet. Upload your resume or add projects to showcase your skills.
          </p>
        )}
      </div>

      {/* Bottom Save bar */}
      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" size="lg" isLoading={isSaving} icon={Save}>
          Save Profile Updates
        </Button>
      </div>
    </form>
  );
};
