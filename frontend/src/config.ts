/**
 * VELUM Dynamic Contract Address Configuration
 *
 * Checks in order of precedence:
 * 1. In-browser deployed contract stored in localStorage ('DEPLOYED_CONTRACT_ADDRESS')
 * 2. Environment variable VITE_CONTRACT_ADDRESS (Vite)
 * 3. Environment variable NEXT_PUBLIC_VELUM_CONTRACT_ADDRESS
 * 4. Empty string when deployment has not been finalized
 */

export function getDeployedContractAddress(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('DEPLOYED_CONTRACT_ADDRESS');
    if (local && local.trim().length > 0) {
      return local.trim();
    }
  }

  const viteAddr = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CONTRACT_ADDRESS;
  if (viteAddr && viteAddr.trim().length > 0) {
    return viteAddr.trim();
  }

  const nextAddr = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_VELUM_CONTRACT_ADDRESS : undefined;
  if (nextAddr && nextAddr.trim().length > 0) {
    return nextAddr.trim();
  }

  return '';
}

export function hasDeployedContractAddress(address = getDeployedContractAddress()): boolean {
  return /^(0x)?[0-9a-f]{64}$/i.test(address);
}

export const CONTRACT_ADDRESS = getDeployedContractAddress();
