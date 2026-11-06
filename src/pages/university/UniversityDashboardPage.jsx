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
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const UniversityDashboardPage = () => {
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const placementStats = {
    totalStudents: 840,
    placedStudents: 658,
    placementRate: 78.4,
    avgPackage: '₹11.8 LPA',
    highestPackage: '₹44.5 LPA',
    medianPackage: '₹9.5 LPA',
    activeDrives: 24,
    participatingCompanies: 68,
  };

  const skillGaps = [
    { skill: 'Docker & Cloud Containerization', campusProficiency: 38, marketDemand: 84, gap: -46, priority: 'critical' },
    { skill: 'Distributed System Design & Indexing', campusProficiency: 44, marketDemand: 80, gap: -36, priority: 'critical' },
    { skill: 'Automated Unit/E2E Testing (Jest, Cypress)', campusProficiency: 31, marketDemand: 65, gap: -34, priority: 'warning' },
    { skill: 'TypeScript & Type Safety', campusProficiency: 58, marketDemand: 82, gap: -24, priority: 'warning' },
    { skill: 'React.js & Frontend State Optimization', campusProficiency: 82, marketDemand: 86, gap: -4, priority: 'good' },
    { skill: 'RESTful APIs & Backend Architecture', campusProficiency: 89, marketDemand: 88, gap: 1, priority: 'good' },
  ];

  const campusDrives = [
    { company: 'Razorpay', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80', role: 'Full Stack SDE-1', package: '₹22 - ₹28 LPA', eligible: 240, status: 'Online Assessment', date: 'Tomorrow, 10:00 AM' },
    { company: 'PhonePe', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&q=80', role: 'Backend Platform Engineer', package: '₹24 - ₹32 LPA', eligible: 195, status: 'Technical Interviews', date: '12 Nov 2026' },
    { company: 'Zepto', logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&q=80', role: 'Frontend Engineer', package: '₹16 - ₹22 LPA', eligible: 310, status: 'Shortlisting Open', date: '15 Nov 2026' },
    { company: 'CRED', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80', role: 'Product Development Engineer', package: '₹26 - ₹36 LPA', eligible: 140, status: 'Final Round', date: '18 Nov 2026' },
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
              Apex Institute of Technology • Season 2025–2026 Cohort Analytics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-gray-300 text-gray-700 outline-none shadow-xs"
            >
              <option>All Departments</option>
              <option>Computer Science & Engineering (CSE)</option>
              <option>Information Technology (IT)</option>
              <option>Electronics & Communication (ECE)</option>
              <option>AI & Data Science (AIDS)</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => window.print()}
              className="text-xs"
            >
              Export TPO Report
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
              <span>↑ +12.3% vs previous year</span>
              <span className="text-gray-400">({placementStats.placedStudents}/{placementStats.totalStudents} placed)</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Average Package (CTC)</span>
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
              From {placementStats.participatingCompanies} verified recruiting partners
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200/90 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Interview-Ready Tier</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B251E]">82.4%</div>
            <div className="text-[11px] text-purple-700 font-semibold">
              PulseAI Score &gt;= 75 on verified ATS tests
            </div>
          </div>
        </div>

        {/* Employability Funnel & Readiness Distribution */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B251E] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#159B79]" /> Student Placement-Readiness Funnel
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Cohort diagnostic categorisation based on PulseAI ATS benchmark scoring and technical mock testing.
              </p>
            </div>
            <Badge variant="primary" size="sm">
              Batch of 2026
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tier 1 */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Tier 1: Interview Ready</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold">41%</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-950">345 Students</div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Scored 85+ on ATS benchmark tests. Immediate candidates for high-tier dream offers (₹18L+ LPA).
              </p>
            </div>

            {/* Tier 2 */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Tier 2: Minor Skill Gap</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] font-extrabold">45%</span>
              </div>
              <div className="text-3xl font-extrabold text-blue-950">382 Students</div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Scored 70–84. Strong core engineering foundation. Needs 2–3 weeks focused prep on system design and cloud deployments.
              </p>
            </div>

            {/* Tier 3 */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Tier 3: Critical Intervention</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold">14%</span>
              </div>
              <div className="text-3xl font-extrabold text-amber-950">113 Students</div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Scored below 70. Flagged for targeted remedial mock interviews, resume restructuring, and project building.
              </p>
            </div>
          </div>
        </div>

        {/* Student Skill-Gaps vs Market Demand Table */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B251E] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Student Skill Gaps vs. Industry Demand
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time gap detection based on active job requirements across top hiring companies vs. candidate profiles.
              </p>
            </div>
            <span className="text-xs text-gray-400 font-mono">Updated today via PulseAI Skill-Gap Agent</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="pb-3">Competency / Skill Area</th>
                  <th className="pb-3 text-center">Campus Proficiency</th>
                  <th className="pb-3 text-center">Market Demand</th>
                  <th className="pb-3 text-center">Net Gap</th>
                  <th className="pb-3 text-right">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {skillGaps.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 font-bold text-gray-900">{item.skill}</td>
                    <td className="py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                        <span>{item.campusProficiency}%</span>
                      </div>
                    </td>
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
                    <td className="py-3.5 text-right">
                      {item.gap <= -30 ? (
                        <span className="text-xs font-bold text-red-600">🚨 Mandatory Bootcamp</span>
                      ) : item.gap < 0 ? (
                        <span className="text-xs font-semibold text-amber-600">⚠️ Elective Workshop</span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600">✅ On Target</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Campus Recruitment Drives */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B251E] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Active & Upcoming Placement Drives
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time tracking of partner recruiter schedules, candidate eligibility, and assessment pipelines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campusDrives.map((d, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={d.logo}
                    alt={d.company}
                    className="w-11 h-11 rounded-xl object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#0B251E]">{d.role}</h4>
                    <p className="text-xs text-gray-500 font-semibold">{d.company} • <span className="text-emerald-700 font-bold">{d.package}</span></p>
                    <span className="text-[11px] text-gray-400">{d.eligible} Eligible Students • {d.date}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-blue-700 border border-blue-200 shadow-2xs">
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
