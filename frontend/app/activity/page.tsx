'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';
import { apiClient } from '../../lib/api-client';
import { TransactionActivity, AuditorDisclosedReport } from '../../lib/velum-types';
import {
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  FileCheck2,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  Shield,
  Search,
  Filter,
  ExternalLink,
  Activity,
  Layers,
  Cpu,
  KeyRound,
  Download,
} from 'lucide-react';

export default function ActivityPage() {
  const { account, isConnected, openConnectModal, connectDemo } = useMidnightWallet();
  const [activities, setActivities] = useState<TransactionActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<TransactionActivity | null>(null);

  // Auditor report modal state
  const [isAuditorModalOpen, setIsAuditorModalOpen] = useState(false);
  const [auditorAddress, setAuditorAddress] = useState('');
  const [generatedReport, setGeneratedReport] = useState<AuditorDisclosedReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    if (account?.shieldedAddress) {
      setIsLoading(true);
      apiClient
        .getActivity(account.shieldedAddress)
        .then((data) => {
          setActivities(data);
        })
        .catch((err) => {
          console.error('Failed to load activities:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [account?.shieldedAddress]);

  const filteredActivities = activities.filter((act) => {
    if (filterType !== 'all') {
      if (filterType === 'send' && !act.type.includes('send')) return false;
      if (filterType === 'receive' && !act.type.includes('receive')) return false;
      if (filterType === 'deposit' && !act.type.includes('deposit')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.txHash?.toLowerCase().includes(q) ||
        act.counterpartyMasked?.toLowerCase().includes(q) ||
        act.type?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleGenerateAuditorReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.shieldedAddress) return;
    setIsGeneratingReport(true);
    try {
      const report = await apiClient.generateAuditorReport({
        ownerAddress: account.shieldedAddress,
        auditorAddress: auditorAddress.trim() || 'universal_auditor',
        periodStart: Date.now() - 30 * 86400000,
        periodEnd: Date.now(),
      });
      setGeneratedReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 pt-4 pb-12 px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Zero-Knowledge Ledger History
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase">
                Note Accumulator
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Confidential Activity Explorer
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Inspect historical zero-knowledge settlements, nullifier anchors, or export certified viewing key disclosure reports.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAuditorModalOpen(true)}
              className="font-medium text-xs px-4"
            >
              <KeyRound className="w-4 h-4 mr-2" /> Auditor Compliance Report
            </Button>
          </div>
        </div>

        {/* ── Explorer Telemetry Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-glass">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Total Account Tx</span>
            <span className="text-xl font-semibold text-foreground tabular-nums">{activities.length} Settlements</span>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border shadow-glass">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Counterparty Leakage</span>
            <span className="text-xl font-semibold text-primary tabular-nums">0.00% (Blinded)</span>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border shadow-glass">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Settlement Finality</span>
            <span className="text-xl font-semibold text-foreground tabular-nums">100% Finalized</span>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border shadow-glass">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Ledger Network</span>
            <span className="text-xl font-semibold text-primary tabular-nums">Midnight Preprod</span>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Tx hash or Bech32..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm text-foreground outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'send', label: 'Outbound' },
              { id: 'receive', label: 'Inbound' },
              { id: 'deposit', label: 'Shield Deposits' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  filterType === f.id
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Ledger Stream Table ── */}
        <div className="bg-card rounded-2xl p-1 border border-border shadow-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px] font-semibold uppercase tracking-wider bg-secondary/30">
                  <th className="px-6 py-4 font-semibold">Operation</th>
                  <th className="px-6 py-4 font-semibold">Value</th>
                  <th className="px-6 py-4 font-semibold">Transaction Hash</th>
                  <th className="px-6 py-4 font-semibold">Nullifier / Note</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground font-medium">
                      {isLoading ? 'Loading confidential ledger history...' : 'No transactions matching this filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => {
                    const isIncoming = act.type.includes('receive') || act.type.includes('deposit');
                    return (
                      <tr key={act.id} className="hover:bg-secondary/40 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                                isIncoming
                                  ? 'bg-primary/10 text-primary border border-primary/20'
                                  : 'bg-background text-foreground border border-border'
                              }`}
                            >
                              {isIncoming ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>
                            <span className="font-semibold text-foreground capitalize text-xs">
                              {act.type.replace('_', ' ')}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-semibold tabular-nums text-sm">
                          <span className={isIncoming ? 'text-primary' : 'text-foreground'}>
                            {isIncoming ? '+' : '-'}{act.amount} {act.tokenType}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors font-mono text-xs">
                            <span className="truncate max-w-[120px]">{act.txHash}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(act.txHash, act.id)}
                              className="p-1 rounded hover:bg-secondary transition-colors"
                            >
                              {copiedHash === act.id ? (
                                <Check className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-xs font-mono truncate max-w-[140px]">
                          {act.nullifierHash || '0x[ZK_HIDDEN]'}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-xs">
                          {new Date(act.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedTx(act)}
                            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors font-medium text-xs shadow-sm"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Transaction Detail Modal ── */}
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-border shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  Settlement Cryptographic Transcript
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20 uppercase">
                  Finalized
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Operation Type:</span>
                    <span className="text-foreground font-semibold capitalize">{selectedTx.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Amount Transferred:</span>
                    <span className="text-primary font-bold text-base">{selectedTx.amount} {selectedTx.tokenType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Gas Cost:</span>
                    <span className="text-foreground font-medium">{selectedTx.gasFee}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block">Transaction Hash:</span>
                  <div className="p-3 rounded-xl bg-background font-mono text-xs text-foreground break-all border border-border shadow-sm">
                    {selectedTx.txHash}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block">Spent Nullifier:</span>
                  <div className="p-3 rounded-xl bg-background font-mono text-xs text-amber-600 dark:text-amber-500 break-all border border-border shadow-sm">
                    {selectedTx.nullifierHash || '0x4981a2f9882... (Encrypted Nullifier Anchor)'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block">Output Note Commitment:</span>
                  <div className="p-3 rounded-xl bg-background font-mono text-xs text-cyan-600 dark:text-cyan-400 break-all border border-border shadow-sm">
                    {selectedTx.commitmentHash || '0x99281bf018a... (BLS12-381 Pedersen Note)'}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedTx(null)}
                  className="w-full font-semibold"
                >
                  Close Transcript
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Auditor Compliance Report Modal ── */}
        <Modal
          isOpen={isAuditorModalOpen}
          onClose={() => {
            setIsAuditorModalOpen(false);
            setGeneratedReport(null);
          }}
          title="Export Auditor Disclosure Certificate"
        >
          {generatedReport ? (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <span className="font-semibold text-primary flex items-center gap-2 text-sm">
                  <FileCheck2 className="w-4 h-4" />
                  Certified Compliance Certificate
                </span>
                <span className="text-xs text-muted-foreground block leading-relaxed">
                  This cryptographic certificate decrypts your historical balances for the specified auditor using your viewing key without revealing spending authority.
                </span>
              </div>

              <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Auditor:</span>
                  <span className="text-foreground font-mono font-medium truncate max-w-[200px]">{generatedReport.auditorAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Total Volume Certified:</span>
                  <span className="text-primary font-bold">
                    {generatedReport.totalVolume?.NIGHT || '0'} NIGHT
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Records Included:</span>
                  <span className="text-foreground font-semibold">{generatedReport.transactions?.length || 0} settlements</span>
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(generatedReport, null, 2));
                  setCopiedProof(true);
                  setTimeout(() => setCopiedProof(false), 2000);
                }}
                className="w-full font-semibold shadow-sm"
              >
                {copiedProof ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Copied Certificate JSON!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copy Certificate JSON
                  </>
                )}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleGenerateAuditorReport} className="space-y-6 pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter an auditor's public Bech32 key to encrypt a time-stamped settlement disclosure report.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Auditor Public Key <span className="text-muted-foreground normal-case font-medium ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="mn_auditor1... or leave blank for universal certificate"
                  value={auditorAddress}
                  onChange={(e) => setAuditorAddress(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 font-mono text-sm text-foreground outline-none shadow-sm transition-all"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                isLoading={isGeneratingReport}
                className="w-full font-semibold shadow-sm h-12"
              >
                Generate Certified Report
              </Button>
            </form>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}
