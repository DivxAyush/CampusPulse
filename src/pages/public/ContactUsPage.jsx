import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  Search,
  HelpCircle,
  Clock,
  User,
  Building2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Copy,
  ExternalLink,
  Bot,
  Paperclip,
  ArrowRight,
  FileText,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supportAPI } from '../../services/api';

export const ContactUsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  // Active view tab: 'ticket' | 'track' | 'bot'
  const [activeTab, setActiveTab] = useState('ticket');

  // Search & FAQ filters
  const [searchQuery, setSearchQuery] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isFaqLoading, setIsFaqLoading] = useState(true);

  // Ticket submission state
  const [ticketData, setTicketData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    role: user?.role || 'candidate',
    category: 'Resume & ATS',
    priority: 'normal',
    subject: '',
    message: '',
    attachmentName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Ticket lookup state
  const [trackIdInput, setTrackIdInput] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedTicket, setTrackedTicket] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Interactive Bot Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Campus Plus Virtual Assistant. How can I help you today? You can select a popular topic below or type your question.',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Update form if user logs in
  useEffect(() => {
    if (user) {
      setTicketData((prev) => ({
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
          search: searchQuery || undefined,
        });
        if (res.data) {
          setFaqs(res.data);
        }
      } catch (err) {
        // Fallback default
        setFaqs([]);
      } finally {
        setIsFaqLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFaqs();
    }, 200);

    return () => clearTimeout(timer);
  }, [faqCategory, searchQuery]);

  // Submit Ticket Handler
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketData.subject || !ticketData.message) {
      addToast('Please fill in both the subject and message details.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await supportAPI.createTicket(ticketData);
      if (res.success && res.data) {
        setCreatedTicket(res.data);
        addToast(`Ticket #${res.data.ticketId} created! Our support team has been notified.`, 'success');
        // Reset message fields
        setTicketData((prev) => ({
          ...prev,
          subject: '',
          message: '',
          attachmentName: '',
        }));
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit support ticket. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ticket Lookup Handler
  const handleLookupTicket = async (e) => {
    if (e) e.preventDefault();
    if (!trackIdInput.trim()) {
      addToast('Please enter a valid ticket reference ID (e.g., CP-10492).', 'error');
      return;
    }

    setIsTracking(true);
    setTrackError('');
    setTrackedTicket(null);

    try {
      const res = await supportAPI.getTicketStatus(trackIdInput.trim());
      if (res.success && res.data) {
        setTrackedTicket(res.data);
        addToast(`Found ticket #${res.data.ticketId}`, 'success');
      }
    } catch (err) {
      setTrackError(err.message || 'Ticket not found.');
      addToast(err.message || 'No ticket matching this reference was found.', 'error');
    } finally {
      setIsTracking(false);
    }
  };

  // Chatbot response generator
  const handleSendChatMessage = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // AI bot reply logic
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('ats') || q.includes('score') || q.includes('resume')) {
        reply = 'The PulseAI Resume Analyzer scores your profile against 20+ ATS parameters (quantified metrics, structure, and keyword density). Single-column PDFs work best. You can test your score at /candidate/ai-analyzer.';
      } else if (q.includes('post') || q.includes('job') || q.includes('recruiter')) {
        reply = 'Verified employers can publish jobs instantly without admin wait times! Simply go to your Recruiter Dashboard -> Post a New Job, fill in details, and it goes live immediately.';
      } else if (q.includes('interview') || q.includes('meet') || q.includes('schedule')) {
        reply = 'Recruiters can schedule interviews directly from the Applicants page by selecting any candidate and clicking "Schedule Interview" with your Google Meet or Zoom link.';
      } else if (q.includes('free') || q.includes('cost') || q.includes('price')) {
        reply = 'Campus Plus is completely 100% free for all students and software job seekers! Enterprise recruiters can post jobs and access AI matching capabilities.';
      } else {
        reply = 'Thank you for reaching out! For specific account inquiries or technical challenges, you can easily submit a priority ticket in the "Submit Support Ticket" tab above.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast(`Copied #${text} to clipboard!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" size="sm" className="px-3 py-1">
          <HelpCircle className="w-3.5 h-3.5 mr-1" /> Help & Contact Support
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
          How can we help your journey today?
        </h1>
        <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
          Get swift support from our engineering and recruiter success teams. File priority tickets, track existing inquiries, or browse PulseAI diagnostics guides.
        </p>

        {/* Live Search Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-brand-muted absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search help topics, ATS benchmarks, interview guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-brand-border rounded-2xl text-sm text-brand-navy placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-light transition-all shadow-subtle"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-xs text-brand-muted hover:text-brand-navy font-bold p-1"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-brand-muted">
            <span className="font-semibold text-brand-navy">Popular:</span>
            {['ATS Score Guide', 'Post a Job', 'Interview Scheduling', 'PDF Resume Format', 'Track Ticket'].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag === 'Track Ticket') {
                      setActiveTab('track');
                    } else {
                      setSearchQuery(tag);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-brand-border/70 hover:border-brand-primary hover:text-brand-primary transition-all cursor-pointer"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Top 4 Support Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-primary flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-brand-navy">Candidate Support</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Troubleshoot resume uploads, ATS score bottlenecks, application tracking, and profile visibility.
          </p>
          <button
            onClick={() => {
              setFaqCategory('candidates');
              window.scrollTo({ top: 900, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 pt-1"
          >
            Candidate FAQs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-brand-navy">Employer & Recruiter</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Guidance on instant job publishing, ATS candidate filtering, interview invitations, and team seats.
          </p>
          <button
            onClick={() => {
              setFaqCategory('companies');
              window.scrollTo({ top: 900, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 pt-1"
          >
            Recruiter FAQs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-brand-navy">PulseAI Engine</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Understand how our PulseAI engine parses resumes, computes semantic job matches, and optimizes bullet points.
          </p>
          <button
            onClick={() => {
              setFaqCategory('ai_tools');
              window.scrollTo({ top: 900, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-cyan-800 hover:underline flex items-center gap-1 pt-1"
          >
            PulseAI Docs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-brand-navy">Trust & Security</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Information regarding encrypted Cloudinary storage, company verification badges, and privacy standards.
          </p>
          <button
            onClick={() => {
              setFaqCategory('security');
              window.scrollTo({ top: 900, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-slate-800 hover:underline flex items-center gap-1 pt-1"
          >
            Security Standards <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Support Hub */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-card overflow-hidden">
        {/* Navigation Mode Tabs */}
        <div className="flex border-b border-brand-border bg-brand-bg/50 px-6 pt-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ticket')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'ticket'
                ? 'bg-white text-brand-navy border-brand-primary shadow-subtle'
                : 'text-brand-muted border-transparent hover:text-brand-navy'
            }`}
          >
            <Send className="w-4 h-4 text-brand-primary" />
            Submit Support Ticket
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-white text-brand-navy border-brand-primary shadow-subtle'
                : 'text-brand-muted border-transparent hover:text-brand-navy'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-600" />
            Track Ticket Status
          </button>

          <button
            onClick={() => setActiveTab('bot')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'bot'
                ? 'bg-white text-brand-navy border-brand-primary shadow-subtle'
                : 'text-brand-muted border-transparent hover:text-brand-navy'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-600" />
            Interactive Support Bot
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              Live
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-10">
          {/* TAB 1: SUBMIT TICKET */}
          {activeTab === 'ticket' && (
            <div className="space-y-8">
              {createdTicket && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-emerald-50 border border-brand-primary/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-primary font-bold text-base">
                      <CheckCircle2 className="w-5 h-5" /> Support Ticket Registered Successfully!
                    </div>
                    <button
                      onClick={() => setCreatedTicket(null)}
                      className="text-xs text-brand-muted hover:text-brand-navy"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-xs text-brand-navy leading-relaxed">
                    Your request has been routed to our specialized support queue. A support engineer will review your ticket within 2 hours.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="text-xs font-semibold text-brand-muted">Ticket Reference:</span>
                    <span className="font-mono font-bold text-sm px-3 py-1 bg-white rounded-lg border border-brand-border text-brand-navy flex items-center gap-2">
                      {createdTicket.ticketId}
                      <button
                        onClick={() => copyToClipboard(createdTicket.ticketId)}
                        className="text-brand-muted hover:text-brand-primary"
                        title="Copy ticket ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </span>
                    <button
                      onClick={() => {
                        setTrackIdInput(createdTicket.ticketId);
                        setActiveTab('track');
                        handleLookupTicket();
                      }}
                      className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 ml-auto"
                    >
                      Track this ticket live <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Your Full Name"
                    required
                    placeholder="e.g., Ayush Sharma"
                    value={ticketData.name}
                    onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address for Updates"
                    type="email"
                    required
                    placeholder="e.g., candidate@campusplus.com"
                    value={ticketData.email}
                    onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                      Account Type
                    </label>
                    <select
                      value={ticketData.role}
                      onChange={(e) => setTicketData({ ...ticketData, role: e.target.value })}
                      className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light transition-all"
                    >
                      <option value="candidate">Candidate / Job Seeker</option>
                      <option value="company">Employer / Recruiter</option>
                      <option value="enterprise">Enterprise Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                      Support Category
                    </label>
                    <select
                      value={ticketData.category}
                      onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                      className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light transition-all"
                    >
                      <option value="Resume & ATS">Resume & ATS Scoring</option>
                      <option value="Job Applications">Job Applications & Tracking</option>
                      <option value="Job Moderation">Job Posting & Recruitment</option>
                      <option value="Technical Issue">Technical Glitch / Bug</option>
                      <option value="Account & Security">Account & Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                      Urgency / Priority
                    </label>
                    <select
                      value={ticketData.priority}
                      onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                      className="w-full bg-white border border-brand-border rounded-xl py-2.5 px-3 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light transition-all font-semibold"
                    >
                      <option value="low">Low (General Inquiry)</option>
                      <option value="normal">Normal (Standard Assistance)</option>
                      <option value="urgent">Urgent (Interview / Job Blocker)</option>
                      <option value="critical">Critical (Account Access Loss)</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Subject Summary"
                  required
                  placeholder="e.g., PulseAI parser did not extract work history bullet points from my PDF"
                  value={ticketData.subject}
                  onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
                      Detailed Description of the Issue
                    </label>
                    <span className="text-[11px] text-brand-muted font-medium">
                      {ticketData.message.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide specific details, reproduction steps, or the specific job title / resume file name involved..."
                    value={ticketData.message}
                    onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                    className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-text placeholder-gray-400 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light transition-all"
                  />
                </div>

                {/* Attachment Simulator */}
                <div className="p-4 rounded-2xl bg-brand-bg border border-dashed border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-muted">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy">Attach Screenshot or Log (Optional)</div>
                      <div className="text-[11px] text-brand-muted">
                        {ticketData.attachmentName ? (
                          <span className="text-brand-primary font-semibold">
                            Attached: {ticketData.attachmentName}
                          </span>
                        ) : (
                          'Supports PNG, JPG, PDF up to 10MB'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ticketData.attachmentName ? (
                      <button
                        type="button"
                        onClick={() => setTicketData({ ...ticketData, attachmentName: '' })}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setTicketData({
                            ...ticketData,
                            attachmentName: 'screenshot_error_diagnostic.png',
                          });
                          addToast('Sample diagnostic screenshot attached!', 'info');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-brand-border text-xs font-bold text-brand-navy hover:border-brand-primary transition-all cursor-pointer"
                      >
                        Attach Sample Screenshot
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <ShieldCheck className="w-4 h-4 text-brand-primary" />
                    <span>Inquiries are confidential and backed by our SLA guarantee.</span>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    icon={Send}
                    className="w-full sm:w-auto"
                  >
                    Submit Support Ticket
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: TRACK TICKET */}
          {activeTab === 'track' && (
            <div className="space-y-8">
              <div className="max-w-xl mx-auto space-y-4 text-center">
                <h3 className="text-xl font-bold text-brand-navy">Track Ticket Status</h3>
                <p className="text-xs text-brand-muted">
                  Enter your unique Campus Plus ticket code to view real-time triage status, assigned engineer, and resolution notes.
                </p>

                <form onSubmit={handleLookupTicket} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter Ticket ID (e.g., CP-10492 or CP-20891)"
                    value={trackIdInput}
                    onChange={(e) => setTrackIdInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-brand-border rounded-xl text-sm font-mono text-brand-navy focus:outline-none focus:border-brand-primary uppercase"
                  />
                  <Button type="submit" variant="primary" size="md" isLoading={isTracking}>
                    Track
                  </Button>
                </form>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-brand-muted">
                  <span>Quick Demo Tickets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackIdInput('CP-10492');
                      supportAPI.getTicketStatus('CP-10492').then((res) => setTrackedTicket(res.data));
                    }}
                    className="px-2 py-0.5 rounded-md bg-brand-bg border border-brand-border font-mono text-brand-navy hover:text-brand-primary"
                  >
                    CP-10492 (Resolved)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackIdInput('CP-20891');
                      supportAPI.getTicketStatus('CP-20891').then((res) => setTrackedTicket(res.data));
                    }}
                    className="px-2 py-0.5 rounded-md bg-brand-bg border border-brand-border font-mono text-brand-navy hover:text-brand-primary"
                  >
                    CP-20891 (In Progress)
                  </button>
                </div>
              </div>

              {/* Track Error */}
              {trackError && (
                <div className="max-w-xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}

              {/* Tracked Ticket Details Card */}
              {trackedTicket && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto bg-brand-bg/60 rounded-3xl border border-brand-border p-6 sm:p-8 space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold text-brand-navy">
                          #{trackedTicket.ticketId}
                        </span>
                        <span
                          className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-md ${
                            trackedTicket.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : trackedTicket.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {trackedTicket.status.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-brand-border text-brand-muted">
                          {trackedTicket.priority} priority
                        </span>
                      </div>
                      <div className="text-xs text-brand-muted">
                        Submitted on {new Date(trackedTicket.createdAt).toLocaleDateString()} by{' '}
                        <span className="font-semibold text-brand-navy">{trackedTicket.name}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-brand-muted">Assigned Specialist</div>
                      <div className="text-xs font-bold text-brand-navy flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                        {trackedTicket.assignedTo}
                      </div>
                    </div>
                  </div>

                  {/* Subject & Message */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                      Subject
                    </div>
                    <div className="text-base font-bold text-brand-navy">{trackedTicket.subject}</div>
                    <div className="text-xs text-brand-text bg-white p-4 rounded-2xl border border-brand-border/70 leading-relaxed">
                      {trackedTicket.message}
                    </div>
                  </div>

                  {/* Specialist Resolution Notes */}
                  {trackedTicket.resolutionNotes && (
                    <div className="p-4 rounded-2xl bg-white border border-brand-primary/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-wider">
                        <MessageSquare className="w-4 h-4" /> Official Support Response
                      </div>
                      <p className="text-xs text-brand-navy leading-relaxed">
                        {trackedTicket.resolutionNotes}
                      </p>
                    </div>
                  )}

                  {/* Visual Timeline */}
                  <div className="pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
                      Resolution Progress
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-brand-primary text-brand-primary font-bold">
                        1. Received
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50 border border-brand-primary text-brand-primary font-bold">
                        2. Triage
                      </div>
                      <div
                        className={`p-2 rounded-xl border font-bold ${
                          trackedTicket.status !== 'open'
                            ? 'bg-emerald-50 border-brand-primary text-brand-primary'
                            : 'bg-white border-brand-border text-brand-muted'
                        }`}
                      >
                        3. Review
                      </div>
                      <div
                        className={`p-2 rounded-xl border font-bold ${
                          trackedTicket.status === 'resolved'
                            ? 'bg-emerald-50 border-brand-primary text-brand-primary'
                            : 'bg-white border-brand-border text-brand-muted'
                        }`}
                      >
                        4. Resolved
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE BOT ASSISTANT */}
          {activeTab === 'bot' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-navy">Campus Plus Instant Assistant</div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Always Active
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setChatMessages([
                      {
                        sender: 'bot',
                        text: 'Chat history cleared. How may I assist you?',
                        time: 'Just now',
                      },
                    ])
                  }
                  className="text-xs text-brand-muted hover:text-brand-navy flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Chat Log */}
              <div className="h-80 overflow-y-auto bg-brand-bg/50 rounded-2xl p-4 border border-brand-border space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-brand-primary text-white rounded-tr-none'
                          : 'bg-white border border-brand-border text-brand-navy shadow-subtle rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-brand-muted mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Suggested quick prompt pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  'Why is my ATS score below 75%?',
                  'How do I schedule an interview?',
                  'Can I post jobs without approval?',
                  'Is Campus Plus free for developers?',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendChatMessage(prompt)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about resumes, jobs, or recruitment..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="flex-1 px-4 py-2.5 bg-white border border-brand-border rounded-xl text-xs text-brand-navy placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                />
                <Button
                  variant="primary"
                  size="md"
                  icon={Send}
                  onClick={() => handleSendChatMessage()}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Direct Contact Channels & Headquarters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-brand-navy">Official Email Desks</h4>
          <div className="space-y-1.5 text-xs text-brand-muted">
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
            <div className="text-[11px] text-emerald-600 font-semibold pt-1">
              Average response time: &lt; 2 hours
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
            <Phone className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-brand-navy">Telephone & WhatsApp</h4>
          <div className="space-y-1.5 text-xs text-brand-muted">
            <div className="font-semibold text-brand-navy">+91 (80) 4123 4567</div>
            <div className="text-xs text-brand-muted">Toll-free across India</div>
            <div className="text-[11px] text-brand-navy font-medium pt-1">
              Mon – Sat: 9:00 AM – 7:00 PM IST
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-800">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-brand-navy">Engineering Innovation Hub</h4>
          <div className="space-y-1 text-xs text-brand-muted leading-relaxed">
            <div className="font-semibold text-brand-navy">Campus Plus Technologies Pvt. Ltd.</div>
            <div>Tower 4, 3rd Floor, 80 Feet Road, Koramangala 4th Block</div>
            <div>Bengaluru, Karnataka 560034, India</div>
          </div>
        </div>
      </div>

      {/* Comprehensive Knowledge Base & FAQs */}
      <div className="space-y-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-border pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">Knowledge Base & FAQ</h2>
            <p className="text-xs text-brand-muted mt-1">
              Self-serve answers to common questions regarding resume scoring, job postings, and applications.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {[
              { id: 'all', label: 'All FAQs' },
              { id: 'candidates', label: 'Candidates' },
              { id: 'companies', label: 'Recruiters' },
              { id: 'ai_tools', label: 'PulseAI' },
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
            <div className="p-8 text-center text-xs text-brand-muted">
              Loading knowledge base answers...
            </div>
          ) : faqs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-brand-border text-xs text-brand-muted">
              No articles found matching your query "{searchQuery}". Try submitting a support ticket above.
            </div>
          ) : (
            faqs.map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-subtle transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-brand-navy hover:text-brand-primary transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-muted flex-shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'transform rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-brand-muted leading-relaxed border-t border-brand-border/40 space-y-3">
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
