import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, ShieldCheck, Sparkles, Users, Award, Briefcase, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const AboutUsPage = () => {
  const { isAuthenticated } = useAuth();

  const values = [
    {
      title: 'AI Transparency & Precision',
      description: 'We believe student evaluation should be explainable. Our Career AI scoring analyzes genuine academic and internship achievements without fabricating false data.',
      icon: Sparkles,
    },
    {
      title: 'Direct Corporate Connections',
      description: 'Cutting out intermediaries. Students connect directly with corporate recruiters and talent leaders across vetted enterprises in Management, Consulting, Marketing, and Analytics.',
      icon: Users,
    },
    {
      title: 'Continuous Career Elevation',
      description: 'Providing students with actionable resume diagnostics, mock interview feedback, and specialization-aligned skill roadmaps.',
      icon: Award,
    },
    {
      title: 'Privacy & Data Integrity',
      description: 'Enterprise-grade security standards with Cloudinary file isolation, role-based authorization, and protected student contact information.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-16 py-10 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <Badge variant="primary" size="sm">
          About IILM Career Platform
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
          Empowering Next-Generation Business & Management Leaders
        </h1>
        <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
          IILM University bridges the gap between ambitious students and premier corporate enterprises through verified placement matching, mock interviews, and career readiness optimization.
        </p>
      </section>

      {/* Metrics Banner */}
      <section className="w-full max-w-[1680px] mx-auto px-4 sm:px-6">
        <div className="bg-brand-navy rounded-3xl p-8 sm:p-12 text-white grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-card">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">12,500+</div>
            <div className="text-xs text-gray-300 mt-1 uppercase font-semibold">Students Placed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">850+</div>
            <div className="text-xs text-gray-300 mt-1 uppercase font-semibold">Corporate Partners</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">94.8%</div>
            <div className="text-xs text-gray-300 mt-1 uppercase font-semibold">Placement Match Rate</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">3.2x</div>
            <div className="text-xs text-gray-300 mt-1 uppercase font-semibold">Faster Campus Placements</div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary-light flex items-center justify-center text-brand-primary">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy">Our Mission</h2>
          <p className="text-sm text-brand-text leading-relaxed">
            To eliminate placement friction by empowering students with intelligent, real-time resume diagnostics and providing recruiters with high-caliber management talent.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary-light flex items-center justify-center text-brand-primary">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy">Our Vision</h2>
          <p className="text-sm text-brand-text leading-relaxed">
            To be the premier university placement ecosystem where career advancement is driven strictly by demonstrable business acumen, leadership rigor, and ethical practice.
          </p>
        </div>
      </section>

      {/* Platform Values */}
      <section className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Our Core Principles</h2>
          <p className="text-sm text-brand-muted mt-2">The standards that guide every algorithm and user interface we build</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-navy">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-muted mt-1.5 leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA - Only shown when user is not logged in */}
      {!isAuthenticated && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-brand-primary-light/60 border border-brand-primary/20 rounded-3xl p-8 sm:p-12 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Join IILM University Placement Network</h2>
            <p className="text-sm text-brand-muted max-w-md mx-auto">
              Whether you are an ambitious student preparing for campus placements or a corporate partner hiring top management talent, we are here to support your journey.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link to="/register">
                <Button variant="primary" size="md">
                  Create Student Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="md">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
