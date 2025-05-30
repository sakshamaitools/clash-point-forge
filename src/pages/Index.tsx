import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Users, DollarSign, Gamepad2 } from 'lucide-react';
import { useEffect } from 'react';
const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Fortnite
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Tournaments
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join competitive Fortnite tournaments, compete against skilled players, 
              and win real cash prizes. Create your own tournaments or participate in existing ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="border-white hover:bg-white px-8 py-3 text-lg text-slate-950">
                View Tournaments
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-300 text-lg">Professional tournament management made simple</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Real Prizes</h3>
              <p className="text-gray-300">Win real cash prizes and build your gaming reputation</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Fair Competition</h3>
              <p className="text-gray-300">Skill-based matchmaking and anti-cheat protection</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Instant Payouts</h3>
              <p className="text-gray-300">Fast and secure payment processing for winners</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <Gamepad2 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Custom Modes</h3>
              <p className="text-gray-300">Play on custom islands with unique game modes</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Compete?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of players already competing in tournaments
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg" onClick={() => navigate('/auth')}>
            Start Playing Now
          </Button>
        </div>
      </div>
    </div>;
};
export default Index;