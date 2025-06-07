
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { user_id, tournament_id, performance_data } = await req.json();

    // Fetch user's historical performance
    const { data: history, error } = await supabaseClient
      .from('performance_metrics')
      .select('*')
      .eq('user_id', user_id)
      .order('recorded_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // AI Anti-cheat Analysis
    const suspiciousActivity = analyzePerformance(performance_data, history || []);

    if (suspiciousActivity.detected) {
      // Create anti-cheat report
      await supabaseClient
        .from('anti_cheat_reports')
        .insert({
          user_id,
          tournament_id,
          detection_type: 'behavioral',
          severity: suspiciousActivity.severity,
          details: {
            anomalies: suspiciousActivity.anomalies,
            confidence: suspiciousActivity.confidence,
            trigger_metrics: suspiciousActivity.triggers
          },
          status: 'pending'
        });

      // Log admin action for review
      await supabaseClient
        .from('admin_audit_log')
        .insert({
          admin_user_id: 'system',
          action: 'anti_cheat_detection',
          target_user_id: user_id,
          details: {
            tournament_id,
            detection_results: suspiciousActivity
          }
        });
    }

    return new Response(JSON.stringify({ 
      analysis_complete: true,
      suspicious_activity: suspiciousActivity.detected,
      confidence: suspiciousActivity.confidence,
      recommended_action: suspiciousActivity.action
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in anti-cheat analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzePerformance(current: any, history: any[]) {
  const anomalies = [];
  const triggers = [];
  
  if (history.length === 0) {
    return { detected: false, confidence: 0, anomalies: [], triggers: [], action: 'monitor' };
  }

  // Calculate historical averages
  const avgKills = history.reduce((sum, h) => sum + h.kills, 0) / history.length;
  const avgDamage = history.reduce((sum, h) => sum + h.damage_dealt, 0) / history.length;
  const avgAccuracy = history.reduce((sum, h) => sum + (h.accuracy_percentage || 0), 0) / history.length;

  // Check for sudden skill improvements
  if (current.kills > avgKills * 3) {
    anomalies.push('Abnormal kill count increase');
    triggers.push('kills_spike');
  }

  if (current.damage_dealt > avgDamage * 2.5) {
    anomalies.push('Abnormal damage increase');
    triggers.push('damage_spike');
  }

  if (current.accuracy_percentage > avgAccuracy + 40) {
    anomalies.push('Abnormal accuracy improvement');
    triggers.push('accuracy_spike');
  }

  // Check for impossible statistics
  if (current.accuracy_percentage > 95) {
    anomalies.push('Impossibly high accuracy');
    triggers.push('accuracy_impossible');
  }

  if (current.kills > 30) {
    anomalies.push('Unrealistic kill count');
    triggers.push('kills_impossible');
  }

  const severity = triggers.length > 2 ? 'high' : triggers.length > 0 ? 'medium' : 'low';
  const confidence = Math.min(triggers.length * 25, 100);
  const detected = triggers.length > 0;

  let action = 'monitor';
  if (confidence > 75) action = 'suspend';
  else if (confidence > 50) action = 'investigate';

  return {
    detected,
    severity,
    confidence,
    anomalies,
    triggers,
    action
  };
}
