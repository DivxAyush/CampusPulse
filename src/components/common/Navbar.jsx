import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Sparkles,
  Building2,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  FileText,
  ShieldCheck,
  Compass,
  GraduationCap,
  Workflow,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Badge } from './Badge';
import { Logo } from './Logo';

export const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (role === 'company') return '/company/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo variant="image" size="sm" className="h-8" />

        {/* Desktop Navigation Links (hidden for admin since sidebar handles all navigation) */}
        {role !== 'admin' && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to={isAuthenticated && role === 'candidate' ? '/candidate/jobs' : '/jobs'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive('/jobs') || isActive('/candidate/jobs')
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-brand-text hover:text-brand-primary hover:bg-white/80'
              }`}
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive('/companies')
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-brand-text hover:text-brand-primary hover:bg-white/80'
              }`}
            >
              Companies
            </Link>
            <Link
              to="/ai-agents"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/ai-agents')
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-brand-text hover:text-brand-primary hover:bg-white/80'
              }`}
            >
              <Workflow className="w-3.5 h-3.5 text-brand-primary" />
              5 AI Agents
            </Link>
            <Link
              to="/pricing"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive('/pricing')
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-brand-text hover:text-brand-primary hover:bg-white/80'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/university/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/university/dashboard')
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-brand-text hover:text-brand-primary hover:bg-white/80'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-brand-primary" />
              University TPO
            </Link>
            <Link
              to={isAuthenticated && role === 'candidate' ? '/candidate/ai-analyzer' : '/jobs'}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-text hover:text-brand-primary hover:bg-white/80 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-brand-primary" />
              PulseAI Tools
            </Link>
            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive('/about')
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-brand-text hover:text-brand-primary hover:bg-white/80'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/help"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive('/contact') || isActive('/help')
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-brand-text hover:text-brand-primary hover:bg-white/80'
              }`}
            >
              Help & Support
            </Link>
          </nav>
        )}

        {/* Right CTA / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-lg border border-brand-border bg-white hover:border-brand-primary transition-all shadow-subtle cursor-pointer"
              >
                <div className="w-7 h-7 rounded-md overflow-hidden bg-brand-primary-light flex items-center justify-center text-brand-navy font-bold text-xs">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName?.charAt(0) || 'U'
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-brand-navy truncate max-w-[120px]">{user.fullName}</div>
                  <div className="text-[10px] text-brand-muted capitalize font-medium">{role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-brand-muted ml-1" />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-brand-border py-2 z-20"
                    >
                      <div className="px-4 py-2 border-b border-brand-border mb-1">
                        <div className="text-xs text-brand-muted font-medium">Signed in as</div>
                        <div className="text-sm font-bold text-brand-navy truncate">{user.email}</div>
                        <Badge variant="primary" size="sm" className="mt-1.5 capitalize">
                          {role} Account
                        </Badge>
                      </div>

                      {role !== 'admin' && (
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-primary-light hover:text-brand-navy transition-colors font-medium"
                        >
                          <Compass className="w-4 h-4 text-brand-primary" />
                          Dashboard
                        </Link>
                      )}

                      {role === 'candidate' && (
                        <>
                          <Link
                            to="/candidate/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-primary-light hover:text-brand-navy transition-colors font-medium"
                          >
                            <User className="w-4 h-4 text-brand-primary" />
                            My Profile
                          </Link>
                          <Link
                            to="/candidate/resumes"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-primary-light hover:text-brand-navy transition-colors font-medium"
                          >
                            <FileText className="w-4 h-4 text-brand-primary" />
                            My Resume
                          </Link>
                          <Link
                            to="/candidate/ai-analyzer"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-primary-light hover:text-brand-navy transition-colors font-medium"
                          >
                            <Sparkles className="w-4 h-4 text-brand-primary" />
                            PulseAI Analyzer
                          </Link>
                        </>
                      )}

                      {role === 'company' && (
                        <>
                          <Link
                            to="/company/jobs/create"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-primary-light hover:text-brand-navy transition-colors font-medium"
                          >
                            <PlusCircle className="w-4 h-4 text-brand-primary" />
                            Post a Job
                          </Link>
                          <Link
                            to="/company/applicants"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-primary-light hover:text-brand-navy transition-colors font-medium"
                          >
                            <User className="w-4 h-4 text-brand-primary" />
                            Applicants
                          </Link>
                        </>
                      )}

                      {role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-primary-light hover:text-brand-navy transition-colors font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-brand-primary" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-brand-border my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" icon={Briefcase}>
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <Link to={getDashboardLink()} className="p-2 rounded-xl bg-brand-primary-light text-brand-navy">
              <Compass className="w-5 h-5" />
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-brand-navy hover:bg-white transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-brand-border bg-white px-4 pt-2 pb-6 space-y-2 shadow-card"
          >
            {role !== 'admin' && (
              <>
                <Link
                  to={isAuthenticated && role === 'candidate' ? '/candidate/jobs' : '/jobs'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-text hover:bg-brand-primary-light"
                >
                  Find Jobs
                </Link>
                <Link
                  to="/companies"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-text hover:bg-brand-primary-light"
                >
                  Companies
                </Link>
                <Link
                  to="/ai-agents"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-text hover:bg-brand-primary-light"
                >
                  5 AI Agents
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-text hover:bg-brand-primary-light"
                >
                  Pricing
                </Link>
                <Link
                  to="/university/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-text hover:bg-brand-primary-light"
                >
                  University TPO Dashboard
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-text hover:bg-brand-primary-light"
                >
                  About Us
                </Link>
                <Link
                  to="/help"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-text hover:bg-brand-primary-light"
                >
                  Help & Support
                </Link>
              </>
            )}

            <div className="pt-3 border-t border-brand-border flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="md" onClick={handleLogout} className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">
                      Create Free Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
