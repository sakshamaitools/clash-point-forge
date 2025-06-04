
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface PlayerStats {
  id: string;
  user_id: string;
  total_matches: number;
  total_wins: number;
  total_tournaments: number;
  achievements: any[];
  win_rate: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  data: any;
  created_at: string;
}

export const usePlayerStats = (userId?: string) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;

  const fetchPlayerStats = async () => {
    if (!targetUserId) return;

    try {
      const { data: statsData, error: statsError } = await supabase
        .from('player_stats')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;

      // Convert the data to match our interface
      if (statsData) {
        const convertedStats: PlayerStats = {
          ...statsData,
          achievements: Array.isArray(statsData.achievements) ? statsData.achievements : []
        };
        setStats(convertedStats);
      }

      // Fetch activity logs if viewing own profile
      if (targetUserId === user?.id) {
        const { data: activityData, error: activityError } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (activityError) throw activityError;
        setActivityLogs((activityData || []) as ActivityLog[]);
      }
    } catch (error) {
      console.error('Error fetching player stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (activityType: string, description: string, data?: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          description,
          data
        });

      if (error) throw error;
      fetchPlayerStats();
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const updateStats = async (updates: Partial<PlayerStats>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('player_stats')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      fetchPlayerStats();
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  useEffect(() => {
    fetchPlayerStats();
  }, [targetUserId]);

  return {
    stats,
    activityLogs,
    loading,
    logActivity,
    updateStats,
    refetch: fetchPlayerStats
  };
};
