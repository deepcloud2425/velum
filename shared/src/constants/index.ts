import { MidnightNetworkConfig, TokenMetadata } from '../types/index.js';

export const APP_NAME = 'Velum';
export const APP_DESCRIPTION = 'Privacy-Preserving Confidential Settlements on Midnight';
export const APP_VERSION = '0.1.0';

export const SUPPORTED_TOKENS: Record<string, TokenMetadata> = {
  NIGHT: {
    symbol: 'NIGHT',
    name: 'Midnight Native Token',
    decimals: 6,
    icon: '/tokens/night.svg',
    isShieldedDefault: true,
  },
  DUST: {
    symbol: 'DUST',
    name: 'Midnight Gas Shield',
    decimals: 6,
    icon: '/tokens/dust.svg',
    isShieldedDefault: true,
  },
  tVELUM: {
    symbol: 'tVELUM',
    name: 'Velum Confidential Stable',
    decimals: 6,
    icon: '/tokens/velum.svg',
    isShieldedDefault: true,
  },
};

export const ADDRESS_PREFIXES = {
  SHIELDED: 'mn_shielded',
  UNSHIELDED: 'mn_addr',
  DUST: 'mn_dust',
  CONTRACT: 'mn_contract',
} as const;

export const DEFAULT_NETWORKS: Record<string, MidnightNetworkConfig> = {
  preprod: {
    networkId: 'preprod',
    indexerUri: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWsUri: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    nodeUri: 'https://rpc.preprod.midnight.network',
    proverServerUri: 'https://prover.preprod.midnight.network',
    contractAddress: process.env.NEXT_PUBLIC_VELUM_CONTRACT_ADDRESS || '',
    explorerUrl: 'https://preprod.midnightexplorer.com',
  },
  testnet: {
    networkId: 'testnet',
    indexerUri: 'https://indexer.testnet.midnight.network/api/v1/graphql',
    indexerWsUri: 'wss://indexer.testnet.midnight.network/api/v1/graphql/ws',
    nodeUri: 'https://rpc.testnet.midnight.network',
    proverServerUri: 'https://prover.testnet.midnight.network',
    contractAddress: process.env.NEXT_PUBLIC_VELUM_CONTRACT_ADDRESS || '',
    explorerUrl: 'https://explorer.testnet.midnight.network',
  },
  devnet: {
    networkId: 'devnet',
    indexerUri: 'https://indexer.devnet.midnight.network/api/v1/graphql',
    indexerWsUri: 'wss://indexer.devnet.midnight.network/api/v1/graphql/ws',
    nodeUri: 'https://rpc.devnet.midnight.network',
    proverServerUri: 'https://prover.devnet.midnight.network',
    contractAddress: 'mn_contract1devnetvelum9847293847293847293847293847293',
    explorerUrl: 'https://explorer.devnet.midnight.network',
  },
  local: {
    networkId: 'local',
    indexerUri: 'http://localhost:8088/api/v1/graphql',
    indexerWsUri: 'ws://localhost:8088/api/v1/graphql/ws',
    nodeUri: 'http://localhost:9944',
    proverServerUri: 'http://localhost:6300',
    contractAddress: 'mn_contract1localvelum00000000000000000000000000000000',
    explorerUrl: 'http://localhost:3000/explorer',
  },
};

export const URI_SCHEME = 'velum:pay';
export const DEFAULT_PAYMENT_REQUEST_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const VIEWING_PERMISSIONS = {
  READ_AMOUNTS: 1 << 0,
  READ_COUNTERPARTY: 1 << 1,
  READ_MEMO: 1 << 2,
  FULL_AUDIT: (1 << 0) | (1 << 1) | (1 << 2),
} as const;
