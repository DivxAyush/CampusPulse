import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, ShieldCheck, Sparkles, Users, Award, Briefcase, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AboutUsPage = () => {
  const values = [
    {
      title: 'AI Transparency & Precision',
      description: 'We believe candidate intelligence should be explainable. Our PulseAI scoring analyzes genuine achievements without fabricating false work history.',
      icon: Sparkles,
    },
    {
      title: 'Direct Recruiter Connections',
      description: 'Cutting out unneeded intermediaries. Candidates connect directly with engineering leads and hiring managers across vetted tech companies.',
      icon: Users,
    },
    {
      title: 'Continuous Career Elevation',
      description: 'Providing candidates with actionable diagnostics, quantifiable resume bullet suggestions, and skill gap roadmaps.',
      icon: Award,
    },
    {
      title: 'Privacy & Data Integrity',
      description: 'Enterprise-grade security standards with Cloudinary file isolation, role-based authorization, and protected contact information.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-16 py-10 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <Badge variant="primary" size="sm">
          About Campus Plus
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
          Architecting the future of software recruitment
        </h1>
        <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Campus Plus bridges the gap between ambitious developers and premier technology enterprises through verified job matching and PulseAI resume optimization.
        </p>
      </section>

      {/* Metrics Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-brand-navy rounded-3xl p-8 sm:p-12 text-white grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-card">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">12,500+</div>
            <div className="text-xs text-gray-300 mt-1 uppercase font-semibold">Candidates Placed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">850+</div>
            <div className="text-xs text-gray-300 mt-1 uppercase font-semibold">Partner Companies</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">94.8%</div>
            <div className="text-xs text-gray-300 mt-1 uppercase font-semibold">Interview Match Rate</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">3.2x</div>
            <div className="text-xs text-gray-300 mt-1 uppercase font-semibold">Faster Time to Hire</div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary-light flex items-center justify-center text-brand-primary">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy">Our Mission</h2>
          <p className="text-sm text-brand-text leading-relaxed">
            To eliminate hiring friction by empowering candidates with intelligent, real-time resume diagnostics and providing recruiters with high-signal candidate matching.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary-light flex items-center justify-center text-brand-primary">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy">Our Vision</h2>
          <p className="text-sm text-brand-text leading-relaxed">
            To be the most trusted recruitment ecosystem where talent discovery is driven strictly by demonstrable skills, engineering rigor, and continuous learning.
          </p>
        </div>
      </section>

      {/* Platform Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
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

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-brand-primary-light/60 border border-brand-primary/20 rounded-3xl p-8 sm:p-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Join Campus Plus Today</h2>
          <p className="text-sm text-brand-muted max-w-md mx-auto">
            Whether you are looking for your next engineering role or hiring world-class technical talent, we are here to support your journey.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/register">
              <Button variant="primary" size="md">
                Create Free Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="md">
                Browse Open Roles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
