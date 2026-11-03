import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-brand-border ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-brand-primary-light flex items-center justify-center text-brand-primary mb-4 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h4 className="text-base sm:text-lg font-bold text-brand-navy">{title}</h4>
      {description && <p className="mt-1.5 text-sm text-brand-muted max-w-sm">{description}</p>}
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-5">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-gray-200/80 rounded-xl ${className}`} />;
};
