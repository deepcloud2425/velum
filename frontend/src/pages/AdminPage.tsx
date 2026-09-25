import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { createEmergencyHeadlessWallet } from '../lib/emergency-wallet';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Shield,
  Check,
} from 'lucide-react';

async function getCompiledContract() {
  const [{ CompiledContract }, { Contract }] = await Promise.all([
    import('@midnight-ntwrk/compact-js'),
    import('../managed/contract/index.js'),
  ]);

  const assetBaseUrl = typeof window !== 'undefined'
    ? new URL('/managed', window.location.origin).toString()
    : 'http://localhost:3000/managed';

  // VelumContract requires witness getters for input, output, and change note values
  const witnesses = {
    get_input_note_value: () => 0n,
    get_output_note_value: () => 0n,
    get_change_note_value: () => 0n,
  };

  return ((CompiledContract as any).make('VelumContract', Contract as any) as any).pipe(
    (c: any) => (CompiledContract as any).withWitnesses(witnesses)(c),
    (CompiledContract as any).withCompiledFileAssets(assetBaseUrl as any),
  );
}

export default function AdminPage() {
  const { session, isConnected, connect, network, switchNetwork, isSandbox } = useWallet();
  const [status, setStatus] = useState<'idle' | 'preparing' | 'deploying' | 'deployed' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deploySubStatus, setDeploySubStatus] = useState<string>('');
  const [manualInput, setManualInput] = useState('');
  const [connectError, setConnectError] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('DEPLOYED_CONTRACT_ADDRESS');
    }
    return null;
  });
  const [copied, setCopied] = useState(false);
  const [selectedDeployNetwork, setSelectedDeployNetwork] = useState<'preview' | 'preprod'>(
    (network as 'preview' | 'preprod') || 'preprod'
  );
  const [mnemonic, setMnemonic] = useState('');

  useEffect(() => {
    if (network === 'preview' || network === 'preprod') {
      setSelectedDeployNetwork(network);
    }
  }, [network]);

  const handleConnectReal = async () => {
    setConnectError(null);
    try {
      await connect(selectedDeployNetwork);
    } catch (e: any) {
      setConnectError(
        e?.message || '1AM extension not found. Please install the official 1AM Wallet extension from 1am.xyz.'
      );
    }
  };

  const handleDeploy = useCallback(async () => {
    if (!isConnected || isSandbox || !session?.providers?.walletProvider) {
      setErrorMsg('Please connect your 1AM Wallet extension to deploy directly on-chain.');
      return;
    }
    setStatus('preparing');
    setCurrentStep(1);
    setDeploySubStatus('Verifying contract artifacts and compiler witnesses...');
    setErrorMsg(null);

    try {
      const compiledContract = await getCompiledContract();
      const constructorArgs: any[] = [];

      setCurrentStep(2);
      setDeploySubStatus('Building unproven deployment transaction and verifier keys...');

      const [{ createUnprovenDeployTx }, { sampleSigningKey }, { setNetworkId }] = await Promise.all([
        import('@midnight-ntwrk/midnight-js-contracts'),
        import('@midnight-ntwrk/compact-runtime'),
        import('@midnight-ntwrk/midnight-js-network-id'),
      ]);

      setNetworkId(selectedDeployNetwork);

      const deployTxData = await (createUnprovenDeployTx as any)(
        {
          zkConfigProvider: session.providers.zkConfigProvider,
          walletProvider: session.providers.walletProvider,
        },
        {
          compiledContract,
          args: constructorArgs,
          signingKey: sampleSigningKey ? sampleSigningKey() : new Uint8Array(32),
        } as any
      );

      if (!deployTxData?.public?.contractAddress) {
        throw new Error('Failed to derive contract address from Midnight deployment transaction.');
      }

      const contractAddress = deployTxData.public.contractAddress;

      // Phase 1: In-browser ZK Proving
      setStatus('deploying');
      setDeploySubStatus('Generating zero-knowledge proof (in-browser WASM prover, ~3-10s)...');
      
      // Keep 1AM extension alive during long proof
      const keepAlive = setInterval(async () => {
        try {
          if (window.midnight?.['1am']) {
            const api = await (window.midnight['1am'] as any).enable();
            await api.state();
            console.log('Pinged 1AM wallet to keep background script alive');
          }
        } catch (e) {}
      }, 5000);

      let provenTx;
      try {
        provenTx = await session.providers.proofProvider.proveTx(deployTxData.private.unprovenTx);
      } finally {
        clearInterval(keepAlive);
      }

      // Phase 2: 1AM Wallet Signature & DUST Fee Balancing
      setCurrentStep(3);
      setDeploySubStatus('Requesting 1AM Wallet approval. If popup didn\'t open, click the 1AM icon in your toolbar.');
      const balancedTx = await session.providers.walletProvider.balanceTx(provenTx);

      // Phase 3: Submit to Midnight Preprod Ledger
      setCurrentStep(4);
      setDeploySubStatus('Broadcasting balanced transaction to Midnight Preprod ledger...');
      await session.providers.midnightProvider.submitTx(balancedTx);

      setDeployedAddress(contractAddress);
      if (typeof window !== 'undefined') {
        localStorage.setItem('DEPLOYED_CONTRACT_ADDRESS', contractAddress);
      }
      setStatus('deployed');
    } catch (e: any) {
      console.error('Contract deployment failed:', e);
      setStatus('error');
      const rawMsg = e?.message ?? String(e);
      if (rawMsg.includes('182')) {
        setErrorMsg('Transaction TTL expired (Node Error 182): The transaction timestamp lapsed before inclusion. Please click deploy again to submit a fresh transaction.');
      } else if (rawMsg.toLowerCase().includes('reject') || rawMsg.toLowerCase().includes('cancel') || rawMsg.toLowerCase().includes('denied')) {
        setErrorMsg('Deployment cancelled: 1AM Wallet signature/balancing was rejected.');
      } else if (rawMsg.toLowerCase().includes('dust') || rawMsg.toLowerCase().includes('balance failed')) {
        setErrorMsg('1AM Wallet DUST not ready: Ensure DUST generation is active in 1AM (Tokens → tNIGHT → Generate DUST) and wait a moment for coins to mature.');
      } else {
        setErrorMsg(rawMsg);
      }
    }
  }, [session, isConnected, isSandbox]);

  const handleEmergencyDeploy = async () => {
    if (!mnemonic.trim()) {
      setErrorMsg('Please enter your mnemonic to emergency deploy.');
      return;
    }
    if (!session?.providers?.zkConfigProvider || !session?.providers?.proofProvider) {
      setErrorMsg('Please connect your 1AM extension (just for proving access) before emergency deploy.');
      return;
    }

    setStatus('preparing');
    setCurrentStep(1);
    setDeploySubStatus('Emergency Deploy: Setting up headless wallet...');
    setErrorMsg(null);

    try {
      const { provider } = await createEmergencyHeadlessWallet(mnemonic.trim());
      
      const compiledContract = await getCompiledContract();
      
      setCurrentStep(2);
      setDeploySubStatus('Emergency Deploy: Building unproven deployment transaction...');

      const [{ createUnprovenDeployTx }, { sampleSigningKey }] = await Promise.all([
        import('@midnight-ntwrk/midnight-js-contracts'),
        import('@midnight-ntwrk/compact-runtime')
      ]);

      const deployTxData = await (createUnprovenDeployTx as any)(
        {
          zkConfigProvider: session.providers.zkConfigProvider,
          walletProvider: provider,
        },
        {
          compiledContract,
          args: [],
          signingKey: sampleSigningKey ? sampleSigningKey() : new Uint8Array(32),
        } as any
      );

      const contractAddress = deployTxData.public.contractAddress;

      setCurrentStep(3);
      setDeploySubStatus('Emergency Deploy: Proving in-browser (WASM)...');
      const provenTx = await session.providers.proofProvider.proveTx(deployTxData.private.unprovenTx);

      setDeploySubStatus('Emergency Deploy: Balancing headless transaction (no popup)...');
      const balancedTx = await provider.balanceTx(provenTx);

      setCurrentStep(4);
      setDeploySubStatus('Emergency Deploy: Broadcasting to Preprod ledger...');
      await provider.submitTx(balancedTx);

      setDeployedAddress(contractAddress);
      if (typeof window !== 'undefined') {
        localStorage.setItem('DEPLOYED_CONTRACT_ADDRESS', contractAddress);
      }
      setStatus('deployed');
    } catch (e: any) {
      console.error('Emergency deployment failed:', e);
      setStatus('error');
      setErrorMsg(e?.message ?? String(e));
    }
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualInput.trim();
    if (!clean) return;
    setDeployedAddress(clean);
    if (typeof window !== 'undefined') {
      localStorage.setItem('DEPLOYED_CONTRACT_ADDRESS', clean);
    }
    setStatus('deployed');
    setManualInput('');
  };

  const copyAddress = () => {
    if (!deployedAddress) return;
    navigator.clipboard.writeText(deployedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetContract = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('DEPLOYED_CONTRACT_ADDRESS');
    }
    setDeployedAddress(null);
    setStatus('idle');
    setCurrentStep(0);
    setErrorMsg(null);
  };

  const explorerBaseUrl = selectedDeployNetwork === 'preprod'
    ? 'https://preprod.midnightexplorer.com/contracts'
    : 'https://preview.midnightexplorer.com/contracts';

  const steps = [
    { num: 1, name: 'Assets' },
    { num: 2, name: 'Build Tx' },
    { num: 3, name: '1AM Approval' },
    { num: 4, name: 'Confirm' },
  ];

  const canDeployOnChain = isConnected && !isSandbox && !!session?.providers?.walletProvider;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8 py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="relative">
            <h1 className="text-5xl font-black tracking-tight text-3d mb-2">
              Contract Deployer
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              Midnight Compact Smart Contract On-Chain Deployment
            </p>
          </div>

          {/* Network Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-secondary/50 border border-border text-sm">
            <button
              type="button"
              onClick={() => {
                setSelectedDeployNetwork('preview');
                if (switchNetwork) switchNetwork('preview');
              }}
              className={`px-4 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                selectedDeployNetwork === 'preview'
                  ? 'bg-background text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDeployNetwork('preprod');
                if (switchNetwork) switchNetwork('preprod');
              }}
              className={`px-4 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                selectedDeployNetwork === 'preprod'
                  ? 'bg-background text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Preprod
            </button>
          </div>
        </div>

        {/* Mode Indicator */}
        {isConnected && (
          <div className={`p-4 rounded-xl border text-sm flex items-center justify-between shadow-sm ${
            isSandbox
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
              : 'bg-primary/5 border-border text-foreground'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isSandbox ? 'bg-amber-400' : 'bg-green-500 animate-pulse'}`} />
              <span className="font-medium">
                {isSandbox ? 'Demo Mode Active (Disconnected)' : '1AM Wallet Connected'}
              </span>
            </div>
            <span className="text-xs uppercase font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              {isSandbox ? 'Local Testing Only' : selectedDeployNetwork}
            </span>
          </div>
        )}

        {/* Main Deploy Card */}
        <div className="panel-3d p-6 sm:p-8 group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />

          {/* Technical Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-8 border-b border-border">
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/50 border border-transparent">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prover Engine</span>
              <span className="text-sm font-semibold text-foreground truncate">1AM In-Browser WASM</span>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/50 border border-transparent">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gas Sponsor</span>
              <span className="text-sm font-semibold text-foreground truncate">1AM DUST (Zero Gas)</span>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/50 border border-transparent">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contract Core</span>
              <span className="text-sm font-semibold text-foreground truncate">Compact v0.31.1</span>
            </div>
          </div>

          {!canDeployOnChain ? (
            <div className="pt-10 pb-6 text-center space-y-6 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-secondary/80 border border-primary/50 flex items-center justify-center text-primary mx-auto shadow-glow-cyan animate-float">
                <Shield className="w-10 h-10 opacity-90" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold tracking-tight text-foreground">
                  Connect 1AM Wallet to Deploy
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Deploying to Midnight requires the 1AM Wallet extension to authorize transaction balancing with DUST and broadcast on-chain.
                </p>
              </div>

              {connectError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-left flex items-start gap-3 max-w-md mx-auto">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{connectError}</span>
                </div>
              )}

              <div className="pt-4 flex justify-center">
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleConnectReal}
                  className="btn-3d px-10 h-14 font-bold rounded-xl text-white uppercase tracking-wider"
                >
                  Connect 1AM Extension
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-8 space-y-8">
              {/* Progress Tracker */}
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                {steps.map((s) => {
                  const isActive = currentStep === s.num;
                  const isPast = currentStep > s.num;
                  return (
                    <div
                      key={s.num}
                      className={`py-3 px-2 rounded-xl border transition-all font-medium ${
                        isActive
                          ? 'bg-primary/5 border-foreground/20 text-foreground shadow-sm'
                          : isPast
                          ? 'bg-secondary/50 border-transparent text-foreground/70'
                          : 'bg-transparent border-border text-muted-foreground'
                      }`}
                    >
                      <span className="opacity-50 mr-1.5 text-xs">{s.num}.</span>
                      <span>{s.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Status Display & Action */}
              {status === 'idle' || status === 'error' ? (
                <div className="space-y-6 pt-4 relative z-10">
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    onClick={handleDeploy}
                    className="btn-3d w-full text-lg font-bold text-white h-16 rounded-2xl uppercase tracking-widest shadow-glow-magenta transition-all"
                  >
                    <Sparkles className="w-6 h-6 mr-3 text-cyan-200 animate-pulse-glow" />
                    Deploy to Midnight {selectedDeployNetwork}
                  </Button>
                  
                  {/* Emergency Headless Deploy */}
                  <div className="mt-8 p-5 rounded-2xl border border-border bg-secondary/30 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Stuck? Emergency Headless Deploy
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        If the 1AM popup fails to open due to browser background worker suspension, paste your mnemonic here to deploy locally. <span className="text-amber-500 font-medium">Never paste your seed on mainnet.</span>
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste your 1AM wallet mnemonic here..."
                      value={mnemonic}
                      onChange={(e) => setMnemonic(e.target.value)}
                      className="input-3d w-full rounded-xl px-4 py-3 text-sm font-mono focus:outline-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEmergencyDeploy}
                      className="w-full font-medium"
                    >
                      Bypass Wallet & Deploy Headlessly
                    </Button>
                  </div>
                </div>
              ) : status === 'preparing' || status === 'deploying' ? (
                <div className="py-12 text-center space-y-6">
                  <Loader2 className="w-8 h-8 text-foreground/40 animate-spin mx-auto" />
                  <div className="text-sm font-medium text-foreground">
                    {deploySubStatus || (
                      currentStep === 1 ? 'Verifying contract assets & witnesses...' :
                      currentStep === 2 ? 'Building unproven deployment transaction...' :
                      currentStep === 3 ? 'Awaiting 1AM Wallet approval...' :
                      currentStep === 4 ? 'Submitting contract to Midnight ledger...' : 'Processing...'
                    )}
                  </div>
                  {currentStep === 3 && (
                    <div className="p-4 bg-secondary/80 border border-border rounded-xl text-foreground text-sm max-w-md mx-auto leading-relaxed shadow-sm">
                      💡 <strong>Note:</strong> If the approval dialog did not pop open automatically, please <strong>click the 1AM icon in your browser toolbar</strong> to review and approve the pending transaction.
                    </div>
                  )}
                </div>
              ) : (
                /* Deployed Result */
                <div className="p-6 bg-primary/5 border border-border rounded-2xl space-y-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-semibold text-foreground">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>
                        Contract Deployed ({selectedDeployNetwork})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetContract}
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-secondary"
                    >
                      <RefreshCw className="w-4 h-4" /> Reset
                    </button>
                  </div>

                  <div className="bg-background p-4 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <span className="text-foreground font-mono text-sm break-all">
                      {deployedAddress}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={copyAddress}
                      className="shrink-0 font-medium px-4 w-full sm:w-auto"
                    >
                      {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-sm text-muted-foreground">
                    <span>✓ Broadcast to Midnight</span>
                    <a
                      href={`${explorerBaseUrl}/${deployedAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-foreground font-medium hover:underline group"
                    >
                      View on Explorer <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  </div>
                </div>
              )}

              {/* Error Box */}
              {status === 'error' && errorMsg && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-start gap-3 text-sm shadow-sm mt-6">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="break-words leading-relaxed">{errorMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Existing Contract Address Override */}
        <div className="panel-3d p-6">
          <p className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-cyan-200">
            Use Existing Deployed Contract
          </p>
          <form onSubmit={handleManualSave} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Paste contract address (e.g. c5bba4e8...)"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="input-3d w-full rounded-xl px-4 py-3 text-sm font-mono focus:outline-none"
            />
            <Button
              type="submit"
              variant="secondary"
              className="btn-3d w-full sm:w-auto h-[46px] px-8 font-bold shrink-0 uppercase tracking-wider text-white"
            >
              Set Active
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
