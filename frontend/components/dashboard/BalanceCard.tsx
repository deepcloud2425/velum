'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import {
  Eye,
  EyeOff,
  Shield,
  ArrowDownToLine,
  RefreshCw,
  Lock,
  Sparkles,
} from 'lucide-react';

export interface BalanceCardProps {
  shieldedNight: string;
  shieldedDust: string;
  shieldedtVelum: string;
  unshieldedNight: string;
  onOpenDeposit: () => void;
  onRefresh?: () => void;
}

export function BalanceCard({
  shieldedNight,
  shieldedDust,
  shieldedtVelum,
  unshieldedNight,
  onOpenDeposit,
  onRefresh,
}: BalanceCardProps) {
  const [showAmounts, setShowAmounts] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<'NIGHT' | 'DUST' | 'tVELUM'>('NIGHT');

  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const parsedNight = parseFloat(shieldedNight.replace(/,/g, '')) || 0;
  const parsedDust = parseFloat(shieldedDust.replace(/,/g, '')) || 0;
  const parsedVelum = parseFloat(shieldedtVelum.replace(/,/g, '')) || 0;

  const currentDisplayAmount =
    selectedAsset === 'NIGHT'
      ? shieldedNight
      : selectedAsset === 'DUST'
      ? shieldedDust
      : shieldedtVelum;

  const estimatedUSD =
    selectedAsset === 'NIGHT'
      ? (parsedNight * 1.85).toFixed(2)
      : selectedAsset === 'DUST'
      ? (parsedDust * 0.12).toFixed(2)
      : (parsedVelum * 1.0).toFixed(2);

  const assetDot: Record<string, string> = {
    NIGHT: 'bg-cyan-500',
    DUST: 'bg-indigo-400',
    tVELUM: 'bg-emerald-500',
  };

  return (
    <Card
      variant="default"
      className="relative overflow-hidden bg-white dark:bg-[#0C101C] border border-zinc-200/90 dark:border-slate-800/90 shadow-card transition-all duration-300"
    >
      {/* Top micro-glow accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-slate-800/80 pt-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                Confidential Shielded Vault
              </h2>
              <Tooltip content="Cryptographically shielded using Compact 0.31.1 note commitments on Midnight Preprod. Account balances are undetectable on block explorers." />
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>1AM Protected Zero-Knowledge Commitments</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onRefresh && (
            <button
              onClick={handleRefresh}
              className="p-2 text-zinc-500 hover:text-black dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
              title="Refresh Balances"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
          <button
            onClick={() => setShowAmounts(!showAmounts)}
            className="p-2 text-zinc-500 hover:text-black dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
            title={showAmounts ? 'Hide amounts' : 'Show amounts'}
          >
            {showAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Asset Tabs + Main Balance Display */}
      <div className="py-6">
        {/* Token selector pills */}
        <div className="flex items-center gap-2 mb-4">
          {(['NIGHT', 'DUST', 'tVELUM'] as const).map((asset) => (
            <button
              key={asset}
              type="button"
              onClick={() => setSelectedAsset(asset)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedAsset === asset
                  ? 'bg-cyan-500 text-black shadow-xs font-extrabold'
                  : 'bg-zinc-100 dark:bg-slate-800/80 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${assetDot[asset]}`} />
              {asset}
            </button>
          ))}
        </div>

        {/* Primary balance figure */}
        <AnimatePresence mode="wait">
          {showAmounts ? (
            <motion.div
              key={`shown-${selectedAsset}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tight font-mono tabular-nums">
                  {currentDisplayAmount}
                </span>
                <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/15 px-2.5 py-1 rounded-lg font-mono border border-cyan-500/25">
                  {selectedAsset}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-2 flex items-center gap-1.5">
                <span className="text-zinc-400">≈</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums">${estimatedUSD} USD</span>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Cryptographically Shielded</span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="hidden"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-zinc-400 dark:text-zinc-600 tracking-tight font-mono select-none">
                  ••••••••
                </span>
                <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg font-mono border border-cyan-500/25">
                  {selectedAsset}
                </span>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-2 flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-500" /> Shielded by Midnight Zero-Knowledge Commitments
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Asset Sub-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-zinc-100 dark:border-slate-800/80">
        {/* DUST gas sub-card */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-800 hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Shielded DUST (Gas)
            </span>
            <Tooltip content="Midnight gas token used by 1AM Wallet to balance and submit zero-knowledge transactions." />
          </div>
          <span className="text-sm font-extrabold text-zinc-950 dark:text-white font-mono mt-1 block tabular-nums">
            {showAmounts ? `${shieldedDust} DUST` : '••••'}
          </span>
        </div>

        {/* tVELUM sub-card */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-800 hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              tVELUM (Confidential)
            </span>
            <Tooltip content="Velum confidential asset transferred with complete value shielding." />
          </div>
          <span className="text-sm font-extrabold text-zinc-950 dark:text-white font-mono mt-1 block tabular-nums">
            {showAmounts ? `${shieldedtVelum} tVELUM` : '••••'}
          </span>
        </div>

        {/* Unshielded L1 + Shield CTA */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-800 hover:border-cyan-500/30 transition-colors flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono font-semibold">Unshielded L1</span>
              <Tooltip content="Public on-chain tokens in your Midnight address before being shielded into private notes." />
            </div>
            <span className="text-sm font-extrabold text-zinc-700 dark:text-zinc-300 font-mono mt-1 block tabular-nums">
              {showAmounts ? `${unshieldedNight} NIGHT` : '••••'}
            </span>
          </div>
          <Button
            variant="primary"
            size="xs"
            onClick={onOpenDeposit}
            className="text-[11px] py-1 px-3 h-8 shadow-xs"
          >
            <ArrowDownToLine className="w-3 h-3 mr-1" /> Shield
          </Button>
        </div>
      </div>
    </Card>
  );
}
