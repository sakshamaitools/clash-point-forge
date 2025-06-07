
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface NFTReward {
  id: string;
  tournament_id: string;
  winner_id: string;
  nft_name: string;
  nft_description: string;
  metadata_url: string;
  token_id: string;
  contract_address: string;
  rarity: string;
  created_at: string;
}

export const useNFTRewards = () => {
  const { user } = useAuth();
  const [nfts, setNfts] = useState<NFTReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNFTs();
    }
  }, [user]);

  const fetchNFTs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('nft_rewards')
        .select('*')
        .eq('winner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNfts(data || []);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async (tournamentId: string, winnerId: string, nftData: {
    name: string;
    description: string;
    rarity: string;
  }) => {
    try {
      const { error } = await supabase
        .from('nft_rewards')
        .insert({
          tournament_id: tournamentId,
          winner_id: winnerId,
          nft_name: nftData.name,
          nft_description: nftData.description,
          rarity: nftData.rarity,
          metadata_url: `https://api.example.com/nft/${Date.now()}`,
          token_id: `token_${Date.now()}`,
          contract_address: '0x1234567890abcdef'
        });

      if (error) throw error;
      fetchNFTs();
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  return {
    nfts,
    loading,
    mintNFT,
    refetch: fetchNFTs
  };
};
