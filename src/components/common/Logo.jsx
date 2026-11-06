import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Logo = ({
  variant = 'full', // 'full' | 'icon' | 'mark'
  size = 'md',     // 'sm' | 'md' | 'lg'
  isDark = false,   // whether rendered on dark background (like footer)
  className = '',
  withLink = true,
  to,
}) => {
  const { isAuthenticated, role } = useAuth();
  const targetLink = to || (isAuthenticated ? (role === 'admin' ? '/admin/dashboard' : role === 'company' ? '/company/dashboard' : '/') : '/');

  const sizes = {
    sm: { icon: 'h-8', full: 'h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'h-10', full: 'h-9', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'h-12', full: 'h-11', text: 'text-2xl', sub: 'text-[11px]' },
  };

  const selectedSize = sizes[size] || sizes.md;

  if (variant === 'image') {
    const imageContent = (
      <img
        src="/logo-full.png"
        alt="Campus Plus AI"
        className={`${selectedSize.full} w-auto object-contain transition-transform duration-200 group-hover:scale-105 ${className}`}
      />
    );
    return withLink ? <Link to={targetLink} className="group inline-flex items-center">{imageContent}</Link> : imageContent;
  }

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Standalone Icon Emblem */}
      <img
        src="/logo-icon.png"
        alt="Campus Plus"
        className={`${selectedSize.icon} w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm`}
      />

      {/* If full variant, display brand text with accurate gradient & subtitle */}
      {variant === 'full' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center font-extrabold tracking-tight leading-none">
            <span className={`${selectedSize.text} ${isDark ? 'text-white' : 'text-[#062D32]'}`}>
              Campus
            </span>
            <span
              className={`${selectedSize.text} bg-gradient-to-r from-[#159B79] to-[#0D6B53] bg-clip-text text-transparent ml-0.5`}
            >
              Plus
            </span>
            <span
              className={`${selectedSize.text} bg-gradient-to-r from-[#159B79] to-[#2FD1A6] bg-clip-text text-transparent ml-1 font-black`}
            >
              AI
            </span>
          </div>
          <span
            className={`${selectedSize.sub} uppercase tracking-widest font-bold mt-1 ${
              isDark ? 'text-gray-400' : 'text-[#71817F]'
            }`}
          >
            Smart Recruitment
          </span>
        </div>
      )}
    </div>
  );

  if (!withLink) {
    return content;
  }

  return (
    <Link to={targetLink} className="group inline-flex items-center">
      {content}
    </Link>
  );
};
