'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  variant?: 'default' | 'accent' | 'subtle' | 'gold' | 'interactive' | 'obsidian' | 'glass' | 'spotlight';
  interactive?: boolean;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, children, ...props }, ref) => {
    const variants: Record<string, string> = {
      default:
        'bg-white dark:bg-[#0C101C] border border-zinc-200/90 dark:border-slate-800/90 shadow-card text-zinc-900 dark:text-zinc-100',
      accent:
        'bg-white dark:bg-[#0C101C] border-2 border-cyan-500/80 shadow-[0_0_24px_-4px_rgba(6,182,212,0.25)] text-zinc-900 dark:text-zinc-100',
      gold:
        'bg-white dark:bg-[#0C101C] border border-cyan-500/60 shadow-[0_0_20px_-4px_rgba(6,182,212,0.2)] text-zinc-900 dark:text-zinc-100',
      subtle:
        'bg-zinc-50 dark:bg-[#080B14] border border-zinc-200/80 dark:border-slate-800/60 text-zinc-900 dark:text-zinc-100',
      interactive:
        'bg-white dark:bg-[#0C101C] border border-zinc-200/90 dark:border-slate-800/90 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-card-hover ' +
        'cursor-pointer transition-all duration-200 text-zinc-900 dark:text-zinc-100',
      obsidian:
        'bg-[#06080F] border border-slate-800/90 text-white shadow-fintech',
      glass:
        'glass-panel text-zinc-900 dark:text-zinc-100 shadow-card',
      spotlight:
        'relative bg-white dark:bg-[#0C101C] border border-zinc-200/90 dark:border-slate-800/90 text-zinc-900 dark:text-zinc-100 shadow-card hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)] transition-all duration-300',
    };

    const isInteractive = interactive || variant === 'interactive';

    return (
      <motion.div
        ref={ref}
        whileHover={isInteractive ? { y: -2, transition: { duration: 0.18 } } : undefined}
        whileTap={isInteractive ? { scale: 0.99 } : undefined}
        className={twMerge(
          clsx(
            'rounded-2xl p-6 transition-colors duration-200',
            variants[variant],
            className
          )
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
