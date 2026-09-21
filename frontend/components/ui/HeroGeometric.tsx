'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  className = '',
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-cyan-500/[0.15]',
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border border-white/[0.08] dark:border-white/[0.05] shadow-[0_8px_32px_0_rgba(6,182,212,0.1)]`}
        />
      </motion.div>
    </motion.div>
  );
}

export function HeroGeometricBackground({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Background ambient radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-500/[0.12] via-indigo-500/[0.06] to-transparent rounded-full blur-[100px] dark:from-cyan-500/[0.18] dark:via-indigo-500/[0.08] dark:to-transparent" />
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[400px] bg-gradient-to-b from-emerald-500/[0.08] to-transparent rounded-full blur-[80px] dark:from-emerald-500/[0.12]" />

      {/* Floating geometric ambient shapes */}
      <ElegantShape
        delay={0.1}
        width={560}
        height={130}
        rotate={14}
        gradient="from-cyan-500/[0.16] via-indigo-500/[0.08]"
        className="left-[-12%] md:left-[-5%] top-[14%] md:top-[18%]"
      />

      <ElegantShape
        delay={0.3}
        width={480}
        height={120}
        rotate={-16}
        gradient="from-indigo-500/[0.14] via-cyan-500/[0.06]"
        className="right-[-10%] md:right-[-3%] top-[35%] md:top-[40%]"
      />

      <ElegantShape
        delay={0.5}
        width={280}
        height={80}
        rotate={-8}
        gradient="from-emerald-500/[0.14] via-teal-500/[0.06]"
        className="left-[5%] md:left-[10%] bottom-[12%] md:bottom-[15%]"
      />

      <ElegantShape
        delay={0.4}
        width={200}
        height={60}
        rotate={20}
        gradient="from-cyan-400/[0.15]"
        className="right-[15%] top-[10%]"
      />

      {/* Subtle fine technical grid with intersection crosshairs */}
      <svg
        className="absolute inset-0 w-full h-full stroke-zinc-400/20 dark:stroke-cyan-500/10 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-grid-pattern"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 44V.5H44" fill="none" strokeWidth="1" strokeDasharray="2 4" />
            <circle cx="0.5" cy="0.5" r="1" className="fill-zinc-400/40 dark:fill-cyan-400/40" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
      </svg>
    </div>
  );
}
