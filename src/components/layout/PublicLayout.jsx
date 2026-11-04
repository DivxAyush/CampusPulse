import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';

export const PublicLayout = () => {
  const location = useLocation();
  const hideFooter = ['/login', '/admin/login', '/admin-login', '/register', '/forgot-password'].includes(location.pathname);

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
