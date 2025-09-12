// Contract configuration
// UPDATE THESE ADDRESSES WITH YOUR DEPLOYED CONTRACT ADDRESSES ON SEPOLIA

export const CONTRACT_ADDRESSES = {
  NEXAPAY_TOKEN: import.meta.env.VITE_PUBLIC_NEXAPAY_TOKEN_ADDRESS || '0x', // NexaPayToken address
  NPT_IDO: import.meta.env.VITE_PUBLIC_NPT_IDO_ADDRESS || '0x47D6d06d34aA875e01d556c29f98e9E6841d9779', // NEW NPT_IDO address
  PUSD_TOKEN: import.meta.env.VITE_PUBLIC_PUSD_TOKEN_ADDRESS || '0x', // PUSD Token address
  OWNER_ADDRESS: import.meta.env.VITE_PUBLIC_OWNER_ADDRESS || '0x', // Your Contract Owner Address
} as const;

export const NETWORK_CONFIG = {
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Test Network',
    rpcUrls: [import.meta.env.VITE_PUBLIC_INFURA_RPC_URL || ''],
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
