
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Trophy, Users, DollarSign } from 'lucide-react';

const CreateTournament = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    entry_fee: '',
    prize_pool: '',
    max_participants: '',
    tournament_format: 'single_elimination',
    game_mode: '',
    island_code: '',
    rules: '',
    registration_deadline: '',
    start_time: '',
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert([
          {
            creator_id: user.id,
            title: formData.title,
            description: formData.description,
            entry_fee: formData.entry_fee ? parseFloat(formData.entry_fee) : 0,
            prize_pool: formData.prize_pool ? parseFloat(formData.prize_pool) : 0,
            max_participants: parseInt(formData.max_participants),
            tournament_format: formData.tournament_format as any,
            game_mode: formData.game_mode,
            island_code: formData.island_code,
            rules: formData.rules,
            registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : null,
            start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
            status: 'open'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Tournament Created!",
        description: "Your tournament has been successfully created.",
      });

      navigate(`/tournament/${data.id}`);
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast({
        title: "Error",
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Tournament</h1>
          <p className="text-gray-600 mt-2">Set up a new Fortnite tournament for players to compete</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              <span>Tournament Details</span>
            </CardTitle>
            <CardDescription>
              Fill in the information below to create your tournament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tournament Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Friday Night Showdown"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_participants">Max Participants *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="max_participants"
                      name="max_participants"
                      type="number"
                      value={formData.max_participants}
                      onChange={handleInputChange}
                      placeholder="16"
                      className="pl-10"
                      min="2"
                      max="128"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your tournament..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="entry_fee">Entry Fee ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="entry_fee"
                      name="entry_fee"
                      type="number"
                      step="0.01"
                      value={formData.entry_fee}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="pl-10"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prize_pool">Prize Pool ($)</Label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="prize_pool"
                      name="prize_pool"
                      type="number"
                      step="0.01"
                      value={formData.prize_pool}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="pl-10"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tournament_format">Tournament Format</Label>
                  <select
                    id="tournament_format"
                    name="tournament_format"
                    value={formData.tournament_format}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="single_elimination">Single Elimination</option>
                    <option value="double_elimination">Double Elimination</option>
                    <option value="round_robin">Round Robin</option>
                    <option value="swiss">Swiss System</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game_mode">Game Mode</Label>
                  <Input
                    id="game_mode"
                    name="game_mode"
                    value={formData.game_mode}
                    onChange={handleInputChange}
                    placeholder="e.g., Solos, Duos, Squads"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="island_code">Island Code</Label>
                <Input
                  id="island_code"
                  name="island_code"
                  value={formData.island_code}
                  onChange={handleInputChange}
                  placeholder="e.g., 1234-5678-9012"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="registration_deadline">Registration Deadline</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="registration_deadline"
                      name="registration_deadline"
                      type="datetime-local"
                      value={formData.registration_deadline}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_time">Tournament Start Time</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="start_time"
                      name="start_time"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Tournament Rules</Label>
                <Textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  placeholder="Specify tournament rules, restrictions, and guidelines..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Tournament'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTournament;
