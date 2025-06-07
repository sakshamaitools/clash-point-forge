
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Player {
  id: string;
  skill_rating: number;
  analytics?: {
    skill_metrics: any;
    play_patterns: any;
  };
  recent_performance: number[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { tournament_id, players } = await req.json();

    // Fetch player analytics and recent performance
    const enhancedPlayers: Player[] = await Promise.all(
      players.map(async (player: any) => {
        const { data: analytics } = await supabaseClient
          .from('player_analytics')
          .select('skill_metrics, play_patterns')
          .eq('user_id', player.id)
          .single();

        const { data: performance } = await supabaseClient
          .from('performance_metrics')
          .select('kills, placement, damage_dealt')
          .eq('user_id', player.id)
          .order('recorded_at', { ascending: false })
          .limit(5);

        return {
          ...player,
          analytics,
          recent_performance: performance?.map(p => p.kills + (100 - p.placement)) || []
        };
      })
    );

    // AI Matchmaking Algorithm
    const balancedMatches = generateBalancedMatches(enhancedPlayers);

    // Store matchmaking results
    await supabaseClient
      .from('tournament_predictions')
      .insert({
        tournament_id,
        prediction_factors: { matchmaking_algorithm: 'ai_balanced', matches: balancedMatches },
        confidence_score: 85.5
      });

    return new Response(JSON.stringify({ 
      matches: balancedMatches,
      algorithm: 'AI-powered skill-based matchmaking'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI matchmaking:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateBalancedMatches(players: Player[]) {
  // Sort players by composite skill score
  const sortedPlayers = players.sort((a, b) => {
    const scoreA = calculateCompositeScore(a);
    const scoreB = calculateCompositeScore(b);
    return scoreB - scoreA;
  });

  const matches = [];
  const used = new Set();

  // Create balanced matches
  for (let i = 0; i < sortedPlayers.length; i++) {
    if (used.has(i)) continue;

    const player1 = sortedPlayers[i];
    let bestMatch = null;
    let bestDiff = Infinity;

    for (let j = i + 1; j < sortedPlayers.length; j++) {
      if (used.has(j)) continue;

      const player2 = sortedPlayers[j];
      const diff = Math.abs(calculateCompositeScore(player1) - calculateCompositeScore(player2));

      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = j;
      }
    }

    if (bestMatch !== null) {
      matches.push({
        player1: player1.id,
        player2: sortedPlayers[bestMatch].id,
        skill_difference: bestDiff,
        predicted_competitiveness: Math.max(0, 100 - bestDiff)
      });
      used.add(i);
      used.add(bestMatch);
    }
  }

  return matches;
}

function calculateCompositeScore(player: Player): number {
  let score = player.skill_rating;

  // Factor in recent performance
  if (player.recent_performance.length > 0) {
    const avgRecent = player.recent_performance.reduce((a, b) => a + b, 0) / player.recent_performance.length;
    score += avgRecent * 0.3;
  }

  // Factor in AI metrics
  if (player.analytics?.skill_metrics) {
    const metrics = player.analytics.skill_metrics;
    score += (metrics.kill_death_ratio || 0) * 50;
    score += (100 - (metrics.average_placement || 50)) * 2;
  }

  return score;
}
