import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Code,
  Mic,
  Award,
  AlertCircle,
  Play,
  RotateCcw,
  Send,
  Zap,
  Layers,
  ChevronRight,
  HelpCircle,
  Calendar,
  Check,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const CareerRoadmapPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'mock-interview'

  // Roadmap State
  const [roadmapWeek, setRoadmapWeek] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set([1]));

  // Mock Interview Simulator State
  const [selectedTopic, setSelectedTopic] = useState('react');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const skillGaps = [
    { skill: 'Docker & Containerization', gapLevel: 'High', priority: 'Urgent', weeks: 'Weeks 3-4' },
    { skill: 'System Design & Database Indexing', gapLevel: 'Medium', priority: 'High', weeks: 'Weeks 1-2' },
    { skill: 'Automated Testing (Jest / Vitest)', gapLevel: 'Medium', priority: 'Recommended', weeks: 'Weeks 5-6' },
    { skill: 'CI/CD Pipelines (GitHub Actions)', gapLevel: 'Low', priority: 'Bonus', weeks: 'Weeks 7-8' },
  ];

  const roadmapMilestones = [
    {
      week: 1,
      title: 'Weeks 1–2: Advanced Backend Architecture & Indexing',
      status: 'in-progress',
      summary: 'Master database performance, composite indexing, and microservice communication.',
      deliverables: [
        'Design compound indexes in MongoDB for query sub-50ms execution',
        'Implement Redis caching layer for heavy read routes',
        'Build authenticated RESTful API with rate limiting and JWT rotation',
      ],
      resources: [
        { name: 'Database Indexing Blueprint', type: 'Guide' },
        { name: 'Node.js Microservices Lab', type: 'Repository' },
      ],
    },
    {
      week: 3,
      title: 'Weeks 3–4: Docker & Production Cloud Deployment',
      status: 'upcoming',
      summary: 'Bridge the critical containerization gap required by 84% of hiring partners.',
      deliverables: [
        'Write multi-stage Dockerfiles for React frontend & Node backend',
        'Configure docker-compose with MongoDB & Redis services',
        'Deploy production cluster to AWS ECS / Render with SSL',
      ],
      resources: [
        { name: 'Containerization 101 for Full Stack', type: 'Interactive Lab' },
        { name: 'Production Dockerfile Templates', type: 'Cheatsheet' },
      ],
    },
    {
      week: 5,
      title: 'Weeks 5–6: Frontend Performance & Automated Testing',
      status: 'upcoming',
      summary: 'Elevate frontend scores to 95+ and implement automated test coverage.',
      deliverables: [
        'Implement automated unit tests with Vitest / Jest (80%+ coverage)',
        'Optimize bundle size using React.lazy, dynamic imports, and Webpack split',
        'Profile rendering bottlenecks using Chrome DevTools Performance tab',
      ],
      resources: [
        { name: 'Modern React Testing Handbook', type: 'Article' },
        { name: 'Lighthouse 100/100 Checklist', type: 'Cheatsheet' },
      ],
    },
    {
      week: 7,
      title: 'Weeks 7–8: System Design & Multi-Round Mock Interviews',
      status: 'upcoming',
      summary: 'Simulate full-loop interview panels with PulseAI Interview Agent and senior mentors.',
      deliverables: [
        'Complete 4 technical coding mock sessions',
        'Practice High Level Design (HLD) for URL Shortener & E-Commerce Cart',
        'Refine STAR behavioral responses for leadership principles',
      ],
      resources: [
        { name: 'System Design Interview Cheatsheet', type: 'Guide' },
        { name: 'STAR Behavioral Framework', type: 'Template' },
      ],
    },
  ];

  const mockQuestions = {
    react: [
      {
        question: 'How does React 18 reconciliation work, and what strategies do you use to prevent unnecessary component re-renders?',
        role: 'Senior React Developer',
        difficulty: 'Medium-Hard',
        keywords: ['Fiber', 'Virtual DOM', 'React.memo', 'useMemo', 'useCallback', 'Diffing algorithm'],
        sampleGoodAnswer:
          'React uses the Fiber reconciliation engine to construct a work-in-progress tree. To prevent re-renders, I leverage React.memo with customized equality checks, wrap expensive computations with useMemo, and maintain stable function references using useCallback.',
      },
      {
        question: 'Explain the difference between optimistic UI updates and pessimistic UI updates in web platforms. When would you choose which?',
        role: 'Frontend Engineer',
        difficulty: 'Medium',
        keywords: ['Optimistic update', 'Rollback', 'Latency', 'Financial transactions'],
        sampleGoodAnswer:
          'Optimistic updates reflect state changes immediately before server confirmation to maximize perceived performance (ideal for likes, comments, upvotes). Pessimistic updates wait for server ACK (essential for payments and critical writes).',
      },
    ],
    backend: [
      {
        question: 'How do you handle race conditions and database deadlocks in a high-concurrency payment or ticket booking API?',
        role: 'Backend Platform Engineer',
        difficulty: 'Hard',
        keywords: ['ACID', 'Transactions', 'Optimistic Locking', 'Pessimistic Locking', 'Distributed Lock', 'Redis'],
        sampleGoodAnswer:
          'I use distributed locking (e.g. Redlock algorithm on Redis) alongside database-level optimistic locking with version fields. For critical ledger transactions, database isolation level SERIALIZABLE with retry backoffs ensures safety.',
      },
    ],
  };

  const currentQuestions = mockQuestions[selectedTopic] || mockQuestions.react;
  const activeQuestion = currentQuestions[currentQuestionIndex] || currentQuestions[0];

  const handleStepToggle = (weekNum) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(weekNum)) next.delete(weekNum);
      else next.add(weekNum);
      return next;
    });
    addToast('Milestone status updated in your PulseAI Career Roadmap!', 'success');
  };

  const handleEvaluateMock = () => {
    if (!candidateAnswer.trim() || candidateAnswer.length < 20) {
      addToast('Please type a more comprehensive technical answer before evaluating.', 'warning');
      return;
    }

    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        score: 89,
        strengths: [
          'Directly addressed the core architectural concept with clear terminology',
          'Mentioned appropriate performance trade-offs and mitigation strategies',
        ],
        improvements: [
          'Could explicitly mention time/space complexity or failure rollback strategies',
          'Include real-world production metrics from past project experience',
        ],
        idealAnswer: activeQuestion.sampleGoodAnswer,
      });
      addToast('PulseAI Interview Agent has completed evaluation!', 'success');
    }, 1800);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B251E] via-[#0E352B] to-[#041712] p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>PulseAI Career Acceleration Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AI Mock Interviews & Personalised Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
            Close your verified skill gaps with an 8-week structured roadmap, and sharpen your technical communication with interactive AI mock rounds.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-emerald-500/30 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-emerald-500 text-gray-950 shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" /> Career Roadmap
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mock-interview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'mock-interview'
                ? 'bg-emerald-500 text-gray-950 shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" /> AI Mock Interview
          </button>
        </div>
      </div>

      {/* TAB 1: CAREER ROADMAP & SKILL GAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8">
          {/* Skill Gap Matrix Card */}
          <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" /> Identified Skill Voids from PulseAI Diagnostics
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  High-demand competencies missing from your resume that top tech recruiters prioritize.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                4 Priority Areas Isolated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {skillGaps.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : item.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">{item.weeks}</span>
                  </div>
                  <h4 className="text-xs font-bold text-brand-navy line-clamp-1">{item.skill}</h4>
                  <p className="text-[11px] text-brand-muted">Targeted in roadmap milestones</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stepped 8-Week Roadmap */}
          <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-primary" /> 8-Week Personalised Placement Pathway
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Curated step-by-step technical milestones designed to boost your interview readiness to 90%+.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{completedSteps.size} of 4 Milestones Cleared</span>
              </div>
            </div>

            <div className="space-y-6">
              {roadmapMilestones.map((milestone, idx) => {
                const isCompleted = completedSteps.has(milestone.week);
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 space-y-4 ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-white border-brand-border hover:border-brand-primary/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleStepToggle(milestone.week)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-gray-300 text-transparent hover:border-emerald-600'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <div>
                          <h4 className={`text-sm sm:text-base font-bold ${isCompleted ? 'line-through text-gray-500' : 'text-brand-navy'}`}>
                            {milestone.title}
                          </h4>
                          <p className="text-xs text-brand-muted mt-0.5">{milestone.summary}</p>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isCompleted ? 'Completed ✓' : 'In Progress'}
                      </span>
                    </div>

                    {/* Deliverables List */}
                    <div className="pl-10 space-y-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Required Deliverables</span>
                      <ul className="space-y-1.5">
                        {milestone.deliverables.map((deliv, dIdx) => (
                          <li key={dIdx} className="text-xs text-brand-text flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div className="pl-10 flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold mr-1">Curated Resources:</span>
                      {milestone.resources.map((res, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-brand-navy text-[11px] font-semibold flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3 h-3 text-brand-primary" /> {res.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE AI MOCK INTERVIEW SIMULATOR */}
      {activeTab === 'mock-interview' && (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="rounded-3xl bg-white border border-brand-border p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-navy">Interactive AI Mock Round</h3>
                <p className="text-xs text-brand-muted">PulseAI Interview Agent evaluates technical depth & communication</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setCurrentQuestionIndex(0);
                  setEvaluationResult(null);
                  setCandidateAnswer('');
                }}
                className="text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-gray-300 text-gray-700 outline-none"
              >
                <option value="react">React & Modern Frontend</option>
                <option value="backend">Backend & System Design</option>
              </select>

              <Link to="/candidate/mock-interview">
                <Button variant="outline" size="sm" icon={Calendar} className="text-xs">
                  Schedule 1-on-1 Human Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </span>
                <span className="text-xs font-semibold text-gray-500">• {activeQuestion.role}</span>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Difficulty: {activeQuestion.difficulty}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-brand-navy leading-relaxed">
                "{activeQuestion.question}"
              </h3>
              <p className="text-xs text-brand-muted">
                Tip: Explain your architectural rationale, mention key methods/hooks, and provide an edge-case example.
              </p>
            </div>

            {/* Answer Input Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-navy">
                Your Answer (Explain in detail):
              </label>
              <textarea
                rows={5}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="e.g. In React 18, reconciliation is handled via the Fiber tree where work units are schedulable. To prevent re-renders, I leverage React.memo with customized equality comparisons..."
                className="w-full text-xs sm:text-sm p-4 rounded-2xl bg-gray-50 border border-brand-border outline-none focus:border-brand-primary focus:bg-white transition-all text-brand-navy resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-brand-muted">
                Keywords to address:{' '}
                {activeQuestion.keywords.slice(0, 3).map((kw, i) => (
                  <span key={i} className="font-semibold text-brand-navy mr-1.5 underline decoration-emerald-500">
                    {kw}
                  </span>
                ))}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleEvaluateMock}
                isLoading={isEvaluating}
                icon={Zap}
                className="px-6 font-bold"
              >
                Evaluate with PulseAI
              </Button>
            </div>
          </div>

          {/* AI Feedback & Evaluation Result */}
          {evaluationResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white border border-emerald-300 p-6 sm:p-8 shadow-subtle space-y-6"
            >
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xl">
                    {evaluationResult.score}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-navy">PulseAI Evaluation Score</h4>
                    <span className="text-xs text-emerald-700 font-semibold">Strong Technical Foundation Demonstrated</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentQuestionIndex + 1 < currentQuestions.length) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                      setCandidateAnswer('');
                      setEvaluationResult(null);
                    } else {
                      addToast('Mock interview round completed!', 'success');
                    }
                  }}
                  className="text-xs"
                >
                  Next Question →
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths in Your Response
                  </span>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {evaluationResult.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Opportunities to Elevate
                  </span>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {evaluationResult.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Model Ideal Answer */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                <span className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> Model Benchmark Answer:
                </span>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  {evaluationResult.idealAnswer}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerRoadmapPage;
