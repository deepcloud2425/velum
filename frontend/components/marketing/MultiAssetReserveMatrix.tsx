'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  Info
} from 'lucide-react';

interface AssetConfig {
  id: string;
  name: string;
  symbol: string;
  type: string;
  shieldedShare: number;
  anonymitySet: number;
  merkleTreeDepth: number;
  gasCostDUsT: string;
  provingLatency: string;
  contractStandard: string;
}

const ASSET_REGISTRY: AssetConfig[] = [
  {
    id: 'night',
    name: 'Native Shielded NIGHT',
    symbol: 'NIGHT',
    type: 'Native Settlement',
    shieldedShare: 88.4,
    anonymitySet: 14820,
    merkleTreeDepth: 32,
    gasCostDUsT: '0.00 DUST',
    provingLatency: '780 ms',
    contractStandard: 'Cell<Uint<64>>',
  },
  {
    id: 'dust',
    name: 'Compute Gas Resource',
    symbol: 'DUST',
    type: 'Fee Subsidizer',
    shieldedShare: 96.2,
    anonymitySet: 42190,
    merkleTreeDepth: 32,
    gasCostDUsT: 'Subsidized',
    provingLatency: '540 ms',
    contractStandard: 'Resource Pallet',
  },
  {
    id: 'tvelum',
    name: 'Vote Escrow Governance',
    symbol: 'tVELUM',
    type: 'Governance Escrow',
    shieldedShare: 92.1,
    anonymitySet: 8940,
    merkleTreeDepth: 32,
    gasCostDUsT: '0.00 DUST',
    provingLatency: '820 ms',
    contractStandard: 'FungibleToken',
  },
  {
    id: 'cusd',
    name: 'Confidential Synthetic USD',
    symbol: 'cUSD',
    type: 'Shielded Stablecoin',
    shieldedShare: 94.7,
    anonymitySet: 22400,
    merkleTreeDepth: 32,
    gasCostDUsT: '0.00 DUST',
    provingLatency: '810 ms',
    contractStandard: 'Escrow Vault',
  },
];

export function MultiAssetReserveMatrix() {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('night');
  const [simulationVolume, setSimulationVolume] = useState<number>(50000);

  const asset = ASSET_REGISTRY.find((a) => a.id === selectedAssetId) || ASSET_REGISTRY[0];
  const dynamicEntropyBits = (Math.log2(asset.anonymitySet * (simulationVolume / 10000))).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            Liquidity Topology
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-tight">
            Shielded Reserves & Anonymity Sets
          </h3>
        </div>

        {/* Asset tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/70 border border-white/[0.08] overflow-x-auto self-start sm:self-auto">
          {ASSET_REGISTRY.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAssetId(a.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedAssetId === a.id
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(0,255,157,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {a.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Main Matrix Card */}
      <div className="glass-cyber rounded-3xl border border-white/[0.1] p-5 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Wing: Simulator */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-xl font-black text-white font-mono uppercase">
                {asset.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {asset.type}
              </span>
            </div>

            {/* Slider */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Simulate Settlement Volume:</span>
                <span className="text-emerald-400 font-bold">
                  {simulationVolume.toLocaleString()} {asset.symbol}
                </span>
              </div>

              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={simulationVolume}
                onChange={(e) => setSimulationVolume(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Anonymity Pool
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {(asset.anonymitySet + simulationVolume / 50).toFixed(0)} Notes
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Entropy Diffusion
                </span>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {dynamicEntropyBits} Bits
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Relayer Gas
                </span>
                <span className="text-sm font-mono font-bold text-teal-300">
                  {asset.gasCostDUsT}
                </span>
              </div>
            </div>
          </div>

          {/* Right Wing: Topology Readout */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-5 rounded-2xl bg-[#03060C] border border-white/[0.1] shadow-xl text-left font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-zinc-300 uppercase font-bold text-[11px]">
                  Accumulator Topology
                </span>
                <span className="text-[10px] text-emerald-400">● 100% UNLINKABLE</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-500">Tree Depth:</span>
                <span className="text-white font-bold">{asset.merkleTreeDepth} Layers (Poseidon)</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-500">Proving Speed:</span>
                <span className="text-cyan-400 font-bold">{asset.provingLatency}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-500">Plaintext Disclosed:</span>
                <span className="text-emerald-400 font-bold">0 Bytes</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-500">Traceability:</span>
                <span className="text-emerald-400 font-black">0.00000000%</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
