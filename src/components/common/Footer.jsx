import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';

export const Footer = () => {
  const { isAuthenticated, role } = useAuth();
  const isRecruiter = isAuthenticated && role === 'company';

  return (
    <footer className="bg-brand-navy text-white pt-14 pb-10 border-t border-brand-navy-light">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-10 border-b border-brand-navy-light/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Logo variant="full" size="lg" isDark={true} />
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
              Smart Job Search. Better Opportunities.
            </p>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              Empowering technical professionals and hiring teams with intelligent matching and streamlined recruitment workflows.
            </p>
          </div>

          {/* Role-based Column: Recruiter links only when recruiter logged in, otherwise Candidate Hub */}
          {isRecruiter ? (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Recruiter Workspace</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link to="/company/dashboard" className="hover:text-brand-primary transition-colors">
                    Employer Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/company/jobs" className="hover:text-brand-primary transition-colors">
                    Manage Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/company/jobs/create" className="hover:text-brand-primary transition-colors">
                    Post a Job Opening
                  </Link>
                </li>
                <li>
                  <Link to="/company/applicants" className="hover:text-brand-primary transition-colors">
                    Candidate Applicants
                  </Link>
                </li>
                <li>
                  <Link to="/company/interviews" className="hover:text-brand-primary transition-colors">
                    Interview Schedules
                  </Link>
                </li>
                <li>
                  <Link to="/company/profile" className="hover:text-brand-primary transition-colors">
                    Company Profile
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Candidate Hub</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link
                    to={isAuthenticated && role === 'candidate' ? '/candidate/jobs' : '/jobs'}
                    className="hover:text-brand-primary transition-colors"
                  >
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/companies" className="hover:text-brand-primary transition-colors">
                    Company Directory
                  </Link>
                </li>
                <li>
                  <Link to="/candidate/ai-analyzer" className="hover:text-brand-primary transition-colors">
                    PulseAI Resume Analyzer
                  </Link>
                </li>
                <li>
                  <Link to="/candidate/resumes" className="hover:text-brand-primary transition-colors">
                    Resume Vault
                  </Link>
                </li>
                <li>
                  <Link to="/candidate/applications" className="hover:text-brand-primary transition-colors">
                    Application Tracker
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Company & Support</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/about" className="hover:text-brand-primary transition-colors">
                  About Campus Plus
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-primary transition-colors">
                  Help & Support Center
                </Link>
              </li>
              <li className="pt-1 text-gray-300 font-medium">
                <a href="tel:+919878543210" className="hover:text-brand-primary transition-colors">
                  📞 +91 9878543210
                </a>
              </li>
              <li className="text-[11px] text-gray-400 leading-relaxed">
                📍 Jaypee Aman N5-601, Sector 151, Greater Noida, UP
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright (Privacy, Terms, Conditions, ISO completely removed) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} Campus Plus. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
