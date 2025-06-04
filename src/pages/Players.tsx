
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFriends } from '@/hooks/useFriends';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Player {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  fortnite_username: string;
}

const Players = () => {
  const { user } = useAuth();
  const { friends, sentRequests, sendFriendRequest } = useFriends();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const searchPlayers = async () => {
    if (!searchTerm.trim() || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, fortnite_username')
        .neq('id', user.id)
        .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%,fortnite_username.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      setPlayers((data || []) as Player[]);
    } catch (error) {
      console.error('Error searching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPlayers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, fortnite_username')
        .neq('id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPlayers((data || []) as Player[]);
    } catch (error) {
      console.error('Error loading recent players:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentPlayers();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlayers();
  };

  const isFriend = (playerId: string) => {
    return friends.some(f => 
      (f.requester_id === playerId || f.addressee_id === playerId) && f.status === 'accepted'
    );
  };

  const hasSentRequest = (playerId: string) => {
    return sentRequests.some(r => r.addressee_id === playerId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Please Sign In</h1>
          <p className="text-gray-300 mb-6">You need to be signed in to find players</p>
          <Button onClick={() => navigate('/auth')} className="cyber-gradient text-white px-8 py-3">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 text-glow">
            FIND <span className="text-cyan-400">PLAYERS</span>
          </h1>
          <p className="text-gray-300 text-xl">Discover and connect with fellow gamers 🎮</p>
        </div>

        {/* Search Form */}
        <Card className="gaming-card border-cyan-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="text"
                placeholder="Search by username, display name, or Epic ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-black/20 border-gray-600 text-white placeholder:text-gray-400"
              />
              <Button 
                type="submit" 
                disabled={loading || !searchTerm.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card className="gaming-card border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-400">
              {searchTerm ? `Search Results (${players.length})` : `Recent Players (${players.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="gaming-card p-4 rounded-xl animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : players.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{searchTerm ? 'No players found. Try a different search term.' : 'No players to display.'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="cursor-pointer" onClick={() => navigate(`/profile/${player.id}`)}>
                        <AvatarImage src={player.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600">
                          {player.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-white font-bold cursor-pointer hover:text-cyan-400" 
                            onClick={() => navigate(`/profile/${player.id}`)}>
                          {player.display_name}
                        </h4>
                        <p className="text-gray-400 text-sm">@{player.username}</p>
                        {player.fortnite_username && (
                          <p className="text-gray-500 text-xs">Epic: {player.fortnite_username}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isFriend(player.id) ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/chat/${player.id}`)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                          <Badge className="bg-green-600 text-white">Friends</Badge>
                        </>
                      ) : hasSentRequest(player.id) ? (
                        <Button disabled variant="outline" className="border-gray-500 text-gray-400">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Request Sent
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => sendFriendRequest(player.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add Friend
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Players;
