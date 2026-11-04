import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Users, Globe, CheckCircle2, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { JobCard } from '../../components/jobs/JobCard';
import { EmptyState } from '../../components/common/EmptyState';
import { companyAPI, jobsAPI } from '../../services/api';

export const CompanyDetailsPage = () => {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadCompanyData = async () => {
    setIsLoading(true);
    try {
      const compRes = await companyAPI.getCompanyBySlug(slug);
      if (compRes.success && compRes.company) {
        setCompany(compRes.company);
        const compId = compRes.company._id;
        const jobsRes = await jobsAPI.getJobs({ companyId: compId, limit: 6 });
        if (jobsRes.success && jobsRes.jobs) {
          setJobs(jobsRes.jobs);
        }
      }
    } catch (e) {
      console.warn('Error loading company data:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-64 bg-white rounded-3xl border border-brand-border" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <EmptyState
          icon={Building2}
          title="Company not found"
          description="We could not locate this company profile in our verified employer directory."
        />
        <Link to="/companies">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Companies
          </Button>
        </Link>
      </div>
    );
  }

  const companyName = company.companyName || company.name || 'Verified Company';
  const logo = company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80';
  const coverImage = company.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  const industry = company.industry || 'Technology';
  const location = company.headquarters || company.location || 'India';
  const size = company.companySize || company.size || 'Growth Stage';
  const founded = company.foundedYear || company.founded || '2020';
  const website = company.website || '#';
  const email = company.contactEmail || company.email || 'careers@campusplus.io';
  const phone = company.contactPhone || company.phone || '+91 80 4123 4567';
  const description = company.description || 'Verified enterprise hiring partner on Campus Plus.';

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <Link to="/companies" className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Company Directory
      </Link>

      {/* Hero Banner Card */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-subtle overflow-hidden">
        {/* Cover Image */}
        <div className="h-44 sm:h-64 w-full bg-brand-navy relative overflow-hidden">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Company Header details */}
        <div className="p-6 sm:p-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-4 border-white shadow-card overflow-hidden flex-shrink-0">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">{companyName}</h1>
                  <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-brand-primary">{industry}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {size}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Founded {founded}
                  </span>
                </div>
              </div>
            </div>

            {website && website !== '#' && (
              <a href={website} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" icon={Globe}>
                  Visit Official Website
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About & Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
            <h2 className="text-lg font-bold text-brand-navy">About {companyName}</h2>
            <div className="text-xs sm:text-sm text-brand-text leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Metadata Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">Company Information</h3>
            <div className="space-y-3 text-xs text-brand-text">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-primary" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-primary" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-primary" />
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-extrabold text-brand-navy tracking-tight">Open Positions at {companyName}</h2>
        {jobs.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No current job openings"
            description="This organization does not currently have active postings listed. Check back soon!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
