import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Search, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { companyAPI } from '../../services/api';

export const CompaniesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, [search, selectedIndustry]);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await companyAPI.getCompanies({
        search: search || undefined,
        industry: selectedIndustry !== 'All' ? selectedIndustry : undefined,
      });
      if (res.success && res.companies) {
        setCompanies(res.companies);
      }
    } catch (err) {
      console.warn('Error loading companies:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const industries = ['All', 'Enterprise Cloud & DevOps', 'Fintech & Digital Banking', 'Artificial Intelligence & ML', 'Healthcare Technology'];

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
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
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-brand-border p-6 sm:p-8 animate-pulse space-y-4" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies found"
          description="Try adjusting your search query or industry filters to discover other verified employers."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((comp) => {
            const companyName = comp.companyName || comp.name;
            const slug = comp.slug || comp._id;
            const logo = comp.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80';
            const location = comp.headquarters || comp.location || 'India';
            const size = comp.companySize || comp.size || 'Growth Stage';

            return (
              <motion.div
                key={comp._id || comp.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card hover:border-brand-primary/40 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Top company badge & logo */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl border border-brand-border p-1 bg-white shadow-xs overflow-hidden flex-shrink-0">
                        <img src={logo} alt={companyName} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-lg font-bold text-brand-navy">{companyName}</h2>
                          {comp.isVerified !== false && <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs font-semibold text-brand-primary mt-0.5">{comp.industry || 'Technology'}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3">
                    {comp.description || 'Enterprise technology employer partnering with Campus Plus for technical talent acquisition.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted pt-2 border-t border-brand-border/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" /> {location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-brand-primary" /> {size}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to={`/companies/${slug}`}>
                    <Button variant="outline" size="sm" className="w-full font-bold group" icon={ArrowRight} iconPosition="right">
                      View Company Profile & Open Roles
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
