
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PlayerProfile from '@/components/PlayerProfile';
import { Button } from '@/components/ui/button';
import { useFriends } from '@/hooks/useFriends';
import { UserPlus, MessageCircle, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { friends, sentRequests, sendFriendRequest } = useFriends();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetUserId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="cyber-gradient rounded-full h-12 w-12 animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-300">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isFriend = friends.some(f => 
    (f.requester_id === targetUserId || f.addressee_id === targetUserId) && f.status === 'accepted'
  );
  const hasSentRequest = sentRequests.some(r => r.addressee_id === targetUserId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isOwnProfile && (
          <div className="mb-6 flex justify-end space-x-3">
            {isFriend ? (
              <Button
                onClick={() => navigate(`/chat/${targetUserId}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            ) : hasSentRequest ? (
              <Button disabled variant="outline" className="border-gray-500 text-gray-400">
                <UserCheck className="h-4 w-4 mr-2" />
                Request Sent
              </Button>
            ) : (
              <Button
                onClick={() => targetUserId && sendFriendRequest(targetUserId)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            )}
          </div>
        )}

        <PlayerProfile userId={targetUserId!} profile={profile} />
      </div>
    </div>
  );
};

export default Profile;
