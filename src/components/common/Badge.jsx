import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-brand-bg text-brand-text border border-brand-border',
    primary: 'bg-brand-primary-light text-brand-navy border border-emerald-200/60 font-semibold',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-red-50 text-red-800 border border-red-200',
    navy: 'bg-brand-navy text-white',
    outline: 'border border-brand-border text-brand-muted',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
    lg: 'text-sm px-3 py-1.5 rounded-lg font-medium',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 transition-colors select-none ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
