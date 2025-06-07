
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CryptoWallet from './CryptoWallet';
import NFTCollection from './NFTCollection';
import BettingInterface from './BettingInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Gamepad2, Trophy, TrendingUp } from 'lucide-react';

interface Tournament {
  id: string;
  title: string;
  status: string;
}

const AdvancedEconomics = () => {
  // Mock tournaments data - in real app this would come from props or API
  const [tournaments] = useState<Tournament[]>([
    { id: '1', title: 'Weekly Battle Royale', status: 'open' },
    { id: '2', title: 'Pro Championship', status: 'upcoming' }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Economics</h1>
        <p className="text-gray-600">Manage your crypto assets, NFTs, and betting portfolio</p>
      </div>

      <Tabs defaultValue="wallet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wallet" className="flex items-center space-x-2">
            <Coins className="h-4 w-4" />
            <span>Wallet</span>
          </TabsTrigger>
          <TabsTrigger value="nfts" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>NFTs</span>
          </TabsTrigger>
          <TabsTrigger value="betting" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Betting</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Gamepad2 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <CryptoWallet />
        </TabsContent>

        <TabsContent value="nfts">
          <NFTCollection />
        </TabsContent>

        <TabsContent value="betting">
          <BettingInterface tournaments={tournaments} />
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">$1,247.50</div>
                <div className="text-sm text-gray-600">+12.5% this month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Bets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">$450 total wagered</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NFTs Owned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">23</div>
                <div className="text-sm text-gray-600">5 legendary items</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedEconomics;
