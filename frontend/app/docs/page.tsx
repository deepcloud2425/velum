'use client';

import React, { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import {
  Terminal,
  Code,
  Shield,
  Cpu,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'circuits' | 'sdk' | 'verification' | 'specs'>('circuits');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const circuits = [
    {
      name: 'deposit(amount: Uint<64>, noteCommitment: Bytes<32>)',
      circuit: 'deposit',
      desc: 'Transfers unshielded public L1 NIGHT into a confidential zero-knowledge note commitment. The note commitment is registered in the on-chain commitment accumulator.',
      inputs: 'amount (public uint64), noteCommitment (32-byte Poseidon hash)',
      stateTransition: 'Increments totalShieldedCommitments counter, appends commitment to ledger.',
    },
    {
      name: 'confidentialTransfer(nullifier: Bytes<32>, newCommitment: Bytes<32>, changeCommitment: Bytes<32>)',
      circuit: 'confidentialTransfer',
      desc: 'Executes peer-to-peer confidential transfer. Verifies in zero-knowledge that input note is unspent, computes spent nullifier to prevent double-spending, and creates fresh note commitments.',
      inputs: 'nullifier (spent note token), newCommitment (recipient note), changeCommitment (sender change)',
      stateTransition: 'Verifies nullifier is not in spent set; commits nullifier; appends 2 new commitments.',
    },
    {
      name: 'registerPaymentRequest(requestId: Bytes<32>, requestCommitment: Bytes<32>)',
      circuit: 'registerPaymentRequest',
      desc: 'Registers an off-chain cryptographic invoice request on the Midnight Preprod ledger.',
      inputs: 'requestId (unique uuid hash), requestCommitment (cryptographic parameter binding)',
      stateTransition: 'Stores request commitment mapped to requestId in contract ledger state.',
    },
    {
      name: 'fulfillPaymentRequest(requestId: Bytes<32>, paymentNullifier: Bytes<32>, receiptCommitment: Bytes<32>)',
      circuit: 'fulfillPaymentRequest',
      desc: 'Atomically fulfills a registered payment request. Verifies payer spending authority and produces an on-chain zero-knowledge receipt.',
      inputs: 'requestId, paymentNullifier, receiptCommitment',
      stateTransition: 'Marks payment request as fulfilled; marks nullifier as spent.',
    },
    {
      name: 'grantAuditorAccess(auditorKey: Bytes<32>, permissions: Uint<8>)',
      circuit: 'grantAuditorAccess',
      desc: 'Grants time-bounded, permissioned viewing key access for regulatory compliance and selective auditing without revealing private spending keys.',
      inputs: 'auditorKey (viewing public key), permissions (read bitmask: amounts, counterparty, memos)',
      stateTransition: 'Registers authorized viewing key in contract access control map.',
    },
  ];

  const sampleCompactCode = `// Cyphra Confidential Settlement Protocol
// Compiler: Compact v0.31.1 (Midnight Network)

circuit deposit(amount: Uint<64>, noteCommitment: Bytes<32>): Void {
    // 1. Enforce non-zero transfer
    assert(amount > 0, "Deposit amount must be positive");
    
    // 2. Consume public unshielded L1 NIGHT from caller
    receiveUnshielded(amount);
    
    // 3. Append note commitment into ZK accumulator
    commitments.insert(noteCommitment);
    totalShielded = totalShielded + amount;
}

circuit confidentialTransfer(
    nullifier: Bytes<32>,
    newCommitment: Bytes<32>,
    changeCommitment: Bytes<32>
): Void {
    // 1. Guard against double-spend
    assert(!nullifiers.member(nullifier), "Nullifier already spent!");
    
    // 2. Burn spent nullifier
    nullifiers.insert(nullifier);
    
    // 3. Emit recipient and change commitments
    commitments.insert(newCommitment);
    commitments.insert(changeCommitment);
}`;

  const sampleSdkCode = `import { createConnectedSession } from '@/lib/midnight';
import { getContract } from '@/managed/contract';

// 1. Connect to 1AM Wallet DApp Connector API v4.0.1
const midnight = (window as any).midnight?.['1am'];
const api = await midnight.enable();

// 2. Initialize provably balanced session
const session = await createConnectedSession(api);

// 3. Call Compact circuit with client WASM proving
const contract = getContract(session.providers);
const tx = await contract.circuits.confidentialTransfer(
  nullifierHex,
  recipientCommitmentHex,
  changeCommitmentHex
);

console.log('Confirmed settlement on Midnight:', tx.txHash);`;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 pt-4 pb-12 px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Protocol Architecture & Circuits
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase">
                Compact v0.31.1
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Developer Specifications
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              In-depth cryptographic circuit blueprints, contract state transitions, and Midnight JS integration guides.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://docs.midnight.network"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-secondary/50 border border-border hover:bg-secondary hover:border-border text-sm font-semibold text-foreground transition-all flex items-center gap-2 shadow-sm"
            >
              Midnight Docs <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* ── Segmented Documentation Tabs ── */}
        <div className="flex rounded-xl bg-secondary/30 p-1 border border-border max-w-xl shadow-sm">
          {[
            { id: 'circuits', label: 'Compact Circuits' },
            { id: 'sdk', label: 'SDK Integration' },
            { id: 'specs', label: 'Cryptographic Curves' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content: Circuits ── */}
        {activeTab === 'circuits' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-5">
              {circuits.map((c) => (
                <div
                  key={c.circuit}
                  className="bg-card rounded-2xl p-6 sm:p-8 border border-border hover:border-border/80 transition-all shadow-glass space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground text-base tracking-tight">{c.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary/50 text-muted-foreground border border-border">
                      Circuit Export
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border shadow-sm">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Inputs:</span>
                      <span className="text-foreground text-sm font-medium">{c.inputs}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border shadow-sm">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">State Transition:</span>
                      <span className="text-primary font-medium text-sm">{c.stateTransition}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Code Preview */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5 text-foreground font-semibold uppercase tracking-wider text-sm">
                  <Code className="w-4 h-4 text-primary" />
                  <span>Cyphra.compact (Circuit Source Extract)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(sampleCompactCode, 'compact')}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {copiedCode === 'compact' ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute top-0 right-4 px-2 py-1 bg-secondary rounded-b-md text-[10px] font-mono text-muted-foreground border-x border-b border-border">
                  .compact
                </div>
                <pre className="p-5 pt-8 rounded-xl bg-black border border-border text-zinc-300 overflow-x-auto text-xs leading-relaxed font-mono shadow-inner">
                  <code>{sampleCompactCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab Content: SDK ── */}
        {activeTab === 'sdk' && (
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5 text-foreground font-semibold uppercase tracking-wider text-sm">
                <Terminal className="w-4 h-4 text-primary" />
                <span>Client-Side Proving & Invocation Pipeline</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(sampleSdkCode, 'sdk')}
                className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold cursor-pointer transition-colors"
              >
                {copiedCode === 'sdk' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
              Cyphra utilizes the official 1AM Wallet DApp Connector API along with `@midnight-ntwrk/midnight-js-contracts` to execute client-side proving. No private keys or secret inputs are ever transmitted over the network.
            </p>

            <div className="relative">
               <div className="absolute top-0 right-4 px-2 py-1 bg-secondary rounded-b-md text-[10px] font-mono text-muted-foreground border-x border-b border-border">
                  .ts
                </div>
              <pre className="p-5 pt-8 rounded-xl bg-black border border-border text-zinc-300 overflow-x-auto text-xs leading-relaxed font-mono shadow-inner">
                <code>{sampleSdkCode}</code>
              </pre>
            </div>
          </div>
        )}

        {/* ── Tab Content: Specs ── */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-glass space-y-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Proving System</span>
              <span className="text-xl font-semibold text-foreground block tracking-tight">BLS12-381 R1CS</span>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Groth16 / Plonk proving over pairing-friendly curve providing 128-bit cryptographic security level.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-glass space-y-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Hash Primitives</span>
              <span className="text-xl font-semibold text-primary block tracking-tight">Poseidon T6</span>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Algebraic hash function optimized for zero-knowledge circuits minimizing constraint count by 8x compared to SHA-256.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-glass space-y-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Consensus Finality</span>
              <span className="text-xl font-semibold text-foreground block tracking-tight">AURA / GRANDPA</span>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Deterministic block production with 12-second block intervals and provable state finality.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
