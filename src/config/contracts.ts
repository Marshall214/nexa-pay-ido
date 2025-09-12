// Contract configuration
// UPDATE THESE ADDRESSES WITH YOUR DEPLOYED CONTRACT ADDRESSES ON SEPOLIA

export const CONTRACT_ADDRESSES = {
  NEXAPAY_TOKEN: process.env.VITE_PUBLIC_NEXAPAY_TOKEN_ADDRESS || '0x', // NexaPayToken address
  NPT_IDO: process.env.VITE_PUBLIC_NPT_IDO_ADDRESS || '0x', // NPT_IDO address
  OWNER_ADDRESS: process.env.VITE_PUBLIC_OWNER_ADDRESS || '0x', // Your Contract Owner Address
} as const;

console.log("CONTRACT_ADDRESSES.NEXAPAY_TOKEN:", CONTRACT_ADDRESSES.NEXAPAY_TOKEN);
console.log("CONTRACT_ADDRESSES.NPT_IDO:", CONTRACT_ADDRESSES.NPT_IDO);
console.log("CONTRACT_ADDRESSES.OWNER_ADDRESS:", CONTRACT_ADDRESSES.OWNER_ADDRESS);

export const NETWORK_CONFIG = {
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Test Network',
    rpcUrls: [process.env.VITE_PUBLIC_INFURA_RPC_URL || ''],
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
