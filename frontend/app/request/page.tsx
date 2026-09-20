'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { QRCodeDisplay } from '../../components/payment/QRCodeDisplay';
import { PaymentRequestModal } from '../../components/payment/PaymentRequestModal';
import { ProofProgressModal } from '../../components/payment/ProofProgressModal';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';
import { usePaymentRequest } from '../../hooks/usePaymentRequest';
import { useConfidentialTransfer } from '../../hooks/useConfidentialTransfer';
import {
  decodePaymentRequest,
  PaymentRequest,
  DecodedPaymentRequest,
  ValidationResult,
  validatePaymentRequest,
} from '../../lib/velum-types';
import {
  QrCode,
  Plus,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Share2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Shield,
  FileCheck2,
  Layers,
} from 'lucide-react';

export default function RequestPage() {
  const { account, isConnected, openConnectModal, connectDemo } = useMidnightWallet();
  const { requests, isLoading, fulfillRequest, refreshRequests } = usePaymentRequest(account);
  const { sendPayment, isProving, step, lastResult, reset } = useConfidentialTransfer(account);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [qrModalRequest, setQrModalRequest] = useState<PaymentRequest | null>(null);
  const [qrModalUri, setQrModalUri] = useState<string | null>(null);

  // Import & Pay state
  const [importInput, setImportInput] = useState('');
  const [importedRequest, setImportedRequest] = useState<DecodedPaymentRequest | null>(null);
  const [importValidation, setImportValidation] = useState<ValidationResult | null>(null);
  const [isProcessingImport, setIsProcessingImport] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paySuccess, setPaySuccess] = useState<{ txHash: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDecodeInput = async () => {
    if (!importInput.trim()) return;
    setIsProcessingImport(true);
    setPayError(null);
    try {
      const decoded = decodePaymentRequest(importInput.trim());
      setImportedRequest(decoded);
      const validation = await validatePaymentRequest(decoded);
      setImportValidation(validation);
    } catch (e: any) {
      setImportedRequest(null);
      setImportValidation(null);
      setPayError(e?.message || 'Failed to decode invoice format.');
    } finally {
      setIsProcessingImport(false);
    }
  };

  const handlePayImported = async () => {
    if (!importedRequest) return;
    setPayError(null);
    try {
      const res = await sendPayment({
        recipientAddress: importedRequest.recipientAddress,
        amount: importedRequest.amount,
        tokenType: importedRequest.tokenType,
        memo: importedRequest.memo,
      });
      if (res?.txHash) {
        setPaySuccess({ txHash: res.txHash });
      }
    } catch (err: any) {
      setPayError(err?.message || 'Invoice fulfillment failed.');
    }
  };

  const handleCopyLink = (req: PaymentRequest) => {
    const uri = `midnight:${req.recipientAddress}?amount=${req.amount}&token=${req.tokenType}&reqId=${req.id}`;
    navigator.clipboard.writeText(uri);
    setCopiedId(req.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openQrModal = (req: PaymentRequest) => {
    const uri = `midnight:${req.recipientAddress}?amount=${req.amount}&token=${req.tokenType}&reqId=${req.id}`;
    setQrModalRequest(req);
    setQrModalUri(uri);
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 pt-4 pb-12 px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Peer-to-Peer Invoicing
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase">
                Encrypted Metadata
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Payment Requests & Invoices
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Issue cryptographic payment requests or fulfill imported invoices with zero-knowledge counterparty anonymity.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="default"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              className="font-semibold text-sm shadow-sm px-5"
            >
              <Plus className="w-4 h-4 mr-2" /> Issue New Invoice
            </Button>
          </div>
        </div>

        {/* ── Top Dual-Wing Console ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Wing: Import & Settle Invoices (7 cols) */}
          <div className="lg:col-span-7 bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/80" />

            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Import & Fulfill Invoice
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-secondary/50 border border-border">
                ECDH Verified
              </span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Paste Invoice URI or Encrypted Payload
                </span>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="midnight:mn_addr_preprod1...?amount=100&token=NIGHT..."
                    value={importInput}
                    onChange={(e) => setImportInput(e.target.value)}
                    className="flex-1 p-3.5 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm text-foreground font-mono outline-none shadow-sm transition-all"
                  />
                  <Button
                    variant="outline"
                    onClick={handleDecodeInput}
                    isLoading={isProcessingImport}
                    className="font-semibold text-sm px-6 h-[50px] shadow-sm hover:bg-secondary/50"
                  >
                    Decode
                  </Button>
                </div>
              </div>

              {/* Decoded Invoice Box */}
              {importedRequest && (
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="text-foreground font-semibold uppercase tracking-wider text-sm">Decoded Payment Parameter</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/20 uppercase">
                      Valid Invoice
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/40 transition-colors">
                      <span className="text-muted-foreground font-medium">Requested Amount:</span>
                      <span className="text-foreground font-semibold">
                        {importedRequest.amount} {importedRequest.tokenType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/40 transition-colors">
                      <span className="text-muted-foreground font-medium">Payee Address:</span>
                      <span className="text-foreground font-mono truncate max-w-[200px] sm:max-w-[300px]">
                        {importedRequest.recipientAddress}
                      </span>
                    </div>
                    {importedRequest.memo && (
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/40 transition-colors">
                        <span className="text-muted-foreground font-medium">Invoice Note:</span>
                        <span className="text-muted-foreground italic truncate max-w-[200px] sm:max-w-[300px]">"{importedRequest.memo}"</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={handlePayImported}
                    className="w-full font-semibold text-sm mt-4 shadow-sm"
                  >
                    Authorize Confidential Fulfillment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {payError && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in flex items-start gap-3">
                   <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                   <div>{payError}</div>
                </div>
              )}

              {paySuccess && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="truncate">Settled successfully! Tx Hash: <span className="font-mono text-xs ml-1 opacity-80">{paySuccess.txHash}</span></span>
                </div>
              )}
            </div>
          </div>

          {/* Right Wing: Quick Stats & Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass space-y-5">
              <div className="flex items-center gap-2.5 text-foreground font-semibold uppercase tracking-wider text-sm pb-4 border-b border-border">
                <Shield className="w-5 h-5 text-primary" />
                <span>Zero-Knowledge Invoicing Protocol</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Traditional crypto invoices create an on-chain cluster between buyer and vendor. Cyphra payment requests use unique single-use note blinding so neither party's transaction history is connected on Midnight.
              </p>
              <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-3.5 text-foreground font-medium text-sm shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span>Encrypted Memo with ECDH Shared Secret</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span>One-Click 1AM Wallet Settlement</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span>On-Chain Receipt Commitment</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Active Invoice Registry Table ── */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border mb-6 gap-4">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Active Invoice Registry
              </h3>
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border">
              {requests.length} Registered Requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="pb-4 font-semibold px-4">Invoice ID</th>
                  <th className="pb-4 font-semibold px-4">Requested Asset</th>
                  <th className="pb-4 font-semibold px-4">Payee Address</th>
                  <th className="pb-4 font-semibold px-4">Status</th>
                  <th className="pb-4 font-semibold px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">
                      No invoices issued yet. Click "Issue New Invoice" to generate one.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-4 px-4 font-mono font-medium text-foreground">
                        #{req.id.slice(0, 8)}...
                      </td>
                      <td className="py-4 px-4 font-semibold text-foreground">
                        {req.amount} <span className="text-primary">{req.tokenType}</span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground font-mono">
                        {req.recipientAddress.slice(0, 16)}...
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                            req.status === 'completed'
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : req.status === 'expired'
                              ? 'bg-secondary text-muted-foreground border border-border'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openQrModal(req)}
                          className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all cursor-pointer font-semibold text-xs border border-border shadow-sm inline-flex items-center justify-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" /> QR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(req)}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer font-semibold text-xs shadow-sm inline-flex items-center justify-center gap-1.5 min-w-[90px]"
                        >
                          {copiedId === req.id ? 'Copied!' : 'Copy Link'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Invoice */}
        <PaymentRequestModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            refreshRequests();
          }}
          account={account}
        />

        {/* Modal: QR Viewer */}
        {qrModalRequest && qrModalUri && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-card rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-border shadow-2xl flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-full flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Invoice QR Code</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                  {qrModalRequest.amount} {qrModalRequest.tokenType}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white shadow-md ring-1 ring-border/50">
                <QRCodeDisplay value={qrModalUri} size={220} />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed px-2">
                Payer can scan this QR code with 1AM Wallet to fulfill the request.
              </p>

              <Button
                variant="outline"
                size="md"
                onClick={() => setQrModalRequest(null)}
                className="w-full font-semibold text-sm h-11"
              >
                Close
              </Button>
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
