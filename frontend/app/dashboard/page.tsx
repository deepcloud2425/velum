'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { PaymentRequestModal } from '../../components/payment/PaymentRequestModal';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';
import { usePrivateBalance } from '../../hooks/usePrivateBalance';
import { apiClient } from '../../lib/api-client';
import { oneAMWallet } from '../../lib/one-am-wallet-adapter';
import { TransactionActivity } from '../../lib/velum-types';
import {
  Shield,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  History,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Sparkles,
  RefreshCw,
  QrCode,
  Send,
  Zap,
  Activity,
  Layers,
  Cpu,
  AlertCircle,
} from 'lucide-react';
import { ShieldedVolumeChart } from '../../components/dashboard/ShieldedVolumeChart';
import { VisualPrivacyWorkflow } from '../../components/dashboard/VisualPrivacyWorkflow';

export default function DashboardPage() {
  const { account, isConnected, openConnectModal, connectDemo, refreshBalances } = useMidnightWallet();
  const balances = usePrivateBalance(account);
  const [activities, setActivities] = useState<TransactionActivity[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('50');
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch recent activity
  useEffect(() => {
    if (account?.shieldedAddress) {
      apiClient
        .getActivity(account.shieldedAddress)
        .then(setActivities)
        .catch((err) => {
          console.warn('Could not fetch activity feed:', err);
        });
    }
  }, [account?.shieldedAddress]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalances();
    if (account?.shieldedAddress) {
      try {
        const updated = await apiClient.getActivity(account.shieldedAddress);
        setActivities(updated);
      } catch {}
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    setIsDepositing(true);
    setDepositError(null);
    try {
      await oneAMWallet.depositShielded(depositAmount, 'NIGHT');
      await refreshBalances();
      try {
        const updated = await apiClient.getActivity(account.shieldedAddress);
        setActivities(updated);
      } catch {}
      setDepositSuccess(true);
      setTimeout(() => {
        setIsDepositOpen(false);
        setDepositSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      setDepositError(err instanceof Error ? err.message : 'Deposit failed.');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleFaucet = async () => {
    if (!account?.shieldedAddress) return;
    setFaucetLoading(true);
    try {
      await apiClient.requestFaucet(account.shieldedAddress, 'NIGHT');
      await refreshBalances();
    } catch (err) {
      console.error(err);
    } finally {
      setFaucetLoading(false);
    }
  };

  const shieldedNightNum = parseFloat(balances.shieldedNight.replace(/,/g, '')) || 0;
  const unshieldedNightNum = parseFloat(balances.unshieldedNight.replace(/,/g, '')) || 0;
  const totalNight = shieldedNightNum + unshieldedNightNum;
  const privacyRatio = totalNight > 0 ? Math.round((shieldedNightNum / totalNight) * 100) : 100;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 pt-4 pb-12 px-4 sm:px-6">
        {/* ── Top Header Console ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Sovereign Liquidity Engine
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase">
                Preprod Active
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Confidential Treasury
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Balances shielded using Compact 0.31.1 zero-knowledge note commitments.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleManualRefresh}
              className="p-2.5 rounded-lg bg-secondary/50 border border-transparent hover:border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center justify-center"
              title="Refresh Balance State"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            </button>

            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFaucet}
                isLoading={faucetLoading}
                className="font-semibold text-xs"
              >
                <Coins className="w-4 h-4 mr-2 opacity-80" />
                Claim Testnet Faucet
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => connectDemo('preprod')}
                  className="font-medium text-xs flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Pre-Funded Sandbox
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={openConnectModal}
                  className="font-semibold text-xs shadow-sm"
                >
                  <Wallet className="w-4 h-4 mr-2 opacity-90" /> Connect 1AM
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Portfolio Vault Wing ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Wing: Primary Vault Card (8 cols) */}
          <div className="lg:col-span-8 bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                    <Shield className="w-5 h-5 opacity-90" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground tracking-wide">
                      Confidential Balance Vault
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {account ? `${account.shieldedAddress.slice(0, 16)}...${account.shieldedAddress.slice(-8)}` : 'Treasury Node Alpha (Sandbox)'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDepositOpen(true)}
                  className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 opacity-80" /> Shield Funds <span className="opacity-70">(L1 → ZK)</span>
                </button>
              </div>

              {/* Main Value Display */}
              <div className="pt-8 pb-6">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                  Primary Shielded Night
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-semibold text-foreground tracking-tight tabular-nums">
                    {balances.shieldedNight}
                  </span>
                  <span className="text-xl font-bold text-primary">NIGHT</span>
                </div>
                <div className="mt-3 text-sm font-medium text-muted-foreground flex items-center gap-3">
                  <span>≈ ${(parseFloat(balances.shieldedNight.replace(/,/g, '')) * 0.42).toFixed(2)} USD</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-primary font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 opacity-80" /> 100% Zero-Knowledge
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Asset Micro Cards */}
            <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border shadow-sm">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Shielded DUST (Gas Fuel)
                </span>
                <span className="text-lg font-semibold text-foreground tabular-nums">
                  {balances.shieldedDust} <span className="text-xs font-medium text-muted-foreground ml-1">DUST</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border shadow-sm">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Synthetic tVELUM
                </span>
                <span className="text-lg font-semibold text-foreground tabular-nums">
                  {balances.shieldedtVelum} <span className="text-xs font-medium text-muted-foreground ml-1">tVELUM</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border shadow-sm">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Public Unshielded L1
                </span>
                <span className="text-lg font-semibold text-amber-600 dark:text-amber-500 tabular-nums">
                  {balances.unshieldedNight} <span className="text-xs font-medium text-muted-foreground ml-1">NIGHT</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Wing: Privacy Radar & Level Score (4 cols) */}
          <div className="lg:col-span-4 bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Privacy Score
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {privacyRatio}% SHIELDED
                </span>
              </div>

              {/* Radial Meter Graphic */}
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-border"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-primary drop-shadow-[0_0_12px_rgba(var(--primary),0.3)]"
                      strokeWidth="8"
                      strokeDasharray={263.89}
                      strokeDashoffset={263.89 * (1 - privacyRatio / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground tracking-tight">{privacyRatio}%</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Score</span>
                  </div>
                </div>

                <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                  {privacyRatio >= 90
                    ? 'Excellent. Your treasury is overwhelmingly insulated from public observers.'
                    : 'Consider shielding your public L1 balance to prevent tracking.'}
                </p>
              </div>
            </div>

            {/* Quick action button inside radar */}
            <div className="pt-5 border-t border-border mt-auto">
              <button
                type="button"
                onClick={() => setIsDepositOpen(true)}
                className="w-full py-3 rounded-xl bg-secondary/50 border border-transparent hover:border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-sm"
              >
                <Lock className="w-4 h-4 text-primary opacity-80" /> Maximize Privacy (Shield 100%)
              </button>
            </div>
          </div>
        </div>

        {/* ── Quick Action Command Dock ── */}
        <div className="pt-4">
          <div className="text-sm font-semibold text-foreground mb-4">
            Settlement Launchpad
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/send">
              <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-sm group cursor-pointer h-full">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Send className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  Send Shielded
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Confidential ZK transfer
                </div>
              </div>
            </Link>

            <Link href="/receive">
              <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-sm group cursor-pointer h-full">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  Receive / QR
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Bech32 Shielded Address
                </div>
              </div>
            </Link>

            <div
              onClick={() => setIsInvoiceOpen(true)}
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-sm group cursor-pointer h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">
                Issue Invoice
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Encrypted payment request
              </div>
            </div>

            <div
              onClick={() => setIsDepositOpen(true)}
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-sm group cursor-pointer h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">
                Shield L1 Asset
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Deposit to private note
              </div>
            </div>
          </div>
        </div>

        {/* ── Shielded Volume Analytics & Workflow ── */}
        <div className="space-y-6 pt-4">
          <ShieldedVolumeChart />
          <VisualPrivacyWorkflow />
        </div>

        {/* ── Recent Confidential Activity Stream ── */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass mt-8">
          <div className="flex items-center justify-between pb-5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide">
                Recent Activity Ledger
              </h3>
            </div>
            <Link
              href="/activity"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
            >
              View Full Ledger <ArrowRight className="w-4 h-4 opacity-70" />
            </Link>
          </div>

          <div className="divide-y divide-border pt-4">
            {activities.length === 0 ? (
              <div className="py-12 text-center text-sm font-medium text-muted-foreground">
                No recent transactions recorded on this account.
              </div>
            ) : (
              activities.slice(0, 5).map((act) => {
                const isIncoming = act.type.includes('receive') || act.type.includes('deposit');
                return (
                  <div
                    key={act.id}
                    className="py-4 px-2 sm:px-4 flex items-center justify-between hover:bg-secondary/40 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                          isIncoming
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-background text-muted-foreground border border-border'
                        }`}
                      >
                        {isIncoming ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-sm font-semibold text-foreground">
                            {act.type === 'shield_deposit'
                              ? 'Shield Deposit'
                              : act.type === 'send_confidential'
                              ? 'Confidential Send'
                              : act.type === 'receive_confidential'
                              ? 'Confidential Receive'
                              : 'Invoice Settlement'}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
                            ZK Verified
                          </span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground font-mono">
                          {act.counterpartyMasked || 'Shielded Commitment'} •{' '}
                          {new Date(act.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-semibold block tabular-nums mb-1 ${
                          isIncoming ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {isIncoming ? '+' : '-'}
                        {act.amount} {act.tokenType}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">Gas: {act.gasFee}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Shield / Deposit Modal ── */}
        <Modal
          isOpen={isDepositOpen}
          onClose={() => setIsDepositOpen(false)}
          title="Shield L1 Assets (Unshielded → Confidential Note)"
        >
          {depositSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Funds Successfully Shielded</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Your L1 assets have been committed into a private zero-knowledge note on Midnight Preprod.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDeposit} className="space-y-6 pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Convert public L1 NIGHT into a shielded note on Midnight. The resulting balance will be completely confidential.
              </p>

              <div className="space-y-1.5">
                <Input
                  label="Amount to Shield"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  rightElement={<span className="text-sm font-semibold text-primary">NIGHT</span>}
                />
                <p className="text-xs font-medium text-muted-foreground px-1">Available Unshielded: <span className="text-foreground">{balances.unshieldedNight} NIGHT</span></p>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border space-y-2 text-sm shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Destination:</span>
                  <span className="text-foreground font-semibold">1AM Shielded Vault</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Circuit:</span>
                  <span className="text-primary font-semibold">Compact: deposit()</span>
                </div>
              </div>

              {depositError && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium shadow-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{depositError}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full font-semibold h-12 shadow-sm"
                isLoading={isDepositing}
              >
                Shield Into Confidential Note
              </Button>
            </form>
          )}
        </Modal>

        {/* ── Invoice Modal ── */}
        <PaymentRequestModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          account={account}
        />
      </div>
    </AppShell>
  );
}
