import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-12 border-t border-brand-navy-light">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-brand-navy-light/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="full" size="lg" isDark={true} />
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
              Smart Job Search. Better Opportunities.
            </p>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Empowering ambitious graduates and software engineers with intelligent PulseAI-powered ATS diagnostics and high-growth opportunities.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-brand-primary border border-brand-primary/40">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Recruiter Network
              </span>
            </div>
          </div>

          {/* Column 1: Candidates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Candidates</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/jobs" className="hover:text-brand-primary transition-colors flex items-center gap-1">
                  Find Jobs <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/candidate/ai-analyzer" className="hover:text-brand-primary transition-colors flex items-center gap-1">
                  PulseAI Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/candidate/resumes" className="hover:text-brand-primary transition-colors">
                  Uploaded Resumes
                </Link>
              </li>
              <li>
                <Link to="/candidate/applications" className="hover:text-brand-primary transition-colors">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Companies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Recruiters</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/register" className="hover:text-brand-primary transition-colors flex items-center gap-1">
                  Employer Registration <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/company/jobs/create" className="hover:text-brand-primary transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link to="/company/applicants" className="hover:text-brand-primary transition-colors">
                  ATS Candidate Scoring
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-brand-primary transition-colors">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link to="/company/interviews" className="hover:text-brand-primary transition-colors">
                  Interview Scheduling
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-brand-primary transition-colors">
                  About Campus Plus
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-primary transition-colors">
                  Help & Contact Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-primary transition-colors">
                  Sign In to Account
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-primary transition-colors">
                  Create New Account
                </Link>
              </li>
              <li>
                <span className="text-xs text-gray-500">ISO 27001 & SOC-2 Ready</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} Campus Plus Technologies. All rights reserved. Built with React, Vite & Tailwind CSS.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
