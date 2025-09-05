// Contract configuration
// UPDATE THESE ADDRESSES WITH YOUR DEPLOYED CONTRACT ADDRESSES ON SEPOLIA

export const CONTRACT_ADDRESSES = {
  // Deployed contract addresses on Sepolia
  NEXAPAY_TOKEN: '0x0a5385Af31C7b9deEeAb6cEabacC3e1244920246', // NexaPayToken address
  NPT_IDO: '0xBD0Df2f72d89a5F3E5E96A9902eFc207aA730090', // NPT_IDO address
} as const;

export const NETWORK_CONFIG = {
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Test Network',
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'SepoliaETH',
      decimals: 18,
    },
  },
} as const;

// Helper function to format addresses for display
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to check if address is valid
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
