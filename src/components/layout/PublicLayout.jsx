import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { useAuth } from '../../context/AuthContext';

export const PublicLayout = () => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();
  const hideFooter = ['/login', '/admin/login', '/admin-login', '/register', '/forgot-password'].includes(location.pathname);

  // If a candidate visits /jobs or /jobs/:slug, preserve candidate workspace sidebar
  if (isAuthenticated && role === 'candidate' && location.pathname.startsWith('/jobs')) {
    const target = location.pathname.startsWith('/jobs/')
      ? location.pathname.replace('/jobs/', '/candidate/jobs/')
      : '/candidate/jobs';
    return <Navigate to={target + location.search} replace />;
  }

  // If an admin visits public job search or landing page, keep them in Admin Portal
  if (isAuthenticated && role === 'admin') {
    if (location.pathname === '/' || location.pathname === '/jobs') {
      return <Navigate to={location.pathname === '/jobs' ? '/admin/jobs' : '/admin/dashboard'} replace />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};
