import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Search, MapPin, Users, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const CompaniesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const companies = [
    {
      id: 'comp_01',
      name: 'Nexus Cloud Systems',
      slug: 'nexus-cloud-systems',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      industry: 'Enterprise Cloud & DevOps',
      location: 'Bengaluru, India',
      size: '250-500 employees',
      openJobsCount: 4,
      isVerified: true,
      description: 'Building next-generation Kubernetes orchestration platforms and developer productivity infrastructure for enterprise teams.',
    },
    {
      id: 'comp_02',
      name: 'FinPulse Technologies',
      slug: 'finpulse-technologies',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80',
      industry: 'Fintech & Digital Banking',
      location: 'Mumbai, India',
      size: '500-1000 employees',
      openJobsCount: 6,
      isVerified: true,
      description: 'Powering automated algorithmic payments, fraud detection, and instant UPI cross-border settlements across Southeast Asia.',
    },
    {
      id: 'comp_03',
      name: 'Zephyr AI Labs',
      slug: 'zephyr-ai-labs',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
      industry: 'Artificial Intelligence & ML',
      location: 'Hyderabad, India',
      size: '100-250 employees',
      openJobsCount: 3,
      isVerified: true,
      description: 'Pioneering multimodal foundation models and autonomous enterprise workflows with frontier machine learning architectures.',
    },
    {
      id: 'comp_04',
      name: 'Quantum Health Tech',
      slug: 'quantum-health-tech',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80',
      industry: 'Healthcare Technology',
      location: 'Pune, India',
      size: '150-300 employees',
      openJobsCount: 2,
      isVerified: true,
      description: 'Transforming clinical workflows, telehealth intelligence, and electronic health record accessibility for medical providers.',
    },
  ];

  const industries = ['All', 'Enterprise Cloud & DevOps', 'Fintech & Digital Banking', 'Artificial Intelligence & ML', 'Healthcare Technology'];

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <Badge variant="primary" size="sm">
          Employer Directory
        </Badge>
        <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">Verified Hiring Companies</h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          Explore premier organizations actively hiring engineers, product leaders, and developers through Campus Plus.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-subtle flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by company name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-bg/60 border border-brand-border rounded-xl pl-10 pr-4 py-2 text-sm text-brand-text outline-none focus:border-brand-primary focus:bg-white transition-all"
          />
        </div>

        {/* Industry Pill filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedIndustry === ind
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-brand-bg text-brand-text hover:bg-gray-200/80 border border-brand-border/60'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map((comp) => (
          <motion.div
            key={comp.id}
            whileHover={{ y: -3 }}
            className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border overflow-hidden p-1.5 flex-shrink-0">
                    <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy flex items-center gap-1.5">
                      {comp.name}
                      {comp.isVerified && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                    </h3>
                    <p className="text-xs font-semibold text-brand-primary">{comp.industry}</p>
                  </div>
                </div>

                <Badge variant="primary" size="sm">
                  {comp.openJobsCount} Openings
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted line-clamp-3 leading-relaxed mb-4">
                {comp.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted font-medium mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" /> {comp.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-brand-primary" /> {comp.size}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
              <Link to={`/jobs?search=${encodeURIComponent(comp.name)}`} className="text-xs font-bold text-brand-navy hover:text-brand-primary transition-colors flex items-center gap-1">
                View Open Positions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to={`/companies/${comp.slug}`}>
                <Button variant="outline" size="sm">
                  Company Overview
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
