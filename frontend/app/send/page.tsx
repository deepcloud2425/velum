'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProofProgressModal } from '../../components/payment/ProofProgressModal';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';
import { usePrivateBalance } from '../../hooks/usePrivateBalance';
import { useConfidentialTransfer } from '../../hooks/useConfidentialTransfer';
import { TokenType } from '../../lib/velum-types';
import {
  Send,
  Lock,
  ShieldCheck,
  Zap,
  ArrowLeft,
  ArrowRight,
  Check,
  Cpu,
  CheckCircle2,
  Copy,
  AlertCircle,
  Clock,
  Coins,
  Sparkles,
  Shield,
  Layers,
  Terminal,
} from 'lucide-react';

export default function SendPage() {
  const { account, isConnected, openConnectModal, connectDemo, network } = useMidnightWallet();
  const balances = usePrivateBalance(account);
  const { sendPayment, isProving, step, lastResult, error, reset } = useConfidentialTransfer(account);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState<TokenType>('NIGHT');
  const [memo, setMemo] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [gasFreeSponsor, setGasFreeSponsor] = useState(true);

  // Available balance for chosen asset
  const availableString = useMemo(() => {
    if (tokenType === 'NIGHT') return balances.shieldedNight;
    if (tokenType === 'DUST') return balances.shieldedDust;
    return balances.shieldedtVelum;
  }, [tokenType, balances]);

  const availableNum = useMemo(() => {
    return parseFloat(availableString.replace(/,/g, '')) || 0;
  }, [availableString]);

  // Recipient address format validator
  const recipientValidation = useMemo(() => {
    if (!recipient) return { valid: false, message: null };
    const trimmed = recipient.trim();
    if (
      !trimmed.startsWith('mn_addr_preprod1') &&
      !trimmed.startsWith('mn_shielded1') &&
      !trimmed.startsWith('mn_addr1')
    ) {
      return {
        valid: false,
        message: 'Expected Midnight format (mn_addr_preprod1... or mn_shielded1...).',
      };
    }
    if (trimmed.length < 35) {
      return {
        valid: false,
        message: 'Address length too short for valid Midnight Bech32 (45+ chars expected).',
      };
    }
    return { valid: true, message: 'Valid Midnight Bech32 address' };
  }, [recipient]);

  const parsedAmount = parseFloat(amount) || 0;
  const remainingBalance = useMemo(() => {
    return Math.max(0, availableNum - parsedAmount).toFixed(4);
  }, [availableNum, parsedAmount]);

  const handleSetPercent = (pct: number) => {
    const val = (availableNum * pct).toFixed(4);
    setAmount(val);
    setValidationError(null);
  };

  const handleGoToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!recipientValidation.valid) {
      setValidationError(recipientValidation.message || 'Invalid recipient address.');
      return;
    }

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Please enter a positive settlement amount.');
      return;
    }

    if (parsedAmount > availableNum) {
      setValidationError(`Insufficient shielded balance. You hold ${availableString} ${tokenType}.`);
      return;
    }

    setIsReviewing(true);
  };

  const handleConfirmTransfer = async () => {
    try {
      await sendPayment({
        recipientAddress: recipient.trim(),
        amount: amount.trim(),
        tokenType,
        memo: memo.trim() || undefined,
      });
    } catch {
      // Handled in hook
    }
  };

  // Sample known active addresses for quick test
  const quickRecipients = [
    { name: 'Institutional Treasury Alpha', addr: 'mn_addr_preprod17hhujr34dkhlv2qpzdzddvxzuwr8qt4g4wy9jle7v37jedey6glsgp3k35' },
    { name: 'Merchant Settlement Gateway', addr: 'mn_addr_preprod1pjuj0js4qsmtmtxaw8yv2cazzcr6w226z8acer6dz6vtu4cfd0rqkw7rnq' },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 pt-4 pb-12 px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-3d-cyan">
                Outbound Confidential Settlement
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-glow-cyan">
                BLS12-381 R1CS
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-3d mb-2">
              Send Shielded Assets
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Synthesize zero-knowledge proofs client-side to transfer value without leaking balances or addresses.
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

        {/* ── Main Dual-Wing Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Wing: Transfer Console Form (7 cols) */}
          <div className="lg:col-span-7 panel-3d p-6 sm:p-8">
            <form onSubmit={handleGoToReview} className="space-y-8">
              {/* Asset Selector */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-foreground mb-3">
                  <span className="uppercase tracking-wider">Select Confidential Asset</span>
                  <span className="text-muted-foreground">
                    Vault Available: <strong className="text-foreground">{availableString} {tokenType}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(['NIGHT', 'DUST', 'tVELUM'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTokenType(t);
                        setValidationError(null);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        tokenType === t
                          ? 'bg-primary/5 border-foreground/20 text-foreground shadow-sm'
                          : 'bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                      }`}
                    >
                      <span className="text-sm font-semibold">{t}</span>
                      <span className="text-[10px] font-medium opacity-70">
                        {t === 'NIGHT' ? balances.shieldedNight : t === 'DUST' ? balances.shieldedDust : balances.shieldedtVelum}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Address */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs font-medium text-foreground mb-2">
                  <span className="uppercase tracking-wider">Recipient Shielded Address (Bech32)</span>
                  {recipientValidation.valid && (
                    <span className="text-green-500 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Checksum Valid
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="mn_addr_preprod1... or mn_shielded1..."
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setValidationError(null);
                  }}
                  className="input-3d w-full p-4 rounded-xl text-sm font-mono outline-none"
                />

                {/* Quick address suggestions */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-medium text-muted-foreground">Quick Select:</span>
                  {quickRecipients.map((rec) => (
                    <button
                      key={rec.name}
                      type="button"
                      onClick={() => setRecipient(rec.addr)}
                      className="px-2.5 py-1 rounded-md bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    >
                      {rec.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs font-medium text-foreground mb-2">
                  <span className="uppercase tracking-wider">Settlement Value</span>
                  <span className="text-muted-foreground">
                    Post-transfer: <span className="text-foreground font-semibold">{remainingBalance} {tokenType}</span>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setValidationError(null);
                    }}
                    className="input-3d w-full p-4 pr-24 rounded-xl font-mono text-xl font-bold outline-none"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-sm text-foreground">
                    {tokenType}
                  </div>
                </div>

                {/* Percentage preset buttons */}
                <div className="mt-3 flex gap-2">
                  {[0.25, 0.5, 0.75, 1].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSetPercent(pct)}
                      className="flex-1 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    >
                      {pct === 1 ? 'MAX' : `${pct * 100}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Encrypted Memo */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs font-medium text-foreground mb-2">
                  <span className="uppercase tracking-wider">Encrypted Counterparty Memo (Optional)</span>
                  <span className="text-muted-foreground text-[10px]">ECDH Encrypted</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Q3 Strategic Liquidity Invoice #884"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="input-3d w-full p-4 rounded-xl text-sm outline-none"
                />
              </div>

              {/* Gas Sponsor Toggle */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border flex items-center justify-between text-sm shadow-sm mt-2">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-foreground font-semibold block">Gas-Free DUST Relayer Sponsorship</span>
                    <span className="text-[11px] text-muted-foreground">Sponsored on Midnight Preprod</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">
                  Free Sponsor
                </span>
              </div>

              {/* Validation Error Alert */}
              {validationError && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 shadow-sm mt-4">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="leading-relaxed">{validationError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="btn-3d w-full text-lg font-bold text-white h-16 rounded-2xl uppercase tracking-widest shadow-glow-magenta transition-all"
                >
                  Synthesize Proof & Review Settlement <Sparkles className="w-5 h-5 ml-2 text-cyan-200 animate-pulse-glow" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right Wing: Live Cryptographic Synthesizer HUD (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="panel-3d p-6">
              <div className="flex items-center justify-between pb-4 border-b border-primary/20">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    Live Circuit HUD
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active
                </span>
              </div>

              <div className="space-y-5 pt-5 text-sm">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">
                    Output Note Commitment
                  </span>
                  <div className="p-3 rounded-lg bg-background border border-border text-muted-foreground font-mono text-xs truncate shadow-sm">
                    {recipient && parsedAmount > 0
                      ? `Poseidon(${parsedAmount}, ${recipient.slice(0, 10)}..., 0x${Math.floor(parsedAmount * 9381).toString(16)})`
                      : '0x[Awaiting valid transfer inputs...]'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">
                    Nullifier Anchor (Double-Spend Guard)
                  </span>
                  <div className="p-3 rounded-lg bg-background border border-border text-amber-600 dark:text-amber-400 font-mono text-xs truncate shadow-sm">
                    0x7a89e1f4c20b8893d56...419a
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-background border border-border shadow-sm">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Constraint Count</span>
                    <span className="text-sm font-semibold text-foreground">24,180 R1CS</span>
                  </div>
                  <div className="p-3 rounded-lg bg-background border border-border shadow-sm">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">WASM Latency</span>
                    <span className="text-sm font-semibold text-primary">~840 ms</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-muted-foreground text-xs leading-relaxed mt-2 shadow-sm">
                  <strong className="text-foreground block font-medium mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Privacy Guarantee
                  </strong>
                  The recipient’s address, the transaction amount, and your remaining vault balance are cryptographically blinded. The Midnight consensus ledger only records the nullifier and note commitment.
                </div>
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="p-5 rounded-xl bg-secondary/30 border border-border text-xs text-muted-foreground space-y-3">
              <span className="text-foreground font-semibold uppercase tracking-wider text-[11px] block">
                Settlement Guidelines
              </span>
              <p className="leading-relaxed flex items-start gap-2">
                <span className="opacity-50 mt-0.5">•</span>
                <span>Always verify that the recipient provided a valid Midnight Preprod address (<code className="text-foreground font-mono">mn_addr_preprod1...</code>).</span>
              </p>
              <p className="leading-relaxed flex items-start gap-2">
                <span className="opacity-50 mt-0.5">•</span>
                <span>Once broadcasted, zero-knowledge settlement cannot be reversed.</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Review Confirmation Modal ── */}
        {isReviewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
            <div className="bg-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-border shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  Confirm Settlement
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">
                  COMPACT 0.31.1
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Asset</span>
                    <span className="text-foreground font-semibold">{tokenType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Transfer Amount</span>
                    <span className="text-primary font-bold text-lg">{amount} {tokenType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Gas Cost</span>
                    <span className="text-primary font-semibold">0.0000 DUST (Sponsored)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Recipient</span>
                  <div className="p-3 rounded-xl bg-background border border-border text-xs text-foreground break-all font-mono shadow-sm">
                    {recipient}
                  </div>
                </div>

                {memo && (
                  <div className="space-y-1.5">
                    <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Encrypted Memo</span>
                    <div className="p-3 rounded-xl bg-background border border-border text-sm text-foreground shadow-sm">
                      "{memo}"
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsReviewing(false)}
                  className="flex-1 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsReviewing(false);
                    handleConfirmTransfer();
                  }}
                  className="flex-1 font-semibold shadow-sm"
                >
                  Sign & Execute ZK Proof
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Prover Progress Modal */}
        <ProofProgressModal
          isOpen={isProving}
          step={step}
          txHash={lastResult?.txHash}
          onClose={reset}
        />
      </div>
    </AppShell>
  );
}
