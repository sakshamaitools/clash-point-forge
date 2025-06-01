
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BracketGenerator from './BracketGenerator';
import MatchCard from './MatchCard';

interface Tournament {
  id: string;
  title: string;
  status: string;
  tournament_format: string;
  creator_id: string;
}

interface Participant {
  id: string;
  user_id: string;
  profiles: {
    username: string;
    display_name: string;
  };
}

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

interface TournamentManagementProps {
  tournament: Tournament;
  participants: Participant[];
  isCreator: boolean;
  onTournamentUpdate: () => void;
}

const TournamentManagement = ({ 
  tournament, 
  participants, 
  isCreator, 
  onTournamentUpdate 
}: TournamentManagementProps) => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [tournament.id]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          player1:profiles!matches_player1_id_fkey(username, display_name),
          player2:profiles!matches_player2_id_fkey(username, display_name)
        `)
        .eq('tournament_id', tournament.id)
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

  const handleMatchUpdate = async () => {
    await fetchMatches();
    await progressTournament();
    onTournamentUpdate();
  };

  const progressTournament = async () => {
    // Check if we need to advance winners to next round
    const currentRounds = groupMatchesByRound();
    
    for (const [roundNum, roundMatches] of Object.entries(currentRounds)) {
      const round = parseInt(roundNum);
      const allMatchesComplete = roundMatches.every(match => match.status === 'completed');
      
      if (allMatchesComplete && round < Math.max(...Object.keys(currentRounds).map(Number))) {
        // Progress winners to next round
        await advanceWinnersToNextRound(round, roundMatches);
      }
    }

    // Check if tournament is complete
    const finalRound = Math.max(...Object.keys(currentRounds).map(Number));
    const finalMatches = currentRounds[finalRound];
    const tournamentComplete = finalMatches?.every(match => match.status === 'completed');

    if (tournamentComplete) {
      await supabase
        .from('tournaments')
        .update({ status: 'completed' })
        .eq('id', tournament.id);
    }
  };

  const advanceWinnersToNextRound = async (completedRound: number, completedMatches: Match[]) => {
    const nextRound = completedRound + 1;
    const nextRoundMatches = matches.filter(m => m.round_number === nextRound);
    
    const updates = [];
    
    for (let i = 0; i < completedMatches.length; i += 2) {
      const match1 = completedMatches[i];
      const match2 = completedMatches[i + 1];
      const nextMatch = nextRoundMatches[Math.floor(i / 2)];
      
      if (nextMatch) {
        const update: any = { id: nextMatch.id };
        
        if (match1?.winner_id) {
          update.player1_id = match1.winner_id;
        }
        if (match2?.winner_id) {
          update.player2_id = match2.winner_id;
        }
        
        updates.push(update);
      }
    }

    if (updates.length > 0) {
      for (const update of updates) {
        await supabase
          .from('matches')
          .update(update)
          .eq('id', update.id);
      }
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

  const cancelTournament = async () => {
    if (!isCreator) return;
    
    try {
      await supabase
        .from('tournaments')
        .update({ status: 'cancelled' })
        .eq('id', tournament.id);

      toast({
        title: "Tournament Cancelled",
        description: "The tournament has been cancelled",
      });

      onTournamentUpdate();
    } catch (error) {
      console.error('Error cancelling tournament:', error);
      toast({
        title: "Error",
        description: "Failed to cancel tournament",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading tournament management...</div>;
  }

  const rounds = groupMatchesByRound();
  const hasMatches = matches.length > 0;

  return (
    <div className="space-y-6">
      {isCreator && (
        <Card>
          <CardHeader>
            <CardTitle>Tournament Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Badge variant="outline">{tournament.status}</Badge>
                <span className="ml-2 text-sm text-gray-600">
                  {participants.length} participants
                </span>
              </div>
              <div className="space-x-2">
                {tournament.status === 'open' && !hasMatches && (
                  <BracketGenerator
                    tournamentId={tournament.id}
                    participants={participants}
                    tournamentFormat={tournament.tournament_format}
                    onBracketGenerated={fetchMatches}
                  />
                )}
                {tournament.status === 'open' && (
                  <Button 
                    variant="destructive" 
                    onClick={cancelTournament}
                  >
                    Cancel Tournament
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasMatches && (
        <Card>
          <CardHeader>
            <CardTitle>Tournament Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(rounds).map(([roundNumber, roundMatches]) => (
                <div key={roundNumber}>
                  <h3 className="font-semibold mb-4">
                    Round {roundNumber}
                    {tournament.tournament_format === 'single_elimination' && 
                     parseInt(roundNumber) === Math.max(...Object.keys(rounds).map(Number)) && 
                     ' (Final)'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roundMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        canManage={isCreator}
                        onMatchUpdate={handleMatchUpdate}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TournamentManagement;
