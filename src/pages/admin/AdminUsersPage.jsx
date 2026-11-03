import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { adminAPI } from '../../services/api';

export const AdminUsersPage = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([
    {
      _id: '1',
      fullName: 'Ayush Sharma',
      email: 'candidate@campusplus.com',
      role: 'candidate',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      fullName: 'Priya Verma',
      email: 'recruiter@nexus.com',
      role: 'company',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '3',
      fullName: 'Rohan Mehta',
      email: 'talent@finpulse.io',
      role: 'company',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
    },
  ]);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id
          ? { ...u, accountStatus: u.accountStatus === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
    addToast('User status updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-2xl font-extrabold text-brand-navy">User Management</h1>
        <p className="text-xs text-brand-muted mt-1">Review registered candidates and employer accounts.</p>
      </div>

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
                  <div className="font-bold text-brand-navy">{u.fullName}</div>
                  <div className="text-brand-muted">{u.email}</div>
                </td>
                <td className="py-3.5 capitalize font-semibold text-brand-navy">{u.role}</td>
                <td className="py-3.5">
                  <Badge variant={u.accountStatus === 'active' ? 'success' : 'danger'} size="sm">
                    {u.accountStatus}
                  </Badge>
                </td>
                <td className="py-3.5 text-right">
                  <Button
                    variant={u.accountStatus === 'active' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => toggleStatus(u._id)}
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
    </div>
  );
};

export const AdminCompaniesPage = () => {
  const { addToast } = useToast();
  const [companies, setCompanies] = useState([
    { id: '1', name: 'Nexus Cloud Systems', industry: 'Enterprise Cloud', isVerified: true, jobs: 4 },
    { id: '2', name: 'FinPulse Technologies', industry: 'Fintech', isVerified: true, jobs: 6 },
    { id: '3', name: 'Zephyr AI Labs', industry: 'AI Research', isVerified: true, jobs: 3 },
  ]);

  const toggleVerify = (id) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isVerified: !c.isVerified } : c))
    );
    addToast('Company verification badge updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-2xl font-extrabold text-brand-navy">Company Verification</h1>
        <p className="text-xs text-brand-muted mt-1">Manage verified partner status badges.</p>
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              <th className="pb-3">Company</th>
              <th className="pb-3">Industry</th>
              <th className="pb-3">Open Jobs</th>
              <th className="pb-3">Verification</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60 text-xs">
            {companies.map((c) => (
              <tr key={c.id} className="hover:bg-brand-bg/40">
                <td className="py-3.5 font-bold text-brand-navy">{c.name}</td>
                <td className="py-3.5 text-brand-muted">{c.industry}</td>
                <td className="py-3.5 font-semibold text-brand-navy">{c.jobs} openings</td>
                <td className="py-3.5">
                  <Badge variant={c.isVerified ? 'primary' : 'default'} size="sm">
                    {c.isVerified ? 'Verified Partner' : 'Standard'}
                  </Badge>
                </td>
                <td className="py-3.5 text-right">
                  <Button variant="outline" size="sm" onClick={() => toggleVerify(c.id)} className="text-xs">
                    Toggle Badge
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminJobsPage = () => {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([
    { id: '1', title: 'Senior Frontend Engineer', company: 'Nexus Cloud Systems', status: 'published' },
    { id: '2', title: 'Backend Systems Developer', company: 'Nexus Cloud Systems', status: 'published' },
    { id: '3', title: 'Full Stack Engineer', company: 'FinPulse Technologies', status: 'published' },
  ]);

  const handleRemove = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    addToast('Job listing removed by admin.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-2xl font-extrabold text-brand-navy">Job Moderation</h1>
        <p className="text-xs text-brand-muted mt-1">Audit active openings across partner organizations.</p>
      </div>

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
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-brand-bg/40">
                <td className="py-3.5 font-bold text-brand-navy">{j.title}</td>
                <td className="py-3.5 text-brand-muted">{j.company}</td>
                <td className="py-3.5">
                  <Badge variant="primary" size="sm" className="capitalize">
                    {j.status}
                  </Badge>
                </td>
                <td className="py-3.5 text-right">
                  <Button variant="danger" size="sm" onClick={() => handleRemove(j.id)} className="text-xs">
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminReportsPage = () => {
  const reports = [
    { title: 'Platform Latency (p95)', value: '38ms', status: 'Optimal' },
    { title: 'PulseAI Inference Average', value: '1.2s', status: 'Operational' },
    { title: 'System Availability', value: '99.98%', status: 'Normal' },
    { title: 'Active Placements This Month', value: '184', status: '+14% MoM' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-brand-border pb-4">
        <h1 className="text-2xl font-extrabold text-brand-navy">System Reports & Health</h1>
        <p className="text-xs text-brand-muted mt-1">Real-time platform infrastructure benchmarks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {reports.map((r, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">{r.title}</span>
            <div className="text-2xl font-extrabold text-brand-navy">{r.value}</div>
            <Badge variant="success" size="sm">
              {r.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
