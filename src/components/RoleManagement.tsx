
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles, AppRole } from '@/hooks/useUserRoles';
import { Shield, UserCog, Search } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  email?: string;
}

interface UserWithRoles extends Profile {
  roles: Array<{
    id: string;
    role: AppRole;
    assigned_at: string;
    is_active: boolean;
  }>;
}

const RoleManagement = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRoles();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('player');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const roleHierarchy: Record<AppRole, number> = {
    'player': 1,
    'tournament_organizer': 2,
    'moderator': 3,
    'support_staff': 4,
    'financial_manager': 5,
    'platform_administrator': 6,
    'super_admin': 7
  };

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
        .select(`
          id,
          username,
          display_name
        `);

      if (error) throw error;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('id, role, assigned_at, is_active')
            .eq('user_id', profile.id);

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

  const assignRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role,
          assigned_by: user?.id,
          notes: notes
        });

      if (error) throw error;

      toast({
        title: "Role Assigned",
        description: `Successfully assigned ${role} role`,
      });

      setNotes('');
      fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    }
  };

  const revokeRole = async (userId: string, roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "Role Revoked",
        description: "Successfully revoked role",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error revoking role:', error);
      toast({
        title: "Error",
        description: "Failed to revoke role",
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
          <div className="text-center text-gray-500">
            You don't have permission to access role management.
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
            <Shield className="h-5 w-5" />
            <span>Role Management</span>
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
          <Shield className="h-5 w-5" />
          <span>Role Management</span>
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

        <div className="space-y-4">
          {filteredUsers.map((userData) => (
            <Card key={userData.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{userData.display_name || userData.username}</h3>
                  <p className="text-sm text-gray-600">@{userData.username}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.roles
                      .filter(role => role.is_active)
                      .map((role) => (
                        <div key={role.id} className="flex items-center space-x-1">
                          <Badge className={`${roleColors[role.role]} text-white`}>
                            {role.role.replace('_', ' ')}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => revokeRole(userData.id, role.id)}
                            className="h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="player">Player</SelectItem>
                      <SelectItem value="tournament_organizer">Tournament Organizer</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="support_staff">Support Staff</SelectItem>
                      <SelectItem value="financial_manager">Financial Manager</SelectItem>
                      <SelectItem value="platform_administrator">Platform Administrator</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => assignRole(userData.id, selectedRole)}>
                    Assign
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (optional)</label>
          <Textarea
            placeholder="Add notes about this role assignment..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
