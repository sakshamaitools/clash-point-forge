
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PlayerAnalytics {
  id: string;
  user_id: string;
  skill_metrics: any;
  play_patterns: any;
  improvement_areas: string[];
  ai_recommendations: string[];
  last_analysis: string;
  updated_at: string;
}

interface PerformanceMetric {
  id: string;
  user_id: string;
  tournament_id: string;
  match_id: string;
  kills: number;
  placement: number;
  damage_dealt: number;
  materials_gathered: number;
  survival_time: number;
  accuracy_percentage: number;
  recorded_at: string;
}

export const useAIAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<PlayerAnalytics | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      fetchPerformance();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('player_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchPerformance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPerformance(data || []);
    } catch (error) {
      console.error('Error fetching performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzePerformance = async () => {
    if (!user || performance.length === 0) return;

    try {
      // AI analysis simulation
      const avgKills = performance.reduce((sum, p) => sum + p.kills, 0) / performance.length;
      const avgPlacement = performance.reduce((sum, p) => sum + p.placement, 0) / performance.length;
      const avgDamage = performance.reduce((sum, p) => sum + p.damage_dealt, 0) / performance.length;

      const skillMetrics = {
        kill_death_ratio: avgKills,
        average_placement: avgPlacement,
        damage_per_game: avgDamage,
        consistency_score: Math.random() * 100
      };

      const improvements = [];
      const recommendations = [];

      if (avgKills < 2) {
        improvements.push('Combat Skills');
        recommendations.push('Practice aim training and weapon handling');
      }
      if (avgPlacement > 50) {
        improvements.push('Positioning');
        recommendations.push('Work on map awareness and positioning');
      }
      if (avgDamage < 500) {
        improvements.push('Engagement Strategy');
        recommendations.push('Focus on dealing more damage per engagement');
      }

      const { error } = await supabase
        .from('player_analytics')
        .upsert({
          user_id: user.id,
          skill_metrics: skillMetrics,
          play_patterns: { recent_performance: performance.slice(0, 5) },
          improvement_areas: improvements,
          ai_recommendations: recommendations,
          last_analysis: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      fetchAnalytics();
    } catch (error) {
      console.error('Error analyzing performance:', error);
    }
  };

  const recordPerformance = async (matchData: Partial<PerformanceMetric>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('performance_metrics')
        .insert({
          user_id: user.id,
          ...matchData,
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;
      fetchPerformance();
    } catch (error) {
      console.error('Error recording performance:', error);
    }
  };

  return {
    analytics,
    performance,
    loading,
    analyzePerformance,
    recordPerformance,
    refetch: () => {
      fetchAnalytics();
      fetchPerformance();
    }
  };
};
