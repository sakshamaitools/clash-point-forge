
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Friend {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
  requester?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  addressee?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export const useFriends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    if (!user) return;

    try {
      // Fetch accepted friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
          *,
          requester:profiles!friends_requester_id_fkey(id, username, display_name, avatar_url),
          addressee:profiles!friends_addressee_id_fkey(id, username, display_name, avatar_url)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;

      // Fetch pending requests received
      const { data: pendingData, error: pendingError } = await supabase
        .from('friends')
        .select(`
          *,
          requester:profiles!friends_requester_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('addressee_id', user.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Fetch sent requests
      const { data: sentData, error: sentError } = await supabase
        .from('friends')
        .select(`
          *,
          addressee:profiles!friends_addressee_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('requester_id', user.id)
        .eq('status', 'pending');

      if (sentError) throw sentError;

      setFriends(friendsData || []);
      setPendingRequests(pendingData || []);
      setSentRequests(sentData || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Error",
        description: "Failed to fetch friends",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (addresseeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          requester_id: user.id,
          addressee_id: addresseeId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Friend Request Sent",
        description: "Your friend request has been sent!",
      });

      fetchFriends();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  const respondToFriendRequest = async (requestId: string, response: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: response, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: response === 'accepted' ? "Friend Request Accepted" : "Friend Request Declined",
        description: `You have ${response} the friend request.`,
      });

      fetchFriends();
    } catch (error) {
      console.error('Error responding to friend request:', error);
      toast({
        title: "Error",
        description: "Failed to respond to friend request",
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Friend Removed",
        description: "Friend has been removed from your list.",
      });

      fetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Error",
        description: "Failed to remove friend",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFriends();

    // Set up real-time subscription for friends updates
    const channel = supabase
      .channel('friends-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'friends',
        filter: `requester_id=eq.${user?.id},addressee_id=eq.${user?.id}`
      }, () => {
        fetchFriends();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    sendFriendRequest,
    respondToFriendRequest,
    removeFriend,
    refetch: fetchFriends
  };
};
