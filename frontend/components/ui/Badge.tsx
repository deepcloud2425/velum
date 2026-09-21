import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'indigo' | 'emerald' | 'yellow' | 'neutral' | 'green' | 'red' | 'gold' | 'slate';
  size?: 'sm' | 'md';
  pulseDot?: boolean;
}

export function Badge({
  className,
  variant = 'cyan',
  size = 'sm',
  pulseDot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    cyan: 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 font-bold',
    indigo: 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 font-bold',
    emerald: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bold',
    green: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bold',
    yellow: 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 font-bold',
    gold: 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 font-bold',
    neutral: 'bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-slate-700',
    slate: 'bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-slate-700',
    red: 'bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25 font-bold',
  };

  const dotColors = {
    cyan: 'bg-cyan-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    green: 'bg-emerald-500',
    yellow: 'bg-cyan-500',
    gold: 'bg-cyan-500',
    neutral: 'bg-zinc-400 dark:bg-zinc-500',
    slate: 'bg-zinc-400 dark:bg-zinc-500',
    red: 'bg-red-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium rounded-md border font-mono select-none transition-colors duration-150',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {pulseDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={clsx(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColors[variant]
            )}
          />
          <span
            className={clsx('relative inline-flex rounded-full h-1.5 w-1.5', dotColors[variant])}
          />
        </span>
      )}
      {children}
    </span>
  );
}
