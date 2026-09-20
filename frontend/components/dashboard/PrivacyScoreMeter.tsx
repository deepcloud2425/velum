'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface PrivacyScoreMeterProps {
  shieldedNight: string;
  unshieldedNight: string;
}

export function PrivacyScoreMeter({
  shieldedNight,
  unshieldedNight,
}: PrivacyScoreMeterProps) {
  const sNum = parseFloat(shieldedNight.replace(/,/g, '')) || 0;
  const uNum = parseFloat(unshieldedNight.replace(/,/g, '')) || 0;
  const total = sNum + uNum;

  const score = total > 0 ? Math.min(100, Math.round((sNum / total) * 100)) : 100;

  // Radial gauge maths (Semi-circle arc: radius = 42, cx = cy = 52)
  const R = 42;
  const CX = 52;
  const CY = 54;
  const circumference = Math.PI * R;
  const dashFill = (score / 100) * circumference;

  const gaugeColor =
    score >= 80 ? '#10B981' : score >= 50 ? '#06B6D4' : '#EF4444';

  const statusLabel =
    score >= 80 ? 'Optimal' : score >= 50 ? 'Partially Shielded' : 'Exposed L1';

  const statusClasses =
    score >= 80
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
      : score >= 50
      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25'
      : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25';

  const dotColor =
    score >= 80 ? 'bg-emerald-500 animate-pulse' : score >= 50 ? 'bg-cyan-500' : 'bg-red-500';

  return (
    <Card className="flex flex-col justify-between bg-white dark:bg-[#0C101C] border border-zinc-200/90 dark:border-slate-800/90 shadow-card h-full transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-bold">
            Privacy Health
          </h3>
        </div>
        <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 shadow-xs ${statusClasses}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {statusLabel}
        </span>
      </div>

      {/* Radial Gauge */}
      <div className="py-4 flex flex-col items-center">
        <div className="relative">
          <svg
            width="110"
            height="64"
            viewBox="0 0 104 60"
            fill="none"
            aria-label={`Privacy score: ${score}%`}
          >
            {/* Track arc */}
            <path
              d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
              className="stroke-zinc-200 dark:stroke-slate-800"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Animated Fill arc */}
            <motion.path
              d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
              stroke={gaugeColor}
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - dashFill }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>

          {/* Centered percentage readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
            <span className="text-2xl font-black font-mono tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {score}%
            </span>
          </div>
        </div>

        <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-2 text-center">
          {score === 100
            ? 'All assets shielded by Midnight ZK.'
            : score >= 50
            ? 'Some tokens remain in unshielded L1.'
            : 'Transfer L1 tokens to shielded vault.'}
        </p>
      </div>

      {/* Breakdown footer */}
      <div className="pt-3 border-t border-zinc-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-center text-xs font-mono">
        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200/80 dark:border-slate-800/80">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">Shielded</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {shieldedNight}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200/80 dark:border-slate-800/80">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">Unshielded</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">
            {unshieldedNight}
          </span>
        </div>
      </div>
    </Card>
  );
}
