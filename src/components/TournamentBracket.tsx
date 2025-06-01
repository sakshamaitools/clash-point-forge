
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MatchCard from './MatchCard';

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
  player1?: { username: string; display_name: string };
  player2?: { username: string; display_name: string };
}

interface TournamentBracketProps {
  tournamentId: string;
  format: string;
  canManage?: boolean;
  onMatchUpdate?: () => void;
}

const TournamentBracket = ({ 
  tournamentId, 
  format, 
  canManage = false, 
  onMatchUpdate 
}: TournamentBracketProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [tournamentId]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          player1:profiles!matches_player1_id_fkey(username, display_name),
          player2:profiles!matches_player2_id_fkey(username, display_name)
        `)
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

  const handleMatchUpdate = () => {
    fetchMatches();
    if (onMatchUpdate) {
      onMatchUpdate();
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
                {format === 'round_robin' && ' (Round Robin)'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roundMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    canManage={canManage}
                    onMatchUpdate={handleMatchUpdate}
                  />
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
