import { ethers, providers } from 'ethers';

async function ensToEoa(ensAddress: string, providerUrl: string): Promise<string | undefined> {
  try {
    const provider = new providers.JsonRpcProvider(providerUrl);
    const eoaAddress = await provider.resolveName(ensAddress);
    
    if (!eoaAddress) {
      console.log('Could not resolve ENS address.');
      return;
    }
    
    console.log('EOA Address:', eoaAddress);
    return eoaAddress;
  } catch (error) {
    console.error('Error resolving ENS address:', error);
  }
}

// Example usage:
const ensAddress = '0xankush.eth'; // Replace with the ENS address you want to convert
const providerUrl = 'https://eth-mainnet.g.alchemy.com/v2/LatuiPPNGhXoq-yKXOr75pOLko1WxUxN'; // Replace with your own provider URL (e.g., from Infura or Alchemy)

ensToEoa(ensAddress, providerUrl);