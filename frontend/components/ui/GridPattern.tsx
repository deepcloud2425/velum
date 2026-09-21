'use client';

import React from 'react';

export function GridPattern({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute w-full h-full stroke-zinc-300/40 dark:stroke-cyan-500/10 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)] transition-colors duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0, 0)"
          >
            <path d="M.5 36V.5H36" fill="none" strokeWidth="1" strokeDasharray="2 4" />
            <circle cx="0.5" cy="0.5" r="1" className="fill-zinc-400 dark:fill-cyan-400" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

export function AmbientGlow() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/15 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 dark:from-cyan-500/20 dark:via-indigo-500/10" />
  );
}
