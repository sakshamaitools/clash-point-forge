
import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ChatWindowProps {
  recipientId: string;
  recipientName?: string;
  recipientAvatar?: string;
}

const ChatWindow = ({ recipientId, recipientName, recipientAvatar }: ChatWindowProps) => {
  const { user } = useAuth();
  const { messages, sendMessage, markAsRead, loading } = useMessages(recipientId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when viewing conversation
    messages.forEach((message) => {
      if (message.recipient_id === user?.id && !message.read_at) {
        markAsRead(message.id);
      }
    });
  }, [messages, user, markAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(recipientId, newMessage.trim());
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="cyber-gradient rounded-full h-12 w-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="gaming-card rounded-xl h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-purple-500/30 flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/social')}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar>
          <AvatarImage src={recipientAvatar} />
          <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600">
            {recipientName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-white font-bold">{recipientName}</h3>
          <p className="text-green-400 text-sm">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                  message.sender_id === user?.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {format(new Date(message.created_at), 'HH:mm')}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-500/30">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-black/30 border-gray-600 text-white placeholder-gray-400"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
