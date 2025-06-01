
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Participant {
  id: string;
  user_id: string;
  registration_time: string;
  payment_status: string;
  profiles: {
    username: string;
    display_name: string;
  };
}

interface ParticipantsListProps {
  participants: Participant[];
}

const ParticipantsList = ({ participants }: ParticipantsListProps) => {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants ({participants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {participant.profiles.display_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{participant.profiles.display_name || participant.profiles.username}</p>
                  <p className="text-xs text-gray-600">@{participant.profiles.username}</p>
                </div>
              </div>
              <Badge className={`${getPaymentStatusColor(participant.payment_status)} text-white text-xs`}>
                {participant.payment_status}
              </Badge>
            </div>
          ))}
          {participants.length === 0 && (
            <p className="text-center text-gray-500 py-4">No participants yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantsList;
