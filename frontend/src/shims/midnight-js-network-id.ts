// Self-contained network-id manager for Midnight
const getInitialNetworkId = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('velum_midnight_network');
      if (saved && (saved === 'preview' || saved === 'preprod' || saved === 'mainnet')) {
        return saved;
      }
    } catch {}
  }
  return 'preprod';
};

let currentNetworkId: string = getInitialNetworkId();

export const setNetworkId = (id: string): void => {
  if (id) {
    currentNetworkId = id;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('velum_midnight_network', id);
      } catch {}
    }
  }
};

export const getNetworkId = (): string => {
  if (!currentNetworkId) {
    currentNetworkId = getInitialNetworkId();
  }
  return currentNetworkId;
};

export enum NetworkId {
  Undeployed = 'undeployed',
  Preview = 'preview',
  Preprod = 'preprod',
  Mainnet = 'mainnet',
}
