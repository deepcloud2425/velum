'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';
import { SupportedNetwork } from '../../lib/one-am-wallet-adapter';
import {
  Globe,
  Check,
  Cpu,
  Lock,
  Settings,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Sparkles,
  Terminal,
} from 'lucide-react';

export default function SettingsPage() {
  const { account, network, setNetwork, connect, disconnect } = useMidnightWallet();
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetwork>((network as SupportedNetwork) || 'preprod');
  const [isSwitching, setIsSwitching] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [diagnosticRun, setDiagnosticRun] = useState(false);
  const [indexerUrl, setIndexerUrl] = useState('https://indexer.preprod.midnight.network/api/v1/graphql');
  const [nodeRpcUrl, setNodeRpcUrl] = useState('wss://rpc.preprod.midnight.network');

  const handleNetworkSwitch = async (net: SupportedNetwork) => {
    setSelectedNetwork(net);
    setIsSwitching(true);
    setNetwork(net);
    try {
      await connect(net);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('velum_cached_notes');
      localStorage.removeItem('velum_recent_recipients');
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 2500);
    }
  };

  const handleRunDiagnostics = () => {
    setDiagnosticRun(true);
    setTimeout(() => setDiagnosticRun(false), 3000);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 pt-4 pb-12 px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Protocol Control Board
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase">
                Diagnostics & RPC
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Settings & Node Configuration
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Configure target Midnight consensus networks, customize indexer RPC endpoints, and manage local storage cache.
            </p>
          </div>
        </div>

        {/* ── Network Selection Grid ── */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5 text-foreground font-semibold uppercase tracking-wider text-sm">
              <Globe className="w-4 h-4 text-primary" />
              <span>Target Midnight Network</span>
            </div>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              Active: {selectedNetwork}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: 'preprod' as SupportedNetwork,
                name: 'Midnight Preprod',
                badge: 'Recommended',
                desc: 'Decentralized staging network with active validator consensus.',
              },
              {
                id: 'preview' as SupportedNetwork,
                name: 'Midnight Preview',
                badge: 'Developer Sandbox',
                desc: 'Pre-release sandbox for contract experiments and test proving.',
              },
              {
                id: 'mainnet' as SupportedNetwork,
                name: 'Midnight Mainnet',
                badge: 'Upcoming',
                desc: 'Production sovereign zero-knowledge settlement ledger.',
              },
            ].map((net) => {
              const isSelected = selectedNetwork === net.id;
              return (
                <div
                  key={net.id}
                  onClick={() => handleNetworkSwitch(net.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                    isSelected
                      ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20'
                      : 'bg-secondary/30 border-border hover:border-primary/40 hover:bg-secondary/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold uppercase tracking-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>{net.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold inline-block ${isSelected ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground border border-border'}`}>
                      {net.badge}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {net.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Custom RPC & Node Endpoints ── */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5 text-foreground font-semibold uppercase tracking-wider text-sm">
              <Database className="w-4 h-4 text-primary" />
              <span>Node & Indexer RPC Endpoints</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Midnight Indexer GraphQL URL
              </span>
              <input
                type="text"
                value={indexerUrl}
                onChange={(e) => setIndexerUrl(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm text-foreground font-mono outline-none shadow-sm transition-all"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Consensus Node WebSocket URL
              </span>
              <input
                type="text"
                value={nodeRpcUrl}
                onChange={(e) => setNodeRpcUrl(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm text-foreground font-mono outline-none shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Local Diagnostics & Maintenance ── */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-glass space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5 text-foreground font-semibold uppercase tracking-wider text-sm">
              <Terminal className="w-4 h-4 text-primary" />
              <span>Local Storage & Health Diagnostics</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-4 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-foreground font-semibold block mb-1.5 text-sm">Purge Local Note Cache</span>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Removes cached note commitments, temporary viewing keys, and cached explorer states from browser local storage.
                </p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearCache}
                className="font-semibold text-xs w-full h-10 shadow-sm"
              >
                <Trash2 className="w-4 h-4 mr-2 opacity-80" />
                {cacheCleared ? 'Cache Cleared!' : 'Clear Local Cache'}
              </Button>
            </div>

            <div className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-4 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-foreground font-semibold block mb-1.5 text-sm">Run Protocol Diagnostics</span>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Verifies 1AM Wallet DApp Connector handshake, indexer response latency, and WASM memory allocator sanity.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRunDiagnostics}
                className={`font-semibold text-xs w-full h-10 shadow-sm transition-all ${diagnosticRun ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${diagnosticRun ? 'animate-spin text-primary' : 'opacity-80'}`} />
                {diagnosticRun ? 'Systems Operational' : 'Run Full Diagnostics'}
              </Button>
            </div>

            {/* Admin Console Card */}
            <div className="p-6 rounded-2xl bg-secondary/50 border border-border space-y-4 flex flex-col justify-between sm:col-span-2 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-foreground font-semibold block text-sm">Contract Deployer & Admin Console</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase font-semibold">
                      Admin Access
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-lg">
                    Deploy, test, or override Compact smart contracts directly on Midnight Preprod & Preview using 1AM Wallet.
                  </p>
                </div>
                <Link href="/admin">
                  <Button variant="default" size="sm" className="font-semibold text-xs shrink-0 shadow-sm px-5 h-10">
                    <Cpu className="w-4 h-4 mr-2" /> Launch Admin Console
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
