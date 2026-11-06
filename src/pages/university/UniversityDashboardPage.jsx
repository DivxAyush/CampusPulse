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
  FileSpreadsheet,
  Briefcase,
  DollarSign,
  PieChart,
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>TPO Intelligence Hub • Powered by PulseAI TPO Agent</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B251E] tracking-tight">
              University Placement & Cohort Employability Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Apex School of Management & Commerce • Batch of 2025–2026 (Marketing, Finance & HR Cohorts)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-gray-300 text-gray-700 outline-none shadow-xs"
            >
              <option>All Business & Commerce Domains</option>
              <option>Marketing & Brand Management</option>
              <option>Finance & Corporate Banking</option>
              <option>Human Resources (HR) & People Analytics</option>
              <option>Business Strategy & Analytics</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => window.print()}
              className="text-xs"
            >
              Export TPO Cohort Report
            </Button>
          </div>
        </div>

        {/* 4 Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Placement Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B251E]">{placementStats.placementRate}%</div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span>↑ +14.6% YoY Placement Yield</span>
              <span className="text-gray-400">({placementStats.placedStudents}/{placementStats.totalStudents} placed)</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Average CTC Package</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B251E]">{placementStats.avgPackage}</div>
            <div className="text-[11px] text-gray-500 font-medium">
              Highest: <strong className="text-emerald-800">{placementStats.highestPackage}</strong> • Median: {placementStats.medianPackage}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Campus Drives</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B251E]">{placementStats.activeDrives} Drives</div>
            <div className="text-[11px] text-gray-500 font-medium">
              From {placementStats.participatingCompanies} leading corporate partners
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Executive-Ready Tier</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B251E]">84.6%</div>
            <div className="text-[11px] text-purple-700 font-semibold">
              Cleared PulseAI corporate readiness tests
            </div>
          </div>
        </div>

        {/* Domain Cohort Placement Breakdown (Marketing, Finance, HR) */}
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
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              Batch of 720 Students
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domainBreakdown.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.domain}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                    {item.placed} Placed
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-[#0B251E]">{item.avgCtc}</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Cohort Size: <strong className="text-gray-900">{item.students} Candidates</strong></div>
                  <div className="text-[11px] text-gray-500">Key Recruiters: {item.topHiring}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Skill-Gaps vs Industry Demand (Marketing, Finance, HR) */}
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="pb-3">Domain</th>
                  <th className="pb-3">Competency / Skill Area</th>
                  <th className="pb-3 text-center">Campus Proficiency</th>
                  <th className="pb-3 text-center">Market Demand</th>
                  <th className="pb-3 text-center">Net Deficit</th>
                  <th className="pb-3 text-right">TPO Recommended Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {skillGaps.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                    <td className="py-3.5 font-bold text-gray-900">{item.skill}</td>
                    <td className="py-3.5 text-center font-semibold text-gray-700">{item.campusProficiency}%</td>
                    <td className="py-3.5 text-center font-semibold text-gray-700">{item.marketDemand}%</td>
                    <td className="py-3.5 text-center">
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
                    <td className="py-3.5 text-right font-medium">
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

        {/* Live Campus Placement Drives (Marketing, Finance, HR Top Recruiters) */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campusDrives.map((d, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={d.logo}
                    alt={d.company}
                    className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div>
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
                    <h4 className="text-xs sm:text-sm font-bold text-[#0B251E] line-clamp-1">{d.role}</h4>
                    <p className="text-xs text-gray-500 font-semibold">{d.company}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-800">{d.package}</span>
                    <span className="block text-[10px] text-gray-400">{d.eligible} Eligible Students</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-blue-700 border border-blue-200 shadow-2xs">
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
