import React, { useState } from 'react';
import { Sparkles, ThumbsUp, Copy, Check, Wand2, Lightbulb, RefreshCw, Send } from 'lucide-react';
import { DiffViewer } from '../../components/resume/DiffViewer';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { aiAPI } from '../../services/api';

export const AiResumeSuggestionsPage = () => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [customText, setCustomText] = useState('');
  const [customSection, setCustomSection] = useState('Work Experience');
  const [isGenerating, setIsGenerating] = useState(false);

  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      section: 'Professional Summary',
      original: 'Results-driven Full Stack Engineer with strong proficiency in React, Node.js, Express, and MongoDB. Passionate about architecting scalable web applications.',
      improved: 'Performance-driven Full Stack Engineer with extensive experience in React 18, Node.js microservices, and MongoDB. Proven track record of developing responsive web platforms and reducing page load latencies by over 30%.',
      reason: 'Adds measurable performance indicators and highlights modern production engineering competencies.',
    },
    {
      id: 2,
      section: 'Work Experience',
      original: 'Engineered high-performance React dashboards, integrated RESTful microservices, and reduced client-side bundle size by 32%.',
      improved: 'Spearheaded the engineering of modular React dashboards with Redux Toolkit and REST APIs, cutting client-side bundle size by 32% and elevating application performance scores to 95+.',
      reason: 'Uses stronger leadership action verbs and mentions architectural tooling explicitly.',
    },
    {
      id: 3,
      section: 'Featured Projects',
      original: 'Full stack recruitment platform with PulseAI resume analyzer, role-based dashboards, and live job tracking.',
      improved: 'Architected an enterprise recruitment platform incorporating PulseAI for automated resume parsing, role-based JWT authorization, and MongoDB Atlas database scaling.',
      reason: 'Demonstrates deep technical complexity and enterprise-grade integration capabilities.',
    },
    {
      id: 4,
      section: 'Work Experience',
      original: 'Helped the backend team fix bugs in Express endpoints and updated database models.',
      improved: 'Diagnosed and resolved critical bottleneck queries in Express.js REST microservices, improving throughput under peak traffic by 28%.',
      reason: 'Replaces passive phrasing ("helped") with active engineering impact ("diagnosed and resolved").',
    },
  ]);

  const handleCustomRewrite = async (e) => {
    e.preventDefault();
    if (!customText.trim()) return;

    setIsGenerating(true);
    try {
      const res = await aiAPI.improveResume({
        section: customSection,
        originalText: customText.trim(),
      });

      if (res.success && res.improvement) {
        const newSuggestion = {
          id: Date.now(),
          section: res.improvement.section || customSection,
          original: res.improvement.original,
          improved: res.improvement.improved,
          reason: res.improvement.reason,
        };
        setSuggestions((prev) => [newSuggestion, ...prev]);
        setCustomText('');
        addToast('New optimized bullet point generated with PulseAI!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error generating improvement', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredSuggestions =
    activeTab === 'all'
      ? suggestions
      : suggestions.filter((s) => s.section.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          Interactive Comparison
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          PulseAI Resume Bullet Improver
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Review side-by-side phrasing optimizations. We enhance active verbs and quantifiable business impact without fabricating candidate experience.
        </p>
      </div>

      {/* Interactive Custom Bullet Rewriter Box */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-brand-primary" /> Live Bullet Rewriter
          </h2>
          <span className="text-xs text-brand-muted">Paste any line from your resume</span>
        </div>

        <form onSubmit={handleCustomRewrite} className="space-y-3">
          <div className="flex gap-3">
            <select
              value={customSection}
              onChange={(e) => setCustomSection(e.target.value)}
              className="bg-brand-bg/60 border border-brand-border rounded-xl px-3 py-2 text-xs font-semibold text-brand-navy outline-none focus:border-brand-primary"
            >
              <option>Work Experience</option>
              <option>Featured Projects</option>
              <option>Professional Summary</option>
              <option>Technical Skills</option>
            </select>
            <input
              type="text"
              placeholder="e.g. Worked on payment gateway integration and made it faster..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="flex-1 bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2 text-sm text-brand-text outline-none focus:border-brand-primary focus:bg-white transition-all"
            />
            <Button type="submit" variant="primary" size="sm" isLoading={isGenerating} icon={Sparkles}>
              Optimize with PulseAI
            </Button>
          </div>
        </form>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3">
        {[
          { label: 'All Suggestions', value: 'all' },
          { label: 'Professional Summary', value: 'summary' },
          { label: 'Work Experience', value: 'experience' },
          { label: 'Projects', value: 'project' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.value
                ? 'bg-brand-navy text-white shadow-subtle'
                : 'text-brand-muted hover:text-brand-navy hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comparison Cards List */}
      <div className="space-y-5">
        {filteredSuggestions.map((sug) => (
          <DiffViewer
            key={sug.id}
            suggestion={sug}
            onAccept={() => {
              // Mark as accepted
            }}
          />
        ))}
      </div>
    </div>
  );
};
