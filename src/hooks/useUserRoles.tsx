
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 
  | 'player'
  | 'tournament_organizer'
  | 'moderator'
  | 'support_staff'
  | 'financial_manager'
  | 'platform_administrator'
  | 'super_admin';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by: string | null;
  assigned_at: string;
  is_active: boolean;
  notes: string | null;
}

export const useUserRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [highestRole, setHighestRole] = useState<AppRole | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRoles();
    } else {
      setRoles([]);
      setHighestRole(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserRoles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      setRoles(data || []);
      
      // Get highest role
      const { data: highestRoleData, error: roleError } = await supabase
        .rpc('get_user_highest_role', { _user_id: user.id });

      if (!roleError && highestRoleData) {
        setHighestRole(highestRoleData);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: AppRole): boolean => {
    return roles.some(r => r.role === role && r.is_active);
  };

  const hasAnyRole = (rolesToCheck: AppRole[]): boolean => {
    return roles.some(r => rolesToCheck.includes(r.role) && r.is_active);
  };

  const canManageTournaments = (): boolean => {
    return hasAnyRole(['tournament_organizer', 'platform_administrator', 'super_admin']);
  };

  const canModerate = (): boolean => {
    return hasAnyRole(['moderator', 'platform_administrator', 'super_admin']);
  };

  const canAccessFinancials = (): boolean => {
    return hasAnyRole(['financial_manager', 'platform_administrator', 'super_admin']);
  };

  const canProvideSupport = (): boolean => {
    return hasAnyRole(['support_staff', 'moderator', 'platform_administrator', 'super_admin']);
  };

  const isAdmin = (): boolean => {
    return hasAnyRole(['platform_administrator', 'super_admin']);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('super_admin');
  };

  return {
    roles,
    highestRole,
    loading,
    hasRole,
    hasAnyRole,
    canManageTournaments,
    canModerate,
    canAccessFinancials,
    canProvideSupport,
    isAdmin,
    isSuperAdmin,
    refetch: fetchUserRoles
  };
};
