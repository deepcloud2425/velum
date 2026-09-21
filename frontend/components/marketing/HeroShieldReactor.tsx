'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Radio, 
  Zap, 
  Sparkles, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Terminal, 
  Flame,
  ArrowRight
} from 'lucide-react';

type ReactorMode = 'shield' | 'transfer' | 'audit';

export function HeroShieldReactor() {
  const [activeMode, setActiveMode] = useState<ReactorMode>('shield');
  const [isFiring, setIsFiring] = useState(false);
  const [firingStep, setFiringStep] = useState<number>(0);
  const [constraintsCount, setConstraintsCount] = useState<number>(24180);

  const handleFireReactor = () => {
    if (isFiring) return;
    setIsFiring(true);
    setFiringStep(1);
    
    let count = 0;
    const countTimer = setInterval(() => {
      count += 4836;
      if (count >= 24180) {
        clearInterval(countTimer);
        setConstraintsCount(24180);
      } else {
        setConstraintsCount(count);
      }
    }, 150);

    setTimeout(() => setFiringStep(2), 350);
    setTimeout(() => setFiringStep(3), 750);
    setTimeout(() => {
      setFiringStep(4);
      setTimeout(() => {
        setIsFiring(false);
        setFiringStep(0);
      }, 1200);
    }, 1200);
  };

  const modeData = {
    shield: {
      tag: 'SHIELD_DEPOSIT',
      title: 'Homomorphic Value Blinding',
      equation: 'C = g^v \\cdot h^r \\pmod p',
      entropy: '256 Bits',
      steps: [
        'Sample secret blinding r ∈ Fr',
        'Synthesize Pedersen commitment C',
        'Append C to depth-32 Merkle root',
      ],
    },
    transfer: {
      tag: 'CONFIDENTIAL_TRANSFER',
      title: 'Spent Nullifier & Conservation',
      equation: 'N = \\mathcal{H}_{\\text{Poseidon}}(sk, \\rho) \\implies \\Delta = 0',
      entropy: '512 Bits',
      steps: [
        'Derive nullifier N = Poseidon(sk, ρ)',
        'Enforce ∑Inputs == ∑Outputs in ZK',
        'Inscribe spent nullifier N to state',
      ],
    },
    audit: {
      tag: 'SELECTIVE_DISCLOSURE',
      title: 'Viewing Key Handshake',
      equation: 'K_{\\text{shared}} = \\text{ECDH}(sk_{\\text{owner}}, PK_{\\text{auditor}})',
      entropy: '256-bit Key',
      steps: [
        'Derive ephemeral secret with auditor PK',
        'Encrypt metadata with authenticated cipher',
        'Produce verifiable ISO-20022 package',
      ],
    },
  };

  const activeConfig = modeData[activeMode];

  return (
    <div className="glass-cyber rounded-3xl p-5 sm:p-6 border border-white/[0.1] shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              ZK Proof Reactor Core
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono">
              Compact v0.31.1 // Halo2 Prover
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
          WASM SANDBOX
        </span>
      </div>

      {/* Tactical Mode Switcher */}
      <div className="grid grid-cols-3 gap-1.5 pt-3.5 pb-2">
        {(['shield', 'transfer', 'audit'] as const).map((m, idx) => (
          <button
            key={m}
            type="button"
            onClick={() => setActiveMode(m)}
            className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
              activeMode === m
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(0,255,157,0.35)]'
                : 'bg-black/50 text-zinc-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            0{idx + 1} {m}
          </button>
        ))}
      </div>

      {/* Dynamic Display Box */}
      <div className="my-2.5 p-3.5 rounded-2xl bg-[#03060B] border border-white/[0.08] relative overflow-hidden">
        <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
          <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            {activeConfig.tag}
          </span>
          <span className="text-zinc-500">
            {isFiring ? `STEP 0${firingStep}/04` : 'READY'}
          </span>
        </div>

        <h4 className="text-sm font-black font-mono text-white tracking-tight uppercase mb-2">
          {activeConfig.title}
        </h4>

        {/* Equation Badge */}
        <div className="p-2 rounded-xl bg-black/80 border border-emerald-500/20 font-mono text-[11px] text-emerald-400 font-bold mb-2.5 truncate">
          {activeConfig.equation}
        </div>

        {/* Synthesis Steps */}
        <div className="space-y-1">
          {activeConfig.steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded-lg text-[10px] font-mono flex items-center justify-between transition-all ${
                isFiring && firingStep >= idx + 1
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'bg-black/40 text-zinc-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isFiring && firingStep >= idx + 1 ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                {step}
              </span>
              <span className="text-[9px] uppercase font-bold text-zinc-500">
                {isFiring && firingStep >= idx + 1 ? '✓' : `P0${idx + 1}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-2 py-1.5">
        <div className="p-2 rounded-xl bg-black/50 border border-white/[0.06] text-left">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
            Constraints
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {constraintsCount.toLocaleString()}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-black/50 border border-white/[0.06] text-left">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
            Entropy
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {activeConfig.entropy}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-black/50 border border-white/[0.06] text-left">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
            Relay Fee
          </span>
          <span className="text-xs font-mono font-bold text-teal-300">
            0.00 DUST
          </span>
        </div>
      </div>

      {/* Execution Trigger */}
      <button
        type="button"
        onClick={handleFireReactor}
        disabled={isFiring}
        className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 text-black font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(0,255,157,0.35)] hover:bg-emerald-400 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isFiring ? (
          <>
            <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
            <span>Synthesizing π (Step 0{firingStep}/04)...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Synthesize In-Browser ZK Proof</span>
          </>
        )}
      </button>
    </div>
  );
}
