
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles, AppRole } from '@/hooks/useUserRoles';
import { Search, Users, Trophy, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { validateAndSanitizeInput } from '@/utils/validation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
  total_tournaments: number;
  total_winnings: number;
  skill_rating: number;
  roles: Array<{
    id: string;
    role: AppRole;
    assigned_at: string;
    is_active: boolean;
  }>;
}

const SecureUserManagement = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRoles();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const roleColors: Record<AppRole, string> = {
    'player': 'bg-gray-500',
    'tournament_organizer': 'bg-blue-500',
    'moderator': 'bg-yellow-500',
    'support_staff': 'bg-green-500',
    'financial_manager': 'bg-purple-500',
    'platform_administrator': 'bg-red-500',
    'super_admin': 'bg-black'
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limit for performance

      if (error) throw error;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('id, role, assigned_at, is_active')
            .eq('user_id', profile.id)
            .eq('is_active', true);

          return {
            ...profile,
            roles: roles || []
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logAdminAction = async (action: string, targetUserId: string, details: any) => {
    try {
      await supabase
        .from('admin_audit_log')
        .insert({
          admin_user_id: user?.id,
          action,
          target_user_id: targetUserId,
          details
        });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  const updateUserStats = async (userId: string, field: string, value: number) => {
    // Validate the field name to prevent injection
    const allowedFields = ['skill_rating'];
    if (!allowedFields.includes(field)) {
      toast({
        title: "Error",
        description: "Invalid field for update",
        variant: "destructive",
      });
      return;
    }

    // Validate the value
    if (field === 'skill_rating' && (value < 0 || value > 5000)) {
      toast({
        title: "Error",
        description: "Skill rating must be between 0 and 5000",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', userId);

      if (error) throw error;

      // Log the admin action
      await logAdminAction('update_user_stats', userId, { field, value });

      toast({
        title: "User Updated",
        description: `User ${field} has been updated`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (value: string) => {
    const validation = validateAndSanitizeInput(value, 'username');
    setSearchTerm(validation.sanitized);
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
              <p>You don't have permission to access user management.</p>
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
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Secure User Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Secure User Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Tournaments</TableHead>
                <TableHead>Winnings</TableHead>
                <TableHead>Skill Rating</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((userData) => (
                <TableRow key={userData.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {userData.display_name || userData.username}
                      </div>
                      <div className="text-sm text-gray-500">@{userData.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {userData.roles
                        .filter(role => role.is_active)
                        .map((role) => (
                          <Badge
                            key={role.id}
                            className={`${roleColors[role.role]} text-white text-xs`}
                          >
                            {role.role.replace('_', ' ')}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span>{userData.total_tournaments || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>${userData.total_winnings || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={userData.skill_rating || 1000}
                        onChange={(e) => {
                          const newRating = parseInt(e.target.value);
                          if (newRating >= 0 && newRating <= 5000) {
                            updateUserStats(userData.id, 'skill_rating', newRating);
                          }
                        }}
                        className="w-20 text-center"
                        min="0"
                        max="5000"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">
                        {new Date(userData.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">No users match your search criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecureUserManagement;
