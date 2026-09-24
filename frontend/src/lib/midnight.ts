import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';

export function toHex(bytes: Uint8Array): string {
  if (!bytes) return '';
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function fromHex(hexString: string): Uint8Array {
  if (!hexString) return new Uint8Array();
  const clean = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  const match = clean.match(/.{1,2}/g);
  return new Uint8Array(match ? match.map((byte) => parseInt(byte, 16)) : []);
}

export function cleanHex(val: string | undefined | null): string {
  if (!val) return '';
  return val.startsWith('0x') ? val.slice(2) : val;
}

export function createPrivateStateProvider() {
  let scope = '';
  const stateStore = new Map<string, unknown>();
  const signingKeyStore = new Map<string, unknown>();
  const key = (id: string) => `${scope}:${id}`;

  return {
    setContractAddress(address: string) { scope = address; },
    async set(id: string, state: unknown) { stateStore.set(key(id), state); },
    async get(id: string) { return stateStore.get(key(id)) ?? null; },
    async remove(id: string) { stateStore.delete(key(id)); },
    async clear() { stateStore.clear(); },
    async setSigningKey(addr: string, k: unknown) { signingKeyStore.set(addr, k); },
    async getSigningKey(addr: string) { return signingKeyStore.get(addr) ?? null; },
    async removeSigningKey(addr: string) { signingKeyStore.delete(addr); },
    async clearSigningKeys() { signingKeyStore.clear(); },
    async exportPrivateStates(): Promise<never> { throw new Error('Not implemented.'); },
    async importPrivateStates(): Promise<never> { throw new Error('Not implemented.'); },
    async exportSigningKeys(): Promise<never> { throw new Error('Not implemented.'); },
    async importSigningKeys(): Promise<never> { throw new Error('Not implemented.'); },
  };
}

export interface ConnectedSession {
  unshieldedAddress: string;
  shieldedAddress: any;
  config: any;
  providers: {
    privateStateProvider: any;
    publicDataProvider: any;
    zkConfigProvider: any;
    proofProvider: any;
    walletProvider: any;
    midnightProvider: any;
  };
}

export async function createConnectedSession(api: any): Promise<ConnectedSession> {
  const [config, unshieldedAddr, shieldedAddress] = await Promise.all([
    api.getConfiguration ? api.getConfiguration() : { networkId: 'preprod' },
    api.getUnshieldedAddress ? api.getUnshieldedAddress() : { unshieldedAddress: '' },
    api.getShieldedAddresses ? api.getShieldedAddresses() : null,
  ]);

  // Set the active network (Preview / Preprod)
  if (config?.networkId) {
    try {
      setNetworkId(config.networkId);
    } catch {
      // Ignored if network ID already initialized
    }
  }

  // Serve compiled ZK keys & artifacts from /managed
  const zkConfigProvider = new FetchZkConfigProvider(
    typeof window !== 'undefined'
      ? new URL('/managed', window.location.origin).toString()
      : 'http://localhost:3000/managed',
    typeof window !== 'undefined' ? window.fetch.bind(window) : (fetch as any),
  );

  let provingProvider: any = null;
  if (typeof api.getProvingProvider === 'function') {
    try {
      provingProvider = await api.getProvingProvider(zkConfigProvider);
      console.log('[1AM Session] Proving provider successfully initialized from wallet.');
    } catch (err) {
      console.error('[1AM Session] Could not initialize proving provider from wallet:', err);
    }
  } else {
    console.warn('[1AM Session] api.getProvingProvider is not available on 1AM API.');
  }

  const proofProvider = {
    async proveTx(unprovenTx: any, _config?: any) {
      console.log('[1AM Session] proofProvider.proveTx called. Has prove:', typeof unprovenTx?.prove === 'function');
      if (typeof unprovenTx?.prove === 'function') {
        if (!provingProvider) {
          throw new Error('1AM proving provider is not available. Please ensure 1AM wallet is connected and unlocked.');
        }
        const { CostModel } = await import('@midnight-ntwrk/ledger-v8');
        console.log('[1AM Session] Running unprovenTx.prove with 1AM proving provider...');
        const proven = await unprovenTx.prove(provingProvider, CostModel.initialCostModel());
        console.log('[1AM Session] unprovenTx.prove completed successfully.');
        return proven;
      }
      return unprovenTx;
    },
  };

  const walletProvider = {
    getCoinPublicKey: () => cleanHex(shieldedAddress?.shieldedCoinPublicKey),
    getEncryptionPublicKey: () => cleanHex(shieldedAddress?.shieldedEncryptionPublicKey),
    balanceTx: async (tx: any) => {
      console.log('[1AM Session] walletProvider.balanceTx called.');
      if (typeof tx?.serialize === 'function' && typeof api.balanceUnsealedTransaction === 'function') {
        const serialized = tx.serialize();
        if (typeof window !== 'undefined' && (window as any).Buffer) {
          const header = (window as any).Buffer.from(serialized.slice(0, 70)).toString('utf8');
          console.log('[1AM Session] Tx header before balance:', header);
        }
        const txHex = toHex(serialized);
        console.log('[1AM Session] Requesting 1AM ProofStation balance, hex length:', txHex.length);
        const balanced = await api.balanceUnsealedTransaction(txHex);
        if (!balanced?.tx) {
          throw new Error('1AM Wallet transaction balancing was rejected or failed.');
        }
        console.log('[1AM Session] 1AM ProofStation balanced transaction received!');
        const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
        return Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced.tx));
      }
      return tx;
    },
  };

  const midnightProvider = {
    submitTx: async (tx: any) => {
      console.log('[1AM Session] midnightProvider.submitTx called.');
      if (typeof tx?.serialize === 'function' && typeof api.submitTransaction === 'function') {
        const txHex = toHex(tx.serialize());
        console.log('[1AM Session] Submitting transaction to Midnight blockchain...');
        const result = await api.submitTransaction(txHex);
        console.log('[1AM Session] Transaction submission result:', result);
        if (typeof result === 'string' && result) return result;
        if (result?.transactionId) return result.transactionId;
        if (result?.id) return result.id;
        return txHex.slice(0, 64);
      }
      throw new Error('1AM Wallet submission API is not available.');
    },
  };

  const privateStateProvider = createPrivateStateProvider();

  let publicDataProvider: any = null;
  if (typeof api.getPublicDataProvider === 'function') {
    try {
      publicDataProvider = await api.getPublicDataProvider();
    } catch (e) {
      console.warn('Could not get publicDataProvider from API:', e);
    }
  }

  return {
    unshieldedAddress: typeof unshieldedAddr === 'string' ? unshieldedAddr : unshieldedAddr?.unshieldedAddress || '',
    shieldedAddress,
    config,
    providers: {
      privateStateProvider,
      publicDataProvider,
      zkConfigProvider,
      proofProvider,
      walletProvider,
      midnightProvider,
    },
  };
}
