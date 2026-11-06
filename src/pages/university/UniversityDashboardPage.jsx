import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Building2,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Download,
  Filter,
  Sparkles,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Briefcase,
  DollarSign,
  Target,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const UniversityDashboardPage = () => {
  const [selectedDept, setSelectedDept] = useState('All Business & Commerce Domains');

  const placementStats = {
    totalStudents: 720,
    placedStudents: 598,
    placementRate: 83.1,
    avgPackage: '₹14.2 LPA',
    highestPackage: '₹38.5 LPA',
    medianPackage: '₹12.0 LPA',
    activeDrives: 32,
    participatingCompanies: 84,
  };

  const domainBreakdown = [
    { domain: 'Marketing & Brand Strategy', placed: '86%', students: 260, avgCtc: '₹14.8 LPA', topHiring: 'HUL, P&G, Zepto, Amazon' },
    { domain: 'Finance & Investment Banking', placed: '84%', students: 240, avgCtc: '₹16.2 LPA', topHiring: 'Deloitte, ICICI, Goldman, KPMG' },
    { domain: 'Human Resources (HR) & Talent Ops', placed: '81%', students: 140, avgCtc: '₹12.5 LPA', topHiring: 'PwC, Tata Steel, Reliance, ITC' },
    { domain: 'Business Analytics & Strategy', placed: '88%', students: 80, avgCtc: '₹15.4 LPA', topHiring: 'McKinsey, Bain, EY, Cognizant' },
  ];

  const skillGaps = [
    { domain: 'Finance', skill: 'Advanced Financial Modeling & DCF Valuation', campusProficiency: 42, marketDemand: 88, gap: -46, priority: 'critical', action: 'Financial Modeling Bootcamp' },
    { domain: 'Marketing', skill: 'Performance Marketing & Multi-Channel ROAS Attribution', campusProficiency: 39, marketDemand: 85, gap: -46, priority: 'critical', action: 'Meta/Google Ads Lab' },
    { domain: 'HR', skill: 'People Analytics & HRIS Platforms (Workday / Darwinbox)', campusProficiency: 34, marketDemand: 78, gap: -44, priority: 'critical', action: 'HRIS Analytics Workshop' },
    { domain: 'Finance', skill: 'Financial Statement Analysis & Capital Budgeting', campusProficiency: 52, marketDemand: 84, gap: -32, priority: 'warning', action: 'Equity Valuation Masterclass' },
    { domain: 'HR', skill: 'Talent Acquisition & Compensation Benchmarking', campusProficiency: 65, marketDemand: 86, gap: -21, priority: 'warning', action: 'Executive Search Simulation' },
    { domain: 'Marketing', skill: 'Brand Strategy, Product Positioning & Go-To-Market', campusProficiency: 84, marketDemand: 86, gap: -2, priority: 'good', action: 'On Track (Exceeds Target)' },
  ];

  const campusDrives = [
    { company: 'Hindustan Unilever (HUL)', logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop&q=80', role: 'Management Trainee - Brand & Marketing', domain: 'Marketing', package: '₹24 - ₹30 LPA', eligible: 180, status: 'Final Panel Interviews', date: 'Tomorrow, 09:30 AM' },
    { company: 'Deloitte', logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop&q=80', role: 'Associate Consultant - Financial Advisory', domain: 'Finance', package: '₹18 - ₹24 LPA', eligible: 210, status: 'Case Study Round', date: '12 Nov 2026' },
    { company: 'PwC India', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&q=80', role: 'Human Capital & HR Advisory Associate', domain: 'HR', package: '₹15 - ₹19 LPA', eligible: 115, status: 'Group Discussion', date: '14 Nov 2026' },
    { company: 'ICICI Bank', logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop&q=80', role: 'Management Trainee - Wealth & Corporate Banking', domain: 'Finance', package: '₹16 - ₹21 LPA', eligible: 240, status: 'Shortlisting Open', date: '16 Nov 2026' },
    { company: 'Tata Steel', logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&q=80', role: 'Assistant Manager - Human Resources (HRBP)', domain: 'HR', package: '₹14 - ₹18 LPA', eligible: 95, status: 'Technical HR Rounds', date: '18 Nov 2026' },
    { company: 'Zepto', logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&q=80', role: 'Growth & Performance Marketing Specialist', domain: 'Marketing', package: '₹17 - ₹23 LPA', eligible: 160, status: 'Campaign Strategy Round', date: '20 Nov 2026' },
  ];

  return (
    <div className="w-full bg-[#FAFCFB] min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-[1680px] mx-auto space-y-8">
        {/* Top Header - Perfect Balanced Grid */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200/80 pb-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>TPO Intelligence Hub • Powered by PulseAI TPO Agent</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B251E] tracking-tight">
              University Placement & Cohort Employability Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Apex School of Management & Commerce • Batch of 2025–2026 (Marketing, Finance & HR Cohorts)
            </p>
          </div>

          {/* Right Toolbar Controls - Consistent h-10 alignment in single horizontal row */}
          <div className="flex flex-row items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-semibold h-10 px-3.5 rounded-xl bg-white border border-gray-300 text-gray-700 outline-none shadow-xs hover:border-gray-400 focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option>All Business & Commerce Domains</option>
              <option>Marketing & Brand Management</option>
              <option>Finance & Corporate Banking</option>
              <option>Human Resources (HR) & People Analytics</option>
              <option>Business Strategy & Analytics</option>
            </select>

            <Button
              variant="outline"
              size="md"
              icon={Download}
              onClick={() => window.print()}
              className="text-xs font-bold h-10 px-4 whitespace-nowrap bg-white hover:bg-gray-50 shadow-xs"
            >
              Export TPO Cohort Report
            </Button>
          </div>
        </div>

        {/* 4 Key Stat Cards - Unified height & spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-subtle flex flex-col justify-between h-full space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Placement Rate</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0B251E]">{placementStats.placementRate}%</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <span>↑ +14.6% YoY Placement Yield</span>
                <span className="text-gray-400">({placementStats.placedStudents}/{placementStats.totalStudents})</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-subtle flex flex-col justify-between h-full space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Average CTC Package</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0B251E]">{placementStats.avgPackage}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-1">
                Highest: <strong className="text-emerald-800 font-bold">{placementStats.highestPackage}</strong> • Median: {placementStats.medianPackage}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-subtle flex flex-col justify-between h-full space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Active Campus Drives</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0B251E]">{placementStats.activeDrives} Drives</div>
              <div className="text-[11px] text-gray-500 font-medium mt-1">
                From {placementStats.participatingCompanies} corporate hiring partners
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-subtle flex flex-col justify-between h-full space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Executive-Ready Tier</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0B251E]">84.6%</div>
              <div className="text-[11px] text-purple-700 font-semibold mt-1">
                Cleared PulseAI corporate readiness tests
              </div>
            </div>
          </div>
        </div>

        {/* Domain Cohort Placement Breakdown - Identical Card Heights */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B251E] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#159B79]" /> Domain Placement Breakdown: Marketing, Finance & HR
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Cohort performance and corporate placement yield across core business specializations.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
              Batch of 720 Candidates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {domainBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 flex flex-col justify-between h-full space-y-4 hover:border-emerald-400/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 min-h-[38px]">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider leading-snug line-clamp-2">
                    {item.domain}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold shrink-0 whitespace-nowrap">
                    {item.placed} Placed
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0B251E]">{item.avgCtc}</div>
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <div>Cohort: <strong className="text-gray-900 font-bold">{item.students} Students</strong></div>
                    <div className="text-[11px] text-gray-500 truncate" title={item.topHiring}>Key: {item.topHiring}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Skill-Gaps vs Industry Demand Table */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B251E] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Student Skill Gaps vs. Industry Demand
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Benchmarked against active recruiter criteria for Marketing, Corporate Finance, and HR positions.
              </p>
            </div>
            <span className="text-xs text-gray-400 font-mono">Calibrated via PulseAI Skill-Gap Agent</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs bg-white">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Competency / Skill Area</th>
                  <th className="py-3 px-4 text-center">Campus Proficiency</th>
                  <th className="py-3 px-4 text-center">Market Demand</th>
                  <th className="py-3 px-4 text-center">Net Deficit</th>
                  <th className="py-3 px-4 text-right">TPO Recommended Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {skillGaps.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.domain === 'Marketing'
                            ? 'bg-purple-100 text-purple-800'
                            : item.domain === 'Finance'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.domain}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{item.skill}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-gray-700">{item.campusProficiency}%</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-gray-700">{item.marketDemand}%</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          item.gap <= -30
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : item.gap < 0
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.gap > 0 ? `+${item.gap}%` : `${item.gap}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {item.gap <= -30 ? (
                        <span className="text-xs font-bold text-red-600">🚨 {item.action}</span>
                      ) : item.gap < 0 ? (
                        <span className="text-xs font-semibold text-amber-600">⚠️ {item.action}</span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600">✅ {item.action}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Campus Placement Drives */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B251E] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Active Corporate Recruitment Drives
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time tracking of corporate recruiters hiring for Marketing, Finance, and Human Resources.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campusDrives.map((d, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-emerald-400/60 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={d.logo}
                    alt={d.company}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                        d.domain === 'Marketing'
                          ? 'bg-purple-100 text-purple-800'
                          : d.domain === 'Finance'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {d.domain}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0B251E] truncate">{d.role}</h4>
                    <p className="text-xs text-gray-500 font-semibold">{d.company}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-800">{d.package}</span>
                    <span className="block text-[10px] text-gray-400">{d.eligible} Eligible Candidates</span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white text-blue-700 border border-blue-200 shadow-2xs">
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboardPage;
