import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'emerald',
  to,
  onClick,
  isLoading = false,
  className = '',
}) => {
  const content = (
    <motion.div
      whileHover={to || onClick ? { y: -3 } : { y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white p-5 rounded-2xl border border-brand-border shadow-subtle transition-all duration-200 ${
        to || onClick
          ? 'cursor-pointer hover:border-brand-primary hover:shadow-card group'
          : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted group-hover:text-brand-primary transition-colors">
            {title}
          </span>
          {(to || onClick) && (
            <ArrowUpRight className="w-3.5 h-3.5 text-brand-muted opacity-0 group-hover:opacity-100 group-hover:text-brand-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {isLoading ? (
          <div className="h-8 w-20 bg-slate-200/80 rounded-lg animate-pulse" />
        ) : (
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            {value ?? 0}
          </span>
        )}
        {!isLoading && trend && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {trend}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse mt-2" />
      ) : (
        subtitle && <p className="mt-1.5 text-xs text-brand-muted">{subtitle}</p>
      )}
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className="block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
