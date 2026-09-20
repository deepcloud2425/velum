'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, ArrowRight, Lock, Key, Check, RefreshCw, Zap, EyeOff, Hash } from 'lucide-react';
import { Button } from '../ui/Button';

export function InteractiveCircuitVisualizer() {
  const [selectedCircuit, setSelectedCircuit] = useState<'send' | 'invoice' | 'withdraw'>('send');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [proofState, setProofState] = useState<'idle' | 'witness' | 'proving' | 'verified'>('idle');
  const [testAmount, setTestAmount] = useState('250.00');
  const [nullifierHash, setNullifierHash] = useState('0x8f4b2a91c0e3d5...null');
  const [noteCommitment, setNoteCommitment] = useState('0x3c91f04b8a2e1d...cmmt');

  const triggerSimulation = () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    setProofState('witness');

    setTimeout(() => {
      setProofState('proving');
    }, 700);

    setTimeout(() => {
      setProofState('verified');
      setIsSynthesizing(false);
      setNullifierHash('0x' + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...null');
      setNoteCommitment('0x' + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...cmmt');
    }, 1800);
  };

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-slate-800 bg-white dark:bg-[#0A0E1A] p-5 sm:p-7 shadow-card overflow-hidden relative transition-colors duration-200">
      {/* Top Hairline Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Midnight Compact ZK Engine • v0.31.1
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-zinc-950 dark:text-white tracking-tight mt-1 font-sans">
            Zero-Knowledge Witness Synthesis & Circuit Execution
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            Test how off-chain witnesses satisfy R1CS constraints without disclosing values or spend keys.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={triggerSimulation}
          disabled={isSynthesizing}
          className="shrink-0 font-mono text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
          {isSynthesizing ? 'Synthesizing...' : 'Simulate Circuit'}
        </Button>
      </div>

      {/* Circuit Type Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-4 pb-1">
        {(['send', 'invoice', 'withdraw'] as const).map((circ) => (
          <button
            key={circ}
            type="button"
            onClick={() => setSelectedCircuit(circ)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedCircuit === circ
                ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-xs'
                : 'bg-zinc-100 dark:bg-slate-900/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent'
            }`}
          >
            {circ === 'send'
              ? 'circuit send_confidential()'
              : circ === 'invoice'
              ? 'circuit pay_invoice()'
              : 'circuit withdraw_unshielded()'}
          </button>
        ))}
      </div>

      {/* Interactive 3-Stage Circuit Architecture Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 relative">
        {/* Step 1: Private Inputs (Shielded in Browser) */}
        <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-[#070A12] border border-zinc-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200/60 dark:border-slate-800/60">
              <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-cyan-500" />
                1. Private Witness
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20">
                Client Only
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Spend Key:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">●●●●●●●● (Secret)</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Transfer Value:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-20 px-1.5 py-0.5 text-right font-bold text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-slate-700 rounded-lg bg-zinc-50 dark:bg-slate-800/80 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold text-[11px]">NIGHT</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Blinding Salt:</span>
                <span className="text-zinc-600 dark:text-zinc-400 text-[11px] truncate max-w-[110px]">r_seed_0x7b4a2...</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200/60 dark:border-slate-800/60 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            *Never broadcasted to network nodes
          </div>
        </div>

        {/* Step 2: Prover Circuit (Compact on Midnight) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1220] border-2 border-cyan-500/50 dark:border-cyan-500/40 flex flex-col justify-between relative shadow-[0_0_25px_-5px_rgba(6,182,212,0.15)]">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100 dark:border-slate-800/60">
              <span className="text-[11px] font-mono font-bold text-zinc-950 dark:text-white uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                2. Compact Prover
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-mono font-extrabold shadow-xs">
                BLS12-381
              </span>
            </div>

            {/* Visualizer Status Orb */}
            <div className="my-3 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-zinc-100 dark:bg-slate-900 border border-zinc-300 dark:border-slate-700 flex items-center justify-center relative shadow-inner">
                {proofState === 'idle' && (
                  <Zap className="w-6 h-6 text-cyan-500" />
                )}
                {proofState === 'witness' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full"
                  />
                )}
                {proofState === 'proving' && (
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="w-7 h-7 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                  />
                )}
                {proofState === 'verified' && (
                  <Check className="w-7 h-7 text-emerald-500 stroke-[3]" />
                )}
              </div>
              <p className="mt-2 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {proofState === 'idle' && 'Ready for Witness Generation'}
                {proofState === 'witness' && 'Synthesizing R1CS Constraints...'}
                {proofState === 'proving' && 'Generating zk-SNARK Proof (π_zk)...'}
                {proofState === 'verified' && 'Circuit Constraints Satisfied!'}
              </p>
              <span className="text-[10px] font-mono text-zinc-400">
                {proofState === 'verified' ? 'Proof size: 384 bytes • Verified in 4ms' : '1,428 arithmetic gates'}
              </span>
            </div>
          </div>

          <div className="w-full bg-zinc-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full"
              initial={{ width: '0%' }}
              animate={{
                width:
                  proofState === 'idle'
                    ? '0%'
                    : proofState === 'witness'
                    ? '45%'
                    : proofState === 'proving'
                    ? '85%'
                    : '100%',
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step 3: Public State Output (On-Chain Settlement) */}
        <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-[#070A12] border border-zinc-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200/60 dark:border-slate-800/60">
              <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                3. On-Chain Ledger
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                Public State
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-zinc-500 text-[10px] mb-0.5">
                  <span>Note Commitment:</span>
                  <Hash className="w-3 h-3 text-cyan-500" />
                </div>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold break-all text-[11px]">
                  {noteCommitment}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-zinc-500 text-[10px] mb-0.5">
                  <span>Spent Nullifier:</span>
                  <Lock className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold break-all text-[11px]">
                  {nullifierHash}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Double-Spend Guard:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <Check className="w-3 h-3" /> Validated
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200/60 dark:border-slate-800/60 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            *Observer sees only zero-knowledge hashes
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="pt-3 border-t border-zinc-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono gap-2">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Off-Chain WASM Prover Latency: ~840ms</span>
        </span>
        <span className="text-zinc-400 dark:text-zinc-500">
          Formal Soundness: BLS12-381 pairing curve with perfect cryptographic hiding
        </span>
      </div>
    </div>
  );
}
