import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

export const CompanyLayout = () => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      {/* Mobile Sidebar Trigger Bar */}
      <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">Recruiter Workspace</span>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 rounded-lg border border-brand-border text-brand-navy"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar role="company" />
        </div>

        {/* Mobile Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="relative w-72 bg-white h-full shadow-2xl z-10">
              <Sidebar role="company" onClose={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AdminLayout = () => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">Admin Portal</span>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 rounded-lg border border-brand-border text-brand-navy"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <div className="hidden lg:block">
          <Sidebar role="admin" />
        </div>

        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="relative w-72 bg-white h-full shadow-2xl z-10">
              <Sidebar role="admin" onClose={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
