import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Video,
  User,
  Users,
  Mail,
  Phone,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { mockInterviewAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const AdminMockInterviewsPage = () => {
  const { addToast } = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, scheduled: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modal state
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: 'scheduled',
    scheduledAt: '',
    meetingLink: '',
    interviewerName: '',
    notes: '',
  });

  useEffect(() => {
    loadEnrollments();
  }, [selectedStatus]);

  const loadEnrollments = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await mockInterviewAPI.getAdminAll(params);
      if (res.success) {
        setEnrollments(res.mockInterviews || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Error loading mock interviews:', err);
      addToast(err.message || 'Failed to load mock interview enrollments', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEnrollments();
  };

  const openManageModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    const dateStr = enrollment.scheduledAt ? new Date(enrollment.scheduledAt).toISOString().slice(0, 16) : '';
    setFormData({
      status: enrollment.status || 'pending',
      scheduledAt: dateStr,
      meetingLink: enrollment.meetingLink || 'https://meet.google.com/new',
      interviewerName: enrollment.interviewerName || 'CampusPulse Senior Interviewer',
      notes: enrollment.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedEnrollment) return;

    setIsUpdating(true);
    try {
      const res = await mockInterviewAPI.updateStatus(selectedEnrollment._id, formData);
      if (res.success) {
        addToast(`Interview request updated to ${formData.status.toUpperCase()}!`, 'success');
        setIsModalOpen(false);
        loadEnrollments();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update interview request', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Calendar className="w-3.5 h-3.5" /> Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-border shadow-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-primary-light text-brand-navy border border-brand-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>CampusPulse AI • Interview Service</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            Mock Interview Enrollments
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Manage candidates who enrolled for 1-on-1 technical mock interviews, schedule Google Meet/Zoom calls, and update progress.
          </p>
        </div>

        <button
          onClick={loadEnrollments}
          className="flex items-center gap-2 px-4 py-2 bg-brand-bg hover:bg-gray-200/60 rounded-xl text-xs font-bold text-brand-navy border border-brand-border transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brand-muted">Total Enrollments</div>
            <div className="text-2xl font-extrabold text-brand-navy mt-1">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brand-muted">Pending Review</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pending}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brand-muted">Scheduled Sessions</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.scheduled}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brand-muted">Completed Mocks</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{stats.completed}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-brand-bg text-brand-text hover:bg-gray-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-brand-bg rounded-xl border border-brand-border outline-none focus:border-brand-primary focus:bg-white transition-all"
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>
        </form>
      </div>

      {/* Enrollments Table / Card List */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-brand-muted">Loading mock interview candidates...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary-light text-brand-primary flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">No Mock Interview Requests Found</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              {selectedStatus === 'all'
                ? 'No candidates have enrolled for mock interviews yet. As soon as a candidate clicks "I Want Mock Interview", it will appear here.'
                : `No requests with status "${selectedStatus}". Try switching to All Requests.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg/50 text-[11px] font-bold text-brand-navy uppercase tracking-wider">
                  <th className="py-3 px-4">Candidate Details</th>
                  <th className="py-3 px-4">Target Role & Tech Stack</th>
                  <th className="py-3 px-4">Preferred Slot / Notes</th>
                  <th className="py-3 px-4">Enrolled On</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {enrollments.map((item) => {
                  const candidateUser = item.userId || {};
                  const candidateInfo = item.candidateId || {};

                  return (
                    <tr key={item._id} className="hover:bg-brand-bg/40 transition-colors">
                      {/* Candidate Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {candidateUser.fullName ? candidateUser.fullName.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <div className="font-bold text-brand-navy text-sm">
                              {candidateUser.fullName || 'Candidate'}
                            </div>
                            <div className="text-[11px] text-brand-muted flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-brand-primary" /> {candidateUser.email || 'No email'}
                            </div>
                            {candidateUser.phone && (
                              <div className="text-[11px] text-brand-muted flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-600" /> {candidateUser.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Target Role & Tech Stack */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-brand-navy flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-brand-primary" />
                            <span>{item.targetRole}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(item.techStack || []).slice(0, 4).map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-brand-bg text-[10px] font-medium text-brand-text border border-brand-border/70"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Preferred Slot & Notes */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="inline-block px-2 py-0.5 rounded bg-gray-100 text-[10px] font-semibold text-brand-navy">
                            {item.preferredSlot || 'Flexible'}
                          </div>
                          {item.notes ? (
                            <p className="text-[11px] text-brand-muted truncate max-w-[200px]" title={item.notes}>
                              "{item.notes}"
                            </p>
                          ) : (
                            <p className="text-[11px] text-gray-400 italic">No custom notes</p>
                          )}
                        </div>
                      </td>

                      {/* Enrolled On */}
                      <td className="py-3.5 px-4 text-brand-muted font-medium whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        <div className="text-[10px] text-gray-400">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {getStatusBadge(item.status)}
                          {item.scheduledAt && item.status === 'scheduled' && (
                            <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.scheduledAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}{' '}
                              {new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                          {item.meetingLink && item.status === 'scheduled' && (
                            <a
                              href={item.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                            >
                              <Video className="w-3 h-3" /> Open Meeting Link
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openManageModal(item)}
                          className="px-3 py-1.5 rounded-xl bg-brand-primary-light hover:bg-emerald-100 text-brand-primary font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MANAGE MODAL */}
      {isModalOpen && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-border space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-brand-navy">Schedule & Manage Mock Interview</h3>
                <p className="text-xs text-brand-muted">
                  Candidate: <strong className="text-brand-navy">{selectedEnrollment.userId?.fullName}</strong> ({selectedEnrollment.userId?.email})
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              {/* Status Radio / Select */}
              <div>
                <label className="block font-bold text-brand-navy mb-1.5">Interview Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-bg border border-brand-border outline-none font-semibold text-brand-navy focus:border-brand-primary"
                >
                  <option value="pending">Pending Review (Waiting for schedule)</option>
                  <option value="scheduled">Scheduled (Date & Meet Link provided)</option>
                  <option value="completed">Completed (Interview conducted)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Scheduled Date & Time */}
              <div>
                <label className="block font-bold text-brand-navy mb-1.5">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-bg border border-brand-border outline-none text-brand-text focus:border-brand-primary"
                />
              </div>

              {/* Meeting Link (Google Meet / Zoom) */}
              <div>
                <label className="block font-bold text-brand-navy mb-1.5">Meeting URL (Google Meet / Zoom)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-bg border border-brand-border outline-none text-brand-text focus:border-brand-primary"
                />
              </div>

              {/* Interviewer Name */}
              <div>
                <label className="block font-bold text-brand-navy mb-1.5">Assigned Interviewer</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Tech Lead, CampusPulse AI"
                  value={formData.interviewerName}
                  onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-bg border border-brand-border outline-none text-brand-text focus:border-brand-primary"
                />
              </div>

              {/* Internal Notes / Feedback */}
              <div>
                <label className="block font-bold text-brand-navy mb-1.5">Admin Notes / Session Notes</label>
                <textarea
                  rows={3}
                  placeholder="Add notes for session or candidate feedback..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-bg border border-brand-border outline-none text-brand-text focus:border-brand-primary resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-brand-border">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdating}>
                  Save & Update Status
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
