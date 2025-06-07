
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useCrypto } from '@/hooks/useCrypto';
import { useNFTRewards } from '@/hooks/useNFTRewards';
import { useAIAnalytics } from '@/hooks/useAIAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Users, DollarSign, Shield, Zap, Target, Star, Crown, BarChart, Coins, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Tournament {
  id: string;
  title: string;
  description: string;
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  status: string;
  start_time: string;
  registration_deadline: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { canManageTournaments, isAdmin, highestRole } = useUserRoles();
  const { currency } = useCrypto();
  const { nfts } = useNFTRewards();
  const { analytics } = useAIAnalytics();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchTournaments();
  }, [user, navigate]);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-gradient-to-r from-green-400 to-cyan-500';
      case 'in_progress': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'completed': return 'bg-gradient-to-r from-blue-400 to-purple-500';
      case 'cancelled': return 'bg-gradient-to-r from-red-400 to-pink-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'player': 'bg-gradient-to-r from-gray-400 to-gray-600',
      'tournament_organizer': 'bg-gradient-to-r from-blue-400 to-cyan-500',
      'moderator': 'bg-gradient-to-r from-yellow-400 to-orange-500',
      'support_staff': 'bg-gradient-to-r from-green-400 to-cyan-500',
      'financial_manager': 'bg-gradient-to-r from-purple-400 to-pink-500',
      'platform_administrator': 'bg-gradient-to-r from-red-400 to-orange-500',
      'super_admin': 'bg-gradient-to-r from-black to-purple-600'
    };
    return colors[role as keyof typeof colors] || 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full float-animation"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full float-animation" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="h-10 w-10 text-yellow-400 animate-pulse" />
              <h1 className="text-4xl font-black text-white text-glow">TOURNAMENT DASHBOARD</h1>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-gray-300 text-lg">🏆 Compete • 🚀 Win • 💰 Earn</p>
              {highestRole && (
                <Badge className={`${getRoleColor(highestRole)} text-white font-bold px-4 py-1 text-sm`}>
                  {highestRole.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            {canManageTournaments() && (
              <Button 
                onClick={() => navigate('/create-tournament')} 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-6 py-3 clip-angle hover-glow transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                CREATE TOURNAMENT
              </Button>
            )}
            {isAdmin() && (
              <Button 
                onClick={() => navigate('/enhanced-admin')} 
                variant="outline" 
                className="border-2 border-purple-500 bg-transparent text-purple-300 hover:bg-purple-500 hover:text-white font-bold px-6 py-3 clip-corner transition-all duration-300"
              >
                <Shield className="h-5 w-5 mr-2" />
                ADMIN PANEL
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="gaming-card bg-black/40 border-0 hover-glow transition-all duration-300 group cursor-pointer" onClick={() => navigate('/economics')}>
            <CardHeader className="relative">
              <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-green-400" />
                Economics Hub
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage crypto wallets, NFTs, and betting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Platform Balance:</span>
                <span className="text-green-400 font-bold">{currency?.balance || 0} coins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">NFTs Owned:</span>
                <span className="text-purple-400 font-bold">{nfts?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card bg-black/40 border-0 hover-glow transition-all duration-300 group cursor-pointer" onClick={() => navigate('/analytics')}>
            <CardHeader className="relative">
              <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center">
                <Brain className="h-6 w-6 mr-2 text-blue-400" />
                AI Analytics
              </CardTitle>
              <CardDescription className="text-gray-300">
                Performance insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">K/D Ratio:</span>
                <span className="text-blue-400 font-bold">{analytics?.skill_metrics?.kill_death_ratio?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Improvement Areas:</span>
                <span className="text-orange-400 font-bold">{analytics?.improvement_areas?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          {isAdmin() && (
            <Card className="gaming-card bg-black/40 border-0 hover-glow transition-all duration-300 group cursor-pointer" onClick={() => navigate('/enhanced-admin')}>
              <CardHeader className="relative">
                <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-red-400" />
                  Enhanced Admin
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced user management and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">User Oversight:</span>
                  <span className="text-red-400 font-bold">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Security Status:</span>
                  <span className="text-green-400 font-bold">Protected</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tournament Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="cyber-gradient rounded-full h-32 w-32 mx-auto mb-6 animate-spin"></div>
            <p className="text-xl text-gray-300 font-bold">Loading epic tournaments... 🚀</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="gaming-card bg-black/40 border-0 hover-glow transition-all duration-300 group">
                <CardHeader className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {tournament.title}
                    </CardTitle>
                    <Badge className={`${getStatusColor(tournament.status)} text-white font-bold px-3 py-1`}>
                      {tournament.status.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300 line-clamp-2">
                    {tournament.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        <div>
                          <div className="text-xs text-gray-400">ENTRY FEE</div>
                          <div className="text-lg font-bold text-green-400">${tournament.entry_fee}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/30">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        <div>
                          <div className="text-xs text-gray-400">PRIZE POOL</div>
                          <div className="text-lg font-bold text-yellow-400">${tournament.prize_pool}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <span className="text-blue-400 font-bold">
                          {tournament.current_participants}/{tournament.max_participants} PLAYERS
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {Math.round((tournament.current_participants / tournament.max_participants) * 100)}% FULL
                      </div>
                    </div>
                  </div>
                  
                  {tournament.start_time && (
                    <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-2">
                      <Zap className="h-4 w-4 inline mr-2 text-cyan-400" />
                      Starts: {new Date(tournament.start_time).toLocaleString()}
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 clip-angle transition-all duration-300 transform group-hover:scale-105" 
                    onClick={() => navigate(`/tournament/${tournament.id}`)}
                  >
                    <Target className="mr-2 h-5 w-5" />
                    JOIN BATTLE
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {tournaments.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="gaming-card p-12 rounded-2xl max-w-md mx-auto">
                  <Trophy className="h-20 w-20 text-cyan-400 mx-auto mb-6 float-animation" />
                  <h3 className="text-2xl font-bold text-white mb-4 text-glow">NO TOURNAMENTS YET</h3>
                  <p className="text-gray-300 mb-6">Be the first to create an epic tournament! 🚀</p>
                  {canManageTournaments() && (
                    <Button 
                      onClick={() => navigate('/create-tournament')}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-3 clip-angle"
                    >
                      <Star className="mr-2 h-5 w-5" />
                      CREATE FIRST TOURNAMENT
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
