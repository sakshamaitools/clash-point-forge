
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  recipient?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export const useMessages = (conversationUserId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async (userId?: string) => {
    if (!user) return;

    const targetUserId = userId || conversationUserId;
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(id, username, display_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(id, username, display_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map();
      
      data?.forEach((message) => {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        const partner = message.sender_id === user.id ? message.recipient : message.sender;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            partner,
            lastMessage: message,
            unreadCount: 0
          });
        }
        
        // Count unread messages
        if (message.recipient_id === user.id && !message.read_at) {
          conversationMap.get(partnerId).unreadCount++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const sendMessage = async (recipientId: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content
        });

      if (error) throw error;

      // Create notification for recipient
      await supabase
        .from('notifications')
        .insert({
          user_id: recipientId,
          type: 'message',
          title: 'New Message',
          content: `You have a new message`,
          data: { sender_id: user.id }
        });

      fetchMessages(recipientId);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (conversationUserId) {
      fetchMessages();
    } else {
      fetchConversations();
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as Message;
        if (conversationUserId) {
          if ((newMessage.sender_id === user?.id && newMessage.recipient_id === conversationUserId) ||
              (newMessage.sender_id === conversationUserId && newMessage.recipient_id === user?.id)) {
            fetchMessages();
          }
        } else {
          fetchConversations();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationUserId]);

  return {
    messages,
    conversations,
    loading,
    sendMessage,
    markAsRead,
    refetch: conversationUserId ? fetchMessages : fetchConversations
  };
};
