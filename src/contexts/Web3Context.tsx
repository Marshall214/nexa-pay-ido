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

const NPT_IDO_ABI = [
  // IDO contract functions
  "function token() view returns (address)",
  "function tokensForSale() view returns (uint256)",
  "function tokensSold() view returns (uint256)",
  "function tokensPerEth() view returns (uint256)",
  "function startTimestamp() view returns (uint256)",
  "function endTimestamp() view returns (uint256)",
  "function paused() view returns (bool)",
  "function minContributionWei() view returns (uint256)",
  "function maxContributionWei() view returns (uint256)",
  "function useWhitelist() view returns (bool)",
  "function whitelist(address) view returns (bool)",
  "function contributions(address) view returns (uint256)",
  "function tokensPurchased(address) view returns (uint256)",
  "function tokensRemaining() view returns (uint256)",
  "function buy() payable",
  "function setPaused(bool) external",
  "function setContributionLimits(uint256, uint256) external",
  "function setTokensPerEth(uint256) external",
  "function setSaleWindow(uint256, uint256) external",
  "function setUseWhitelist(bool) external",
  "function updateWhitelist(address, bool) external",
  "function batchUpdateWhitelist(address[], bool) external",
  "function withdrawFunds(address, uint256) external",
  "function recoverUnsoldTokens(address) external",
  "event Bought(address indexed buyer, uint256 weiAmount, uint256 tokensAmount)",
  "event Withdraw(address indexed to, uint256 amountWei)",
  "event UnsoldTokensRecovered(address indexed to, uint256 amount)",
  "event WhitelistUpdated(address indexed account, bool allowed)"
];

import { CONTRACT_ADDRESSES } from '../config/contracts';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  provider: BrowserProvider | null;
  
  // Contract instances
  tokenContract: Contract | null;
  idoContract: Contract | null;
  
  // Contract data
  tokenData: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    userBalance: string;
  } | null;
  
  idoData: {
    tokensForSale: string;
    tokensSold: string;
    tokensPerEth: string;
    startTimestamp: number;
    endTimestamp: number;
    paused: boolean;
    minContribution: string;
    maxContribution: string;
    useWhitelist: boolean;
    userContribution: string;
    userTokensPurchased: string;
    tokensRemaining: string;
    isWhitelisted: boolean;
  } | null;
  
  // Methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  buyTokens: (ethAmount: string) => Promise<string>;
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
  const [tokenData, setTokenData] = useState(null);
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
        
        setTokenContract(tokenContract);
        setIdoContract(idoContract);

        // Check if already connected
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await refreshData();
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

      setAccount(accounts[0]);
      setIsConnected(true);
      await refreshData();
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
    setIdoData(null);
    setError(null);
  };

  const refreshData = async () => {
    if (!provider || !account || !tokenContract || !idoContract) return;

    try {
      // Get token data
      const [name, symbol, decimals, totalSupply, userBalance] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply(),
        tokenContract.balanceOf(account)
      ]);

      setTokenData({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatEther(totalSupply),
        userBalance: ethers.formatEther(userBalance)
      });

      // Get IDO data
      const [
        tokensForSale,
        tokensSold,
        tokensPerEth,
        startTimestamp,
        endTimestamp,
        paused,
        minContribution,
        maxContribution,
        useWhitelist,
        userContribution,
        userTokensPurchased,
        tokensRemaining,
        isWhitelisted
      ] = await Promise.all([
        idoContract.tokensForSale(),
        idoContract.tokensSold(),
        idoContract.tokensPerEth(),
        idoContract.startTimestamp(),
        idoContract.endTimestamp(),
        idoContract.paused(),
        idoContract.minContributionWei(),
        idoContract.maxContributionWei(),
        idoContract.useWhitelist(),
        idoContract.contributions(account),
        idoContract.tokensPurchased(account),
        idoContract.tokensRemaining(),
        useWhitelist ? idoContract.whitelist(account) : true
      ]);

      setIdoData({
        tokensForSale: ethers.formatEther(tokensForSale),
        tokensSold: ethers.formatEther(tokensSold),
        tokensPerEth: ethers.formatEther(tokensPerEth),
        startTimestamp: Number(startTimestamp),
        endTimestamp: Number(endTimestamp),
        paused,
        minContribution: ethers.formatEther(minContribution),
        maxContribution: ethers.formatEther(maxContribution),
        useWhitelist,
        userContribution: ethers.formatEther(userContribution),
        userTokensPurchased: ethers.formatEther(userTokensPurchased),
        tokensRemaining: ethers.formatEther(tokensRemaining),
        isWhitelisted
      });
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh contract data');
    }
  };

  const buyTokens = async (ethAmount: string): Promise<string> => {
    if (!provider || !account || !idoContract) {
      throw new Error('Web3 not initialized');
    }

    try {
      const signer = await provider.getSigner();
      const idoContractWithSigner = idoContract.connect(signer);
      
      const tx = await idoContractWithSigner.buy({
        value: ethers.parseEther(ethAmount)
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
    tokenData,
    idoData,
    connectWallet,
    disconnectWallet,
    buyTokens,
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
