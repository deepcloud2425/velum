'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, ArrowDownLeft, QrCode, ShieldPlus, ArrowUpRight } from 'lucide-react';

export interface QuickActionsProps {
  onOpenDeposit: () => void;
  onOpenInvoice?: () => void;
}

export function QuickActions({ onOpenDeposit, onOpenInvoice }: QuickActionsProps) {
  const actions = [
    {
      label: 'Send Confidential',
      desc: 'Zero-knowledge transfer',
      href: '/send',
      icon: Send,
      highlight: true,
    },
    {
      label: 'Receive Payment',
      desc: 'Shielded QR & stealth addr',
      href: '/receive',
      icon: ArrowDownLeft,
      highlight: false,
    },
    {
      label: 'Request Payment',
      desc: 'Confidential invoice link',
      href: onOpenInvoice ? undefined : '/request',
      onClick: onOpenInvoice,
      icon: QrCode,
      highlight: false,
    },
    {
      label: 'Shield Funds',
      desc: 'Deposit L1 into private note',
      onClick: onOpenDeposit,
      icon: ShieldPlus,
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        const content = (
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-2xl border transition-all duration-200 group flex items-start justify-between cursor-pointer shadow-card relative ${
              act.highlight
                ? 'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-500/40 hover:border-cyan-500 hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.25)]'
                : 'bg-white dark:bg-[#0C101C] border-zinc-200 dark:border-slate-800 hover:border-cyan-500/40 hover:shadow-card-hover'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  act.highlight
                    ? 'bg-cyan-500 text-black shadow-xs font-bold'
                    : 'bg-zinc-100 dark:bg-slate-850 text-zinc-700 dark:text-zinc-300 group-hover:bg-cyan-500 group-hover:text-black border border-zinc-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950 dark:text-white transition-colors font-sans">
                  {act.label}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 font-mono">{act.desc}</p>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors shrink-0" />
          </motion.div>
        );

        if (act.href) {
          return (
            <Link key={act.label} href={act.href} className="block">
              {content}
            </Link>
          );
        }

        return (
          <button key={act.label} onClick={act.onClick} className="text-left w-full block">
            {content}
          </button>
        );
      })}
    </div>
  );
}
