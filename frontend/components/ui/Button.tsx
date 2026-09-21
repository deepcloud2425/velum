'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Emil Kowalski style: 160ms ease-out, scale(0.97) on press
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium transition-all duration-[180ms] ease-out ' +
      'select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none ' +
      'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 overflow-hidden';

    const variants = {
      default:
        'bg-primary text-primary-foreground shadow-[0_5px_0_rgba(138,92,28,0.95)] hover:bg-primary-hover border border-primary/60 rounded-md',
      primary:
        'bg-primary text-primary-foreground shadow-[0_5px_0_rgba(138,92,28,0.95)] hover:bg-primary-hover border border-primary/60 rounded-md',
      secondary:
        'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 border border-border rounded-md',
      glass:
        'backdrop-blur-xl bg-white/[0.035] text-foreground border border-white/[0.12] hover:bg-white/[0.07] hover:border-primary/35 rounded-md shadow-glass',
      outline:
        'bg-transparent border border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/45 rounded-md',
      ghost:
        'bg-transparent text-foreground hover:bg-white/[0.05] rounded-md',
      danger:
        'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-md',
      destructive:
        'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-md',
    };

    const sizes = {
      xs: 'min-h-9 px-3 py-1.5 text-[11px] gap-1.5',
      sm: 'min-h-10 px-3.5 py-2 text-xs gap-1.5',
      md: 'min-h-11 px-4 py-2 text-sm gap-2',
      lg: 'min-h-12 px-8 py-2.5 text-base gap-2.5',
      icon: 'h-11 w-11 shrink-0',
    };


    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        <div className={clsx("flex items-center gap-2 transition-all duration-200", isLoading && "opacity-0 blur-sm")}>
          {children}
        </div>
        
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

