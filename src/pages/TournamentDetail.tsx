import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, Users, DollarSign, Calendar, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TournamentBracket from '@/components/TournamentBracket';
import ParticipantsList from '@/components/ParticipantsList';
import TournamentManagement from '@/components/TournamentManagement';
import TournamentLeaderboard from '@/components/TournamentLeaderboard';

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
  tournament_format: string;
  game_mode: string;
  rules: string;
  island_code: string;
  creator_id: string;
}

interface Participant {
  id: string;
  user_id: string;
  registration_time: string;
  payment_status: string;
  profiles: {
    username: string;
    display_name: string;
  };
}

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchTournamentData();
  }, [id, user, navigate]);

  const fetchTournamentData = async () => {
    try {
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();

      if (tournamentError) throw tournamentError;
      setTournament(tournamentData);

      const { data: participantsData, error: participantsError } = await supabase
        .from('tournament_participants')
        .select(`
          id,
          user_id,
          registration_time,
          payment_status,
          profiles (
            username,
            display_name
          )
        `)
        .eq('tournament_id', id);

      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);

      // Check if current user is registered
      const userParticipant = participantsData?.find(p => p.user_id === user?.id);
      setIsRegistered(!!userParticipant);

    } catch (error) {
      console.error('Error fetching tournament data:', error);
      toast({
        title: "Error",
        description: "Failed to load tournament data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user || !tournament) return;

    setRegistering(true);
    try {
      // Check if registration is still open
      if (tournament.current_participants >= tournament.max_participants) {
        toast({
          title: "Tournament Full",
          description: "This tournament has reached its maximum capacity",
          variant: "destructive",
        });
        return;
      }

      if (new Date() > new Date(tournament.registration_deadline)) {
        toast({
          title: "Registration Closed",
          description: "Registration deadline has passed",
          variant: "destructive",
        });
        return;
      }

      // Create participant record
      const { error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: id,
          user_id: user.id,
          payment_status: tournament.entry_fee > 0 ? 'pending' : 'completed'
        });

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: "You have been registered for the tournament",
      });

      fetchTournamentData();
    } catch (error) {
      console.error('Error registering for tournament:', error);
      toast({
        title: "Registration Failed",
        description: "Failed to register for tournament",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
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

  const isCreator = user?.id === tournament?.creator_id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tournament Not Found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tournament Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{tournament.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {tournament.description}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                    {tournament.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Entry Fee</p>
                      <p className="font-semibold">${tournament.entry_fee}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Prize Pool</p>
                      <p className="font-semibold">${tournament.prize_pool}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Players</p>
                      <p className="font-semibold">{tournament.current_participants}/{tournament.max_participants}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Format</p>
                      <p className="font-semibold capitalize">{tournament.tournament_format.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>

                {tournament.start_time && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Start Time</p>
                      <p className="font-semibold">{new Date(tournament.start_time).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {tournament.island_code && (
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Island Code</p>
                      <p className="font-semibold font-mono">{tournament.island_code}</p>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {tournament.rules && (
                  <div>
                    <h3 className="font-semibold mb-2">Tournament Rules</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{tournament.rules}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tournament Management - only show for creators */}
            {isCreator && (
              <TournamentManagement
                tournament={tournament}
                participants={participants}
                isCreator={isCreator}
                onTournamentUpdate={fetchTournamentData}
              />
            )}

            {/* Tournament Bracket */}
            {(tournament.status === 'in_progress' || tournament.status === 'completed') && (
              <TournamentBracket 
                tournamentId={tournament.id} 
                format={tournament.tournament_format}
                canManage={isCreator}
                onMatchUpdate={fetchTournamentData}
              />
            )}

            {/* Tournament Results/Leaderboard */}
            {(tournament.status === 'completed' || tournament.status === 'in_progress') && (
              <TournamentLeaderboard
                tournamentId={tournament.id}
                tournamentFormat={tournament.tournament_format}
                status={tournament.status}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent>
                {isRegistered ? (
                  <div className="text-center">
                    <div className="text-green-600 mb-2">✓ You're registered!</div>
                    <p className="text-sm text-gray-600">Good luck in the tournament</p>
                  </div>
                ) : tournament.status === 'open' ? (
                  <div className="space-y-4">
                    {tournament.registration_deadline && (
                      <div>
                        <p className="text-sm text-gray-600">Registration closes:</p>
                        <p className="font-semibold">{new Date(tournament.registration_deadline).toLocaleString()}</p>
                      </div>
                    )}
                    <Button 
                      onClick={handleRegister} 
                      disabled={registering || tournament.current_participants >= tournament.max_participants}
                      className="w-full"
                    >
                      {registering ? 'Registering...' : `Register (${tournament.entry_fee > 0 ? `$${tournament.entry_fee}` : 'Free'})`}
                    </Button>
                    {tournament.current_participants >= tournament.max_participants && (
                      <p className="text-sm text-red-600 text-center">Tournament is full</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    Registration is closed
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants List */}
            <ParticipantsList participants={participants} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
