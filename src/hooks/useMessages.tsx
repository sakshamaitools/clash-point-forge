
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  partner: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  } | null;
  lastMessage: Message;
  unreadCount: number;
}

export const useMessages = (recipientId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!user || !recipientId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Get all unique conversations for the user
      const { data: messagesData, error } = await supabase
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
      const conversationMap = new Map<string, Conversation>();
      
      (messagesData || []).forEach((message: any) => {
        const isFromUser = message.sender_id === user.id;
        const partnerId = isFromUser ? message.recipient_id : message.sender_id;
        const partner = isFromUser ? message.recipient : message.sender;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            partner,
            lastMessage: message,
            unreadCount: 0
          });
        }

        // Count unread messages from partner
        if (!isFromUser && !message.read_at) {
          const conversation = conversationMap.get(partnerId)!;
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipient: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipient,
          content
        });

      if (error) throw error;
      
      if (recipientId) {
        fetchMessages();
      } else {
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
    if (recipientId) {
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
        table: 'messages',
        filter: user?.id 
          ? recipientId 
              ? `or(and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id}))`
              : `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
          : undefined
      }, () => {
        if (recipientId) {
          fetchMessages();
        } else {
          fetchConversations();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, recipientId]);

  return {
    messages,
    conversations,
    loading,
    sendMessage,
    markAsRead,
    refetch: recipientId ? fetchMessages : fetchConversations
  };
};
