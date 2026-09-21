'use client';

import React from 'react';
import Link from 'next/link';

export interface VelumLogoProps {
  variant?: 'mark' | 'full' | 'compact' | 'badge' | 'wordmark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  href?: string;
  theme?: 'dark' | 'light' | 'auto';
  showBadge?: boolean;
}

export function VelumLogoMark({
  size = 32,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        <linearGradient id="velumGrad1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="velumGlow" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
        </linearGradient>
        <filter id="velumBlur" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Ambient background glow */}
      <circle cx="24" cy="24" r="16" fill="url(#velumGlow)" filter="url(#velumBlur)" opacity="0.4" />

      {/* Hexagonal Shield Outline */}
      <polygon
        points="24,4 42,14 42,34 24,44 6,34 6,14"
        stroke="url(#velumGrad1)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="rgba(6, 182, 212, 0.05)"
      />

      {/* Inner Interlocking ZK Veil (Continuous Möbius Curve) */}
      <path
        d="M24 12C28 16 32 20 32 26C32 30.4183 28.4183 34 24 34C19.5817 34 16 30.4183 16 26C16 20 20 16 24 12Z"
        stroke="url(#velumGrad1)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Central Zero-Knowledge Singularity Core */}
      <circle cx="24" cy="24" r="3.5" fill="#06B6D4" />
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

export function VelumLogo({
  variant = 'full',
  size = 'md',
  className = '',
  href,
  theme = 'auto',
  showBadge = false,
}: VelumLogoProps) {
  const sizeMap = {
    xs: { markSize: 22, fontSize: 'text-xs', gap: 'gap-1.5' },
    sm: { markSize: 28, fontSize: 'text-sm', gap: 'gap-2' },
    md: { markSize: 34, fontSize: 'text-lg', gap: 'gap-2.5' },
    lg: { markSize: 42, fontSize: 'text-xl', gap: 'gap-3' },
    xl: { markSize: 52, fontSize: 'text-2xl', gap: 'gap-3.5' },
  };

  const { markSize, fontSize, gap } = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center ${gap} ${className} group cursor-pointer select-none`}>
      {/* Brand Icon Mark */}
      <div className="transition-transform duration-300 ease-out group-hover:scale-105 active:scale-95">
        <VelumLogoMark size={markSize} />
      </div>

      {/* Brand Name Typography Lockup */}
      {variant !== 'mark' && (
        <div className="flex items-center gap-2">
          <span
            className={`font-black tracking-widest font-sans leading-none text-zinc-900 dark:text-white ${fontSize}`}
            style={{ letterSpacing: '0.12em' }}
          >
            VELUM
          </span>
          {showBadge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              ZK
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}
