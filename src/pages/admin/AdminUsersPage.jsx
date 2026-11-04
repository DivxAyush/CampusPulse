import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle2, AlertCircle, Building2, Briefcase } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { adminAPI } from '../../services/api';

export const AdminUsersPage = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.warn('Error loading users:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await adminAPI.updateUserStatus(id, { accountStatus: newStatus });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, accountStatus: newStatus } : u))
        );
        addToast(`User status changed to ${newStatus}.`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error updating status', 'error');
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-2xl font-extrabold text-brand-navy">User Management</h1>
        <p className="text-xs text-brand-muted mt-1">Review registered candidates and employer accounts.</p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white rounded-3xl border border-brand-border animate-pulse" />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users registered"
          description="There are currently no candidate or employer user accounts registered."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-xs">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-brand-bg/40">
                  <td className="py-3.5">
                    <div className="font-bold text-brand-navy">{u.fullName || 'User'}</div>
                    <div className="text-brand-muted">{u.email}</div>
                  </td>
                  <td className="py-3.5 capitalize font-semibold text-brand-navy">{u.role}</td>
                  <td className="py-3.5">
                    <Badge variant={u.accountStatus === 'active' ? 'success' : 'danger'} size="sm">
                      {u.accountStatus || 'active'}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-right">
                    <Button
                      variant={u.accountStatus === 'active' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => toggleStatus(u._id, u.accountStatus || 'active')}
                      className="text-xs"
                    >
                      {u.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const AdminCompaniesPage = () => {
  const { addToast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getCompanies();
      if (res.success && res.companies) {
        setCompanies(res.companies);
      }
    } catch (err) {
      console.warn('Error loading companies:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVerify = async (id) => {
    try {
      const res = await adminAPI.toggleCompanyVerification(id);
      if (res.success) {
        setCompanies((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isVerified: !c.isVerified } : c))
        );
        addToast('Company verification badge updated.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error updating verification', 'error');
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-2xl font-extrabold text-brand-navy">Company Verification</h1>
        <p className="text-xs text-brand-muted mt-1">Manage verified partner status badges.</p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white rounded-3xl border border-brand-border animate-pulse" />
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies found"
          description="There are currently no registered company profiles to audit."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                <th className="pb-3">Company</th>
                <th className="pb-3">Industry</th>
                <th className="pb-3">Verification</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-xs">
              {companies.map((c) => (
                <tr key={c._id} className="hover:bg-brand-bg/40">
                  <td className="py-3.5 font-bold text-brand-navy">{c.companyName || c.name}</td>
                  <td className="py-3.5 text-brand-muted">{c.industry || 'General'}</td>
                  <td className="py-3.5">
                    <Badge variant={c.isVerified ? 'primary' : 'default'} size="sm">
                      {c.isVerified ? 'Verified Partner' : 'Standard'}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleVerify(c._id)} className="text-xs">
                      Toggle Badge
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const AdminJobsPage = () => {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getJobs();
      if (res.success && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (err) {
      console.warn('Error loading jobs:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await adminAPI.deleteJob(id);
      if (res.success) {
        setJobs((prev) => prev.filter((j) => j._id !== id));
        addToast('Job listing removed by admin.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error removing job', 'error');
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-2xl font-extrabold text-brand-navy">Job Moderation</h1>
        <p className="text-xs text-brand-muted mt-1">Audit active openings across partner organizations.</p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white rounded-3xl border border-brand-border animate-pulse" />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs to moderate"
          description="There are currently no active job listings in the database."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                <th className="pb-3">Position</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-xs">
              {jobs.map((j) => {
                const compName = j.companyId?.companyName || j.company || 'Enterprise';
                return (
                  <tr key={j._id} className="hover:bg-brand-bg/40">
                    <td className="py-3.5 font-bold text-brand-navy">{j.title}</td>
                    <td className="py-3.5 text-brand-muted">{compName}</td>
                    <td className="py-3.5">
                      <Badge variant="primary" size="sm" className="capitalize">
                        {j.status || 'published'}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Button variant="danger" size="sm" onClick={() => handleRemove(j._id)} className="text-xs">
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAPI.getReports().then((res) => {
      if (res.success && res.reports) setReports(res.reports);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-2xl font-extrabold text-brand-navy">System Reports & Health</h1>
        <p className="text-xs text-brand-muted mt-1">Real-time platform infrastructure benchmarks.</p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white rounded-3xl border border-brand-border animate-pulse" />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No system reports generated"
          description="System health telemetry will appear once diagnostic tests execute."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {reports.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">{r.type || r.title}</span>
              <div className="text-2xl font-extrabold text-brand-navy">{r.latency || r.value || r.uptime}</div>
              <Badge variant="success" size="sm">
                {r.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
