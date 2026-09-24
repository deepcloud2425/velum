import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  oneAMWallet,
  OneAMWalletState,
  SupportedNetwork,
} from '../../lib/one-am-wallet-adapter';
import { ConnectedSession, createConnectedSession } from '../lib/midnight';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';

export interface WalletContextType {
  session: ConnectedSession | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (network?: SupportedNetwork) => Promise<void>;
  connectDemo: (network?: SupportedNetwork) => Promise<void>;
  disconnect: () => void;
  network: SupportedNetwork;
  switchNetwork: (net: SupportedNetwork) => Promise<void>;
  walletState: OneAMWalletState;
  isSandbox: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<OneAMWalletState>(() => oneAMWallet.getState());
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Sync wallet state changes
  useEffect(() => {
    const unsubscribe = oneAMWallet.subscribe(async (state) => {
      setWalletState(state);

      if (state.isConnected && state.connectedApi) {
        try {
          const sess = await createConnectedSession(state.connectedApi);
          setSession(sess);
          oneAMWallet.setContractSession(sess);
        } catch (err) {
          oneAMWallet.setContractSession(null);
          console.warn('Failed to build 1AM connected session:', err);
        }
      } else if (state.isConnected && state.isSandbox) {
        // Build demo session
        const zkConfigProvider = new FetchZkConfigProvider(
          typeof window !== 'undefined'
            ? new URL('/managed', window.location.origin).toString()
            : 'http://localhost:3000/managed',
          typeof window !== 'undefined' ? window.fetch.bind(window) : (fetch as any),
        );

        const demoSession: ConnectedSession = {
          unshieldedAddress: state.addresses?.unshieldedAddress || 'mn_addr_preview1gwv5ww5tvagek3cvqk2gvkh8pxt6840ql8r50lzuv3k44ljmfetqszz0yw',
          shieldedAddress: {
            shieldedAddress: state.addresses?.shieldedAddress || 'mn_shielded1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
            shieldedCoinPublicKey: state.addresses?.shieldedCoinPublicKey || '0x3c914bf4677a69e0fd8bb953585e9e3a7566118bf789a6851740564279972fab',
            shieldedEncryptionPublicKey: state.addresses?.shieldedEncryptionPublicKey || '0x85d315868d02455447b537042e19ab17d60dbe48fc866249c6e1da743d7491ab',
          },
          config: { networkId: state.network || 'preview' },
          providers: {
            privateStateProvider: {
              get: async () => null,
              set: async () => {},
            },
            publicDataProvider: null,
            zkConfigProvider,
            proofProvider: {
              async proveTx(unprovenTx: any) {
                return unprovenTx;
              },
            },
            walletProvider: {
              getCoinPublicKey: () => state.addresses?.shieldedCoinPublicKey || '3c914bf4677a69e0fd8bb953585e9e3a7566118bf789a6851740564279972fab',
              getEncryptionPublicKey: () => state.addresses?.shieldedEncryptionPublicKey || '85d315868d02455447b537042e19ab17d60dbe48fc866249c6e1da743d7491ab',
              balanceTx: async (tx: any) => tx,
            },
            midnightProvider: {
              submitTx: async () => 'demo_tx_hash_simulated',
            },
          },
        };
        oneAMWallet.setContractSession(demoSession);
        setSession(demoSession);
      } else {
        oneAMWallet.setContractSession(null);
        setSession(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const connect = useCallback(async (network: SupportedNetwork = 'preview') => {
    setIsConnecting(true);
    try {
      await oneAMWallet.connectWallet(network);
    } catch (err) {
      console.error('1AM wallet connect error:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectDemo = useCallback(async (network: SupportedNetwork = 'preview') => {
    setIsConnecting(true);
    try {
      await oneAMWallet.connectDemo(network);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (typeof (oneAMWallet as any).disconnect === 'function') {
      (oneAMWallet as any).disconnect();
    }
    oneAMWallet.setContractSession(null);
    setSession(null);
  }, []);

  const switchNetwork = useCallback(async (net: SupportedNetwork) => {
    if (typeof (oneAMWallet as any).switchNetwork === 'function') {
      await (oneAMWallet as any).switchNetwork(net);
    } else {
      await oneAMWallet.connectWallet(net);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        session,
        isConnected: walletState.isConnected,
        isConnecting,
        connect,
        connectDemo,
        disconnect,
        network: walletState.network,
        switchNetwork,
        walletState,
        isSandbox: !!walletState.isSandbox,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
