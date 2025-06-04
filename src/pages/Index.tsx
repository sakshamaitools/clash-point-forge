import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Users, DollarSign, Gamepad2, Zap, Target, Star } from 'lucide-react';
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
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="cyber-gradient rounded-full h-32 w-32 animate-spin"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-20 float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full opacity-20 float-animation" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-10 float-animation" style={{
        animationDelay: '2s'
      }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-6">
              <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
              <span className="text-cyan-400 font-bold text-lg tracking-wider">BATTLE ROYALE</span>
              <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 text-glow leading-tight">
              FORTNITE
              <span className="block cyber-gradient bg-clip-text animate-pulse text-purple-50">
                TOURNAMENTS
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              🏆 Join <span className="text-yellow-400 font-bold">EPIC</span> competitive Fortnite tournaments 
              🚀 Compete against <span className="text-cyan-400 font-bold">PRO</span> players 
              💰 Win <span className="text-green-400 font-bold">REAL CASH</span> prizes
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-4 text-lg font-bold clip-angle hover-glow transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/auth')}>
                <Gamepad2 className="mr-2 h-6 w-6" />
                START GAMING NOW
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-purple-500 bg-transparent text-purple-300 hover:bg-purple-500 hover:text-white px-12 py-4 text-lg font-bold clip-corner transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/auth')}>
                <Trophy className="mr-2 h-6 w-6" />
                VIEW TOURNAMENTS
              </Button>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="gaming-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">10K+</div>
                <div className="text-gray-300">Active Players</div>
              </div>
              <div className="gaming-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">$50K+</div>
                <div className="text-gray-300">Prizes Won</div>
              </div>
              <div className="gaming-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                <div className="text-gray-300">Tournaments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 text-glow">
              WHY CHOOSE OUR <span className="text-cyan-400">GAMING</span> PLATFORM?
            </h2>
            <p className="text-gray-300 text-xl">Professional tournament management made epic 🔥</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="gaming-card p-8 rounded-xl text-center group hover-glow transition-all duration-300">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">REAL PRIZES 💰</h3>
              <p className="text-gray-300">Win real cash prizes and build your gaming reputation like a pro</p>
            </div>
            
            <div className="gaming-card p-8 rounded-xl text-center group hover-glow transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">FAIR COMPETITION ⚔️</h3>
              <p className="text-gray-300">Skill-based matchmaking and advanced anti-cheat protection</p>
            </div>
            
            <div className="gaming-card p-8 rounded-xl text-center group hover-glow transition-all duration-300">
              <div className="bg-gradient-to-r from-green-400 to-cyan-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">INSTANT PAYOUTS 🚀</h3>
              <p className="text-gray-300">Lightning-fast and secure payment processing for winners</p>
            </div>
            
            <div className="gaming-card p-8 rounded-xl text-center group hover-glow transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">CUSTOM MODES 🎮</h3>
              <p className="text-gray-300">Play on exclusive custom islands with unique game modes</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="gaming-card p-12 rounded-2xl">
            <Star className="h-16 w-16 text-yellow-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold text-white mb-6 text-glow">
              READY TO <span className="text-cyan-400">DOMINATE</span>?
            </h2>
            <p className="text-gray-300 text-xl mb-8 leading-relaxed">
              Join <span className="text-yellow-400 font-bold">thousands</span> of players already competing in tournaments 🏆
            </p>
            <Button size="lg" className="cyber-gradient text-white px-16 py-6 text-xl font-bold rounded-xl hover-glow transition-all duration-300 transform hover:scale-110" onClick={() => navigate('/auth')}>
              <Gamepad2 className="mr-3 h-8 w-8" />
              ENTER THE BATTLE NOW
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;