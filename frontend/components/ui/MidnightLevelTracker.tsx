'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Shield, Lock, FileCode, Cpu, Layers, Sparkles, ChevronRight, KeyRound } from 'lucide-react';

interface LevelMilestone {
  level: number;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  contractMethod: string;
  features: string[];
  status: 'Verified' | 'Active';
}

const levels: LevelMilestone[] = [
  {
    level: 1,
    title: 'Genesis & Compact Foundation',
    badge: 'Level 1 Complete',
    subtitle: 'Toolchain stand up & Compact contract deployment on Midnight Preprod',
    description:
      'Stood up the Compact v0.31.1 compiler toolchain, wrote the foundational smart contract with private state declaration, and deployed to Midnight Preprod with 1AM Wallet integration.',
    contractMethod: 'export ledger balance: Cell<Uint<64>>',
    features: [
      'Compact smart contract compiled to WASM runtime',
      'Midnight Preprod deployment verification',
      'Official 1AM Wallet DApp Connector v4.0.1 handshake',
      'Zero-stutter singleton connection polling (350ms)',
    ],
    status: 'Verified',
  },
  {
    level: 2,
    title: 'Confidential Note Tree & Circuits',
    badge: 'Level 2 Complete',
    subtitle: 'Private note commitments, spend authorization & nullifier mechanics',
    description:
      'Engineered zero-knowledge circuits for confidential value transfer. Built cryptographic note commitments and spent nullifiers to prevent double-spending without revealing balances.',
    contractMethod: 'circuit send_confidential(sk: Bytes<32>, val: Uint<64>, salt: Bytes<32>)',
    features: [
      'Shielded deposit & transfer circuits with BLS12-381 proofs',
      'Cryptographic blinding nonces for indistinguishable notes',
      'Spent nullifier hash set to enforce double-spend protection',
      'Sub-second WASM client prover (<850ms in browser)',
    ],
    status: 'Verified',
  },
  {
    level: 3,
    title: 'Viewing Keys & Multi-Party Invoices',
    badge: 'Level 3 Complete',
    subtitle: 'Counterparty public key encryption & selective compliance disclosure',
    description:
      'Added multi-party encrypted invoicing and selective viewing keys. Allows authorized compliance officers and auditors to verify transaction history without revealing private spend keys.',
    contractMethod: 'circuit pay_invoice(invoice_id: Bytes<32>, encrypted_memo: Bytes<128>)',
    features: [
      'P2P confidential payment requests with encrypted metadata',
      'Dynamic QR code generator with counterparty public key',
      'Selective viewing key disclosure for tax & regulatory audit',
      'Private balance masking with instant visibility toggle',
    ],
    status: 'Verified',
  },
  {
    level: 4,
    title: 'Gasless DUST & Production Ledger',
    badge: 'Level 4 Complete',
    subtitle: 'Dust-free UX, automated indexer polling & production readiness',
    description:
      'Integrated native Midnight DUST balancing for completely fee-sponsored, dust-free transactions. Real-time GraphQL indexer polling monitors block settlement with instant state updates.',
    contractMethod: 'export circuit balanceUnsealedTransaction(dust_fee: Uint<64>)',
    features: [
      'Dust-free transaction sponsorship via 1AM Wallet Facade',
      'Real-time Midnight GraphQL indexer block sync',
      'Multi-network routing (Preprod Staging, Preview Sandbox, Mainnet)',
      '100% offline-ready test suite with 58 automated unit tests',
    ],
    status: 'Verified',
  },
];

export function MidnightLevelTracker() {
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const current = levels.find((l) => l.level === activeLevel) || levels[0];

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-slate-800 bg-white dark:bg-[#0A0E1A] p-6 sm:p-8 shadow-card overflow-hidden transition-colors duration-200">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-slate-800/80">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block mb-1">
            Cohort Milestones
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight font-sans">
            Midnight Architecture Levels 1 to 4
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Explore how Velum was systematically built and verified across every milestone of the Midnight cohort.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shrink-0 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All 4 Levels Verified</span>
        </div>
      </div>

      {/* Level Buttons Stepper Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-6">
        {levels.map((lvl) => {
          const isSelected = activeLevel === lvl.level;
          return (
            <button
              key={lvl.level}
              type="button"
              onClick={() => setActiveLevel(lvl.level)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-[0_0_20px_-3px_rgba(6,182,212,0.2)]'
                  : 'border-zinc-200 dark:border-slate-800 bg-zinc-50/60 dark:bg-slate-900/40 hover:border-zinc-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-cyan-500 text-black'
                      : 'bg-zinc-200 dark:bg-slate-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  LEVEL {lvl.level}
                </span>
                <CheckCircle2
                  className={`w-4 h-4 ${
                    isSelected ? 'text-cyan-500 dark:text-cyan-400' : 'text-emerald-500'
                  }`}
                />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate font-sans">
                {lvl.title.split('&')[0]}
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 truncate">
                {lvl.status}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Level Deep-Dive Showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.level}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="p-5 sm:p-6 rounded-2xl bg-zinc-50/90 dark:bg-[#070A12] border border-zinc-200/90 dark:border-slate-800/90 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200/80 dark:border-slate-800/80">
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                Milestone 0{current.level}
              </span>
              <h4 className="text-base sm:text-lg font-black text-zinc-950 dark:text-white font-sans">
                {current.title}
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-mono font-bold self-start sm:self-auto">
              ✓ {current.badge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
            {current.description}
          </p>

          {/* Compact Contract Code Signature */}
          <div className="p-3 rounded-xl bg-zinc-900 dark:bg-[#04060B] border border-zinc-800 dark:border-slate-800 font-mono text-xs text-zinc-100 flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <code className="text-cyan-300 font-semibold whitespace-nowrap">
                {current.contractMethod}
              </code>
            </div>
            <span className="text-[10px] text-zinc-400 shrink-0 ml-3">
              Compact v0.31.1
            </span>
          </div>

          {/* Feature Bullets Grid */}
          <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
            {current.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-zinc-200/80 dark:border-slate-800/80 text-xs font-mono text-zinc-800 dark:text-zinc-200 flex items-start gap-2.5"
              >
                <div className="w-4 h-4 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
