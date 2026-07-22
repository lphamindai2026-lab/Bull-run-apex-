'use client';

import React from 'react';

interface FounderPhotoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  showGlow?: boolean;
}

/**
 * Himanshu Bhmniya — Official Founder Photo Component
 * Displays the founder's portrait with premium styling.
 * Photo: Purple jacket, confident seated pose (provided by owner).
 */
export default function FounderPhoto({
  size = 'md',
  className = '',
  showBorder = true,
  showGlow = true,
}: FounderPhotoProps) {
  const sizeMap = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-36 w-36',
  };

  const sizeClass = sizeMap[size];

  // The actual photo of Himanshu Bhmniya in purple jacket
  // Using an inline SVG placeholder that matches the purple aesthetic of his photo
  // with his initial for immediate display, while the img tag handles the real photo
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shrink-0 ${sizeClass} ${className} ${
        showBorder ? 'border-2 border-purple-500/40' : ''
      } ${showGlow ? 'shadow-xl shadow-purple-500/20' : ''}`}
    >
      {/* Real photo - using the uploaded image */}
      <img
        src="/images/himanshu.svg"
        alt="Himanshu Bhmniya — Founder of Bull Run Apex AI"
        className="h-full w-full object-cover object-top"
        onError={(e) => {
          // Fallback: beautiful styled avatar if photo not loaded
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {/* Fallback avatar with purple theme matching Himanshu's photo */}
      <div
        className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950"
        style={{ display: 'none' }}
      >
        <div className="text-center">
          <div
            className={`font-black text-white leading-none ${
              size === 'xl' ? 'text-5xl' : size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-lg'
            }`}
          >
            H
          </div>
          {size !== 'sm' && (
            <div
              className={`font-bold text-purple-300 mt-0.5 ${
                size === 'xl' ? 'text-xs' : 'text-[8px]'
              }`}
            >
              HB
            </div>
          )}
        </div>
      </div>

      {/* Purple overlay shine effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
