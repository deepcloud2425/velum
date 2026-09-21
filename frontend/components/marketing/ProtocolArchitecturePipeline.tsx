'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Code2, 
  Zap,
  Fingerprint
} from 'lucide-react';

interface ArchitectureStage {
  id: string;
  stepNumber: string;
  tag: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  invariants: string[];
  metrics: { label: string; value: string }[];
  compactCode: string;
  mathProof: string;
}

const STAGES: ArchitectureStage[] = [
  {
    id: 'witness',
    stepNumber: '01',
    tag: 'WITNESS SYNTHESIS',
    title: 'Client Witness Sandbox',
    subtitle: 'WASM In-Memory State',
    icon: Fingerprint,
    invariants: [
      'Spending key sk never leaves local memory',
      'Pedersen blinding scalar r sampled in Fr',
      'Unlinkable L1 / shielded pools',
    ],
    metrics: [
      { label: 'Prover Sandbox', value: 'Local WASM' },
      { label: 'Secret Leakage', value: '0.00%' },
      { label: 'Constraints', value: '24,180 R1CS' },
      { label: 'Latency', value: '~140ms' },
    ],
    compactCode: `witness get_spending_witness(coin_id: Bytes<32>): SpendingSecret;

circuit generate_private_note(
  secret: SpendingSecret, 
  amount: Uint<64>, 
  blinding: Field
): NoteCommitment {
  const commitment = pedersen_commit(amount, blinding);
  assert(is_valid_scalar(secret));
  return commitment;
}`,
    mathProof: 'C = g^v \\cdot h^r \\pmod p',
  },
  {
    id: 'snark',
    stepNumber: '02',
    tag: 'HALO2 / PLONK',
    title: 'Zero-Knowledge Argument',
    subtitle: 'Homomorphic Conservation',
    icon: Cpu,
    invariants: [
      'Conservation: ∑Inputs = ∑Outputs + Fee',
      'Deterministic nullifier prevents double-spends',
      '768-byte compressed proof payload',
    ],
    metrics: [
      { label: 'Proving System', value: 'Halo2 / Plonk' },
      { label: 'Proof Size', value: '768 Bytes' },
      { label: 'On-Chain Verify', value: '< 2.4ms' },
      { label: 'Double-Spend Risk', value: '0.00%' },
    ],
    compactCode: `circuit confidential_transfer(
  inputs: Vector<Note, 2>, 
  outputs: Vector<Note, 2>, 
  proof: ZkProof
): Void {
  assert(sum_commitments(inputs) == sum_commitments(outputs));
  record_nullifier(poseidon_hash(inputs[0].nullifier_key));
}`,
    mathProof: '\\pi = \\text{PlonkVerify}(\\mathcal{V}_{\\text{vk}}, \\mathbf{x}_{\\text{pub}}, \\mathbb{W}) \\equiv 1',
  },
  {
    id: 'consensus',
    stepNumber: '03',
    tag: 'MIDNIGHT CONSENSUS',
    title: 'State Commitment',
    subtitle: 'Patricia-Merkle Trie',
    icon: Layers,
    invariants: [
      'Immutable nullifier inscription in state',
      'Sponsored DUST relayer fee subsidies',
      'AURA + GRANDPA 12s finality',
    ],
    metrics: [
      { label: 'Consensus', value: 'AURA + GRANDPA' },
      { label: 'Block Time', value: '12.0s' },
      { label: 'Gas Subsidy', value: '100% Sponsored' },
      { label: 'Tree Depth', value: '32 Layers' },
    ],
    compactCode: `export ledger nullifiers: Map<Bytes<32>, Boolean>;
export ledger note_tree_root: Cell<Bytes<32>>;

circuit commit_settlement(nullifier: Bytes<32>, new_root: Bytes<32>): Void {
  assert(!nullifiers.member(nullifier));
  nullifiers.insert(nullifier, true);
  note_tree_root.write(new_root);
}`,
    mathProof: '\\mathcal{H}_{\\text{root}}^{\\,(t+1)} = \\text{MerkleUpdate}(\\mathcal{H}_{\\text{root}}^{\\,(t)}, C_{\\text{new}})',
  },
  {
    id: 'audit',
    stepNumber: '04',
    tag: 'SELECTIVE DISCLOSURE',
    title: 'Viewing Key Auditing',
    subtitle: 'Diffie-Hellman Handshake',
    icon: ShieldCheck,
    invariants: [
      'Read-only certificates: no spend authority',
      'Bilateral Diffie-Hellman encryption over Jubjub',
      'ISO-20022, IRS & MiCA compliance ready',
    ],
    metrics: [
      { label: 'Audit Scheme', value: 'ECDH on Jubjub' },
      { label: 'Spend Authority', value: '100% Blind' },
      { label: 'Standard', value: 'ISO-20022 JSON' },
      { label: 'Revocation', value: 'Time-Lock Expiry' },
    ],
    compactCode: `circuit grant_auditor_access(
  auditor_pk: PublicKey, 
  shared_secret: EphemeralSecret,
  tx_commitment: Bytes<32>
): EncryptedAuditReceipt {
  return ecdh_encrypt(tx_commitment, auditor_pk, shared_secret);
}`,
    mathProof: 'K_{\\text{shared}} = \\text{scalar\\_mult}(sk_{\\text{owner}}, PK_{\\text{auditor}})',
  },
];

export function ProtocolArchitecturePipeline() {
  const [activeStageId, setActiveStageId] = useState<string>('witness');
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <div className="space-y-6">
      {/* Header text */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            Execution Pipeline
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-tight">
            How Cyphra Enforces Mathematical Privacy
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-zinc-400 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>4-Stage Protocol Engine</span>
        </div>
      </div>

      {/* Stepper Navigation Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-400/60 shadow-[0_0_20px_rgba(0,255,157,0.15)]'
                  : 'bg-[#060910]/70 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  STAGE {stage.stepNumber}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
              </div>
              <h4 className="text-xs font-bold text-white font-mono leading-tight">
                {stage.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Container */}
      <div className="glass-cyber rounded-3xl border border-white/[0.1] p-5 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Stage Invariants & Proof */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                {activeStage.tag}
              </span>
              <h4 className="text-xl font-black text-white font-mono tracking-tight uppercase mt-2">
                {activeStage.title}
              </h4>
              <p className="text-xs font-mono text-zinc-400">
                // {activeStage.subtitle}
              </p>
            </div>

            {/* Invariants List */}
            <div className="space-y-1.5 pt-1">
              {activeStage.invariants.map((inv, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-zinc-300 font-mono"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{inv}</span>
                </div>
              ))}
            </div>

            {/* Math Proof */}
            <div className="p-3 rounded-xl bg-black/70 border border-emerald-500/20 font-mono text-xs text-emerald-400 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-zinc-500 block uppercase">Formal Invariant</span>
                <span className="font-bold">{activeStage.mathProof}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Code & Metrics */}
          <div className="lg:col-span-6 space-y-4">
            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2">
              {activeStage.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-black/50 border border-white/[0.08] text-left"
                >
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
                    {metric.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-white block mt-0.5">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Compact Code Preview */}
            <div className="rounded-2xl border border-white/[0.1] bg-[#030508] overflow-hidden text-left shadow-xl">
              <div className="flex items-center justify-between px-3.5 py-2 bg-black/60 border-b border-white/[0.08] text-[10px] font-mono text-zinc-400">
                <span className="text-white font-bold">compact_circuit.compact</span>
                <span className="text-zinc-500">COMPACT 0.31.1</span>
              </div>
              <div className="p-3.5 overflow-x-auto text-[11px] font-mono leading-relaxed text-zinc-300">
                <pre className="whitespace-pre">
                  <code>{activeStage.compactCode}</code>
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
