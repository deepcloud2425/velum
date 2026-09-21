'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Play, Cpu, ShieldCheck } from 'lucide-react';

interface TerminalTab {
  id: string;
  label: string;
  command: string;
  description: string;
  outputSnippet?: string[];
}

export function TerminalControlDeck() {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'compact' | 'wallet'>('quickstart');
  const [copied, setCopied] = useState(false);

  const tabs: Record<'quickstart' | 'compact' | 'wallet', TerminalTab> = {
    quickstart: {
      id: 'quickstart',
      label: 'Setup & Run',
      description: 'Run the Vite development client with local Express and Midnight Preprod connector.',
      command: 'pnpm install && pnpm dev',
      outputSnippet: [
        '[VITE v8.3.1] ready in 280 ms',
        '➜ Local:   http://localhost:3000/',
        '➜ Network: http://192.168.1.10:3000/',
        '➜ Proxy:   /api -> http://localhost:3001',
        '⚡ [Midnight] Preprod node connected (Block #248,192)',
      ],
    },
    compact: {
      id: 'compact',
      label: 'Compact Compiler',
      description: 'Compile the Velum zero-knowledge circuit for the Midnight WASM runtime.',
      command: 'compact compile contracts/velum/src/velum.compact',
      outputSnippet: [
        'Compiling Compact circuit (target: midnight-preprod-v0.31.1)...',
        '✔ Synthesizing R1CS constraints: 1,428 constraints',
        '✔ Prover key generated: velum.bkey (420 KB)',
        '✔ Verifier key generated: velum.vkey (1.2 KB)',
        '✔ Compact contract artifact emitted to contracts/velum/dist/index.cjs',
      ],
    },
    wallet: {
      id: 'wallet',
      label: '1AM Wallet SDK',
      description: 'Initialize dust-free transaction flow using the standard DApp Connector API.',
      command: "const wallet = await window.midnight['1am'].connect('preprod');",
      outputSnippet: [
        '// Connect to 1AM Wallet singleton',
        'const { shieldedAddress } = await wallet.getAccount();',
        '// Submit shielded transaction without cloud proofs',
        'const tx = await wallet.proveAndSubmit(unsealedTx);',
        'console.log(`Transaction finalized in block ${tx.blockHeight}`);',
      ],
    },
  };

  const current = tabs[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-slate-800 bg-white dark:bg-[#070A12] shadow-card overflow-hidden transition-colors duration-200 font-mono">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-slate-800/80 bg-zinc-50/80 dark:bg-[#0A0E1A]">
        <div className="flex items-center gap-2">
          {/* Mac-style traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 dark:bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 dark:bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 dark:bg-emerald-500/70" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-sans">
            Developer Control Deck
          </span>
          <span className="hidden sm:inline-block text-[10px] text-zinc-400 dark:text-zinc-500">
            • bash / zsh
          </span>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-200/60 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800">
          {(['quickstart', 'compact', 'wallet'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                activeTab === key
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tabs[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-2.5 border-b border-zinc-100 dark:border-slate-800/60 text-xs text-zinc-600 dark:text-zinc-400 font-sans bg-zinc-50/30 dark:bg-[#070A12]">
        {current.description}
      </div>

      {/* Command Line Bar */}
      <div className="px-5 py-3.5 bg-zinc-900 dark:bg-[#05070D] flex items-center justify-between gap-3 text-xs text-zinc-100">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-cyan-400 select-none font-bold">$</span>
          <code className="text-emerald-400 dark:text-emerald-300 font-semibold whitespace-nowrap">
            {current.command}
          </code>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white transition-all text-[11px] font-medium shrink-0 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Output Console Snippet */}
      {current.outputSnippet && (
        <div className="px-5 py-4 bg-zinc-950 dark:bg-[#030509] border-t border-zinc-800 dark:border-slate-900 text-[11px] text-zinc-400 space-y-1 font-mono leading-relaxed select-text">
          {current.outputSnippet.map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-zinc-600 select-none text-[10px] w-4 text-right">
                {i + 1}
              </span>
              <span
                className={
                  line.startsWith('✔')
                    ? 'text-emerald-400 font-semibold'
                    : line.startsWith('⚡')
                    ? 'text-cyan-400 font-semibold'
                    : line.startsWith('➜')
                    ? 'text-indigo-400'
                    : line.startsWith('//')
                    ? 'text-zinc-500 italic'
                    : 'text-zinc-300'
                }
              >
                {line}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
