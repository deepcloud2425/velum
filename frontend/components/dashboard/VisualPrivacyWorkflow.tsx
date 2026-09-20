'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Shield, Eye, EyeOff, Lock, CheckCircle2, ArrowRight, Database, Cpu } from 'lucide-react';

export function VisualPrivacyWorkflow() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'comparison'>('workflow');

  return (
    <Card className="bg-white dark:bg-[#0C101C] border border-zinc-200 dark:border-slate-800 shadow-card p-6 text-zinc-900 dark:text-zinc-100 space-y-4 rounded-3xl transition-colors duration-200">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-sans flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span>Zero-Knowledge Privacy Architecture</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            How Compact smart contracts and Groth16 zk-SNARKs protect transactional data.
          </p>
        </div>

        <div className="flex rounded-xl bg-zinc-100 dark:bg-slate-900 p-1 border border-zinc-200 dark:border-slate-800 text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'workflow'
                ? 'bg-cyan-500 text-black shadow-xs font-extrabold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Proof Workflow
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'comparison'
                ? 'bg-cyan-500 text-black shadow-xs font-extrabold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            On-Chain vs Shielded
          </button>
        </div>
      </div>

      {activeTab === 'workflow' ? (
        /* Workflow Stepper */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Step 1: Off-Chain Witness */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#070A12] border border-zinc-200 dark:border-slate-800 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Step 1 • Browser Local</span>
              <EyeOff className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <h4 className="font-bold text-zinc-950 dark:text-white text-xs font-sans">Private Witness Generation</h4>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Your 1AM Wallet synthesizes secret note values (spending key, input balance, and blinding salt). Secret parameters never touch the network.
            </p>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 text-[10px] text-zinc-700 dark:text-zinc-300">
              <code>Witness = (sk, amount, salt)</code>
            </div>
          </div>

          {/* Step 2: Groth16 Proof */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase">Step 2 • Cryptographic Circuit</span>
              <Lock className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <h4 className="font-bold text-zinc-950 dark:text-white text-xs font-sans">Groth16 zk-SNARK Proving</h4>
            <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
              The Compact circuit proves value conservation (<code>in = out + change</code>) and spends the input nullifier without revealing amounts or counterparties.
            </p>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-cyan-500/30 text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">
              <code>Proof = π_zk (R1CS Constraints)</code>
            </div>
          </div>

          {/* Step 3: Ledger Verification */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#070A12] border border-zinc-200 dark:border-slate-800 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Step 3 • Midnight Consensus</span>
              <Database className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <h4 className="font-bold text-zinc-950 dark:text-white text-xs font-sans">On-Chain Settlement</h4>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Midnight validators verify proof validity in 4ms. The spent nullifier is recorded to prevent double spending and the new note commitment is inserted into the Merkle tree.
            </p>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              <code>Ledger = (Commitment, Nullifier)</code>
            </div>
          </div>
        </div>
      ) : (
        /* Comparison Table View */
        <div className="rounded-2xl border border-zinc-200 dark:border-slate-800 overflow-hidden font-mono text-xs">
          <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-slate-800">
            <div className="p-3.5 bg-zinc-50 dark:bg-[#070A12]">
              <span className="text-[10px] text-red-500 font-bold block mb-1">Standard Public Ledger</span>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px]">
                <li>• Public sender & receiver addresses</li>
                <li>• Exact transaction values exposed</li>
                <li>• Full historical wallet balances indexed</li>
                <li>• Susceptible to address clustering</li>
              </ul>
            </div>
            <div className="p-3.5 bg-cyan-500/5 dark:bg-cyan-500/10">
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block mb-1">Velum on Midnight</span>
              <ul className="space-y-1 text-zinc-800 dark:text-zinc-200 text-[11px]">
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Shielded note commitments</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Cryptographic spent nullifiers</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Encrypted peer-to-peer invoices</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Optional selective viewing keys</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
