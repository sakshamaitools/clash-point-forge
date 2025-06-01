
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  display_name: string;
  final_placement: number | null;
  wins: number;
  losses: number;
}

interface TournamentLeaderboardProps {
  tournamentId: string;
  tournamentFormat: string;
  status: string;
}

const TournamentLeaderboard = ({ 
  tournamentId, 
  tournamentFormat, 
  status 
}: TournamentLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'completed' || status === 'in_progress') {
      fetchLeaderboard();
    }
  }, [tournamentId, status]);

  const fetchLeaderboard = async () => {
    try {
      // Get all participants
      const { data: participants, error: participantsError } = await supabase
        .from('tournament_participants')
        .select(`
          user_id,
          final_placement,
          profiles(username, display_name)
        `)
        .eq('tournament_id', tournamentId);

      if (participantsError) throw participantsError;

      // Get match results for each participant
      const leaderboardData = await Promise.all(
        participants.map(async (participant) => {
          const { data: matches } = await supabase
            .from('matches')
            .select('*')
            .eq('tournament_id', tournamentId)
            .or(`player1_id.eq.${participant.user_id},player2_id.eq.${participant.user_id}`)
            .eq('status', 'completed');

          const wins = matches?.filter(match => match.winner_id === participant.user_id).length || 0;
          const losses = (matches?.length || 0) - wins;

          return {
            user_id: participant.user_id,
            username: participant.profiles.username,
            display_name: participant.profiles.display_name,
            final_placement: participant.final_placement,
            wins,
            losses
          };
        })
      );

      // Sort based on tournament format
      if (tournamentFormat === 'single_elimination' || tournamentFormat === 'double_elimination') {
        // Sort by final placement (lower is better), then by wins
        leaderboardData.sort((a, b) => {
          if (a.final_placement && b.final_placement) {
            return a.final_placement - b.final_placement;
          }
          if (a.final_placement && !b.final_placement) return -1;
          if (!a.final_placement && b.final_placement) return 1;
          return b.wins - a.wins;
        });
      } else if (tournamentFormat === 'round_robin') {
        // Sort by wins, then by win percentage
        leaderboardData.sort((a, b) => {
          if (a.wins !== b.wins) return b.wins - a.wins;
          const aWinRate = a.wins / (a.wins + a.losses) || 0;
          const bWinRate = b.wins / (b.wins + b.losses) || 0;
          return bWinRate - aWinRate;
        });
      }

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="font-bold">{index + 1}</span>;
    }
  };

  const getPositionBadge = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-500';
      case 1: return 'bg-gray-400';
      case 2: return 'bg-amber-600';
      default: return 'bg-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tournament Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading results...</div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div key={entry.user_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <Badge className={`${getPositionBadge(index)} text-white flex items-center space-x-1`}>
                  {getPositionIcon(index)}
                </Badge>
                <div>
                  <p className="font-medium">
                    {entry.display_name || entry.username}
                  </p>
                  <p className="text-sm text-gray-600">@{entry.username}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {entry.wins}W - {entry.losses}L
                </div>
                {entry.wins + entry.losses > 0 && (
                  <div className="text-sm text-gray-600">
                    {Math.round((entry.wins / (entry.wins + entry.losses)) * 100)}% win rate
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentLeaderboard;
