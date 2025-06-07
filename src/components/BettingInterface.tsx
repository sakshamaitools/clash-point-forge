
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBetting } from '@/hooks/useBetting';
import { useCrypto } from '@/hooks/useCrypto';
import { DollarSign, TrendingUp, Trophy, Clock } from 'lucide-react';

const BettingInterface = ({ tournaments }: { tournaments: any[] }) => {
  const { bets, placeBet, calculateOdds } = useBetting();
  const { currency } = useCrypto();
  const [selectedTournament, setSelectedTournament] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [betType, setBetType] = useState('winner');

  const handlePlaceBet = async () => {
    if (!selectedTournament || !betAmount) return;

    await placeBet({
      tournament_id: selectedTournament,
      bet_type: betType,
      bet_amount: parseFloat(betAmount)
    });

    setBetAmount('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Place Bet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tournament</label>
              <select
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Tournament</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Bet Type</label>
              <select
                value={betType}
                onChange={(e) => setBetType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="winner">Tournament Winner</option>
                <option value="top3">Top 3 Finish</option>
                <option value="outcome">Match Outcome</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Bet amount"
                max={currency?.balance || 0}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Available Balance: <span className="font-semibold">{currency?.balance || 0} coins</span>
            </div>
            <Button onClick={handlePlaceBet} disabled={!selectedTournament || !betAmount}>
              Place Bet
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Your Bets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bets.length > 0 ? (
            <div className="space-y-3">
              {bets.map((bet) => (
                <div key={bet.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{bet.bet_type}</div>
                    <div className="text-sm text-gray-600">
                      {bet.bet_amount} coins • Odds: {bet.odds.toFixed(2)}x
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{bet.potential_payout.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">Potential</div>
                  </div>
                  <Badge className={`${getStatusColor(bet.status)} text-white ml-4`}>
                    {bet.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bets Yet</h3>
              <p className="text-gray-600">Place your first bet on upcoming tournaments!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BettingInterface;
