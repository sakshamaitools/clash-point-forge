
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCrypto } from '@/hooks/useCrypto';
import { Wallet, Coins, TrendingUp, TrendingDown } from 'lucide-react';

const CryptoWallet = () => {
  const { wallets, currency, loading, connectWallet } = useCrypto();

  if (loading) {
    return <div className="text-center py-4">Loading wallet...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>Platform Currency</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currency ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{currency.balance}</div>
                <div className="text-sm text-gray-600">Current Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {currency.total_earned}
                </div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  {currency.total_spent}
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No currency account found</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Connected Wallets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium capitalize">{wallet.wallet_type}</div>
                  <div className="text-sm text-gray-600">{wallet.wallet_address.slice(0, 10)}...{wallet.wallet_address.slice(-8)}</div>
                </div>
                <Badge variant={wallet.is_verified ? "default" : "secondary"}>
                  {wallet.is_verified ? "Verified" : "Pending"}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No wallets connected</div>
          )}
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => connectWallet('metamask')}
              className="flex-1"
            >
              Connect MetaMask
            </Button>
            <Button 
              onClick={() => connectWallet('walletconnect')}
              variant="outline"
              className="flex-1"
            >
              WalletConnect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoWallet;
