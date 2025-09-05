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
import nexaPayLogo from "@/assets/nexapay-logo.png";
import ethLogo from "@/assets/eth-logo.png";

interface TokenSaleData {
  totalSupply: number;
  soldTokens: number;
  pricePerToken: number;
  userETHBalance: number;
  userNPTBalance: number;
  isConnected: boolean;
  walletAddress: string;
  targetNaira: number;
  raisedNaira: number;
  ethToNairaRate: number;
}

interface Transaction {
  hash: string;
  status: 'pending' | 'success' | 'error';
  ethAmount: number;
  nptAmount: number;
  timestamp: Date;
}

const JupiterIDO = () => {
  const { toast } = useToast();
  const [tokenSale, setTokenSale] = useState<TokenSaleData>({
    totalSupply: 1000000,
    soldTokens: 675000,
    pricePerToken: 0.0001,
    userETHBalance: 2.5,
    userNPTBalance: 5000,
    isConnected: false,
    walletAddress: "",
    targetNaira: 500000000, // ₦500M target
    raisedNaira: 337500000, // ₦337.5M raised so far
    ethToNairaRate: 2500000, // 1 ETH = ₦2.5M
  });

  const [ethAmount, setEthAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const remainingTokens = tokenSale.totalSupply - tokenSale.soldTokens;
  const saleProgress = (tokenSale.soldTokens / tokenSale.totalSupply) * 100;
  const fundraisingProgress = (tokenSale.raisedNaira / tokenSale.targetNaira) * 100;
  const nptAmount = ethAmount ? parseFloat(ethAmount) / tokenSale.pricePerToken : 0;
  const ethAmountInNaira = ethAmount ? parseFloat(ethAmount) * tokenSale.ethToNairaRate : 0;

  const connectWallet = async () => {
    setIsLoading(true);
    try {
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

    setTimeout(() => {
      const success = Math.random() > 0.1;
      
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
          raisedNaira: prev.raisedNaira + ethAmountInNaira,
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
    <div className="min-h-screen bg-gradient-jupiter-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={nexaPayLogo} alt="NexaPay" className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground">NexaPay</span>
              <Badge variant="secondary" className="bg-jupiter-green/20 text-jupiter-green border-jupiter-green/30">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              {tokenSale.isConnected ? (
                <Button variant="outline" className="font-mono text-sm">
                  {tokenSale.walletAddress}
                </Button>
              ) : (
                <Button onClick={connectWallet} disabled={isLoading} variant="default">
                  <Wallet className="w-4 h-4 mr-2" />
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-jupiter-main bg-clip-text text-transparent">
            NexaPay Token Sale
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Join the future of decentralized payments. Purchase NPT tokens during our exclusive IDO.
          </p>
          
          {/* Fundraising Target */}
          <div className="mb-6">
            <Card className="bg-gradient-card shadow-card border-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="w-5 h-5 text-jupiter-cyan mr-2" />
                      <span className="text-sm font-medium text-muted-foreground">Fundraising Target</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">₦{(tokenSale.targetNaira / 1000000).toFixed(0)}M</p>
                    <p className="text-xs text-muted-foreground">Nigerian Naira</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="w-5 h-5 text-jupiter-green mr-2" />
                      <span className="text-sm font-medium text-muted-foreground">Raised So Far</span>
                    </div>
                    <p className="text-2xl font-bold text-jupiter-green">₦{(tokenSale.raisedNaira / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-muted-foreground">{fundraisingProgress.toFixed(1)}% of target</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Fundraising Progress</span>
                    <span className="text-sm font-medium">₦{(tokenSale.raisedNaira / 1000000).toFixed(1)}M / ₦{(tokenSale.targetNaira / 1000000).toFixed(0)}M</span>
                  </div>
                  <Progress value={fundraisingProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sale Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-card shadow-card border-border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-jupiter-green mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Sold</span>
                </div>
                <p className="text-xl font-bold">{saleProgress.toFixed(1)}%</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card border-border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-jupiter-cyan mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Price</span>
                </div>
                <p className="text-xl font-bold">{tokenSale.pricePerToken} ETH</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card border-border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-jupiter-purple mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Remaining</span>
                </div>
                <p className="text-xl font-bold">{(remainingTokens / 1000).toFixed(0)}K</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Sale Progress</span>
              <span className="text-sm font-medium">{tokenSale.soldTokens.toLocaleString()} / {tokenSale.totalSupply.toLocaleString()} NPT</span>
            </div>
            <Progress value={saleProgress} className="h-2" />
          </div>
        </div>

        {/* Jupiter-style Swap Interface */}
        <Card className="bg-gradient-card shadow-card border-border overflow-hidden">
          <CardContent className="p-6">
            {!tokenSale.isConnected ? (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-6">
                  Connect your wallet to start purchasing NPT tokens
                </p>
                <Button 
                  onClick={connectWallet} 
                  disabled={isLoading}
                  variant="default"
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* From Token */}
                  <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">You pay</label>
                  <div className="relative">
                    <div className="flex items-center bg-secondary/30 rounded-2xl p-4 border border-border">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <img src={ethLogo} alt="ETH" className="w-8 h-8" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold">ETH</span>
                          <span className="text-xs text-muted-foreground">Ethereum</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={ethAmount}
                          onChange={(e) => setEthAmount(e.target.value)}
                          className="border-0 bg-transparent text-right text-xl font-semibold p-0 h-auto focus-visible:ring-0"
                          step="0.0001"
                          min="0"
                        />
                        <span className="text-xs text-muted-foreground mt-1">
                          Balance: {tokenSale.userETHBalance.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Swap Arrow */}
                <div className="flex justify-center">
                  <div className="bg-secondary/50 rounded-full p-2">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>

                {/* To Token */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">You receive</label>
                  <div className="relative">
                    <div className="flex items-center bg-secondary/30 rounded-2xl p-4 border border-border">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <img src={nexaPayLogo} alt="NPT" className="w-8 h-8" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold">NPT</span>
                          <span className="text-xs text-muted-foreground">NexaPay Token</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-semibold">
                          {nptAmount ? nptAmount.toLocaleString() : "0"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Balance: {tokenSale.userNPTBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Transaction Info */}
                {ethAmount && parseFloat(ethAmount) > 0 && (
                  <div className="bg-secondary/20 rounded-lg p-4 space-y-2 border border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="font-medium">1 ETH = {(1 / tokenSale.pricePerToken).toLocaleString()} NPT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Value in Naira</span>
                      <span className="font-medium text-jupiter-cyan">₦{ethAmountInNaira.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network fee</span>
                      <span className="font-medium">~₦12,500</span>
                    </div>
                  </div>
                )}

                {/* Buy Button */}
                <Button 
                  onClick={buyTokens}
                  disabled={isLoading || !ethAmount || parseFloat(ethAmount) <= 0}
                  className="w-full h-12 text-base font-semibold"
                  variant="jupiter"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Buy ${nptAmount ? nptAmount.toLocaleString() : ""} NPT`
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <Card className="mt-6 bg-gradient-card shadow-card border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.hash} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {tx.status === 'pending' && <Clock className="w-4 h-4 text-warning animate-spin" />}
                      {tx.status === 'success' && <CheckCircle className="w-4 h-4 text-jupiter-green" />}
                      {tx.status === 'error' && <AlertCircle className="w-4 h-4 text-destructive" />}
                      <div>
                        <p className="text-sm font-medium">{tx.ethAmount} ETH → {tx.nptAmount.toFixed(0)} NPT</p>
                        <p className="text-xs text-muted-foreground font-mono">{tx.hash}</p>
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
  );
};

export default JupiterIDO;