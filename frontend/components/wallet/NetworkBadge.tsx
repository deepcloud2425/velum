'use client';

import React, { useState } from 'react';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export function NetworkBadge() {
  const { network, setNetwork, isConnected, connect } = useMidnightWallet();
  const [isOpen, setIsOpen] = useState(false);
  const activeNet = network || 'preprod';
  const displayNet = activeNet.toUpperCase();

  const networks: {
    id: 'preprod' | 'preview' | 'mainnet';
    label: string;
    desc: string;
    supported: boolean;
  }[] = [
    {
      id: 'preprod',
      label: 'PREPROD',
      desc: 'Active Midnight Preprod Ledger',
      supported: true,
    },
    {
      id: 'preview',
      label: 'PREVIEW',
      desc: 'Disabled (Preprod only deployment)',
      supported: false,
    },
    {
      id: 'mainnet',
      label: 'MAINNET',
      desc: 'Upcoming Production Ledger',
      supported: false,
    },
  ];

  const handleSelect = async (net: 'preview' | 'preprod' | 'mainnet', supported: boolean) => {
    if (!supported) return;
    setIsOpen(false);
    setNetwork(net);
    if (isConnected) {
      try {
        await connect(net);
      } catch (err) {
        console.warn('Network switch error:', err);
      }
    }
  };

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold tracking-wider bg-cyan-500/10 dark:bg-cyan-500/15 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-xs transition-colors cursor-pointer"
        title="Midnight Preprod Active Ledger ([Contract Pending])"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{displayNet}</span>
        <svg
          className={`w-3 h-3 text-cyan-600 dark:text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#0C101C] border border-zinc-200 dark:border-slate-800 shadow-xl py-2 z-50 text-left font-mono">
            <div className="px-3.5 py-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-100 dark:border-slate-800 flex items-center justify-between">
              <span>Midnight Consensus</span>
              <span className="text-emerald-500 font-bold">LIVE</span>
            </div>
            {networks.map((net) => {
              const isSelected = activeNet === net.id;
              return (
                <button
                  key={net.id}
                  type="button"
                  disabled={!net.supported}
                  onClick={() => handleSelect(net.id, net.supported)}
                  className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/10 dark:bg-cyan-500/15 font-bold text-cyan-700 dark:text-cyan-300 cursor-default'
                      : net.supported
                      ? 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white cursor-pointer'
                      : 'text-zinc-400 dark:text-zinc-600 bg-zinc-50/50 dark:bg-slate-900/30 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? 'bg-emerald-500'
                            : net.supported
                            ? 'bg-zinc-400'
                            : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                      />
                      <span>{net.label}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">{net.desc}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
