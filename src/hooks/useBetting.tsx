
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TournamentBet {
  id: string;
  user_id: string;
  tournament_id: string;
  bet_type: string;
  predicted_user_id: string;
  bet_amount: number;
  odds: number;
  potential_payout: number;
  status: string;
  created_at: string;
}

export const useBetting = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bets, setBets] = useState<TournamentBet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBets();
    }
  }, [user]);

  const fetchBets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tournament_bets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBets(data || []);
    } catch (error) {
      console.error('Error fetching bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const placeBet = async (betData: {
    tournament_id: string;
    bet_type: string;
    predicted_user_id?: string;
    bet_amount: number;
  }) => {
    if (!user) return;

    try {
      // Calculate odds (simplified)
      const odds = Math.random() * 3 + 1; // Random odds between 1-4
      const potential_payout = betData.bet_amount * odds;

      const { error } = await supabase
        .from('tournament_bets')
        .insert({
          user_id: user.id,
          tournament_id: betData.tournament_id,
          bet_type: betData.bet_type,
          predicted_user_id: betData.predicted_user_id,
          bet_amount: betData.bet_amount,
          odds: odds,
          potential_payout: potential_payout
        });

      if (error) throw error;

      toast({
        title: "Bet Placed",
        description: `Bet of ${betData.bet_amount} coins placed successfully`,
      });

      fetchBets();
    } catch (error) {
      console.error('Error placing bet:', error);
      toast({
        title: "Bet Failed",
        description: "Failed to place bet",
        variant: "destructive",
      });
    }
  };

  const calculateOdds = (tournamentId: string, userId: string) => {
    // Simplified odds calculation
    return Math.random() * 3 + 1;
  };

  return {
    bets,
    loading,
    placeBet,
    calculateOdds,
    refetch: fetchBets
  };
};
