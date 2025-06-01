
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Participant {
  id: string;
  user_id: string;
  seed_number: number | null;
}

export const useTournamentBracket = () => {
  const [generating, setGenerating] = useState(false);

  const generateSingleEliminationBracket = async (tournamentId: string, participants: Participant[]) => {
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
    const matches = [];
    let matchNumber = 1;

    // Generate first round matches
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
      if (i + 1 < shuffledParticipants.length) {
        matches.push({
          tournament_id: tournamentId,
          round_number: 1,
          match_number: matchNumber++,
          player1_id: shuffledParticipants[i].user_id,
          player2_id: shuffledParticipants[i + 1].user_id,
          status: 'scheduled'
        });
      }
    }

    // Generate subsequent rounds (empty for now, will be filled as matches complete)
    let currentRoundMatches = matches.length;
    let roundNumber = 2;
    
    while (currentRoundMatches > 1) {
      const nextRoundMatches = Math.ceil(currentRoundMatches / 2);
      for (let i = 0; i < nextRoundMatches; i++) {
        matches.push({
          tournament_id: tournamentId,
          round_number: roundNumber,
          match_number: i + 1,
          player1_id: null,
          player2_id: null,
          status: 'scheduled'
        });
      }
      currentRoundMatches = nextRoundMatches;
      roundNumber++;
    }

    return matches;
  };

  const generateBracket = async (tournamentId: string, format: string) => {
    setGenerating(true);
    try {
      // Get tournament participants
      const { data: participants, error: participantsError } = await supabase
        .from('tournament_participants')
        .select('id, user_id, seed_number')
        .eq('tournament_id', tournamentId);

      if (participantsError) throw participantsError;

      if (!participants || participants.length < 2) {
        throw new Error('Not enough participants to generate bracket');
      }

      let matches = [];

      switch (format) {
        case 'single_elimination':
          matches = await generateSingleEliminationBracket(tournamentId, participants);
          break;
        default:
          throw new Error(`Bracket generation for ${format} not implemented yet`);
      }

      // Insert matches into database
      const { error: matchesError } = await supabase
        .from('matches')
        .insert(matches);

      if (matchesError) throw matchesError;

      // Update tournament status to in_progress
      const { error: tournamentError } = await supabase
        .from('tournaments')
        .update({ status: 'in_progress' })
        .eq('id', tournamentId);

      if (tournamentError) throw tournamentError;

      return { success: true };
    } catch (error) {
      console.error('Error generating bracket:', error);
      return { success: false, error };
    } finally {
      setGenerating(false);
    }
  };

  return { generateBracket, generating };
};
