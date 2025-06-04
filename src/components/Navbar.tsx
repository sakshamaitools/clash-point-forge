
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trophy, User, Shield, Settings, Zap, Crown } from 'lucide-react';
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
      'player': 'bg-gradient-to-r from-gray-400 to-gray-600',
      'tournament_organizer': 'bg-gradient-to-r from-blue-400 to-cyan-500',
      'moderator': 'bg-gradient-to-r from-yellow-400 to-orange-500',
      'support_staff': 'bg-gradient-to-r from-green-400 to-cyan-500',
      'financial_manager': 'bg-gradient-to-r from-purple-400 to-pink-500',
      'platform_administrator': 'bg-gradient-to-r from-red-400 to-orange-500',
      'super_admin': 'bg-gradient-to-r from-black to-purple-600'
    };
    return colors[role as keyof typeof colors] || 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  return (
    <nav className="bg-black/80 backdrop-blur-lg border-b border-purple-500/30 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-r from-cyan-400 to-purple-600 p-2 rounded-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="font-black text-xl text-white">FORTNITE</span>
              <span className="block text-xs text-cyan-400 font-bold tracking-wider">TOURNAMENTS</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Role-based navigation items */}
                {canManageTournaments() && (
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/create-tournament')}
                    className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 font-bold border border-cyan-500/30 clip-corner transition-all duration-300"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    CREATE TOURNAMENT
                  </Button>
                )}

                {isAdmin() && (
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/admin')}
                    className="text-purple-400 hover:text-white hover:bg-purple-500/20 font-bold border border-purple-500/30 clip-corner transition-all duration-300"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    ADMIN PANEL
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gaming-card text-white hover:text-cyan-400 font-bold px-4 py-2 transition-all duration-300">
                      <User className="h-4 w-4 mr-2" />
                      <span className="max-w-32 truncate">{user.email}</span>
                      {highestRole && !loading && (
                        <Badge className={`${getRoleColor(highestRole)} text-white text-xs ml-2 px-2`}>
                          {highestRole.replace('_', ' ').toUpperCase()}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-black/90 backdrop-blur-lg border border-purple-500/30 text-white"
                  >
                    <DropdownMenuLabel className="text-cyan-400 font-bold">MY ACCOUNT</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-purple-500/30" />
                    <DropdownMenuItem 
                      onClick={() => navigate('/dashboard')}
                      className="text-white hover:bg-cyan-500/20 hover:text-cyan-400 cursor-pointer"
                    >
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/profile')}
                      className="text-white hover:bg-purple-500/20 hover:text-purple-400 cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {isAdmin() && (
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin')}
                        className="text-white hover:bg-red-500/20 hover:text-red-400 cursor-pointer"
                      >
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-purple-500/30" />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold px-6 py-2 clip-angle transition-all duration-300"
              >
                <Zap className="mr-2 h-4 w-4" />
                SIGN IN
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
