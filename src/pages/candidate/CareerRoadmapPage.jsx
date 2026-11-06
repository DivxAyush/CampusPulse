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
  Mic,
  Award,
  AlertCircle,
  Play,
  RotateCcw,
  Zap,
  Layers,
  ChevronRight,
  Calendar,
  Check,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart,
  Briefcase,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const CareerRoadmapPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'mock-interview'
  const [selectedDomain, setSelectedDomain] = useState('marketing'); // 'marketing' | 'finance' | 'hr'

  // Roadmap Progress State
  const [completedSteps, setCompletedSteps] = useState(new Set([1]));

  // Mock Interview State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Domain Configurations
  const domainData = {
    marketing: {
      name: 'Marketing & Brand Strategy',
      icon: Target,
      color: 'purple',
      badge: 'High Growth Domain',
      skillGaps: [
        { skill: 'Performance Marketing & Multi-Channel ROAS', gapLevel: 'High', priority: 'Urgent', weeks: 'Weeks 1–2' },
        { skill: 'Conversion Rate Optimization (CRO & GA4)', gapLevel: 'High', priority: 'Urgent', weeks: 'Weeks 3–4' },
        { skill: 'Go-To-Market (GTM) Strategy & Positioning', gapLevel: 'Medium', priority: 'Priority', weeks: 'Weeks 5–6' },
        { skill: 'Retention Marketing & CRM Automation (HubSpot)', gapLevel: 'Low', priority: 'Recommended', weeks: 'Weeks 7–8' },
      ],
      milestones: [
        {
          week: 1,
          title: 'Weeks 1–2: Performance Marketing & Paid Acquisition',
          summary: 'Master campaign scaling, Meta & Google Ads optimization, and CAC:LTV economics.',
          deliverables: [
            'Audit multi-channel paid acquisition campaigns and diagnose CAC creep',
            'Construct audience segmentation funnels across Top of Funnel (TOFU) and Bottom of Funnel (BOFU)',
            'Formulate ROAS attribution models accounting for 7-day click / 1-day view windows',
          ],
          resources: [
            { name: 'Meta & Google Ads Scaling Playbook', type: 'Framework' },
            { name: 'CAC:LTV Optimization Spreadsheet', type: 'Template' },
          ],
        },
        {
          week: 3,
          title: 'Weeks 3–4: Marketing Analytics & Conversion Rate Optimization (CRO)',
          summary: 'Bridge the data attribution gap with GA4, Mixpanel, and landing page A/B tests.',
          deliverables: [
            'Set up event tracking and custom conversion funnels in Google Analytics 4',
            'Design and execute A/B split tests on checkout and signup pages',
            'Calculate statistical significance and lift metrics for landing page variations',
          ],
          resources: [
            { name: 'CRO & Funnel Diagnostics Handbook', type: 'Guide' },
            { name: 'GA4 Event Tagging Matrix', type: 'Cheatsheet' },
          ],
        },
        {
          week: 5,
          title: 'Weeks 5–6: Brand Positioning & Product Marketing Strategy',
          summary: 'Craft differentiated value propositions, customer persona maps, and GTM plans.',
          deliverables: [
            'Build ideal customer profiles (ICPs) and competitive positioning battlecards',
            'Draft comprehensive Go-To-Market (GTM) launch schedule for a new product tier',
            'Conduct customer voice analysis to refine messaging hierarchy',
          ],
          resources: [
            { name: 'B2B & B2C Product Positioning Framework', type: 'Guide' },
            { name: 'GTM Launch Template', type: 'Template' },
          ],
        },
        {
          week: 7,
          title: 'Weeks 7–8: Executive Pitch & CMO Panel Mock Interviews',
          summary: 'Simulate high-stakes marketing case presentations and behavioral leadership panels.',
          deliverables: [
            'Complete 3 marketing case study rounds on product turnaround & crisis PR',
            'Present a ₹50 Lakh annual marketing budget allocation exercise',
            'Refine STAR behavioral responses for growth leadership roles',
          ],
          resources: [
            { name: 'CMO Case Study Interview Handbook', type: 'Guide' },
            { name: 'Budget Allocation Modeling Template', type: 'Template' },
          ],
        },
      ],
      mockQuestions: [
        {
          question:
            'How do you calculate the Customer Lifetime Value (LTV) to Customer Acquisition Cost (CAC) ratio, and what strategic interventions would you deploy if CAC jumps by 40% in paid digital channels?',
          role: 'Performance Marketing Lead / Growth Manager',
          difficulty: 'Advanced',
          keywords: ['LTV:CAC Ratio', 'Retention Rate', 'Payback Period', 'Ad Fatigue', 'Organic Flywheel', 'Referral Loops'],
          sampleGoodAnswer:
            'LTV:CAC is calculated as (Customer Value * Average Lifespan * Gross Margin) / Total Acquisition Spend. If CAC surges by 40%, I would diagnose ad fatigue and creative saturation, re-allocate budget to retargeting high-intent segments, refine audience exclusions, and activate organic retention flywheels like referral loops to lower blended CAC.',
        },
        {
          question:
            'Walk me through a 90-day Go-To-Market (GTM) launch plan for a premium consumer product entering a saturated market.',
          role: 'Product Marketing Manager (PMM)',
          difficulty: 'Comprehensive',
          keywords: ['Positioning', 'Beta Cohort', 'Influencer Seeding', 'Channel Mix', 'North Star Metric', 'Post-Launch Retention'],
          sampleGoodAnswer:
            'Day 1-30 focuses on ICP validation, competitive battlecards, and private beta seeding. Day 31-60 drives buzz with exclusive influencer gifting, PR coverage, and search intent capture. Day 61-90 scales multi-channel performance ads while tracking Day-30 retention and cohort NPS as primary health indicators.',
        },
      ],
    },
    finance: {
      name: 'Finance & Investment Banking',
      icon: DollarSign,
      color: 'emerald',
      badge: 'High CTC Domain',
      skillGaps: [
        { skill: '3-Statement Financial Modeling & LBO', gapLevel: 'High', priority: 'Urgent', weeks: 'Weeks 1–2' },
        { skill: 'DCF Valuation & WACC Sensitivity Analysis', gapLevel: 'High', priority: 'Urgent', weeks: 'Weeks 3–4' },
        { skill: 'Financial Statement Analysis & Capital Budgeting', gapLevel: 'Medium', priority: 'Priority', weeks: 'Weeks 5–6' },
        { skill: 'M&A Deal Structuring & Due Diligence', gapLevel: 'Low', priority: 'Recommended', weeks: 'Weeks 7–8' },
      ],
      milestones: [
        {
          week: 1,
          title: 'Weeks 1–2: 3-Statement Financial Modeling & Projections',
          summary: 'Build dynamic linked Income Statement, Balance Sheet, and Cash Flow models.',
          deliverables: [
            'Construct integrated 5-year financial statement forecast in Excel',
            'Model working capital schedules, depreciation waterfalls, and debt amortization',
            'Handle circular references with dynamic interest expense toggles',
          ],
          resources: [
            { name: 'Wall Street 3-Statement Modeling Template', type: 'Excel Model' },
            { name: 'Working Capital Mechanics Guide', type: 'Handbook' },
          ],
        },
        {
          week: 3,
          title: 'Weeks 3–4: Valuation Methodologies (DCF, Comps, Precedents)',
          summary: 'Master intrinsic and relative valuation frameworks used by investment banks.',
          deliverables: [
            'Calculate Weighted Average Cost of Capital (WACC) with CAPM and debt weighting',
            'Model Unlevered Free Cash Flow (UFCF) and Terminal Value via Gordon Growth & Exit Multiple',
            'Run 2-variable sensitivity tables on WACC vs Terminal Growth Rate',
          ],
          resources: [
            { name: 'DCF Valuation Architecture Blueprint', type: 'Excel Model' },
            { name: 'Trading Comps Valuation Matrix', type: 'Guide' },
          ],
        },
        {
          week: 5,
          title: 'Weeks 5–6: Corporate Finance & Capital Structure Optimization',
          summary: 'Evaluate debt vs equity financing, dividend policy, and capital budgeting.',
          deliverables: [
            'Analyze NPV and IRR for competing multi-crore capital expenditure proposals',
            'Evaluate optimal debt-to-equity ratios and interest coverage thresholds',
            'Draft credit committee risk summary for syndicated loan issuance',
          ],
          resources: [
            { name: 'Capital Budgeting Decision Matrix', type: 'Template' },
            { name: 'Corporate Credit Analysis Guide', type: 'Handbook' },
          ],
        },
        {
          week: 7,
          title: 'Weeks 7–8: Investment Banking Panel Mocks & Pitch Presentations',
          summary: 'Defend M&A transaction pitches and answer rapid-fire financial accounting questions.',
          deliverables: [
            'Pitch a strategic buy-side acquisition case for a consumer tech firm',
            'Clear 3 rapid-fire accounting interview rounds on working capital adjustments',
            'Complete LBO paper modeling exercise in under 45 minutes',
          ],
          resources: [
            { name: 'Investment Banking 400 Questions Guide', type: 'Handbook' },
            { name: 'Paper LBO Cheat Sheet', type: 'Template' },
          ],
        },
      ],
      mockQuestions: [
        {
          question:
            'Walk me through a Discounted Cash Flow (DCF) model from Free Cash Flow to Enterprise Value. How do you derive WACC and determine Terminal Value?',
          role: 'Investment Banking Analyst / Financial Advisory',
          difficulty: 'Advanced',
          keywords: ['UFCF', 'EBIT(1-t)', 'CapEx', 'WACC', 'Cost of Equity', 'Gordon Growth', 'Enterprise Value'],
          sampleGoodAnswer:
            'I project Unlevered Free Cash Flow: EBIT*(1 - Tax Rate) + D&A - CapEx - Change in Net Working Capital. Next, I discount UFCF using WACC, where Cost of Equity is calculated via CAPM: Rf + Beta*(Rm - Rf). Terminal Value is calculated using Gordon Growth Rate or Exit Multiple method, then discounted back to present value. Summing the PV of discrete cash flows and PV of Terminal Value yields Enterprise Value.',
        },
        {
          question:
            'If Depreciation increases by ₹10 Crore, walk me through how this impacts all three financial statements step-by-step, assuming a 30% tax rate.',
          role: 'Corporate Finance Specialist / Equity Research',
          difficulty: 'Core Accounting',
          keywords: ['Income Statement', 'Operating Cash Flow', 'Balance Sheet', 'Tax Shield', 'Retained Earnings'],
          sampleGoodAnswer:
            '1. Income Statement: Operating Income drops by ₹10 Cr. With a 30% tax rate, net income decreases by ₹7 Cr. 2. Cash Flow Statement: Net income is down ₹7 Cr, but Depreciation is added back as a non-cash expense (+₹10 Cr), so Cash from Operations increases by ₹3 Cr. 3. Balance Sheet: Cash increases by ₹3 Cr, PP&E drops by ₹10 Cr due to accumulated depreciation, so Assets decline by ₹7 Cr. On the Liabilities & Equity side, Retained Earnings decrease by ₹7 Cr, keeping the Balance Sheet perfectly balanced.',
        },
      ],
    },
    hr: {
      name: 'Human Resources (HR) & People Analytics',
      icon: Users,
      color: 'blue',
      badge: 'Core Corporate Domain',
      skillGaps: [
        { skill: 'People Analytics & Predictive Attrition Modeling', gapLevel: 'High', priority: 'Urgent', weeks: 'Weeks 1–2' },
        { skill: 'HRIS Platforms & Talent Workflow Automation', gapLevel: 'High', priority: 'Urgent', weeks: 'Weeks 3–4' },
        { skill: 'Compensation Benchmarking & Total Rewards (P50/P75)', gapLevel: 'Medium', priority: 'Priority', weeks: 'Weeks 5–6' },
        { skill: 'Labor Compliance, POSH & Industrial Relations', gapLevel: 'Low', priority: 'Recommended', weeks: 'Weeks 7–8' },
      ],
      milestones: [
        {
          week: 1,
          title: 'Weeks 1–2: People Analytics & Attrition Diagnostics',
          summary: 'Use workforce data to isolate attrition drivers and compute quality-of-hire metrics.',
          deliverables: [
            'Construct executive HR dashboard in Tableau / Excel tracking voluntary vs involuntary attrition',
            'Model correlation between manager tenure, appraisal ratings, and retention risk',
            'Formulate 9-Box Grid talent assessment matrix for succession planning',
          ],
          resources: [
            { name: 'People Analytics Metrics Framework', type: 'Handbook' },
            { name: '9-Box Talent Calibration Matrix', type: 'Template' },
          ],
        },
        {
          week: 3,
          title: 'Weeks 3–4: Modern Talent Acquisition & Sourcing Funnels',
          summary: 'Optimize time-to-fill, cost-per-hire, and employer branding campaigns.',
          deliverables: [
            'Design multi-stage technical screening pipeline reducing time-to-hire by 25%',
            'Develop campus recruitment drive rubrics ensuring diversity & inclusion parity',
            'Build candidate engagement nurture sequences using modern ATS/CRM tooling',
          ],
          resources: [
            { name: 'End-to-End Talent Sourcing Guide', type: 'Playbook' },
            { name: 'Candidate Experience Rubric', type: 'Template' },
          ],
        },
        {
          week: 5,
          title: 'Weeks 5–6: Compensation, Benefits & Total Rewards Architecture',
          summary: 'Master percentile benchmarking (P50/P75), ESOP vesting, and annual appraisal cycles.',
          deliverables: [
            'Build salary band ranges with compa-ratio calibrations across seniority levels',
            'Design performance-linked incentive (PLI) bonus structure aligned with business KPIs',
            'Calculate ESOP pool dilution and 4-year vesting schedules with 1-year cliff',
          ],
          resources: [
            { name: 'Compensation Benchmarking Framework', type: 'Excel Model' },
            { name: 'Total Rewards & Benefits Guide', type: 'Handbook' },
          ],
        },
        {
          week: 7,
          title: 'Weeks 7–8: Strategic HRBP Case Presentations & Grievance Scenarios',
          summary: 'Handle employee relations, labor code compliance, and cultural integration challenges.',
          deliverables: [
            'Resolve simulated workplace dispute and POSH complaint investigation protocol',
            'Present change management strategy for organizational restructuring',
            'Demonstrate STAR competency behavioral responses for HR leadership roles',
          ],
          resources: [
            { name: 'HRBP Case Study Interview Toolkit', type: 'Guide' },
            { name: 'Workplace Investigation Checklist', type: 'Handbook' },
          ],
        },
      ],
      mockQuestions: [
        {
          question:
            'How would you design a data-backed talent retention strategy in a high-growth startup experiencing an annual voluntary attrition rate of 28% across critical departments?',
          role: 'HR Business Partner (HRBP) / Talent Lead',
          difficulty: 'Strategic HR',
          keywords: ['Attrition Drivers', 'Stay Interviews', 'Compa-Ratio', 'Career Lattice', 'Manager Effectiveness', 'eNPS'],
          sampleGoodAnswer:
            'First, I conduct cohort attrition analysis to pinpoint whether turnover is concentrated in specific tenures (e.g. 12-18 months) or under specific managers. Next, I benchmark compa-ratios to ensure fair compensation bands, implement quarterly stay interviews with high-potentials, and introduce clear dual-track career ladders (IC vs Management) to eliminate career stagnation.',
        },
        {
          question:
            'Explain how you establish market-competitive compensation bands using market percentile benchmarking (P50 / P75), and how you resolve compensation compression during aggressive lateral hiring.',
          role: 'Compensation & Benefits (Total Rewards) Specialist',
          difficulty: 'Technical HR',
          keywords: ['Compa-Ratio', 'P50/P75 Benchmarking', 'Salary Bands', 'Compression', 'Market Adjustments', 'Pay Equity'],
          sampleGoodAnswer:
            'I establish midpoint targets based on market surveys (e.g. Aon, Mercer) aligning with company philosophy—targeting P75 for mission-critical revenue roles and P50 for operational roles. To resolve compensation compression where new hires earn more than tenured top performers, I perform internal pay equity audits and grant off-cycle equity grants or market corrections to tenured performers with high appraisal scores.',
        },
      ],
    },
  };

  const currentDomainInfo = domainData[selectedDomain] || domainData.marketing;
  const currentQuestions = currentDomainInfo.mockQuestions;
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
    if (!candidateAnswer.trim() || candidateAnswer.length < 25) {
      addToast('Please type a more comprehensive professional response before evaluating.', 'warning');
      return;
    }

    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        score: 91,
        strengths: [
          'Directly addressed the core strategic dilemma with industry-standard terminology',
          'Demonstrated clear understanding of quantitative trade-offs and organizational impact',
        ],
        improvements: [
          'Could explicitly mention ROI attribution formulas or real stakeholder communication nuances',
          'Add a metric-driven example from your past internship or academic project',
        ],
        idealAnswer: activeQuestion.sampleGoodAnswer,
      });
      addToast('PulseAI Interview Agent has completed domain evaluation!', 'success');
    }, 1800);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B251E] via-[#0E352B] to-[#041712] p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>PulseAI Career Acceleration • Business & Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AI Mock Interviews & Personalised Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
            Close your domain skill gaps across <strong>Marketing</strong>, <strong>Finance</strong>, and <strong>Human Resources</strong>. Practice case study mocks and follow structured 8-week career roadmaps.
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

      {/* Domain Selection Pills (Marketing, Finance, HR) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-brand-border shadow-subtle">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
          <Briefcase className="w-4 h-4 text-brand-primary" />
          <span>Select Your Target Specialization:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDomain('marketing');
              setCurrentQuestionIndex(0);
              setEvaluationResult(null);
              setCandidateAnswer('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              selectedDomain === 'marketing'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Marketing & Brand Strategy
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedDomain('finance');
              setCurrentQuestionIndex(0);
              setEvaluationResult(null);
              setCandidateAnswer('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              selectedDomain === 'finance'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Finance & Investment Banking
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedDomain('hr');
              setCurrentQuestionIndex(0);
              setEvaluationResult(null);
              setCandidateAnswer('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              selectedDomain === 'hr'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Human Resources (HR)
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
                  <AlertCircle className="w-5 h-5 text-amber-500" /> Isolated {currentDomainInfo.name} Skill Voids
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Core competencies prioritized by corporate recruiters hiring for top management roles.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                4 Priority Areas Isolated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentDomainInfo.skillGaps.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : item.priority === 'Priority'
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
                  <Compass className="w-5 h-5 text-brand-primary" /> 8-Week Pathway for {currentDomainInfo.name}
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Step-by-step business case deliverables designed to prepare you for premier corporate placement rounds.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{completedSteps.size} of 4 Milestones Cleared</span>
              </div>
            </div>

            <div className="space-y-6">
              {currentDomainInfo.milestones.map((milestone, idx) => {
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
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-navy">Interactive AI Mock Round ({currentDomainInfo.name})</h3>
                <p className="text-xs text-brand-muted">PulseAI Interview Agent evaluates strategic depth, metrics, and STAR clarity</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/candidate/mock-interview">
                <Button variant="outline" size="sm" icon={Calendar} className="text-xs">
                  Schedule 1-on-1 Panel Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
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
                Tip: Structure your response with clear business frameworks, mention metrics/ratios, and justify your strategic rationale.
              </p>
            </div>

            {/* Answer Input Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-navy">
                Your Professional Response (Explain your methodology in detail):
              </label>
              <textarea
                rows={5}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Type your structured answer here. Include business frameworks, metric calculations, and real-world project context..."
                className="w-full text-xs sm:text-sm p-4 rounded-2xl bg-gray-50 border border-brand-border outline-none focus:border-brand-primary focus:bg-white transition-all text-brand-navy resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-brand-muted">
                Key concepts to emphasize:{' '}
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
                    <h4 className="text-base font-bold text-brand-navy">PulseAI Strategic Assessment Score</h4>
                    <span className="text-xs text-emerald-700 font-semibold">Ready for Corporate Leadership Rounds</span>
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
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> Model Benchmark Response:
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
