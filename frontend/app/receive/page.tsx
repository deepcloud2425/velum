'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { QRCodeDisplay } from '../../components/payment/QRCodeDisplay';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';
import {
  Copy,
  Check,
  Shield,
  KeyRound,
  Share2,
  Sparkles,
  QrCode,
  ArrowDownLeft,
  Eye,
  Lock,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function ReceivePage() {
  const { account, isConnected, openConnectModal, connectDemo } = useMidnightWallet();
  const [copiedShielded, setCopiedShielded] = useState(false);
  const [copiedUnshielded, setCopiedUnshielded] = useState(false);
  const [copiedKeys, setCopiedKeys] = useState(false);
  const [shared, setShared] = useState(false);
  const [activeAddressTab, setActiveAddressTab] = useState<'shielded' | 'unshielded'>('shielded');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestToken, setRequestToken] = useState<'NIGHT' | 'DUST' | 'tVELUM'>('NIGHT');

  const currentAddress = account?.shieldedAddress || 'mn_addr_preprod17hhujr34dkhlv2qpzdzddvxzuwr8qt4g4wy9jle7v37jedey6glsgp3k35';
  const unshieldedAddress = account?.unshieldedAddress || 'mn_unshielded_preprod189fka294x091k...';

  const handleCopyShielded = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopiedShielded(true);
    setTimeout(() => setCopiedShielded(false), 2000);
  };

  const handleCopyUnshielded = () => {
    navigator.clipboard.writeText(unshieldedAddress);
    setCopiedUnshielded(true);
    setTimeout(() => setCopiedUnshielded(false), 2000);
  };

  const handleCopyKeys = () => {
    if (account?.shieldedCoinPublicKey) {
      navigator.clipboard.writeText(
        JSON.stringify(
          {
            shieldedAddress: account.shieldedAddress,
            shieldedCoinPublicKey: account.shieldedCoinPublicKey,
            shieldedEncryptionPublicKey: account.shieldedEncryptionPublicKey,
          },
          null,
          2
        )
      );
      setCopiedKeys(true);
      setTimeout(() => setCopiedKeys(false), 2000);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && currentAddress) {
      try {
        await navigator.share({
          title: 'My Shielded Midnight Address',
          text: currentAddress,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
    }
  };

  // Build the dynamic payment URI
  const paymentUri = requestAmount
    ? `midnight:${currentAddress}?amount=${requestAmount}&token=${requestToken}`
    : `midnight:${currentAddress}`;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 pt-4 pb-12 px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Inbound Settlement Protocol
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase">
                Bech32 Shielded
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Receive Shielded Assets
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Share your shielded Bech32 address or generate an encrypted QR invoice without disclosing your historical treasury balance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isConnected && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => connectDemo('preprod')}
                className="font-medium text-xs px-4"
              >
                Use Pre-Funded Sandbox
              </Button>
            )}
          </div>
        </div>

        {/* ── Main Dual-Wing Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Wing: Holographic Address Console (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-glass relative overflow-hidden">
              {/* Mode Switcher Tabs */}
              <div className="flex rounded-xl bg-secondary/30 p-1 border border-border mb-8 shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveAddressTab('shielded')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeAddressTab === 'shielded'
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  <Shield className="w-4 h-4" /> Shielded Address (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAddressTab('unshielded')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeAddressTab === 'unshielded'
                      ? 'bg-background text-foreground border border-border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" /> Public L1 Address
                </button>
              </div>

              {/* Address Display Box */}
              {activeAddressTab === 'shielded' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-medium text-foreground mb-1">
                    <span className="uppercase tracking-wider">Midnight Shielded Address</span>
                    <span className="text-primary font-semibold flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> ZK-Protected
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-border font-mono text-sm text-foreground break-all leading-relaxed shadow-sm">
                    {currentAddress}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleCopyShielded}
                      className="font-semibold text-sm shadow-sm h-12"
                    >
                      {copiedShielded ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2 opacity-80" /> Copy Address
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleShare}
                      className="font-semibold text-sm h-12"
                    >
                      {shared ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Shared!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 mr-2 opacity-80" /> Share Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-medium text-foreground mb-1">
                    <span className="uppercase tracking-wider">Public L1 Address (Unshielded)</span>
                    <span className="text-amber-600 dark:text-amber-500 font-semibold flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Eye className="w-3.5 h-3.5" /> Public Explorer Traceable
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-border font-mono text-sm text-foreground break-all leading-relaxed shadow-sm">
                    {unshieldedAddress}
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCopyUnshielded}
                    className="w-full font-semibold text-sm h-12"
                  >
                    {copiedUnshielded ? (
                      <>
                        <Check className="w-4 h-4 mr-2" /> Copied Public Address!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2 opacity-80" /> Copy Public L1 Address
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Attach Amount Specification */}
              <div className="pt-8 mt-8 border-t border-border space-y-3">
                <div className="text-xs font-medium text-foreground uppercase tracking-wider mb-2">
                  Preset Amount Specification (Optional)
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Enter requested amount (e.g. 150)"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="flex-1 p-3.5 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 font-mono text-sm text-foreground outline-none shadow-sm transition-all"
                  />
                  <select
                    value={requestToken}
                    onChange={(e) => setRequestToken(e.target.value as any)}
                    className="p-3.5 rounded-xl bg-background border border-border font-mono text-sm text-primary font-semibold outline-none cursor-pointer shadow-sm focus:border-primary/50"
                  >
                    <option value="NIGHT">NIGHT</option>
                    <option value="DUST">DUST</option>
                    <option value="tVELUM">tVELUM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cryptographic Viewing Key Export Card */}
            <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-semibold uppercase tracking-wider text-xs">
                  <KeyRound className="w-4 h-4 text-primary" />
                  <span>Selective Viewing Key Bundle</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyKeys}
                  className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  {copiedKeys ? (
                    <span>Copied JSON!</span>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Export Keys JSON
                    </>
                  )}
                </button>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-lg">
                Your viewing keys grant read-only visibility into your incoming shielded notes. Share only with authorized accountants or compliance auditors.
              </p>
            </div>
          </div>

          {/* Right Wing: Dynamic QR Code Matrix (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-glass flex flex-col items-center text-center">
              <div className="w-full flex items-center justify-between pb-5 border-b border-border mb-8">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    Scan to Pay
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest bg-secondary px-2 py-0.5 rounded border border-border">1AM Ready</span>
              </div>

              {/* QR Code Container */}
              <div className="p-4 rounded-3xl bg-white shadow-xl ring-1 ring-border/50">
                <QRCodeDisplay
                  value={paymentUri}
                  size={220}
                />
              </div>

              {/* Dynamic Payload Summary */}
              <div className="mt-8 w-full p-4 rounded-xl bg-secondary/30 border border-border font-mono text-sm text-left space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Protocol:</span>
                  <span className="text-primary font-semibold">Midnight / Cyphra</span>
                </div>
                {requestAmount && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Target Value:</span>
                    <span className="text-foreground font-bold">{requestAmount} {requestToken}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="text-foreground">Midnight Preprod</span>
                </div>
              </div>
            </div>

            {/* Listening Status Badge */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between text-sm shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                <span className="text-primary font-medium">Listening for incoming settlements...</span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">12s Polling</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
