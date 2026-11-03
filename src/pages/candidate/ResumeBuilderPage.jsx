import React, { useState } from 'react';
import { FileEdit, Printer, Download, Sparkles, Plus, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const ResumeBuilderPage = () => {
  const [resumeData, setResumeData] = useState({
    fullName: 'Ayush Sharma',
    headline: 'Full Stack Software Engineer',
    email: 'candidate@campusplus.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    summary:
      'Performance-driven Full Stack Engineer with extensive experience in React 18, Node.js microservices, and MongoDB. Proven track record of developing responsive web platforms and reducing page load latencies by over 30%.',
    skills: 'React.js, Node.js, Express, MongoDB, JavaScript, Tailwind CSS, Redux Toolkit, REST APIs, Git, Docker',
    education: [
      {
        institution: 'National Institute of Technology Karnataka',
        degree: 'B.Tech in Computer Science',
        year: '2020 - 2024',
        grade: '8.85 CGPA',
      },
    ],
    experience: [
      {
        company: 'HyperDrive Technologies',
        role: 'Associate Software Engineer',
        dates: 'Jul 2024 - Present',
        bullets: 'Engineered high-throughput GraphQL and REST endpoints serving 50k daily active users.\nDecreased client-side bundle size by 32% with dynamic code-splitting and asset optimization.',
      },
    ],
    projects: [
      {
        title: 'Campus Plus Recruitment Portal',
        tech: 'React, Node.js, MongoDB, Tailwind CSS',
        description: 'Architected full stack recruitment marketplace with PulseAI resume intelligence and role-based JWT auth.',
      },
    ],
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6 print:hidden">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Live Interactive Editor
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Resume Builder</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Edit your details in real-time and preview the ATS-standard styled document.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={handlePrint} icon={Printer}>
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Two Column Layout: Editor on left, Live Document on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Input Editor */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-5 print:hidden max-h-[80vh] overflow-y-auto">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-brand-primary" /> Edit Resume Details
          </h2>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={resumeData.fullName}
              onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
            />
            <Input
              label="Professional Headline"
              value={resumeData.headline}
              onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Email"
                value={resumeData.email}
                onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
              />
              <Input
                label="Phone"
                value={resumeData.phone}
                onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
              />
            </div>

            <Input
              label="Location"
              value={resumeData.location}
              onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Executive Summary
              </label>
              <textarea
                rows={4}
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="w-full bg-brand-bg/60 border border-brand-border rounded-xl p-3 text-xs text-brand-text outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Skills (Comma separated)
              </label>
              <textarea
                rows={2}
                value={resumeData.skills}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                className="w-full bg-brand-bg/60 border border-brand-border rounded-xl p-3 text-xs text-brand-text outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Resume Sheet Preview */}
        <div className="bg-white rounded-3xl border border-brand-border p-8 sm:p-10 shadow-card space-y-6 text-gray-900 font-sans print:border-none print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-brand-primary pb-4 text-center space-y-1">
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-brand-navy">
              {resumeData.fullName}
            </h1>
            <p className="text-xs font-bold text-brand-primary">{resumeData.headline}</p>
            <div className="text-[11px] text-gray-600 flex flex-wrap justify-center gap-3 pt-1">
              <span>{resumeData.email}</span>
              <span>•</span>
              <span>{resumeData.phone}</span>
              <span>•</span>
              <span>{resumeData.location}</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-navy border-b border-gray-200 pb-0.5">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-gray-700">{resumeData.summary}</p>
          </div>

          {/* Technical Skills */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-navy border-b border-gray-200 pb-0.5">
              Technical Core Competencies
            </h2>
            <p className="text-xs leading-relaxed text-gray-700 font-medium">{resumeData.skills}</p>
          </div>

          {/* Work Experience */}
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-navy border-b border-gray-200 pb-0.5">
              Work Experience
            </h2>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-brand-navy">{exp.role}</span>
                  <span className="text-[10px] text-gray-500 font-medium">{exp.dates}</span>
                </div>
                <div className="text-[11px] font-semibold text-brand-primary">{exp.company}</div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-brand-primary-light">
                  {exp.bullets}
                </p>
              </div>
            ))}
          </div>

          {/* Featured Projects */}
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-navy border-b border-gray-200 pb-0.5">
              Featured Engineering Projects
            </h2>
            {resumeData.projects.map((proj, i) => (
              <div key={i} className="space-y-0.5 text-xs">
                <div className="font-bold text-brand-navy flex justify-between">
                  <span>{proj.title}</span>
                  <span className="text-[10px] text-gray-500 font-normal">{proj.tech}</span>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-navy border-b border-gray-200 pb-0.5">
              Education
            </h2>
            {resumeData.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-brand-navy">{edu.institution}</span>
                  <div className="text-[11px] text-gray-600">{edu.degree}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-500">{edu.year}</span>
                  <div className="text-[11px] font-bold text-brand-primary">{edu.grade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
