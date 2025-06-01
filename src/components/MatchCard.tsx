
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface MatchCardProps {
  match: Match;
  canManage: boolean;
  onMatchUpdate: () => void;
}

const MatchCard = ({ match, canManage, onMatchUpdate }: MatchCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const handleDeclareWinner = async (winnerId: string) => {
    if (!canManage) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('matches')
        .update({
          winner_id: winnerId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', match.id);

      if (error) throw error;

      toast({
        title: "Match Updated",
        description: "Winner has been declared",
      });

      onMatchUpdate();
    } catch (error) {
      console.error('Error updating match:', error);
      toast({
        title: "Error",
        description: "Failed to update match",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      case 'disputed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlayerName = (player: any) => {
    if (!player) return 'TBD';
    return player.display_name || player.username || 'Unknown Player';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Match {match.match_number}</CardTitle>
          <Badge className={`${getStatusColor(match.status)} text-white text-xs`}>
            {match.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className={`p-2 rounded flex justify-between items-center ${
            match.winner_id === match.player1_id ? 'bg-green-100 border-green-300' : 
            match.player1_id ? 'bg-gray-50' : 'bg-gray-100'
          }`}>
            <span className="text-sm font-medium">
              {getPlayerName(match.player1)}
            </span>
            {match.winner_id === match.player1_id && (
              <span className="text-green-600">👑</span>
            )}
            {canManage && match.status === 'scheduled' && match.player1_id && match.player2_id && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeclareWinner(match.player1_id!)}
                disabled={updating}
                className="ml-2"
              >
                Win
              </Button>
            )}
          </div>
          
          <div className="text-center text-xs text-gray-500">vs</div>
          
          <div className={`p-2 rounded flex justify-between items-center ${
            match.winner_id === match.player2_id ? 'bg-green-100 border-green-300' : 
            match.player2_id ? 'bg-gray-50' : 'bg-gray-100'
          }`}>
            <span className="text-sm font-medium">
              {getPlayerName(match.player2)}
            </span>
            {match.winner_id === match.player2_id && (
              <span className="text-green-600">👑</span>
            )}
            {canManage && match.status === 'scheduled' && match.player1_id && match.player2_id && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeclareWinner(match.player2_id!)}
                disabled={updating}
                className="ml-2"
              >
                Win
              </Button>
            )}
          </div>
        </div>

        {match.scheduled_time && (
          <div className="text-xs text-gray-600 text-center">
            {new Date(match.scheduled_time).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
