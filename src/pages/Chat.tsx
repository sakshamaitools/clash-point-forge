
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ChatWindow from '@/components/ChatWindow';

const Chat = () => {
  const { userId } = useParams<{ userId: string }>();
  const [recipientProfile, setRecipientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipientProfile = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setRecipientProfile(data);
      } catch (error) {
        console.error('Error fetching recipient profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipientProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="cyber-gradient rounded-full h-12 w-12 animate-spin"></div>
      </div>
    );
  }

  if (!userId || !recipientProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">User Not Found</h1>
          <p className="text-gray-300">The user you're trying to chat with doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChatWindow
          recipientId={userId}
          recipientName={recipientProfile.display_name}
          recipientAvatar={recipientProfile.avatar_url}
        />
      </div>
    </div>
  );
};

export default Chat;
