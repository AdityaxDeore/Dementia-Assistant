import React from 'react';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { 
  Gamepad2, 
  Brain, 
  Target, 
  Puzzle, 
  Timer, 
  Trophy,
  Play,
  Star,
  PawPrint,
  Sparkles,
  Castle
} from 'lucide-react';

export default function GamesPage() {
  const [, setLocation] = useLocation();

  const games = [
    {
      id: 1,
      title: "Memory Challenge",
      description: "Improve your cognitive function with fun memory exercises",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      difficulty: "Easy",
      time: "5-10 min"
    },
    {
      id: 2,
      title: "Mindful Breathing",
      description: "Interactive breathing exercises to reduce stress and anxiety",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      difficulty: "Beginner",
      time: "3-15 min"
    },
    {
      id: 3,
      title: "Puzzle Therapy",
      description: "Relaxing puzzles designed to calm the mind",
      icon: Puzzle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      difficulty: "Medium",
      time: "10-20 min"
    },
    {
      id: 4,
      title: "Focus Timer",
      description: "Pomodoro-style focus sessions with wellness breaks",
      icon: Timer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      difficulty: "Any",
      time: "25 min"
    },
    {
      id: 5,
      title: "Pet Care Dashboard",
      description: "Care for a virtual pet to practice responsibility and mindfulness",
      icon: PawPrint,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      difficulty: "Easy",
      time: "Open-ended",
      route: "/petcare-game"
    },
    {
      id: 6,
      title: "Inner Gatekeeper",
      description: "Protect your mind castle from negative thoughts and emotions in this therapeutic strategy game",
      icon: Castle,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      difficulty: "Medium",
      time: "15-30 min",
      route: "/inner-gatekeeper"
    }
  ];

  return (
    <div className="space-y-6" data-testid="page-games">
      <BackButton to="/dashboard" />
      
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <i className="fi fi-rr-gamepad text-2xl text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Wellness Games</h1>
        </div>
        <p className="text-muted-foreground">
          Engage in therapeutic games and activities designed to improve mental wellbeing, 
          reduce stress, and enhance cognitive function through play.
        </p>
      </div>

      {/* Pet Care Dashboard Game Section */}
      <div className="bg-gradient-to-r from-rose-400/10 via-violet-400/10 to-blue-400/10 rounded-2xl p-8 border-0 shadow-xl backdrop-blur-sm relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full -translate-y-6 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-200/20 to-pink-200/20 rounded-full translate-y-4 -translate-x-6"></div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-lg">
              <PawPrint className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Pet Care Dashboard</h2>
              <Badge className="bg-gradient-to-r from-rose-400 to-pink-500 text-white border-0 shadow-md mt-2">
                🌟 Most Popular Therapeutic Game
              </Badge>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Experience the joy of caring for a virtual pet while learning valuable life skills. This interactive game 
            combines fun gameplay with therapeutic benefits, helping you develop responsibility, empathy, and mindfulness.
          </p>
        </div>

        {/* Game Preview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">🐕</div>
            <div className="font-semibold text-gray-800">Choose Your Pet</div>
            <div className="text-sm text-gray-600">Dog, Cat, or Rabbit</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-800">Track Progress</div>
            <div className="text-sm text-gray-600">Health & Happiness</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-semibold text-gray-800">Earn Achievements</div>
            <div className="text-sm text-gray-600">Level up & unlock rewards</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">🧠</div>
            <div className="font-semibold text-gray-800">Therapeutic Benefits</div>
            <div className="text-sm text-gray-600">Mindfulness & empathy</div>
          </div>
        </div>

        {/* Therapeutic Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 rounded-xl p-6 text-center shadow-lg border-0 bg-gradient-to-br from-rose-50/80 to-pink-50/80 backdrop-blur-sm">
            <Trophy className="w-8 h-8 text-rose-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Build Responsibility</h3>
            <p className="text-gray-600 text-sm">
              Learn time management and develop consistent care routines through daily pet activities
            </p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 text-center shadow-lg border-0 bg-gradient-to-br from-sky-50/80 to-blue-50/80 backdrop-blur-sm">
            <Target className="w-8 h-8 text-sky-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Develop Empathy</h3>
            <p className="text-gray-600 text-sm">
              Enhance emotional awareness and caregiving skills by responding to your pet's needs
            </p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 text-center shadow-lg border-0 bg-gradient-to-br from-violet-50/80 to-purple-50/80 backdrop-blur-sm">
            <Brain className="w-8 h-8 text-violet-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Practice Mindfulness</h3>
            <p className="text-gray-600 text-sm">
              Stay present and attentive while engaging in calming, therapeutic gameplay
            </p>
          </div>
        </div>

        {/* Game Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl mb-2">🍎</div>
            <div className="font-semibold text-emerald-800">Feed</div>
            <div className="text-xs text-emerald-600">Nutrition & health</div>
          </div>
          <div className="bg-gradient-to-br from-sky-100 to-blue-200 rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl mb-2">💧</div>
            <div className="font-semibold text-sky-800">Hydrate</div>
            <div className="text-xs text-sky-600">Fresh water care</div>
          </div>
          <div className="bg-gradient-to-br from-violet-100 to-purple-200 rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl mb-2">🎮</div>
            <div className="font-semibold text-violet-800">Play</div>
            <div className="text-xs text-violet-600">Fun activities</div>
          </div>
          <div className="bg-gradient-to-br from-rose-100 to-pink-200 rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl mb-2">💤</div>
            <div className="font-semibold text-rose-800">Rest</div>
            <div className="text-xs text-rose-600">Recovery time</div>
          </div>
        </div>

        {/* Play Button */}
        <div className="text-center">
          <Button 
            onClick={() => setLocation('/petcare-game')}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold py-4 px-8 text-lg rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Your Pet Care Journey
            <Sparkles className="w-6 h-6 ml-3" />
          </Button>
          <p className="text-sm text-gray-600 mt-3">
            🎯 Recommended by mental health professionals • 🎮 Play anytime, anywhere • 💝 Completely free
          </p>
        </div>
      </div>

      {/* Inner Gatekeeper Game Section */}
      <div className="bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-blue-500/10 rounded-2xl p-8 border-0 shadow-xl backdrop-blur-sm relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full -translate-y-6 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full translate-y-4 -translate-x-6"></div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
              <Castle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Inner Gatekeeper</h2>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-md mt-2">
                🧠 Mental Health Strategy Game
              </Badge>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Take on the role of a guardian protecting your mind castle from negative thoughts and emotions. 
            Make strategic choices to maintain your mental wellbeing while growing stronger and more resilient.
          </p>
        </div>

        {/* Game Preview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">🏰</div>
            <div className="font-semibold text-gray-800">Protect Castle</div>
            <div className="text-sm text-gray-600">Maintain health & peace</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">⚔️</div>
            <div className="font-semibold text-gray-800">Strategic Choices</div>
            <div className="text-sm text-gray-600">Accept, reject, or challenge</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">🌤️</div>
            <div className="font-semibold text-gray-800">Dynamic Weather</div>
            <div className="text-sm text-gray-600">Reflects your mental state</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold text-gray-800">Track Progress</div>
            <div className="text-sm text-gray-600">Level up & improve skills</div>
          </div>
        </div>

        {/* Therapeutic Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 rounded-xl p-6 text-center shadow-lg border-0 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm">
            <Brain className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Emotional Regulation</h3>
            <p className="text-gray-600 text-sm">
              Learn to identify and manage difficult emotions through strategic gameplay
            </p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 text-center shadow-lg border-0 bg-gradient-to-br from-purple-50/80 to-violet-50/80 backdrop-blur-sm">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Decision Making</h3>
            <p className="text-gray-600 text-sm">
              Practice making healthy choices under pressure in a safe environment
            </p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 text-center shadow-lg border-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
            <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Mental Resilience</h3>
            <p className="text-gray-600 text-sm">
              Build strength to handle life's challenges with wisdom and courage
            </p>
          </div>
        </div>

        {/* Play Button */}
        <div className="text-center">
          <Button 
            onClick={() => setLocation('/inner-gatekeeper')}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <Castle className="w-6 h-6 mr-3" />
            Begin Your Inner Journey
            <Sparkles className="w-6 h-6 ml-3" />
          </Button>
          <p className="text-sm text-gray-600 mt-3">
            🧠 Designed by mental health experts • 🎮 Evidence-based therapy • 🏰 Safe space to practice
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <Card key={game.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 hover:shadow-xl hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300 ${
                    game.id === 1 ? 'bg-gradient-to-br from-sky-400 to-blue-500' :
                    game.id === 2 ? 'bg-gradient-to-br from-emerald-400 to-green-500' :
                    game.id === 3 ? 'bg-gradient-to-br from-violet-400 to-purple-500' :
                    game.id === 4 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                    game.id === 5 ? 'bg-gradient-to-br from-rose-400 to-pink-500' :
                    'bg-gradient-to-br from-indigo-400 to-purple-500'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors font-bold">
                  {game.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {game.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{game.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    <span>{game.time}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    if ((game as any).route) {
                      setLocation((game as any).route);
                    } else {
                      // Placeholder for other games
                      alert(`${game.title} - Coming Soon! This therapeutic game is under development.`);
                    }
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {(game as any).route ? 'Play Now' : 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-sky-400/10 via-violet-400/10 to-blue-400/10 border-0 shadow-lg backdrop-blur-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-4 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-sky-200/20 to-cyan-200/20 rounded-full translate-y-4 -translate-x-6"></div>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full shadow-lg">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Therapeutic Gaming Benefits
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our wellness games are designed by mental health professionals to provide therapeutic benefits 
              while being engaging and fun. Regular play can help improve mood, reduce anxiety, and enhance 
              cognitive abilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <Brain className="w-6 h-6 text-sky-600 mx-auto mb-2" />
                <div className="font-medium text-gray-800">Cognitive Enhancement</div>
                <div className="text-sm text-gray-600">Memory & Focus</div>
              </div>
              <div className="text-center">
                <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="font-medium text-gray-800">Stress Reduction</div>
                <div className="text-sm text-gray-600">Mindful Activities</div>
              </div>
              <div className="text-center">
                <Trophy className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                <div className="font-medium text-gray-800">Achievement</div>
                <div className="text-sm text-gray-600">Progress Tracking</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}