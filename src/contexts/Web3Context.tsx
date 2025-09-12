import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Contract ABIs - we'll add these after you provide the deployed addresses
const NEXAPAY_TOKEN_ABI = [
  // ERC20 standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

const PUSD_TOKEN_ABI = [
  // ERC20 standard functions for PUSD
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint224 value)",
  "event Approval(address indexed owner, address indexed spender, uint224 value)"
];

const NPT_IDO_ABI = [
  // IDO contract functions (simplified to match your current NPT_IDO.sol)
  "function tokensForSale() view returns (uint256)",
  "function tokensSold() view returns (uint256)",
  "function tokensPerPUSD() view returns (uint256)", // Changed from tokensPerEth
  "function tokensPurchased(address) view returns (uint256)",
  "function tokensRemaining() view returns (uint256)",
  "function buy(uint256 pusdAmount) external", // Changed to accept pusdAmount
  "function withdrawFunds(address, uint256) external", // Changed to pusdAmount
  "function recoverUnsoldTokens(address) external",
  "event Bought(address indexed buyer, uint256 pusdAmount, uint256 tokensAmount)", // Changed to pusdAmount
  "event Withdraw(address indexed to, uint256 pusdAmount)", // Changed to pusdAmount
  "event UnsoldTokensRecovered(address indexed to, uint256 amount)"
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
  pusdContract: Contract | null; // PUSD Contract instance

  // Contract data
  tokenData: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    userBalance: string;
  } | null;

  pusdData: {
    name: string;
    symbol: string;
    decimals: number;
    userBalance: string;
    allowance: string; // Allowance for IDO contract
  } | null;

  idoData: {
    tokensForSale: string;
    tokensSold: string;
    tokensPerPUSD: string; // Changed from tokensPerEth
    userTokensPurchased: string;
    tokensRemaining: string;
  } | null;

  // Methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  buyTokens: (pusdAmount: string) => Promise<string>; // Changed to accept pusdAmount
  approvePUSD: (amount: string) => Promise<string>; // New: Approve PUSD for IDO
  refreshData: () => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

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
  const [pusdContract, setPusdContract] = useState<Contract | null>(null); // Initialize pusdContract
  const [tokenData, setTokenData] = useState(null);
  const [pusdData, setPusdData] = useState(null); // Initialize pusdData
  const [idoData, setIdoData] = useState(null);
  const [error, setError] = useState<string | null>(null);

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
        const pusdContract = new Contract(CONTRACT_ADDRESSES.PUSD_TOKEN, PUSD_TOKEN_ABI, provider); // Initialize pusdContract
        
        setTokenContract(tokenContract);
        setIdoContract(idoContract);
        setPusdContract(pusdContract); // Set pusdContract

        // Check if already connected
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const connectedAccount = accounts[0];
          setAccount(connectedAccount);
          setIsConnected(true);
          await refreshData(provider, connectedAccount, tokenContract, idoContract, pusdContract);
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
      await refreshData(provider, connectedAccount, tokenContract, idoContract, pusdContract);
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
    setPusdData(null); // Clear pusdData
    setIdoData(null);
    setError(null);
  };

  const refreshData = async (
    currentProvider?: BrowserProvider | null,
    currentAccount?: string | null,
    currentTokenContract?: Contract | null,
    currentIdoContract?: Contract | null,
    currentPusdContract?: Contract | null // Pass pusdContract
  ) => {
    // Use provided arguments or fall back to state
    const activeProvider = currentProvider || provider;
    const activeAccount = currentAccount || account;
    const activeTokenContract = currentTokenContract || tokenContract;
    const activeIdoContract = currentIdoContract || idoContract;
    const activePusdContract = currentPusdContract || pusdContract; // Use activePusdContract

    if (!activeProvider || !activeAccount || !activeTokenContract || !activeIdoContract || !activePusdContract) return;

    try {
      // Get token data
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
        totalSupply: ethers.formatEther(totalSupply),
        userBalance: ethers.formatEther(userBalance)
      });

      // Get PUSD data
      const [pusdName, pusdSymbol, pusdDecimals, pusdBalance, pusdAllowance] = await Promise.all([
        activePusdContract.name(),
        activePusdContract.symbol(),
        activePusdContract.decimals(),
        activePusdContract.balanceOf(activeAccount),
        activePusdContract.allowance(activeAccount, activeIdoContract?.address || '0x0000000000000000000000000000000000000000') // Assuming IDO contract is the spender
      ]);

      setPusdData({
        name: pusdName,
        symbol: pusdSymbol,
        decimals: Number(pusdDecimals),
        userBalance: ethers.formatEther(pusdBalance),
        allowance: ethers.formatEther(pusdAllowance)
      });

      // Get IDO data (simplified to match your current NPT_IDO.sol)
      const [
        tokensForSale,
        tokensSold,
        tokensPerPUSD,
        userTokensPurchased,
        tokensRemaining,
      ] = await Promise.all([
        activeIdoContract.tokensForSale(),
        activeIdoContract.tokensSold(),
        activeIdoContract.tokensPerPUSD(), // Changed to tokensPerPUSD
        activeIdoContract.tokensPurchased(activeAccount),
        activeIdoContract.tokensRemaining(),
      ]);

      setIdoData({
        tokensForSale: ethers.formatEther(tokensForSale),
        tokensSold: ethers.formatEther(tokensSold),
        tokensPerPUSD: ethers.formatUnits(tokensPerPUSD, 18), // Explicitly format with 18 decimals
        userTokensPurchased: ethers.formatEther(userTokensPurchased),
        tokensRemaining: ethers.formatEther(tokensRemaining),
      });

    } catch (err: any) {
      console.error('Error inside refreshData:', err);
      setError(err.message || 'Failed to refresh contract data in refreshData');
    }
  };

  const buyTokens = async (pusdAmount: string): Promise<string> => {
    if (!provider || !account || !idoContract || !pusdContract) {
      throw new Error('Web3 not initialized');
    }

    try {
      const signer = await provider.getSigner();
      const idoContractWithSigner = idoContract.connect(signer);
      const pusdContractWithSigner = pusdContract.connect(signer);
      
      // Approve PUSD for the IDO contract
      const approveTx = await pusdContractWithSigner.approve(idoContractWithSigner.address, ethers.parseEther(pusdAmount));
      await approveTx.wait();

      // Buy tokens using the approved PUSD amount
      const tx = await idoContractWithSigner.buy({
        value: ethers.parseEther(pusdAmount) // The buy function expects PUSD amount, not ETH
      });

      await tx.wait();
      await refreshData();
      
      return tx.hash;
    } catch (err: any) {
      console.error('Error buying tokens:', err);
      throw new Error(err.message || 'Failed to buy tokens');
    }
  };

  const approvePUSD = async (amount: string): Promise<string> => {
    if (!provider || !account || !pusdContract) {
      throw new Error('Web3 not initialized');
    }

    try {
      const signer = await provider.getSigner();
      const pusdContractWithSigner = pusdContract.connect(signer);

      const tx = await pusdContractWithSigner.approve(idoContract?.address || '0x0000000000000000000000000000000000000000', ethers.parseEther(amount));
      await tx.wait();
      await refreshData();
      return tx.hash;
    } catch (err: any) {
      console.error('Error approving PUSD:', err);
      throw new Error(err.message || 'Failed to approve PUSD');
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
    pusdContract, // Add pusdContract to context value
    tokenData,
    pusdData, // Add pusdData to context value
    idoData,
    connectWallet,
    disconnectWallet,
    buyTokens,
    approvePUSD, // Add approvePUSD to context value
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
