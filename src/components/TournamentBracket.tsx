
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Match {
  id: string;
  tournament_id: string;
  round_number: number;
  match_number: number;
  player1_id: string | null;
  player2_id: string | null;
  winner_id: string | null;
  status: string;
  scheduled_time: string | null;
}

interface TournamentBracketProps {
  tournamentId: string;
  format: string;
}

const TournamentBracket = ({ tournamentId, format }: TournamentBracketProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [tournamentId]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round_number')
        .order('match_number');

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      case 'disputed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const groupMatchesByRound = () => {
    const rounds: { [key: number]: Match[] } = {};
    matches.forEach(match => {
      if (!rounds[match.round_number]) {
        rounds[match.round_number] = [];
      }
      rounds[match.round_number].push(match);
    });
    return rounds;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tournament Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading bracket...</div>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tournament Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            Bracket will be generated when the tournament starts
          </div>
        </CardContent>
      </Card>
    );
  }

  const rounds = groupMatchesByRound();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Bracket</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(rounds).map(([roundNumber, roundMatches]) => (
            <div key={roundNumber}>
              <h3 className="font-semibold mb-4">
                Round {roundNumber}
                {format === 'single_elimination' && parseInt(roundNumber) === Math.max(...Object.keys(rounds).map(Number)) && ' (Final)'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roundMatches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Match {match.match_number}</span>
                      <Badge className={`${getMatchStatusColor(match.status)} text-white text-xs`}>
                        {match.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className={`p-2 rounded ${match.winner_id === match.player1_id ? 'bg-green-100' : 'bg-gray-50'}`}>
                        <span className="text-sm">Player 1</span>
                        {match.winner_id === match.player1_id && <span className="float-right text-green-600">👑</span>}
                      </div>
                      <div className="text-center text-xs text-gray-500">vs</div>
                      <div className={`p-2 rounded ${match.winner_id === match.player2_id ? 'bg-green-100' : 'bg-gray-50'}`}>
                        <span className="text-sm">Player 2</span>
                        {match.winner_id === match.player2_id && <span className="float-right text-green-600">👑</span>}
                      </div>
                    </div>
                    {match.scheduled_time && (
                      <div className="mt-2 text-xs text-gray-600">
                        {new Date(match.scheduled_time).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentBracket;
