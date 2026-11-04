import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  User,
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supportAPI } from '../../services/api';

export const ContactUsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // FAQ filters
  const [faqCategory, setFaqCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isFaqLoading, setIsFaqLoading] = useState(true);

  // Contact form state
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    role: user?.role || 'candidate',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update form if user logs in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
        role: user.role || prev.role,
      }));
    }
  }, [user]);

  // Load FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      setIsFaqLoading(true);
      try {
        const res = await supportAPI.getFaqs({
          category: faqCategory !== 'all' ? faqCategory : undefined,
        });
        if (res.success && res.data) {
          setFaqs(res.data);
        }
      } catch (err) {
        console.warn('FAQ load fallback:', err.message);
        setFaqs([
          {
            id: 1,
            category: 'candidates',
            question: 'How is my ATS Resume Score calculated?',
            answer:
              'PulseAI scores resumes based on 5 structural dimensions: Layout Readability, Skills Match Depth, Project Impact Metrics, Quantifiable Achievements, and Executive Summary quality.',
          },
          {
            id: 2,
            category: 'companies',
            question: 'Can I shortlist candidates and schedule interviews directly on the portal?',
            answer:
              'Yes! Recruiters can review ranked applicant profiles, mark status updates (Shortlist, Under Review, Offer), and propose live video interview slots.',
          },
          {
            id: 3,
            category: 'ai_tools',
            question: 'Does PulseAI store or sell my resume data?',
            answer:
              'Never. Your resume documents are securely hosted on encrypted cloud storage and are only accessible by you and companies you explicitly apply to.',
          },
          {
            id: 4,
            category: 'candidates',
            question: 'Is Campus Plus completely free for graduates and job seekers?',
            answer:
              'Yes! All student and candidate tools, including resume scanning, job search, and application tracking, are 100% free.',
          },
        ]);
      } finally {
        setIsFaqLoading(false);
      }
    };

    fetchFaqs();
  }, [faqCategory]);

  // Submit Contact Form Handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      addToast('Please enter both subject and your message.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await supportAPI.sendMessage(formData);
      setIsSubmitted(true);
      addToast('Message sent! Our support team will respond via email shortly.', 'success');
      setFormData((prev) => ({
        ...prev,
        subject: '',
        message: '',
      }));
    } catch (err) {
      addToast(err.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 space-y-8">
      {/* Hero Header (Tight spacing, no search) */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <Badge variant="primary" size="sm">
          <HelpCircle className="w-3.5 h-3.5 mr-1" /> Help & Support
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          How can we help you?
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Reach out directly to our team below or browse our knowledge base.
        </p>
      </div>

      {/* 4 Quick Support Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle hover:shadow-card transition-all space-y-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-brand-navy">Account & Access</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Guidance on profile completion, role switching between candidate and recruiter, and password resets.
          </p>
          <button
            onClick={() => {
              setFaqCategory('candidates');
              document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            Explore Account FAQs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle hover:shadow-card transition-all space-y-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-brand-navy">Recruiters & Postings</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Help with publishing job listings, applicant screening, status transitions, and team accounts.
          </p>
          <button
            onClick={() => {
              setFaqCategory('companies');
              document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            Recruiter Guidelines <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle hover:shadow-card transition-all space-y-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-800 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-brand-navy">Platform Diagnostics</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Understand how our PulseAI engine parses resumes, extracts technical skills, and computes job matches.
          </p>
          <button
            onClick={() => {
              setFaqCategory('ai_tools');
              document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-cyan-800 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            Diagnostics Info <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle hover:shadow-card transition-all space-y-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-brand-navy">Trust & Security</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Information regarding encrypted document storage, company verification badges, and privacy standards.
          </p>
          <button
            onClick={() => {
              setFaqCategory('security');
              document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-slate-800 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            Security Standards <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Contact Form (No Bot, No Tabs) */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
            <Send className="w-5 h-5 text-brand-primary" /> Send Us a Message
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Fill out the form below and our team will get back to your registered email address.
          </p>
        </div>

        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-brand-primary/40 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-primary font-bold text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5" /> Message Sent Successfully!
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-brand-muted hover:text-brand-navy cursor-pointer font-medium"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-brand-text leading-relaxed">
              Thank you for reaching out! Our support team has received your message and will reply within 2 hours.
            </p>
          </motion.div>
        )}

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Full Name"
              required
              placeholder="e.g., Ayush Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Contact Email"
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Account Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-semibold text-brand-navy focus:outline-none focus:border-brand-primary"
              >
                <option value="candidate">Candidate / Job Seeker</option>
                <option value="company">Employer / Recruiter</option>
                <option value="other">General Inquirer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Inquiry Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-semibold text-brand-navy focus:outline-none focus:border-brand-primary"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Resume & ATS">Resume & ATS Diagnostics</option>
                <option value="Job Applications">Job Applications & Tracking</option>
                <option value="Recruiter Accounts">Recruiter & Company Postings</option>
                <option value="Technical Issue">Technical & Platform Issue</option>
              </select>
            </div>
          </div>

          <Input
            label="Subject"
            required
            placeholder="e.g., Question regarding technical skill scoring on uploaded resume"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Detailed Message
              </label>
              <span className="text-[11px] text-brand-muted">
                {formData.message.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              required
              placeholder="Provide details about your query so our team can assist you effectively..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-2xl text-xs sm:text-sm text-brand-navy placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-brand-muted">
              Average response time: under 2 business hours.
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              icon={Send}
            >
              Send Message
            </Button>
          </div>
        </form>
      </div>

      {/* Direct Contact Desks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-2">
          <div className="w-9 h-9 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary">
            <Mail className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-brand-navy">Official Email Desks</h4>
          <div className="space-y-1 text-xs text-brand-muted">
            <div>
              <span className="font-semibold text-brand-navy">Candidates: </span>
              <a href="mailto:support@campusplus.io" className="text-brand-primary hover:underline">
                support@campusplus.io
              </a>
            </div>
            <div>
              <span className="font-semibold text-brand-navy">Recruiters: </span>
              <a href="mailto:recruiters@campusplus.io" className="text-brand-primary hover:underline">
                recruiters@campusplus.io
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
            <Phone className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-brand-navy">Telephone Support</h4>
          <div className="space-y-1 text-xs text-brand-muted">
            <div className="font-semibold text-brand-navy">+91 (80) 4123 4567</div>
            <div>Mon – Sat: 9:00 AM – 7:00 PM IST</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-800">
            <MapPin className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-brand-navy">Bengaluru Office</h4>
          <div className="space-y-0.5 text-xs text-brand-muted leading-relaxed">
            <div className="font-semibold text-brand-navy">Campus Plus Technologies Pvt. Ltd.</div>
            <div>Koramangala 4th Block, Bengaluru, India</div>
          </div>
        </div>
      </div>

      {/* Comprehensive Knowledge Base & FAQs */}
      <div id="faq-section" className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-border pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy">Knowledge Base & FAQ</h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Self-serve answers to common questions regarding resume scoring, job postings, and applications.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {[
              { id: 'all', label: 'All FAQs' },
              { id: 'candidates', label: 'Candidates' },
              { id: 'companies', label: 'Recruiters' },
              { id: 'ai_tools', label: 'Platform' },
              { id: 'security', label: 'Security' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFaqCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  faqCategory === cat.id
                    ? 'bg-brand-navy text-white shadow-subtle'
                    : 'bg-white border border-brand-border text-brand-muted hover:text-brand-navy'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {isFaqLoading ? (
            <div className="p-6 text-center text-xs text-brand-muted">
              Loading knowledge base answers...
            </div>
          ) : faqs.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-brand-border text-xs text-brand-muted">
              No articles found. Try selecting another category or send us a message above.
            </div>
          ) : (
            faqs.map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-subtle transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm text-brand-navy hover:text-brand-primary transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-muted flex-shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'transform rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-brand-muted leading-relaxed border-t border-brand-border/40 space-y-3">
                    <p>{faq.answer}</p>
                    <div className="flex items-center justify-between pt-2 text-[11px] text-brand-muted border-t border-brand-border/20">
                      <span>Was this helpful?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToast('Thank you for your feedback!', 'success')}
                          className="flex items-center gap-1 hover:text-brand-primary transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" /> Yes
                        </button>
                        <button
                          onClick={() =>
                            addToast('Feedback recorded. We will improve this answer.', 'info')
                          }
                          className="flex items-center gap-1 hover:text-brand-primary transition-colors cursor-pointer"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" /> No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
