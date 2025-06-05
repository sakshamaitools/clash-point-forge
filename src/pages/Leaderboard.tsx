
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  tournament_wins: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Get tournament winners by counting completed tournaments for each user
      const { data: tournamentData, error } = await supabase
        .from('tournaments')
        .select(`
          id,
          status,
          tournament_participants!inner(
            user_id,
            final_placement,
            profiles(
              id,
              username,
              display_name,
              avatar_url
            )
          )
        `)
        .eq('status', 'completed');

      if (error) throw error;

      // Count wins for each user
      const winCounts = new Map<string, { user: any; wins: number }>();

      tournamentData?.forEach(tournament => {
        tournament.tournament_participants.forEach(participant => {
          if (participant.final_placement === 1) { // Winner (1st place)
            const userId = participant.user_id;
            const userProfile = participant.profiles;
            
            if (winCounts.has(userId)) {
              winCounts.get(userId)!.wins += 1;
            } else {
              winCounts.set(userId, {
                user: userProfile,
                wins: 1
              });
            }
          }
        });
      });

      // Convert to array and sort by wins
      const leaderboardData: LeaderboardEntry[] = Array.from(winCounts.entries())
        .map(([userId, data]) => ({
          user_id: userId,
          username: data.user.username,
          display_name: data.user.display_name,
          avatar_url: data.user.avatar_url,
          tournament_wins: data.wins
        }))
        .sort((a, b) => b.tournament_wins - a.tournament_wins);

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1: return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <Award className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPositionBadge = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 1: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 2: return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="cyber-gradient rounded-full h-12 w-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="gaming-card border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-center text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text">
              🏆 Tournament Champions Leaderboard
            </CardTitle>
            <p className="text-center text-gray-400">
              Top players ranked by tournament victories
            </p>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Tournament Winners Yet</h3>
                <p className="text-gray-500">Complete some tournaments to see the leaderboard!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.user_id}
                    onClick={() => handleUserClick(entry.user_id)}
                    className={`
                      flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200
                      hover:scale-105 hover:shadow-lg border
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/30' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/30' :
                        index === 2 ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-amber-500/30' :
                        'bg-black/20 border-gray-600/30'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getPositionBadge(index)} text-white text-lg px-3 py-1 flex items-center space-x-2`}>
                        {getPositionIcon(index)}
                        <span className="font-bold">#{index + 1}</span>
                      </Badge>
                      
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600">
                          {entry.display_name?.charAt(0) || entry.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {entry.display_name || entry.username}
                        </h3>
                        <p className="text-cyan-400 text-sm">@{entry.username}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-black text-white mb-1">
                        {entry.tournament_wins}
                      </div>
                      <div className="text-sm text-gray-400">
                        {entry.tournament_wins === 1 ? 'Tournament Win' : 'Tournament Wins'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
