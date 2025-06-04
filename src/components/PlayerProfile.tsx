
import React from 'react';
import { usePlayerStats } from '@/hooks/usePlayerStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Target, Zap, Award, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface PlayerProfileProps {
  userId: string;
  profile?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    fortnite_username: string;
    created_at: string;
  };
}

const PlayerProfile = ({ userId, profile }: PlayerProfileProps) => {
  const { stats, activityLogs, loading } = usePlayerStats(userId);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="gaming-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const achievements = stats?.achievements || [];
  const winRate = stats?.win_rate || 0;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="gaming-card border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600 text-2xl">
                {profile?.display_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-white mb-2">{profile?.display_name}</h1>
              <p className="text-cyan-400 font-bold">@{profile?.username}</p>
              {profile?.fortnite_username && (
                <p className="text-gray-400">Epic ID: {profile.fortnite_username}</p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                Member since {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Unknown'}
              </p>
            </div>
            <div className="text-right">
              <Badge className={`${winRate >= 50 ? 'bg-green-600' : winRate >= 30 ? 'bg-yellow-600' : 'bg-red-600'} text-white text-lg px-4 py-2`}>
                {winRate.toFixed(1)}% Win Rate
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gaming-card border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-yellow-400 mb-1">{stats?.total_wins || 0}</div>
            <div className="text-gray-400">Total Wins</div>
          </CardContent>
        </Card>

        <Card className="gaming-card border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-400 mb-1">{stats?.total_matches || 0}</div>
            <div className="text-gray-400">Matches Played</div>
          </CardContent>
        </Card>

        <Card className="gaming-card border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-400 mb-1">{stats?.total_tournaments || 0}</div>
            <div className="text-gray-400">Tournaments</div>
          </CardContent>
        </Card>

        <Card className="gaming-card border-green-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-400 mb-1">{winRate.toFixed(1)}%</div>
            <div className="text-gray-400">Win Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="gaming-card border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements ({achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No achievements yet. Keep playing to earn some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-black/20 p-4 rounded-lg border border-orange-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{achievement.name || 'Achievement'}</h4>
                      <p className="text-gray-400 text-sm">{achievement.description || 'Well earned!'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {activityLogs.length > 0 && (
        <Card className="gaming-card border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white">{log.description}</p>
                    <p className="text-gray-400 text-sm">
                      {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
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

export default PlayerProfile;
