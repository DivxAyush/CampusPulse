import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Users, Globe, CheckCircle2, ArrowLeft, Briefcase, Mail, Phone, Calendar } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { JobCard } from '../../components/jobs/JobCard';
import { jobsAPI } from '../../services/api';

export const CompanyDetailsPage = () => {
  const { slug } = useParams();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockCompanyDetails = {
    name: 'Nexus Cloud Systems',
    slug: 'nexus-cloud-systems',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    industry: 'Enterprise Cloud & DevOps',
    location: 'Bengaluru, India',
    size: '250-500 employees',
    website: 'https://nexuscloud.io',
    founded: '2019',
    email: 'careers@nexuscloud.io',
    phone: '+91 80 4123 4567',
    description: `Nexus Cloud Systems builds next-generation Kubernetes orchestration platforms and developer productivity infrastructure for enterprise teams. Our products empower cloud engineers across 40+ countries to deploy distributed microservices reliably with zero downtime.

We foster a culture of technical excellence, autonomous ownership, and continuous innovation. Our team comprises passionate contributors to open-source cloud native tools, distributed systems researchers, and frontend visual craftsmen.`,
    benefits: [
      'Comprehensive Medical & Wellness Insurance for Family',
      'Flexible Hybrid & Remote Work Schedules',
      'Annual Learning & Conference Stipend (₹1,50,000)',
      'Modern Ergonomic Setup & Latest Apple Hardware',
      'Quarterly Performance Stock Grant Programs',
      'Generous Parental Leave & Wellness Days',
    ],
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await jobsAPI.getJobs({ limit: 4 });
      if (res.success && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (e) {
      console.warn(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <Link to="/companies" className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Company Directory
      </Link>

      {/* Cover & Brand Banner */}
      <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-card">
        <div className="h-48 sm:h-64 w-full relative">
          <img src={mockCompanyDetails.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
        </div>

        <div className="p-6 sm:p-10 -mt-16 sm:-mt-20 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-card overflow-hidden p-2 flex-shrink-0">
              <img src={mockCompanyDetails.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">{mockCompanyDetails.name}</h1>
                <CheckCircle2 className="w-5 h-5 text-brand-primary" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-brand-primary">{mockCompanyDetails.industry}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {mockCompanyDetails.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {mockCompanyDetails.size}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Founded {mockCompanyDetails.founded}
                </span>
              </div>
            </div>
          </div>

          <a href={mockCompanyDetails.website} target="_blank" rel="noreferrer">
            <Button variant="outline" size="md" icon={Globe} iconPosition="left">
              Official Website
            </Button>
          </a>
        </div>
      </div>

      {/* Main Grid: Overview vs Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8 bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-brand-navy">About {mockCompanyDetails.name}</h2>
            <p className="text-sm text-brand-text leading-relaxed whitespace-pre-line">
              {mockCompanyDetails.description}
            </p>
          </section>

          <section className="space-y-4 pt-4 border-t border-brand-border">
            <h2 className="text-lg font-bold text-brand-navy">Workplace Culture & Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockCompanyDetails.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-bg text-xs font-semibold text-brand-navy">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Contact info card */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Hiring Office Details</h3>
          <div className="space-y-3 text-xs text-brand-text">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-primary" />
              <span>{mockCompanyDetails.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-primary" />
              <span>{mockCompanyDetails.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-brand-primary" />
              <span>{mockCompanyDetails.location}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-brand-border">
            <Badge variant="primary" size="md" className="w-full justify-center">
              Active Employer on Campus Plus
            </Badge>
          </div>
        </div>
      </div>

      {/* Open Positions List */}
      <div className="space-y-6 pt-6 border-t border-brand-border">
        <h2 className="text-2xl font-extrabold text-brand-navy tracking-tight">Open Positions at {mockCompanyDetails.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};
