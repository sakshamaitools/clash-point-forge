
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  user_id: string;
  profiles: {
    username: string;
    display_name: string;
  };
}

interface BracketGeneratorProps {
  tournamentId: string;
  participants: Participant[];
  tournamentFormat: string;
  onBracketGenerated: () => void;
}

const BracketGenerator = ({ 
  tournamentId, 
  participants, 
  tournamentFormat, 
  onBracketGenerated 
}: BracketGeneratorProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const generateSingleEliminationBracket = async () => {
    const participantCount = participants.length;
    if (participantCount < 2) {
      toast({
        title: "Not Enough Participants",
        description: "At least 2 participants are required",
        variant: "destructive",
      });
      return;
    }

    // Calculate number of rounds needed
    const rounds = Math.ceil(Math.log2(participantCount));
    
    // Shuffle participants for random seeding
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
    
    // Create first round matches
    const matches = [];
    let matchNumber = 1;
    
    // First round - pair up participants
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
      const player1 = shuffledParticipants[i];
      const player2 = shuffledParticipants[i + 1] || null;
      
      matches.push({
        tournament_id: tournamentId,
        round_number: 1,
        match_number: matchNumber++,
        player1_id: player1.user_id,
        player2_id: player2?.user_id || null,
        status: player2 ? 'scheduled' : 'completed',
        winner_id: player2 ? null : player1.user_id
      });
    }

    // Create subsequent rounds with TBD players
    for (let round = 2; round <= rounds; round++) {
      const prevRoundMatches = Math.ceil(shuffledParticipants.length / Math.pow(2, round - 1));
      const currentRoundMatches = Math.ceil(prevRoundMatches / 2);
      
      for (let i = 0; i < currentRoundMatches; i++) {
        matches.push({
          tournament_id: tournamentId,
          round_number: round,
          match_number: i + 1,
          player1_id: null,
          player2_id: null,
          status: 'scheduled'
        });
      }
    }

    return matches;
  };

  const generateBracket = async () => {
    setGenerating(true);
    try {
      let matches;
      
      switch (tournamentFormat) {
        case 'single_elimination':
          matches = await generateSingleEliminationBracket();
          break;
        case 'round_robin':
          // For now, implement basic round-robin
          matches = await generateRoundRobinBracket();
          break;
        default:
          throw new Error('Unsupported tournament format');
      }

      if (matches && matches.length > 0) {
        const { error } = await supabase
          .from('matches')
          .insert(matches);

        if (error) throw error;

        // Update tournament status to in_progress
        await supabase
          .from('tournaments')
          .update({ status: 'in_progress' })
          .eq('id', tournamentId);

        toast({
          title: "Bracket Generated",
          description: "Tournament bracket has been created successfully",
        });

        onBracketGenerated();
      }
    } catch (error) {
      console.error('Error generating bracket:', error);
      toast({
        title: "Error",
        description: "Failed to generate tournament bracket",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateRoundRobinBracket = async () => {
    const matches = [];
    let matchNumber = 1;

    // Every participant plays every other participant once
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        matches.push({
          tournament_id: tournamentId,
          round_number: 1, // All matches in round 1 for round-robin
          match_number: matchNumber++,
          player1_id: participants[i].user_id,
          player2_id: participants[j].user_id,
          status: 'scheduled'
        });
      }
    }

    return matches;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Tournament Bracket</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Participants: {participants.length}</p>
            <p>Format: {tournamentFormat.replace('_', ' ')}</p>
          </div>
          <Button 
            onClick={generateBracket} 
            disabled={generating || participants.length < 2}
            className="w-full"
          >
            {generating ? 'Generating Bracket...' : 'Generate Bracket'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BracketGenerator;
