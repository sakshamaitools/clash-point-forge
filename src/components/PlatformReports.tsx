
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Trophy, DollarSign, Activity, Download, Calendar } from 'lucide-react';

interface ReportData {
  userGrowth: Array<{ month: string; users: number }>;
  tournamentActivity: Array<{ month: string; tournaments: number; participants: number }>;
  revenueData: Array<{ month: string; revenue: number; fees: number }>;
  statusDistribution: Array<{ name: string; value: number; color: string }>;
}

const PlatformReports = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRoles();
  const { toast } = useToast();
  const [reportData, setReportData] = useState<ReportData>({
    userGrowth: [],
    tournamentActivity: [],
    revenueData: [],
    statusDistribution: []
  });
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      fetchReportData();
    }
  }, [isAdmin, timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Get date range
      const endDate = new Date();
      const startDate = new Date();
      const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
      startDate.setMonth(endDate.getMonth() - months);

      // Fetch user growth data
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      // Fetch tournament data
      const { data: tournaments } = await supabase
        .from('tournaments')
        .select('created_at, status, current_participants')
        .gte('created_at', startDate.toISOString());

      // Fetch transaction data
      const { data: transactions } = await supabase
        .from('transactions')
        .select('created_at, amount, transaction_type')
        .gte('created_at', startDate.toISOString())
        .eq('payment_status', 'completed');

      // Process user growth data
      const userGrowthMap = new Map();
      profiles?.forEach(profile => {
        const month = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        userGrowthMap.set(month, (userGrowthMap.get(month) || 0) + 1);
      });

      const userGrowth = Array.from(userGrowthMap.entries()).map(([month, users]) => ({ month, users }));

      // Process tournament activity data
      const tournamentMap = new Map();
      const participantMap = new Map();
      
      tournaments?.forEach(tournament => {
        const month = new Date(tournament.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        tournamentMap.set(month, (tournamentMap.get(month) || 0) + 1);
        participantMap.set(month, (participantMap.get(month) || 0) + tournament.current_participants);
      });

      const tournamentActivity = Array.from(tournamentMap.entries()).map(([month, tournaments]) => ({
        month,
        tournaments,
        participants: participantMap.get(month) || 0
      }));

      // Process revenue data
      const revenueMap = new Map();
      const feesMap = new Map();
      
      transactions?.forEach(transaction => {
        const month = new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const amount = Number(transaction.amount);
        
        if (transaction.transaction_type === 'entry_fee') {
          feesMap.set(month, (feesMap.get(month) || 0) + amount);
        }
        revenueMap.set(month, (revenueMap.get(month) || 0) + amount);
      });

      const revenueData = Array.from(revenueMap.entries()).map(([month, revenue]) => ({
        month,
        revenue,
        fees: feesMap.get(month) || 0
      }));

      // Process tournament status distribution
      const statusCounts = new Map();
      tournaments?.forEach(tournament => {
        statusCounts.set(tournament.status, (statusCounts.get(tournament.status) || 0) + 1);
      });

      const statusColors = {
        'draft': '#6B7280',
        'open': '#10B981',
        'in_progress': '#F59E0B',
        'completed': '#3B82F6',
        'cancelled': '#EF4444'
      };

      const statusDistribution = Array.from(statusCounts.entries()).map(([name, value]) => ({
        name,
        value,
        color: statusColors[name as keyof typeof statusColors] || '#6B7280'
      }));

      setReportData({
        userGrowth,
        tournamentActivity,
        revenueData,
        statusDistribution
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch report data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const csvData = [
      ['Report Type', 'Period', 'Generated On'],
      ['Platform Analytics', timeRange, new Date().toLocaleDateString()],
      [''],
      ['User Growth'],
      ['Month', 'New Users'],
      ...reportData.userGrowth.map(item => [item.month, item.users]),
      [''],
      ['Tournament Activity'],
      ['Month', 'Tournaments', 'Participants'],
      ...reportData.tournamentActivity.map(item => [item.month, item.tournaments, item.participants]),
      [''],
      ['Revenue Data'],
      ['Month', 'Total Revenue', 'Entry Fees'],
      ...reportData.revenueData.map(item => [item.month, item.revenue, item.fees])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `platform-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: "Report Exported",
      description: "Report has been downloaded as CSV file",
    });
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            You don't have permission to access platform reports.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Platform Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading reports...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Platform Reports</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>User Growth</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tournament Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Tournament Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.tournamentActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tournaments" fill="#10B981" name="Tournaments Created" />
              <Bar dataKey="participants" fill="#F59E0B" name="Total Participants" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Revenue Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={reportData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Total Revenue" />
                <Line type="monotone" dataKey="fees" stroke="#3B82F6" strokeWidth={2} name="Entry Fees" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tournament Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Tournament Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={reportData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {reportData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformReports;
