
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Users, DollarSign } from 'lucide-react';
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
      case 'open': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tournament Dashboard</h1>
            <p className="text-gray-600 mt-2">Compete in Fortnite tournaments and win prizes</p>
          </div>
          <Button onClick={() => navigate('/create-tournament')} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Tournament</span>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tournaments...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{tournament.title}</CardTitle>
                    <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {tournament.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Entry: ${tournament.entry_fee}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">${tournament.prize_pool}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        {tournament.current_participants}/{tournament.max_participants} players
                      </span>
                    </div>
                    
                    {tournament.start_time && (
                      <div className="text-sm text-gray-600">
                        Starts: {new Date(tournament.start_time).toLocaleString()}
                      </div>
                    )}
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => navigate(`/tournament/${tournament.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {tournaments.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments yet</h3>
                <p className="text-gray-600 mb-4">Be the first to create a tournament!</p>
                <Button onClick={() => navigate('/create-tournament')}>
                  Create First Tournament
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
