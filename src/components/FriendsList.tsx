
import React from 'react';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserCheck, UserX, MessageCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FriendsList = () => {
  const { friends, pendingRequests, sentRequests, loading, respondToFriendRequest, removeFriend } = useFriends();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 && (
        <Card className="gaming-card border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Friend Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={request.requester?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600">
                        {request.requester?.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-bold">{request.requester?.display_name}</p>
                      <p className="text-gray-400 text-sm">@{request.requester?.username}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => respondToFriendRequest(request.id, 'accepted')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respondToFriendRequest(request.id, 'declined')}
                      className="border-red-500 text-red-400 hover:bg-red-500/20"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card className="gaming-card border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Friends ({friends.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No friends yet. Send some friend requests!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => {
                const friendProfile = friend.requester_id === friend.requester?.id ? friend.addressee : friend.requester;
                return (
                  <div key={friend.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-all">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={friendProfile?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600">
                          {friendProfile?.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-bold">{friendProfile?.display_name}</p>
                        <p className="text-gray-400 text-sm">@{friendProfile?.username}</p>
                      </div>
                      <Badge className="bg-green-600 text-white">Online</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/chat/${friendProfile?.id}`)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/profile/${friendProfile?.id}`)}
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <Card className="gaming-card border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-gray-400 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Sent Requests ({sentRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={request.addressee?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600">
                        {request.addressee?.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-bold">{request.addressee?.display_name}</p>
                      <p className="text-gray-400 text-sm">@{request.addressee?.username}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    Pending
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FriendsList;
