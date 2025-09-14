import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { useToast } from "@/hooks/use-toast";

// Contract ABIs - we'll add these after you provide the deployed addresses
const NEXAPAY_TOKEN_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const NPT_IDO_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokensForSale",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tokensPerETH",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensAmount",
        "type": "uint256"
      }
    ],
    "name": "Bought",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "UnsoldTokensRecovered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethAmount",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "recoverUnsoldTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokensForSale",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokensPerETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "tokensPurchased",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokensRemaining",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokensSold",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../config/contracts';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  provider: BrowserProvider | null;
  
  // Contract instances
  tokenContract: Contract | null;
  idoContract: Contract | null;
  // pusdContract: Contract | null; // PUSD Contract instance
  
  // Contract data
  tokenData: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    userBalance: string;
  } | null;

  // pusdData: {
  //   name: string;
  //   symbol: string;
  //   decimals: number;
  //   userBalance: string;
  //   allowance: string; // Allowance for IDO contract
  // } | null;
  
  idoData: {
    tokensForSale: string;
    tokensSold: string;
    tokensPerEth: string; // Changed from tokensPerPUSD
    userTokensPurchased: string;
    tokensRemaining: string;
  } | null;

  userEthBalance: string | null; // New: User's native ETH balance
  
  // Methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  buyTokens: (ethAmount: string) => Promise<string>; // Changed to accept ethAmount
  // approvePUSD: (amount: string) => Promise<string>; // New: Approve PUSD for IDO
  refreshData: () => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [idoContract, setIdoContract] = useState<Contract | null>(null);
  // const [pusdContract, setPusdContract] = useState<Contract | null>(null); // Initialize pusdContract
  const [tokenData, setTokenData] = useState(null);
  // const [pusdData, setPusdData] = useState(null); // Initialize pusdData
  const [idoData, setIdoData] = useState(null);
  const [userEthBalance, setUserEthBalance] = useState<string | null>(null); // Initialize userEthBalance
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize provider and contracts
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const ethereum = await detectEthereumProvider();
        if (!ethereum) {
          setError('MetaMask not detected. Please install MetaMask.');
          return;
        }

        const provider = new BrowserProvider(ethereum);
        setProvider(provider);

        // Initialize contracts
        const tokenContract = new Contract(CONTRACT_ADDRESSES.NEXAPAY_TOKEN, NEXAPAY_TOKEN_ABI, provider);
        const idoContract = new Contract(CONTRACT_ADDRESSES.NPT_IDO, NPT_IDO_ABI, provider);
        // const pusdContract = new Contract(CONTRACT_ADDRESSES.PUSD_TOKEN, PUSD_TOKEN_ABI, provider); // Initialize pusdContract
        
        setTokenContract(tokenContract);
        setIdoContract(idoContract);
        // setPusdContract(pusdContract); // Set pusdContract

        // Check if already connected
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const connectedAccount = accounts[0];
          setAccount(connectedAccount);
          setIsConnected(true);
          await refreshData(provider, connectedAccount, tokenContract, idoContract /*, pusdContract*/);
        }
      } catch (err) {
        console.error('Error initializing Web3:', err);
        setError('Failed to initialize Web3 connection');
      }
    };

    initWeb3();
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const ethereum = await detectEthereumProvider();
      if (!ethereum) {
        throw new Error('MetaMask not detected');
      }

      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const connectedAccount = accounts[0];
      setAccount(connectedAccount);
      setIsConnected(true);
      await refreshData(provider, connectedAccount, tokenContract, idoContract /*, pusdContract*/);
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setTokenData(null);
    // setPusdData(null); // Clear pusdData
    setIdoData(null);
    setUserEthBalance(null); // Clear userEthBalance
    setError(null);
    toast({
      title: "Wallet Disconnected",
      description: "To completely disconnect, please go to your MetaMask extension -> Connected sites and remove this DApp.",
      duration: 5000, // Display for 5 seconds
    });
  };

  const refreshData = async (
    currentProvider?: BrowserProvider | null,
    currentAccount?: string | null,
    currentTokenContract?: Contract | null,
    currentIdoContract?: Contract | null,
    // currentPusdContract?: Contract | null // Pass pusdContract
  ) => {
    // Use provided arguments or fall back to state
    const activeProvider = currentProvider || provider;
    const activeAccount = currentAccount || account;
    const activeTokenContract = currentTokenContract || tokenContract;
    const activeIdoContract = currentIdoContract || idoContract;

    if (!activeProvider || !activeAccount || !activeTokenContract || !activeIdoContract) return;

    try {
      // --- Get Token Data ---
      const [name, symbol, decimals, totalSupply, userBalance] = await Promise.all([
        activeTokenContract.name(),
        activeTokenContract.symbol(),
        activeTokenContract.decimals(),
        activeTokenContract.totalSupply(),
        activeTokenContract.balanceOf(activeAccount)
      ]);

      setTokenData({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, Number(decimals)),
        userBalance: ethers.formatUnits(userBalance, Number(decimals))
      });

      // --- Get IDO Data ---
      const [
        tokensForSale,
        tokensSold,
        tokensPerEth,
        userTokensPurchased,
        tokensRemaining,
      ] = await Promise.all([
        activeIdoContract.tokensForSale(),
        activeIdoContract.tokensSold(),
        activeIdoContract.tokensPerETH(),
        activeIdoContract.tokensPurchased(activeAccount),
        activeIdoContract.tokensRemaining(),
      ]);

      setIdoData({
        tokensForSale: ethers.formatUnits(tokensForSale, Number(decimals)),
        tokensSold: ethers.formatUnits(tokensSold, Number(decimals)),
        tokensPerEth: ethers.formatUnits(tokensPerEth, Number(decimals)),
        userTokensPurchased: ethers.formatUnits(userTokensPurchased, Number(decimals)),
        tokensRemaining: ethers.formatUnits(tokensRemaining, Number(decimals)),
      });

      // Get user's native ETH balance
      if (activeProvider && activeAccount) {
        const balance = await activeProvider.getBalance(activeAccount);
        setUserEthBalance(ethers.formatEther(balance));
      } else {
        setUserEthBalance(null);
      }

    } catch (err: any) {
      console.error('Error inside refreshData:', err);
      setError(err.message || 'Failed to refresh contract data in refreshData');
    }
  };

  const buyTokens = async (ethAmount: string): Promise<string> => {
    if (!provider || !account || !idoContract) {
      throw new Error('Web3 not initialized');
    }

    try {
      const signer = await provider.getSigner();
      const idoContractWithSigner = idoContract.connect(signer);
      
      // Buy tokens by sending ETH as value
      const tx = await idoContractWithSigner.buy({
        value: ethers.parseEther(ethAmount) // The buy function expects ETH amount
      });

      await tx.wait();
      await refreshData();
      
      return tx.hash;
    } catch (err: any) {
      console.error('Error buying tokens:', err);
      throw new Error(err.message || 'Failed to buy tokens');
    }
  };

  const clearError = () => setError(null);

  const value: Web3ContextType = {
    isConnected,
    isConnecting,
    account,
    provider,
    tokenContract,
    idoContract,
    // pusdContract, // Add pusdContract to context value
    tokenData,
    // pusdData, // Add pusdData to context value
    idoData,
    userEthBalance, // Add userEthBalance to context value
    connectWallet,
    disconnectWallet,
    buyTokens,
    // approvePUSD, // Add approvePUSD to context value
    refreshData,
    error,
    clearError
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
