
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Search, Users, Shield, Brain, AlertTriangle, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnhancedUserProfile {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
  total_tournaments: number;
  total_winnings: number;
  skill_rating: number;
  platform_currency?: {
    balance: number;
    total_earned: number;
    total_spent: number;
  };
  crypto_wallets?: Array<{
    wallet_type: string;
    is_verified: boolean;
  }>;
  nft_count?: number;
  analytics?: {
    skill_metrics: any;
    improvement_areas: string[];
  };
  anti_cheat_reports?: Array<{
    severity: string;
    status: string;
    created_at: string;
  }>;
}

// Helper function to safely convert Json to string array
const convertToStringArray = (jsonData: any): string[] => {
  if (Array.isArray(jsonData)) {
    return jsonData.filter(item => typeof item === 'string');
  }
  return [];
};

const EnhancedUserManagement = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRoles();
  const { toast } = useToast();
  const [users, setUsers] = useState<EnhancedUserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAdmin()) {
      fetchEnhancedUsers();
    }
  }, [isAdmin]);

  const fetchEnhancedUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch additional data for each user
      const enhancedUsers = await Promise.all(
        profiles.map(async (profile) => {
          // Fetch platform currency
          const { data: currency } = await supabase
            .from('platform_currency')
            .select('balance, total_earned, total_spent')
            .eq('user_id', profile.id)
            .single();

          // Fetch crypto wallets
          const { data: wallets } = await supabase
            .from('crypto_wallets')
            .select('wallet_type, is_verified')
            .eq('user_id', profile.id);

          // Fetch NFT count
          const { count: nftCount } = await supabase
            .from('nft_rewards')
            .select('*', { count: 'exact', head: true })
            .eq('winner_id', profile.id);

          // Fetch analytics
          const { data: analyticsData } = await supabase
            .from('player_analytics')
            .select('skill_metrics, improvement_areas')
            .eq('user_id', profile.id)
            .single();

          // Fetch anti-cheat reports
          const { data: reports } = await supabase
            .from('anti_cheat_reports')
            .select('severity, status, created_at')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(5);

          // Convert analytics data to proper types
          const analytics = analyticsData ? {
            skill_metrics: analyticsData.skill_metrics,
            improvement_areas: convertToStringArray(analyticsData.improvement_areas)
          } : undefined;

          const enhancedProfile: EnhancedUserProfile = {
            ...profile,
            platform_currency: currency,
            crypto_wallets: wallets || [],
            nft_count: nftCount || 0,
            analytics,
            anti_cheat_reports: reports || []
          };

          return enhancedProfile;
        })
      );

      setUsers(enhancedUsers);
    } catch (error) {
      console.error('Error fetching enhanced users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const flagForAntiCheat = async (userId: string, severity: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('anti_cheat_reports')
        .insert({
          user_id: userId,
          detection_type: 'manual',
          severity,
          details: { reason, flagged_by: user?.id },
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "User Flagged",
        description: "Anti-cheat report created successfully",
      });

      fetchEnhancedUsers();
    } catch (error) {
      console.error('Error flagging user:', error);
      toast({
        title: "Error",
        description: "Failed to create anti-cheat report",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-center text-gray-500">
            <AlertTriangle className="h-8 w-8 mr-2" />
            <div>
              <h3 className="font-semibold">Access Denied</h3>
              <p>You don't have permission to access enhanced user management.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading enhanced user data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Enhanced User Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="economics">Economics</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {filteredUsers.map((userData) => (
              <div key={userData.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <div className="font-medium">{userData.display_name || userData.username}</div>
                    <div className="text-sm text-gray-500">@{userData.username}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{userData.total_tournaments}</div>
                    <div className="text-xs text-gray-600">Tournaments</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">${userData.total_winnings}</div>
                    <div className="text-xs text-gray-600">Winnings</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{userData.skill_rating}</div>
                    <div className="text-xs text-gray-600">Skill Rating</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="economics" className="space-y-4">
            {filteredUsers.map((userData) => (
              <div key={userData.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium">{userData.display_name || userData.username}</div>
                    <div className="text-sm text-gray-500">@{userData.username}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <div className="font-semibold">{userData.platform_currency?.balance || 0}</div>
                    <div className="text-xs text-gray-600">Balance</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{userData.crypto_wallets?.length || 0}</div>
                    <div className="text-xs text-gray-600">Wallets</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{userData.nft_count}</div>
                    <div className="text-xs text-gray-600">NFTs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{userData.platform_currency?.total_earned || 0}</div>
                    <div className="text-xs text-gray-600">Total Earned</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {filteredUsers.map((userData) => (
              <div key={userData.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium">{userData.display_name || userData.username}</div>
                    <div className="text-sm text-gray-500">@{userData.username}</div>
                  </div>
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                {userData.analytics ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">K/D Ratio</div>
                        <div className="text-lg">{userData.analytics.skill_metrics?.kill_death_ratio?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Avg Placement</div>
                        <div className="text-lg">{userData.analytics.skill_metrics?.average_placement?.toFixed(0) || 'N/A'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Improvement Areas</div>
                      <div className="flex flex-wrap gap-1">
                        {userData.analytics.improvement_areas?.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No analytics data available</div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            {filteredUsers.map((userData) => (
              <div key={userData.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium">{userData.display_name || userData.username}</div>
                    <div className="text-sm text-gray-500">@{userData.username}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => flagForAntiCheat(userData.id, 'low', 'Manual review')}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Flag
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Reports</div>
                  {userData.anti_cheat_reports?.length > 0 ? (
                    <div className="space-y-1">
                      {userData.anti_cheat_reports.map((report, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <Badge variant={report.severity === 'high' ? 'destructive' : 'secondary'}>
                            {report.severity}
                          </Badge>
                          <span className="text-gray-600">{report.status}</span>
                          <span className="text-gray-500">{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No security reports</div>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedUserManagement;
