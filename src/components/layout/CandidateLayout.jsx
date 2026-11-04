import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

export const CandidateLayout = () => {
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

      {/* Mobile Sidebar Trigger Bar (Only on very small phone screens < 640px) */}
      <div className="sm:hidden bg-white border-b border-brand-border px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">Candidate Workspace</span>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 rounded-lg border border-brand-border text-brand-navy cursor-pointer"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 flex w-full">
        {/* Desktop & Tablet Sidebar (Permanently stays at the side) */}
        <div className="hidden sm:block flex-shrink-0">
          <Sidebar role="candidate" />
        </div>

        {/* Mobile Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div className="sm:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="relative w-64 bg-white h-full shadow-2xl z-10">
              <Sidebar role="candidate" onClose={() => setIsMobileSidebarOpen(false)} />
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
