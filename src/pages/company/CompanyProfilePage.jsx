import React, { useState, useEffect } from 'react';
import { Building2, Globe, MapPin, Phone, Mail, CheckCircle2, Save, Users, Calendar } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { companyAPI } from '../../services/api';

export const CompanyProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    companyType: '',
    foundedYear: '',
    description: '',
    headquarters: '',
    contactEmail: '',
    contactPhone: '',
    logo: '',
    coverImage: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await companyAPI.getProfile();
      if (res.success && res.profile) {
        setFormData({
          companyName: res.profile.companyName || '',
          website: res.profile.website || '',
          industry: res.profile.industry || '',
          companySize: res.profile.companySize || '',
          companyType: res.profile.companyType || 'Product',
          foundedYear: res.profile.foundedYear || '',
          description: res.profile.description || '',
          headquarters: res.profile.headquarters || '',
          contactEmail: res.profile.contactEmail || '',
          contactPhone: res.profile.contactPhone || '',
          logo: res.profile.logo || '',
          coverImage: res.profile.coverImage || '',
        });
      }
    } catch (err) {
      console.warn('Error loading company profile:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await companyAPI.updateProfile(formData);
      if (res.success) {
        addToast('Company profile updated successfully.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error updating profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Company Identity
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Employer Profile</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Showcase your workplace mission, culture, and team details to prospective applicants.
          </p>
        </div>
        <Button type="submit" variant="primary" size="md" isLoading={isSaving} icon={Save}>
          Save Profile
        </Button>
      </div>

      {/* Brand Visuals */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-primary" /> Brand Visual Assets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Logo Image URL"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            helperText="Square 1:1 image recommended"
          />
          <Input
            label="Cover Banner URL"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            helperText="Wide 16:9 landscape image recommended"
          />
        </div>

        {/* Visual Preview */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg border border-brand-border">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-brand-border p-1 flex-shrink-0">
            <img src={formData.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <div className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
              {formData.companyName}
              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="text-xs text-brand-muted">{formData.industry} • {formData.headquarters}</div>
          </div>
        </div>
      </div>

      {/* General Details */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-navy">Company Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
          <Input
            label="Official Website"
            icon={Globe}
            placeholder="https://company.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Industry Sector
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary"
            >
              <option>Enterprise Cloud & DevOps</option>
              <option>Fintech & Banking</option>
              <option>Artificial Intelligence & ML</option>
              <option>Healthcare Technology</option>
              <option>E-Commerce & Retail</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Company Size
            </label>
            <select
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary"
            >
              <option>10-50 employees</option>
              <option>50-200 employees</option>
              <option>250-500 employees</option>
              <option>500-1000 employees</option>
              <option>1000+ employees</option>
            </select>
          </div>

          <Input
            label="Founded Year"
            icon={Calendar}
            placeholder="2019"
            value={formData.foundedYear}
            onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Headquarters Location"
            icon={MapPin}
            placeholder="Bengaluru, India"
            value={formData.headquarters}
            onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
          />
          <Input
            label="Hiring Contact Email"
            icon={Mail}
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            About Company & Culture
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" size="lg" isLoading={isSaving} icon={Save}>
          Save Company Changes
        </Button>
      </div>
    </form>
  );
};
