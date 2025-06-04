
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Bell, Search, UserPlus } from 'lucide-react';
import FriendsList from '@/components/FriendsList';
import { useMessages } from '@/hooks/useMessages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const Social = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { conversations, loading: conversationsLoading } = useMessages();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');

  useEffect(() => {
    // Auto-switch to messages tab if there's a notification
    if (conversations.some(c => c.unreadCount > 0) && activeTab !== 'messages') {
      toast({
        title: "New message received",
        description: "You have unread messages",
      });
    }
  }, [conversations]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Please Sign In</h1>
          <p className="text-gray-300 mb-6">You need to be signed in to access social features</p>
          <Button onClick={() => navigate('/auth')} className="cyber-gradient text-white px-8 py-3">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const totalUnreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 text-glow">
            SOCIAL <span className="text-cyan-400">HUB</span>
          </h1>
          <p className="text-gray-300 text-xl">Connect with friends and fellow gamers 🎮</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="gaming-card border-purple-500/30 bg-black/40">
            <TabsTrigger value="friends" className="text-white data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Users className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-white data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
              {totalUnreadMessages > 0 && (
                <Badge className="ml-2 bg-red-600 text-white text-xs">
                  {totalUnreadMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-600 text-white text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <FriendsList />
              </div>
              <div className="space-y-6">
                <Card className="gaming-card border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      onClick={() => navigate('/players')}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Players
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20"
                      onClick={() => navigate('/profile')}
                    >
                      View My Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="gaming-card border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="cyber-gradient rounded-full h-8 w-8 animate-spin"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations yet. Send a message to start chatting!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => navigate(`/chat/${conversation.id}`)}
                        className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all ${
                          conversation.unreadCount > 0 
                            ? 'bg-blue-900/20 hover:bg-blue-900/30 border border-blue-500/50' 
                            : 'bg-black/20 hover:bg-black/30'
                        }`}
                      >
                        <Avatar>
                          <AvatarImage src={conversation.partner?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600">
                            {conversation.partner?.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-bold ${conversation.unreadCount > 0 ? 'text-blue-300' : 'text-white'}`}>
                              {conversation.partner?.display_name}
                            </h4>
                            <span className="text-gray-400 text-sm">
                              {conversation.lastMessage?.created_at && 
                                format(new Date(conversation.lastMessage.created_at), 'HH:mm')}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${
                            conversation.unreadCount > 0 ? 'text-white' : 'text-gray-400'
                          }`}>
                            {conversation.lastMessage?.content}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-600 text-white">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="gaming-card border-yellow-500/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications ({notifications.length})
                </CardTitle>
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    Mark All Read
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications yet!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => !notification.read_at && markAsRead(notification.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          notification.read_at ? 'bg-black/10 opacity-60' : 'bg-black/20 hover:bg-black/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-bold">{notification.title}</h4>
                            {notification.content && (
                              <p className="text-gray-400 text-sm mt-1">{notification.content}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-2">
                              {format(new Date(notification.created_at), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                          {!notification.read_at && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Social;
