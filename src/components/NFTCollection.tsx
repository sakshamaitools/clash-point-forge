
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNFTRewards } from '@/hooks/useNFTRewards';
import { Trophy, Star, Gem, Crown } from 'lucide-react';

const NFTCollection = () => {
  const { nfts, loading } = useNFTRewards();

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-4 w-4" />;
      case 'epic': return <Gem className="h-4 w-4" />;
      case 'rare': return <Star className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500';
      case 'epic': return 'bg-purple-500';
      case 'rare': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading NFT collection...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>NFT Collection</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <div key={nft.id} className="border rounded-lg p-4 space-y-3">
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  {getRarityIcon(nft.rarity)}
                </div>
                <div>
                  <h3 className="font-semibold">{nft.nft_name}</h3>
                  <p className="text-sm text-gray-600">{nft.nft_description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className={`${getRarityColor(nft.rarity)} text-white capitalize`}>
                    {nft.rarity}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(nft.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs Yet</h3>
            <p className="text-gray-600">Win tournaments to earn unique NFT rewards!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTCollection;
