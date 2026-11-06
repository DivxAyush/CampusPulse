import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Zap,
  Mic,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  Workflow,
  BarChart3,
  Building2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const FiveAiAgentsPage = () => {
  const [activeAgentId, setActiveAgentId] = useState('resume');

  const agents = [
    {
      id: 'resume',
      number: '01',
      name: 'Resume Agent',
      shortRole: 'ATS Quality & Parsing Specialist',
      icon: FileText,
      color: 'emerald',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      accentColor: 'from-emerald-500 to-teal-500',
      description:
        'Ingests binary resume vectors (PDF, DOCX) and translates them into structured talent profiles. Calculates ATS compliance, detects impact metrics, and suggests quantified bullet revisions.',
      capabilities: [
        'Multi-format text & table extraction',
        'ATS Parsability and structure scoring',
        'Bullet-point impact quantification',
        'Side-by-side phrasing revisions',
      ],
      inputData: 'Candidate PDF / DOCX resume',
      outputData: 'Structured profile DNA & ATS diagnostic report',
    },
    {
      id: 'skillgap',
      number: '02',
      name: 'Skill-Gap Agent',
      shortRole: 'Market Benchmarking & Roadmaps',
      icon: Search,
      color: 'teal',
      bgColor: 'bg-teal-50 text-teal-700 border-teal-200',
      badgeColor: 'bg-teal-100 text-teal-800',
      accentColor: 'from-teal-500 to-cyan-500',
      description:
        'Compares student competencies against real-time industry hiring matrices. Identifies missing high-impact technical proficiencies and synthesizes personalized week-by-week learning roadmaps.',
      capabilities: [
        'Real-time market skill deficit analysis',
        '8-week personalized bridge roadmaps',
        'Targeted project & repository suggestions',
        'Micro-credential curation',
      ],
      inputData: 'Candidate verified skills + Current job demands',
      outputData: 'Prioritized skill voids & 8-week bridge plan',
    },
    {
      id: 'matching',
      number: '03',
      name: 'Matching Agent',
      shortRole: 'Semantic Vector Job Recommender',
      icon: Zap,
      color: 'indigo',
      bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      accentColor: 'from-indigo-500 to-purple-500',
      description:
        'Computes multidimensional affinity scores between candidates and active openings. Explains why a candidate is selected and ranks applicants for recruiters without unconscious bias.',
      capabilities: [
        'Multi-vector cosine semantic search',
        'Explainable match rationales',
        'Location and workplace mode weighting',
        'Automated recruiter shortlist scoring',
      ],
      inputData: 'Candidate profile + Recruiter job opening specs',
      outputData: 'Affinity match score (0-100%) & fit rationale',
    },
    {
      id: 'interview',
      number: '04',
      name: 'Interview Agent',
      shortRole: 'Dynamic Conversational Simulator',
      icon: Mic,
      color: 'purple',
      bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-800',
      accentColor: 'from-purple-500 to-pink-500',
      description:
        'Simulates real technical, business case, and behavioral interview rounds across Marketing, Finance, HR, and Tech. Evaluates answers for quantitative metrics, strategic depth, and STAR structure.',
      capabilities: [
        'Adaptive follow-up question generation',
        'Business case & metrics calculation grading',
        'STAR methodology answer validation',
        'Confidence & communication metrics',
      ],
      inputData: 'Target role, candidate audio/text responses',
      outputData: 'Round score, edge cases missed, ideal answer',
    },
    {
      id: 'tpo',
      number: '05',
      name: 'TPO / University Agent',
      shortRole: 'Cohort Analytics & Placement Funnel',
      icon: GraduationCap,
      color: 'amber',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-800',
      accentColor: 'from-amber-500 to-orange-500',
      description:
        'Synthesizes batch-wide placement statistics for university placement cells. Predicts departmental placement readiness and alerts faculty to curriculum bottlenecks before placement drives start.',
      capabilities: [
        'Departmental placement-readiness funnel',
        'Institutional curriculum gap insights',
        'Automated drive candidate dispatch',
        'Predictive package & placement yield',
      ],
      inputData: 'University cohort scores + Campus drive schedule',
      outputData: 'Employability dashboard & curriculum adjustments',
    },
  ];

  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  return (
    <div className="w-full bg-[#FAFCFB] min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="max-w-[1680px] mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>PulseAI Multi-Agent Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B251E] tracking-tight">
            The Five Intelligent AI Agents <br />
            <span className="text-[#159B79]">Powering CampusPulse</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            Our presentation proposes five specialized, interconnected autonomous agents working collaboratively across students, universities, and recruiters to build an end-to-end placement engine.
          </p>
        </div>

        {/* Interactive Workflow Diagram */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B251E] to-[#04120E] p-6 sm:p-10 text-white shadow-xl border border-emerald-500/20 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Workflow className="w-4 h-4" /> End-to-End Interconnected Workflow
              </span>
              <h3 className="text-xl font-bold text-white mt-1">How The 5 Agents Collaborate in Real-Time</h3>
            </div>
            <span className="text-xs text-emerald-300/80 font-mono">Click any agent below to inspect its role</span>
          </div>

          {/* Stepper workflow nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            {agents.map((ag, i) => {
              const isSelected = activeAgentId === ag.id;
              const IconComp = ag.icon;
              return (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => setActiveAgentId(ag.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/10 scale-102'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-xs font-mono text-emerald-400 font-bold">{ag.number}</span>
                    <IconComp className={`w-5 h-5 ${isSelected ? 'text-emerald-300' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white tracking-wide">{ag.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{ag.shortRole}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Agent Highlight Detail Bar */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold">
                Inspecting Agent {activeAgent.number}: {activeAgent.name}
              </div>
              <h4 className="text-lg font-bold text-white">{activeAgent.shortRole}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{activeAgent.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0 text-xs w-full md:w-auto">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Agent Input</span>
                <span className="font-semibold text-emerald-200 mt-0.5 block">{activeAgent.inputData}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Agent Output</span>
                <span className="font-semibold text-emerald-200 mt-0.5 block">{activeAgent.outputData}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Agent Detailed Cards */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#0B251E] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#159B79]" /> Comprehensive Agent Capabilities
            </h3>
            <span className="text-xs text-gray-500 font-medium">Built on modern micro-agent architecture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((ag) => {
              const Icon = ag.icon;
              return (
                <div
                  key={ag.id}
                  className="rounded-3xl bg-white border border-gray-200/90 p-6 flex flex-col justify-between shadow-subtle hover:shadow-hover hover:border-emerald-500/50 transition-all duration-300 space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border font-bold ${ag.bgColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase">Agent {ag.number}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#0B251E]">{ag.name}</h4>
                      <p className="text-xs font-semibold text-[#159B79] mt-0.5">{ag.shortRole}</p>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">{ag.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Core Responsibilities</span>
                      <ul className="space-y-1.5">
                        {ag.capabilities.map((cap, cIdx) => (
                          <li key={cIdx} className="text-xs text-gray-700 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Target Stakeholder:</span>
                    <strong className="text-gray-800 font-bold">
                      {ag.id === 'tpo' ? 'Universities' : ag.id === 'matching' ? 'Recruiters' : 'Students & Colleges'}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-[#0B251E]">Ready to experience the 5 Agents in action?</h3>
            <p className="text-xs text-gray-600">
              Run your resume through the Resume Agent or explore university cohort intelligence on the TPO Dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/candidate/ai-analyzer">
              <Button variant="primary" size="md" icon={ArrowRight}>
                Try PulseAI Analyzer
              </Button>
            </Link>
            <Link to="/university/dashboard">
              <Button variant="outline" size="md" icon={GraduationCap}>
                Open TPO Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiveAiAgentsPage;

