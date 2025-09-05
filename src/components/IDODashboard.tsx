import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, ArrowRight, CheckCircle, AlertCircle, Clock, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenSaleData {
  totalSupply: number;
  soldTokens: number;
  pricePerToken: number;
  userETHBalance: number;
  userNPTBalance: number;
  isConnected: boolean;
  walletAddress: string;
}

interface Transaction {
  hash: string;
  status: 'pending' | 'success' | 'error';
  ethAmount: number;
  nptAmount: number;
  timestamp: Date;
}

const IDODashboard = () => {
  const { toast } = useToast();
  const [tokenSale, setTokenSale] = useState<TokenSaleData>({
    totalSupply: 1000000,
    soldTokens: 675000,
    pricePerToken: 0.0001,
    userETHBalance: 2.5,
    userNPTBalance: 5000,
    isConnected: false,
    walletAddress: "",
  });

  const [ethAmount, setEthAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const remainingTokens = tokenSale.totalSupply - tokenSale.soldTokens;
  const saleProgress = (tokenSale.soldTokens / tokenSale.totalSupply) * 100;
  const nptAmount = ethAmount ? parseFloat(ethAmount) / tokenSale.pricePerToken : 0;

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Simulate wallet connection
      setTimeout(() => {
        setTokenSale(prev => ({
          ...prev,
          isConnected: true,
          walletAddress: "0x742d...af85"
        }));
        setIsLoading(false);
        toast({
          title: "Wallet Connected",
          description: "MetaMask connected successfully",
        });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Connection Failed",
        description: "Please try connecting your wallet again",
        variant: "destructive",
      });
    }
  };

  const buyTokens = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid ETH amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(ethAmount) > tokenSale.userETHBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough ETH",
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

    // Simulate transaction processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      
      setTransactions(prev => 
        prev.map(tx => 
          tx.hash === newTransaction.hash 
            ? { ...tx, status: success ? 'success' : 'error' }
            : tx
        )
      );

      if (success) {
        setTokenSale(prev => ({
          ...prev,
          soldTokens: prev.soldTokens + nptAmount,
          userETHBalance: prev.userETHBalance - parseFloat(ethAmount),
          userNPTBalance: prev.userNPTBalance + nptAmount,
        }));
        setEthAmount("");
        toast({
          title: "Purchase Successful!",
          description: `Successfully bought ${nptAmount.toLocaleString()} NPT tokens`,
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: "Your transaction was reverted. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-primary px-4 py-2 rounded-lg">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-white font-bold text-xl">NexaPay</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            NexaPay Token Sale
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the future of decentralized payments. Purchase NPT tokens during our exclusive IDO.
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Token Sale Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Token Sale Progress</span>
                  <Badge variant="secondary" className="bg-neon-green/20 text-neon-green border-neon-green/30">
                    LIVE
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Track the real-time progress of our NPT token sale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{saleProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={saleProgress} className="h-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Total Supply</p>
                    <p className="text-2xl font-bold">{tokenSale.totalSupply.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">NPT</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold text-electric-blue">{remainingTokens.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">NPT</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Price per Token</p>
                    <p className="text-2xl font-bold text-crypto-gold">{tokenSale.pricePerToken}</p>
                    <p className="text-xs text-muted-foreground">ETH</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Interface */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Purchase NPT Tokens</CardTitle>
                <CardDescription>
                  Enter the amount of ETH you want to spend
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!tokenSale.isConnected ? (
                  <div className="text-center py-8">
                    <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-muted-foreground mb-6">
                      Connect your MetaMask wallet to start purchasing NPT tokens
                    </p>
                    <Button 
                      onClick={connectWallet} 
                      disabled={isLoading}
                      variant="default"
                      className="bg-gradient-primary hover:opacity-90 shadow-glow"
                    >
                      {isLoading ? "Connecting..." : "Connect MetaMask"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">ETH Amount</label>
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={ethAmount}
                          onChange={(e) => setEthAmount(e.target.value)}
                          className="bg-secondary/50 border-border"
                          step="0.0001"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">NPT Tokens</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={nptAmount.toFixed(0)}
                          readOnly
                          className="bg-secondary/30 border-border text-muted-foreground"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={buyTokens}
                      disabled={isLoading || !ethAmount}
                      className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                    >
                      {isLoading ? "Processing..." : "Buy NPT Tokens"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Info */}
            {tokenSale.isConnected && (
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Your Wallet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-mono text-sm">{tokenSale.walletAddress}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-secondary/30 p-3 rounded-lg">
                      <p className="text-lg font-bold">{tokenSale.userETHBalance.toFixed(4)}</p>
                      <p className="text-xs text-muted-foreground">ETH</p>
                    </div>
                    <div className="text-center bg-secondary/30 p-3 rounded-lg">
                      <p className="text-lg font-bold text-electric-blue">{tokenSale.userNPTBalance.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">NPT</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div key={tx.hash} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {tx.status === 'pending' && <Clock className="w-4 h-4 text-warning animate-spin" />}
                          {tx.status === 'success' && <CheckCircle className="w-4 h-4 text-neon-green" />}
                          {tx.status === 'error' && <AlertCircle className="w-4 h-4 text-destructive" />}
                          <div>
                            <p className="text-xs font-mono">{tx.hash}</p>
                            <p className="text-xs text-muted-foreground">
                              {tx.ethAmount} ETH → {tx.nptAmount.toFixed(0)} NPT
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(tx.hash)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDODashboard;