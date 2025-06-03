import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleManagement from '@/components/RoleManagement';
import TournamentOversight from '@/components/TournamentOversight';
import UserManagement from '@/components/UserManagement';
import PlatformReports from '@/components/PlatformReports';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, Trophy, DollarSign, Activity } from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  totalTournaments: number;
  activeTournaments: number;
  totalTransactions: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalTournaments: 0,
    activeTournaments: 0,
    totalTransactions: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!rolesLoading && !isAdmin()) {
      navigate('/dashboard');
      return;
    }

    if (isAdmin()) {
      fetchPlatformStats();
    }
  }, [user, isAdmin, rolesLoading, navigate]);

  const fetchPlatformStats = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch tournament stats
      const { count: tournamentsCount } = await supabase
        .from('tournaments')
        .select('*', { count: 'exact', head: true });

      const { count: activeTournamentsCount } = await supabase
        .from('tournaments')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress']);

      // Fetch transaction stats
      const { count: transactionsCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      const { data: revenueData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('payment_status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalTournaments: tournamentsCount || 0,
        activeTournaments: activeTournamentsCount || 0,
        totalTransactions: transactionsCount || 0,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform management and oversight</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTournaments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTournaments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roles">Role Management</TabsTrigger>
            <TabsTrigger value="tournaments">Tournament Oversight</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="roles">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="tournaments">
            <TournamentOversight />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports">
            <PlatformReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
