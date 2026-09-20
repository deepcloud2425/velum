'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Building2,
  FileText
} from 'lucide-react';

interface AuditScenario {
  id: string;
  name: string;
  authority: string;
  standard: string;
  sampleAuditorKey: string;
  simulatedCiphertext: string;
  decryptedData: {
    transactionId: string;
    blockHeight: number;
    amount: string;
    token: string;
    purpose: string;
    taxId: string;
    auditorSignoff: string;
    zeroKnowledgeProof: string;
  };
}

const AUDIT_SCENARIOS: AuditScenario[] = [
  {
    id: 'irs',
    name: 'IRS Form 8300 Audit',
    authority: 'IRS Compliance',
    standard: 'Treasury Reg § 1.6045-1',
    sampleAuditorKey: 'mn_auditor_pk1q7x8m7yq4plv9a4c8z2nd0g5u3kt9rw6m0p8e2',
    simulatedCiphertext: '0x8f2a1b9c7d4e3f6029b4c8a1e5d7f302b8d9c1e7a4b2c0f6',
    decryptedData: {
      transactionId: '0x3c9f...8a9b',
      blockHeight: 248921,
      amount: '250,000.00',
      token: 'NIGHT',
      purpose: 'Enterprise Treasury Retainer',
      taxId: 'US-EIN-84-9201948',
      auditorSignoff: 'PwC Cryptographic Attestation #9021',
      zeroKnowledgeProof: 'π_Halo2_Verified_Pass',
    },
  },
  {
    id: 'fatf',
    name: 'FATF Travel Rule',
    authority: 'FATF Interop',
    standard: 'IVMS 101 Protocol',
    sampleAuditorKey: 'mn_auditor_pk1q9z3p0l8k2m4n6b7v5c1x8z9a0s2d4f6g8h0j',
    simulatedCiphertext: '0x1e3a5c7e9b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d',
    decryptedData: {
      transactionId: '0x7b1e...b9d2',
      blockHeight: 248944,
      amount: '50,000.00',
      token: 'cUSD',
      purpose: 'Cross-Border Merchant Settlement',
      taxId: 'EU-VAT-NL820491823B01',
      auditorSignoff: 'TRISA Certified Handshake',
      zeroKnowledgeProof: 'π_Merkle_Membership_Pass',
    },
  },
  {
    id: 'mica',
    name: 'EU MiCA CASP Disclosure',
    authority: 'ESMA Regulatory',
    standard: 'MiCA Article 68',
    sampleAuditorKey: 'mn_auditor_pk1q5l2m8k9j3h4g6f7d0s1a2z3x4c5v6b7n8m9q',
    simulatedCiphertext: '0x4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b',
    decryptedData: {
      transactionId: '0x9a2c...b9d2',
      blockHeight: 248980,
      amount: '1,200,000.00',
      token: 'tVELUM',
      purpose: 'Proof of Reserve Capital',
      taxId: 'DE-HRB-749201',
      auditorSignoff: 'Deloitte Verification #884',
      zeroKnowledgeProof: 'π_Homomorphic_Solvency_Pass',
    },
  },
];

export function AuditorComplianceTerminal() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('irs');
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [hasDecrypted, setHasDecrypted] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  const scenario = AUDIT_SCENARIOS.find((s) => s.id === selectedScenarioId) || AUDIT_SCENARIOS[0];

  const handleSimulateDecryption = () => {
    setIsDecrypting(true);
    setHasDecrypted(false);
    setTimeout(() => {
      setIsDecrypting(false);
      setHasDecrypted(true);
    }, 600);
  };

  const handleCopyAuditorKey = () => {
    navigator.clipboard.writeText(scenario.sampleAuditorKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            Compliance Gateway
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-tight">
            Selective Disclosure & Audit Sandbox
          </h3>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/70 border border-white/[0.08] overflow-x-auto self-start sm:self-auto">
          {AUDIT_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScenarioId(s.id);
                setHasDecrypted(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedScenarioId === s.id
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(0,255,157,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="glass-cyber rounded-3xl border border-white/[0.1] p-5 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Key Parameters & Action */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              <span>{scenario.authority}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{scenario.standard}</span>
            </div>

            {/* Auditor Key Box */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  Auditor Public Key (Bech32)
                </span>
                <button
                  type="button"
                  onClick={handleCopyAuditorKey}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer text-[11px]"
                >
                  {copiedKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-mono text-[10px] text-zinc-300 truncate p-2 rounded-lg bg-black/40">
                {scenario.sampleAuditorKey}
              </p>
            </div>

            {/* Public Ciphertext */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-xs font-mono space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase">Public On-Chain Ciphertext:</span>
              <p className="text-[10px] text-zinc-400 truncate font-mono">
                {scenario.simulatedCiphertext}...[ZK_SEALED]
              </p>
            </div>

            {/* Action Trigger */}
            <button
              type="button"
              onClick={handleSimulateDecryption}
              disabled={isDecrypting}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 text-black font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(0,255,157,0.35)] hover:bg-emerald-400 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDecrypting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Computing ECDH Scalar Multiplication...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-black" />
                  <span>Simulate Auditor Decryption</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Decrypted Payload */}
          <div className="lg:col-span-6 space-y-3">
            <div className="rounded-2xl border border-white/[0.1] bg-[#030508] overflow-hidden text-left shadow-2xl">
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-black/70 border-b border-white/[0.08] text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  audit_package.json
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${hasDecrypted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {hasDecrypted ? '✓ VERIFIED' : 'SEALED'}
                </span>
              </div>

              <div className="p-4 font-mono text-[11px] leading-relaxed text-zinc-300 min-h-[220px] flex flex-col justify-center">
                {hasDecrypted ? (
                  <div className="space-y-1.5">
                    <p><span className="text-zinc-500">"txHash":</span> <span className="text-emerald-400 font-bold">{scenario.decryptedData.transactionId}</span></p>
                    <p><span className="text-zinc-500">"amount":</span> <span className="text-emerald-400 font-bold">{scenario.decryptedData.amount} {scenario.decryptedData.token}</span></p>
                    <p><span className="text-zinc-500">"purpose":</span> <span className="text-zinc-200">{scenario.decryptedData.purpose}</span></p>
                    <p><span className="text-zinc-500">"taxId":</span> <span className="text-cyan-400">{scenario.decryptedData.taxId}</span></p>
                    <p><span className="text-zinc-500">"attestation":</span> <span className="text-teal-300">{scenario.decryptedData.auditorSignoff}</span></p>
                    <p><span className="text-zinc-500">"status":</span> <span className="text-emerald-400 font-bold">{scenario.decryptedData.zeroKnowledgeProof}</span></p>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <Lock className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-zinc-400 text-xs font-mono">
                      Ciphertext sealed. Click <strong>"Simulate Auditor Decryption"</strong> to inspect.
                    </p>
                  </div>
                )}
              </div>

              <div className="px-3.5 py-2 bg-black/60 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="text-emerald-400">ISO-20022 / MiCA Compliant</span>
                <span>Spend Key: 100% Blind</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
