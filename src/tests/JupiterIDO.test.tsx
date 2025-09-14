import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JupiterIDO from '../components/JupiterIDO';
import { Web3Context } from '../contexts/Web3Context';
import '@testing-library/jest-dom';

// Mock the Web3Context to control its state for testing
const mockWeb3ContextValue = {
  isConnected: false,
  isConnecting: false,
  account: null,
  provider: null,
  tokenContract: null,
  idoContract: null,
  tokenData: null,
  idoData: null,
  userEthBalance: null,
  connectWallet: vi.fn(),
  disconnectWallet: vi.fn(),
  buyTokens: vi.fn(),
  refreshData: vi.fn(),
  error: null,
  clearError: vi.fn(),
};

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('JupiterIDO', () => {
  it('renders the Connect Wallet button when not connected', () => {
    render(
      <Web3Context.Provider value={mockWeb3ContextValue}>
        <JupiterIDO />
      </Web3Context.Provider>
    );
    expect(screen.getByTestId('header-connect-wallet')).toBeInTheDocument();
  });

  it('calls connectWallet when the Connect Wallet button is clicked', async () => {
    render(
      <Web3Context.Provider value={mockWeb3ContextValue}>
        <JupiterIDO />
      </Web3Context.Provider>
    );
    const connectButton = await screen.findByTestId('connect-wallet-button');
    fireEvent.click(connectButton);
    expect(mockWeb3ContextValue.connectWallet).toHaveBeenCalledTimes(1);
  });

  it('renders the disconnect button when connected', () => {
    const connectedMockWeb3ContextValue = { ...mockWeb3ContextValue, isConnected: true, account: '0x123...abc' };
    render(
      <Web3Context.Provider value={connectedMockWeb3ContextValue}>
        <JupiterIDO />
      </Web3Context.Provider>
    );
    expect(screen.getByTestId('header-disconnect-wallet')).toBeInTheDocument();
  });

  it('calls disconnectWallet when the disconnect button is clicked', () => {
    const connectedMockWeb3ContextValue = { ...mockWeb3ContextValue, isConnected: true, account: '0x123...abc' };
    render(
      <Web3Context.Provider value={connectedMockWeb3ContextValue}>
        <JupiterIDO />
      </Web3Context.Provider>
    );
    const disconnectButton = screen.getByTestId('header-disconnect-wallet');
    fireEvent.click(disconnectButton);
    expect(connectedMockWeb3ContextValue.disconnectWallet).toHaveBeenCalledTimes(1);
  });
});
