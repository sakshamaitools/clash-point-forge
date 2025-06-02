
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trophy, User, Shield, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { highestRole, isAdmin, canManageTournaments, loading } = useUserRoles();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'player': 'bg-gray-500',
      'tournament_organizer': 'bg-blue-500',
      'moderator': 'bg-yellow-500',
      'support_staff': 'bg-green-500',
      'financial_manager': 'bg-purple-500',
      'platform_administrator': 'bg-red-500',
      'super_admin': 'bg-black'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-purple-600 mr-2" />
            <span className="font-bold text-xl text-gray-900">Fortnite Tournaments</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Role-based navigation items */}
                {canManageTournaments() && (
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/create-tournament')}
                    className="flex items-center space-x-1"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Create Tournament</span>
                  </Button>
                )}

                {isAdmin() && (
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/admin')}
                    className="flex items-center space-x-1"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.email}</span>
                      {highestRole && !loading && (
                        <Badge className={`${getRoleColor(highestRole)} text-white text-xs`}>
                          {highestRole.replace('_', ' ')}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {isAdmin() && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
