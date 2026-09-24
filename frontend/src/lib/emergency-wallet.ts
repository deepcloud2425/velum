import { Buffer } from 'buffer';
import * as bip39 from 'bip39';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { UnshieldedWallet, createKeystore, PublicKey } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import * as ledger from '@midnight-ntwrk/ledger-v8';
import * as Rx from 'rxjs';
import type { WalletProvider, MidnightProvider } from '@midnight-ntwrk/midnight-js-types';
import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

const signTransactionIntents = (
  tx: { intents?: Map<number, any> },
  signFn: (payload: Uint8Array) => ledger.Signature,
  proofMarker: 'proof' | 'pre-proof',
) => {
  if (!tx.intents || tx.intents.size === 0) return;
  for (const segment of tx.intents.keys()) {
    const intent = tx.intents.get(segment);
    if (!intent) continue;

    const cloned = ledger.Intent.deserialize(
      'signature', proofMarker, 'pre-binding', intent.serialize()
    );
    const signature = signFn(cloned.signatureData(segment));
    
    if ((cloned as any).fallibleUnshieldedOffer) {
      const sigs = (cloned as any).fallibleUnshieldedOffer.inputs.map(
        (_: any, i: number) => (cloned as any).fallibleUnshieldedOffer.signatures.at(i) ?? signature
      );
      (cloned as any).fallibleUnshieldedOffer = (cloned as any).fallibleUnshieldedOffer.addSignatures(sigs);
    }
    if ((cloned as any).guaranteedUnshieldedOffer) {
      const sigs = (cloned as any).guaranteedUnshieldedOffer.inputs.map(
        (_: any, i: number) => (cloned as any).guaranteedUnshieldedOffer.signatures.at(i) ?? signature
      );
      (cloned as any).guaranteedUnshieldedOffer = (cloned as any).guaranteedUnshieldedOffer.addSignatures(sigs);
    }
    tx.intents.set(segment, cloned);
  }
};

export async function createEmergencyHeadlessWallet(mnemonic: string) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const hdWallet = HDWallet.fromSeed(seed);
  if (hdWallet.type !== 'seedOk') throw new Error('Invalid seed');

  const derivationResult = hdWallet.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);

  if (derivationResult.type !== 'keysDerived') throw new Error('Key derivation failed');
  hdWallet.hdWallet.clear();
  
  const keys = derivationResult.keys;
  const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(keys[Roles.Zswap]);
  const dustSecretKey = ledger.DustSecretKey.fromSeed(keys[Roles.Dust]);

  const networkId = getNetworkId() || 'preprod';
  const unshieldedKeystore = createKeystore(keys[Roles.NightExternal], networkId as any);

  const indexer = networkId === 'preview' ? 'https://indexer.preview.midnight.network/api/v4/graphql' : 'https://indexer.preprod.midnight.network/api/v4/graphql';
  const indexerWS = networkId === 'preview' ? 'wss://indexer.preview.midnight.network/api/v4/graphql/ws' : 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
  const rpc = networkId === 'preview' ? 'wss://rpc.preview.midnight.network' : 'https://rpc.preprod.midnight.network';
  const relayWs = rpc.startsWith('http') ? rpc.replace('http', 'ws') : rpc;

  const dummyProver = new URL('http://localhost:6300');
  
  const shieldedWallet = ShieldedWallet({
    networkId: networkId as any,
    indexerClientConnection: { indexerHttpUrl: indexer, indexerWsUrl: indexerWS },
  } as any).startWithSecretKeys(shieldedSecretKeys);

  const unshieldedWallet = UnshieldedWallet({
    networkId: networkId as any,
    indexerClientConnection: { indexerHttpUrl: indexer },
  } as any).startWithPublicKey(PublicKey.fromKeyStore(unshieldedKeystore));

  const dustWallet = DustWallet({
    networkId: networkId as any,
    costParameters: {
      additionalFeeOverhead: 300_000_000_000_000n,
      feeBlocksMargin: 5,
    },
    indexerClientConnection: { indexerHttpUrl: indexer, indexerWsUrl: indexerWS },
  } as any).startWithSecretKey(dustSecretKey, ledger.LedgerParameters.initialParameters().dust);

  const wallet = await WalletFacade.init({
    configuration: {
      networkId: networkId as any,
      indexerClientConnection: { indexerHttpUrl: indexer, indexerWsUrl: indexerWS },
      provingServerUrl: dummyProver,
      relayURL: new URL(relayWs),
      costParameters: {
        additionalFeeOverhead: 300_000_000_000_000n,
        feeBlocksMargin: 5,
      },
    } as any,
    shielded: () => shieldedWallet,
    unshielded: () => unshieldedWallet,
    dust: () => dustWallet,
  } as any);
  await wallet.start(shieldedSecretKeys, dustSecretKey);

  console.log('Emergency wallet starting sync...');
  console.log('Emergency wallet starting sync...');
  let state;
  try {
    state = await Rx.firstValueFrom(
      wallet.state().pipe(
        Rx.tap((s) => console.log('Wallet state update:', { isSynced: s.isSynced, shielded: s.shielded.progress, unshielded: s.unshielded.progress, dust: s.dust.progress })),
        Rx.filter((s) => s.isSynced),
        Rx.timeout(8000)
      )
    );
    console.log('Emergency wallet synced!', state);
  } catch (e) {
    console.warn('Sync timed out or errored, proceeding anyway...', e);
    // Grab the latest state synchronously if we timed out
    state = await Rx.firstValueFrom(wallet.state());
  }
  
  const provider: WalletProvider & MidnightProvider = {
    getCoinPublicKey() { return state.shielded.coinPublicKey.toHexString(); },
    getEncryptionPublicKey() { return state.shielded.encryptionPublicKey.toHexString(); },
    async balanceTx(tx, ttl?) {
      console.log('Balancing transaction with emergency headless wallet...');
      const recipe = await wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys, dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 60 * 60 * 1000) },
      );
      const signFn = (payload: Uint8Array) => unshieldedKeystore.signData(payload);
      signTransactionIntents(recipe.baseTransaction, signFn, 'proof');
      if (recipe.balancingTransaction) {
        signTransactionIntents(recipe.balancingTransaction, signFn, 'pre-proof');
      }
      return wallet.finalizeRecipe(recipe);
    },
    submitTx(tx) {
      console.log('Submitting transaction to relay...');
      return wallet.submitTransaction(tx) as any;
    },
  };

  return { wallet, provider, state };
}
