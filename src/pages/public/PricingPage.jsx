import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  GraduationCap,
  Building2,
  Users,
  Zap,
  Star,
  Gem,
  Cpu,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  School,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const PricingPage = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <div className="w-full bg-[#FAFCFB] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/80 pb-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B251E] tracking-tight">
              Simple, Flexible Pricing <br className="hidden sm:inline" />
              for <span className="text-[#159B79]">Every Stakeholder</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              One platform. Three stakeholders. A smarter placement ecosystem.
            </p>
          </div>

          {/* Stakeholder avatars visual */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-xs self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
              <GraduationCap className="w-3.5 h-3.5" /> Students
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100">
              <School className="w-3.5 h-3.5" /> Universities
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
              <Building2 className="w-3.5 h-3.5" /> Recruiters
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* 1. UNIVERSITIES */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white border border-emerald-300/80 p-6 sm:p-8 flex flex-col justify-between shadow-subtle relative hover:shadow-hover hover:border-emerald-500 transition-all duration-300"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B251E]">Universities</h3>
                  <span className="text-xs text-gray-500 font-medium">B2B SaaS Subscription</span>
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#159B79] tracking-tight">
                  ₹755 – ₹1,133
                </div>
                <div className="text-xs font-bold text-gray-500 mt-0.5">per student / year</div>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Placement analytics, skill-gap insights and placement-readiness intelligence.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Cohort-level analytics</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Student skill insights</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Placement funnel tracking</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/contact">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-2xl bg-[#0F382C] hover:bg-[#159B79] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  Request a Demo <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* 2. RECRUITERS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-white border border-blue-200 p-6 sm:p-8 flex flex-col justify-between shadow-subtle relative hover:shadow-hover hover:border-blue-400 transition-all duration-300"
          >
            {/* Top Tag */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 shadow-2xs">
              Pay Per Drive
            </div>

            <div className="space-y-5 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B251E]">Recruiters</h3>
                  <span className="text-xs text-gray-500 font-medium">Per Placement Drive</span>
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1A428A] tracking-tight">
                  ₹47,215+
                </div>
                <div className="text-xs font-bold text-gray-500 mt-0.5">Per Placement Drive</div>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Candidate matching, shortlist intelligence and recruitment workflow support.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Semantic candidate matching</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>AI-powered shortlisting</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Recruitment analytics</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/contact">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-2xl bg-[#1A385C] hover:bg-[#1A428A] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  Contact Sales <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* 3. STUDENTS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-white border border-purple-200 p-6 sm:p-8 flex flex-col justify-between shadow-subtle relative hover:shadow-hover hover:border-purple-400 transition-all duration-300"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B251E]">Students</h3>
                  <span className="text-xs text-gray-500 font-medium">Freemium + Credits</span>
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#4F39A8] tracking-tight">
                  Free to get started
                </div>
                <div className="text-xs font-bold text-gray-500 mt-0.5">Basic tools with usage credits</div>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Resume tools, skill-gap analysis and personalised learning paths.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Resume analysis</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Career roadmap</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Mock interviews</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/register">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-2xl bg-[#31236B] hover:bg-[#4F39A8] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* AI Credits for Students Breakdown */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-[#0B251E] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#159B79]" /> AI Credits for Students
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Access basic features for free, and unlock advanced AI tools with credits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Low Credit */}
            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-gray-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" /> Low Credit
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Resume parsing, profile updates and basic skill-gap analysis
              </p>
            </div>

            {/* Medium Credit */}
            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-gray-200/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider">
                <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" /> Medium Credit
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Detailed job matching and personalised learning plans
              </p>
            </div>

            {/* High Credit */}
            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-gray-200/80 space-y-2">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
                <Gem className="w-4 h-4 text-purple-600" /> High Credit
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Extended mock interviews and multi-round simulations
              </p>
            </div>
          </div>
        </div>

        {/* Cost Efficiency Accordion */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#0B251E]">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span>How Our AI Technology Stays Cost-Efficient</span>
                <span className="block text-xs font-normal text-gray-500 mt-0.5">
                  We use a smart mix of AI models and token-based pricing to deliver maximum value.
                </span>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isAccordionOpen ? 'rotate-180' : ''}`} />
          </button>

          {isAccordionOpen && (
            <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3 space-y-2 bg-gray-50/40">
              <p>
                By employing a hybrid multi-agent pipeline (lightweight semantic embeddings for parsing + large-scale Qwen 27B reasoning for deep mock interviews), CampusPulse AI eliminates unnecessary API compute overhead while maintaining enterprise-grade accuracy.
              </p>
              <p>
                University campus partners benefit from pooled cohort token caching, reducing recurrent inference costs by over 40% per placement cycle.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer & Footer Tagline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 border-t border-gray-200/80 pt-6">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[9px] font-bold">i</span>
            <span>All prices are proposed assumptions from our project and are subject to pilot validation. Not final market prices.</span>
          </div>
          <div className="font-medium text-gray-500">
            Built for a smarter, more skilled workforce • <strong className="text-gray-700 font-bold">CampusPulse AI</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
