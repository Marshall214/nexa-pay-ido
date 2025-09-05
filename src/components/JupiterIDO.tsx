import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  ArrowDown, 
  ChevronDown, 
  Settings, 
  ExternalLink, 
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  TrendingUp,
  Users,
  Target,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { formatAddress } from "@/config/contracts";
import nexaPayLogo from "@/assets/nexapay-logo.png";
import ethLogo from "@/assets/eth-logo.png";

interface Transaction {
  hash: string;
  status: 'pending' | 'success' | 'error';
  ethAmount: number;
  nptAmount: number;
  timestamp: Date;
}

const JupiterIDO = () => {
  const { toast } = useToast();
  const { 
    isConnected, 
    isConnecting, 
    account, 
    tokenData, 
    idoData, 
    connectWallet, 
    buyTokens, 
    error, 
    clearError 
  } = useWeb3();

  const [ethAmount, setEthAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Constants for display
  const targetNaira = 700000000; // ₦700M target
  const ethToNairaRate = 2500000; // 1 ETH = ₦2.5M

  // Calculate values from real data
  const totalSupply = tokenData ? parseFloat(tokenData.totalSupply) : 0;
  const soldTokens = idoData ? parseFloat(idoData.tokensSold) : 0;
  const pricePerToken = idoData ? parseFloat(idoData.tokensPerEth) : 0;
  const userNPTBalance = tokenData ? parseFloat(tokenData.userBalance) : 0;
  const raisedNaira = soldTokens * pricePerToken * ethToNairaRate;

  const remainingTokens = totalSupply - soldTokens;
  const saleProgress = totalSupply > 0 ? (soldTokens / totalSupply) * 100 : 0;
  const fundraisingProgress = (raisedNaira / targetNaira) * 100;
  const nptAmount = ethAmount && pricePerToken > 0 ? parseFloat(ethAmount) / pricePerToken : 0;
  const ethAmountInNaira = ethAmount ? parseFloat(ethAmount) * ethToNairaRate : 0;

  // Handle Web3 errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Web3 Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleBuyTokens = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid ETH amount",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    const newTransaction: Transaction = {
      hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
      status: 'pending',
      ethAmount: parseFloat(ethAmount),
      nptAmount: nptAmount,
      timestamp: new Date(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setIsLoading(true);

    try {
      const txHash = await buyTokens(ethAmount);
      
      setTransactions(prev => 
        prev.map(tx => 
          tx.hash === newTransaction.hash 
            ? { ...tx, hash: txHash, status: 'success' }
            : tx
        )
      );

      setEthAmount("");
      toast({
        title: "Purchase Successful!",
        description: `Successfully bought ${nptAmount.toLocaleString()} NPT tokens`,
      });
    } catch (error: any) {
      setTransactions(prev => 
        prev.map(tx => 
          tx.hash === newTransaction.hash 
            ? { ...tx, status: 'error' }
            : tx
        )
      );

      toast({
        title: "Transaction Failed",
        description: error.message || "Your transaction was reverted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-cyber-bg cyber-grid cyber-scanlines relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-neon-cyan rounded-full animate-neon-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-neon-blue rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-neon-purple rounded-full animate-cyber-glow"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-neon-pink rounded-full animate-neon-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-neon-green rounded-full animate-glow"></div>
      </div>

      {/* Header */}
      <header className="border-b border-neon-blue/20 bg-card/90 backdrop-blur-md sticky top-0 z-50 shadow-cyber">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src={nexaPayLogo} alt="NexaPay" className="w-10 h-10 animate-float" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse-slow shadow-neon"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold gradient-text">NexaPay</span>
                <span className="text-xs text-muted-foreground">Decentralized Payments</span>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 px-3 py-1 text-xs font-bold animate-neon-pulse shadow-neon">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="hover-neon border-neon-blue/30 text-neon-blue">
                <Settings className="w-4 h-4" />
              </Button>
              {isConnected ? (
                <Button variant="outline" className="font-mono text-sm hover-neon bg-neon-blue/10 border-neon-blue/30 text-neon-blue">
                  {formatAddress(account || '')}
                </Button>
              ) : (
                <Button 
                  onClick={connectWallet} 
                  disabled={isConnecting} 
                  className="btn-cyber" 
                  data-testid="header-connect-wallet"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text leading-tight animate-neon-pulse" data-testid="main-title">
              NexaPay Token Sale
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-neon-cyan/20 rounded-full animate-pulse-slow shadow-neon"></div>
            <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-neon-purple/20 rounded-full animate-pulse-slow shadow-neon" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-neon-pink/30 rounded-full animate-cyber-glow"></div>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the future of decentralized payments. Purchase NPT tokens during our exclusive IDO and be part of the next generation of financial technology.
          </p>
          
          {/* Fundraising Target */}
          <div className="mb-8">
            <Card className="card-cyber-glow hover-lift">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-3 bg-neon-blue/20 rounded-xl mr-3 shadow-neon">
                        <Target className="w-6 h-6 text-neon-blue" />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Fundraising Target</span>
                    </div>
                    <p className="text-3xl font-bold text-neon-cyan mb-1 animate-neon-pulse">₦{(targetNaira / 1000000).toFixed(0)}M</p>
                    <p className="text-sm text-muted-foreground">Nigerian Naira</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-3 bg-neon-green/20 rounded-xl mr-3 shadow-neon">
                        <DollarSign className="w-6 h-6 text-neon-green" />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Raised So Far</span>
                    </div>
                    <p className="text-3xl font-bold text-neon-green mb-1 animate-neon-pulse">₦{(raisedNaira / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">{fundraisingProgress.toFixed(1)}% of target</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Fundraising Progress</span>
                    <span className="text-sm font-bold text-neon-cyan">₦{(raisedNaira / 1000000).toFixed(1)}M / ₦{(targetNaira / 1000000).toFixed(0)}M</span>
                  </div>
                  <div className="relative">
                    <Progress value={fundraisingProgress} className="h-3 bg-secondary/50" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan/30 to-neon-green/30 shadow-neon"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sale Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-cyber hover-lift">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-neon-green/20 rounded-xl mr-3 shadow-neon">
                    <TrendingUp className="w-6 h-6 text-neon-green" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Sold</span>
                </div>
                <p className="text-2xl font-bold text-neon-green animate-neon-pulse">{saleProgress.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">of total supply</p>
              </CardContent>
            </Card>
            <Card className="card-cyber hover-lift">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-neon-blue/20 rounded-xl mr-3 shadow-neon">
                    <Zap className="w-6 h-6 text-neon-blue" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Price</span>
                </div>
                <p className="text-2xl font-bold text-neon-cyan animate-neon-pulse">{pricePerToken} ETH</p>
                <p className="text-xs text-muted-foreground mt-1">per token</p>
              </CardContent>
            </Card>
            <Card className="card-cyber hover-lift">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-neon-purple/20 rounded-xl mr-3 shadow-neon">
                    <Users className="w-6 h-6 text-neon-purple" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Remaining</span>
                </div>
                <p className="text-2xl font-bold text-neon-purple animate-neon-pulse">{(remainingTokens / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground mt-1">tokens left</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Sale Progress</span>
              <span className="text-sm font-bold text-neon-cyan">{soldTokens.toLocaleString()} / {totalSupply.toLocaleString()} NPT</span>
            </div>
            <div className="relative">
              <Progress value={saleProgress} className="h-3 bg-secondary/50" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan/30 to-neon-green/30 shadow-neon"></div>
            </div>
          </div>
        </div>

        {/* Cyberpunk Swap Interface */}
        <Card className="card-cyber-glow hover-lift">
          <CardContent className="p-8">
            {!isConnected ? (
              <div className="text-center py-16">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-neon-blue/20 rounded-full flex items-center justify-center animate-float shadow-neon">
                    <Wallet className="w-10 h-10 text-neon-blue" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full animate-pulse-slow shadow-neon"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-neon-purple rounded-full animate-cyber-glow"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 gradient-text animate-neon-pulse">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  Connect your wallet to start purchasing NPT tokens and join the future of decentralized payments
                </p>
                <Button 
                  onClick={connectWallet} 
                  disabled={isConnecting}
                  className="btn-cyber text-lg px-8 py-4 min-w-[240px]"
                  data-testid="connect-wallet-button"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* From Token */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-neon-cyan uppercase tracking-wide">You pay</label>
                  <div className="relative">
                    <div className="flex items-center bg-secondary/20 rounded-2xl p-6 border border-neon-blue/30 hover:border-neon-cyan/50 transition-all duration-300 shadow-neon">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="relative">
                          <img src={ethLogo} alt="ETH" className="w-10 h-10" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-blue rounded-full flex items-center justify-center shadow-neon">
                            <span className="text-xs font-bold text-black">E</span>
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-lg text-neon-blue">ETH</span>
                          <span className="text-sm text-muted-foreground">Ethereum</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={ethAmount}
                          onChange={(e) => setEthAmount(e.target.value)}
                          className="input-cyber border-0 bg-transparent text-right text-2xl font-bold p-0 h-auto focus-visible:ring-0 text-foreground"
                          step="0.0001"
                          min="0"
                          data-testid="eth-input"
                        />
                        <span className="text-sm text-muted-foreground mt-2">
                          Balance: {account ? "Loading..." : "0.0000"} ETH
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Swap Arrow */}
                <div className="flex justify-center">
                  <div className="bg-neon-blue/20 rounded-full p-3 hover:bg-neon-cyan/30 transition-all duration-300 hover:scale-110 shadow-neon">
                    <ArrowDown className="w-5 h-5 text-neon-blue" />
                  </div>
                </div>

                {/* To Token */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-neon-green uppercase tracking-wide">You receive</label>
                  <div className="relative">
                    <div className="flex items-center bg-secondary/20 rounded-2xl p-6 border border-neon-green/30 hover:border-neon-green/50 transition-all duration-300 shadow-neon">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="relative">
                          <img src={nexaPayLogo} alt="NPT" className="w-10 h-10" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full flex items-center justify-center shadow-neon">
                            <span className="text-xs font-bold text-black">N</span>
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-lg text-neon-green">NPT</span>
                          <span className="text-sm text-muted-foreground">NexaPay Token</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-neon-green animate-neon-pulse">
                          {nptAmount ? nptAmount.toLocaleString() : "0"}
                        </span>
                        <span className="text-sm text-muted-foreground mt-2">
                          Balance: {userNPTBalance.toLocaleString()} NPT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8 bg-neon-blue/20" />

                {/* Transaction Info */}
                {ethAmount && parseFloat(ethAmount) > 0 && (
                  <div className="bg-secondary/10 rounded-xl p-6 space-y-4 border border-neon-cyan/20 shadow-neon">
                    <h4 className="text-sm font-bold text-neon-cyan uppercase tracking-wide">Transaction Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Exchange Rate</span>
                        <span className="font-bold text-neon-blue">1 ETH = {pricePerToken > 0 ? (1 / pricePerToken).toLocaleString() : "0"} NPT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Value in Naira</span>
                        <span className="font-bold text-neon-purple">₦{ethAmountInNaira.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Network Fee</span>
                        <span className="font-bold text-neon-orange">~₦12,500</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buy Button */}
                <Button 
                  onClick={handleBuyTokens}
                  disabled={isLoading || !ethAmount || parseFloat(ethAmount) <= 0}
                  className="w-full h-14 text-lg font-bold btn-cyber hover:scale-105 active:scale-95"
                  data-testid="buy-tokens-button"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 animate-spin" />
                      Processing Transaction...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-3" />
                      Buy {nptAmount ? nptAmount.toLocaleString() : "0"} NPT Tokens
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <Card className="mt-8 card-cyber hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-neon-blue/20 rounded-xl mr-3 shadow-neon">
                  <Clock className="w-5 h-5 text-neon-blue" />
                </div>
                <h3 className="text-xl font-bold gradient-text animate-neon-pulse">Recent Transactions</h3>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.hash} className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-neon-blue/20 hover:border-neon-cyan/30 transition-all duration-300 shadow-neon">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {tx.status === 'pending' && <Clock className="w-6 h-6 text-neon-orange animate-spin" />}
                        {tx.status === 'success' && <CheckCircle className="w-6 h-6 text-neon-green" />}
                        {tx.status === 'error' && <AlertCircle className="w-6 h-6 text-neon-red" />}
                        {tx.status === 'success' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse-slow shadow-neon"></div>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{tx.ethAmount} ETH → {tx.nptAmount.toFixed(0)} NPT</p>
                        <p className="text-xs text-muted-foreground font-mono">{tx.hash}</p>
                        <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(tx.hash)}
                      className="hover:bg-neon-blue/10 hover:text-neon-blue hover-neon"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cyberpunk Footer */}
        <footer className="mt-16 pt-8 border-t border-neon-blue/20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src={nexaPayLogo} alt="NexaPay" className="w-6 h-6 animate-float" />
              <span className="text-lg font-bold gradient-text animate-neon-pulse">NexaPay</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Powered by Ethereum • Secured by Smart Contracts • Built for the Future
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <span className="hover:text-neon-cyan transition-colors duration-300">© 2024 NexaPay</span>
              <span className="text-neon-blue">•</span>
              <span className="hover:text-neon-cyan transition-colors duration-300">Privacy Policy</span>
              <span className="text-neon-blue">•</span>
              <span className="hover:text-neon-cyan transition-colors duration-300">Terms of Service</span>
              <span className="text-neon-blue">•</span>
              <span className="hover:text-neon-cyan transition-colors duration-300">Documentation</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default JupiterIDO;