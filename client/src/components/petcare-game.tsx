import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Droplets, 
  Apple, 
  GamepadIcon, 
  Trophy, 
  Star,
  Clock,
  Target,
  Sparkles,
  PawPrint,
  MessageCircle,
  Send,
  Bone,
  Music,
  Moon
} from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  type: 'cat' | 'dog' | 'rabbit';
  level: number;
  health: number;
  happiness: number;
  hunger: number;
  thirst: number;
  experience: number;
  maxExperience: number;
  mood: 'happy' | 'sad' | 'tired' | 'hungry' | 'playful' | 'sleeping';
  lastFed: number;
  lastPlayed: number;
}

interface Activity {
  id: string;
  name: string;
  icon: any;
  effect: {
    health?: number;
    happiness?: number;
    hunger?: number;
    thirst?: number;
    experience: number;
  };
  cooldown: number;
  description: string;
  color: string;
  animation: 'eating' | 'playing' | 'sleeping' | 'drinking';
}

export const PetCareDashboard: React.FC = () => {
  const [pet, setPet] = useState<Pet>({
    id: '1',
    name: 'Buddy',
    type: 'dog',
    level: 1,
    health: 80,
    happiness: 70,
    hunger: 60,
    thirst: 50,
    experience: 150,
    maxExperience: 200,
    mood: 'happy',
    lastFed: Date.now(),
    lastPlayed: Date.now()
  });

  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'eating' | 'playing' | 'sleeping' | 'drinking'>('idle');
  const [isAnimating, setIsAnimating] = useState(false);

  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [achievements, setAchievements] = useState<string[]>([]);
  const [playTime, setPlayTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: 'user' | 'pet', message: string, timestamp: Date}>>([
    {
      id: '1',
      sender: 'pet',
      message: `Woof! Hi there! I'm ${pet.name} and I'm so happy to meet you! 🐕💕`,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  const activities: Activity[] = [
    {
      id: 'feed',
      name: 'Feed',
      icon: Apple,
      effect: { hunger: 30, health: 5, experience: 10 },
      cooldown: 5000,
      description: 'Give your pet a nutritious meal',
      color: 'text-green-600',
      animation: 'eating'
    },
    {
      id: 'water',
      name: 'Water',
      icon: Droplets,
      effect: { thirst: 40, health: 5, experience: 8 },
      cooldown: 4000,
      description: 'Provide fresh water',
      color: 'text-blue-600',
      animation: 'drinking'
    },
    {
      id: 'play',
      name: 'Play',
      icon: GamepadIcon,
      effect: { happiness: 25, hunger: -10, thirst: -5, experience: 15 },
      cooldown: 8000,
      description: 'Play games and have fun',
      color: 'text-purple-600',
      animation: 'playing'
    },
    {
      id: 'rest',
      name: 'Rest',
      icon: Heart,
      effect: { health: 20, happiness: 10, experience: 5 },
      cooldown: 10000,
      description: 'Let your pet rest and recover',
      color: 'text-red-600',
      animation: 'sleeping'
    }
  ];

  // Auto-decrease stats over time and update mood
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => {
        const newPet = {
          ...prev,
          health: Math.max(0, prev.health - 1),
          happiness: Math.max(0, prev.happiness - 1),
          hunger: Math.max(0, prev.hunger - 2), 
          thirst: Math.max(0, prev.thirst - 1.5)
        };
        
        // Update mood based on stats and time
        let newMood: Pet['mood'] = 'happy';
        const timeSinceLastFed = Date.now() - prev.lastFed;
        const timeSinceLastPlayed = Date.now() - prev.lastPlayed;
        
        if (newPet.hunger < 20) {
          newMood = 'hungry';
        } else if (newPet.health < 30) {
          newMood = 'tired';
        } else if (newPet.happiness < 30) {
          newMood = 'sad';
        } else if (timeSinceLastPlayed > 60000) { // 1 minute
          newMood = 'playful';
        } else if (newPet.health < 50 && Math.random() < 0.3) {
          newMood = 'sleeping';
        }
        
        return { ...newPet, mood: newMood };
      });
      
      setPlayTime(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] -= 100;
          }
        });
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Check for level up
  useEffect(() => {
    if (pet.experience >= pet.maxExperience) {
      const newLevel = pet.level + 1;
      setPet(prev => ({
        ...prev,
        level: newLevel,
        experience: prev.experience - prev.maxExperience,
        maxExperience: Math.floor(prev.maxExperience * 1.2),
        health: Math.min(100, prev.health + 20),
        happiness: Math.min(100, prev.happiness + 15)
      }));

      // Add achievement
      if (!achievements.includes(`level_${newLevel}`)) {
        setAchievements(prev => [...prev, `level_${newLevel}`]);
      }
    }
  }, [pet.experience, pet.maxExperience, pet.level, achievements]);

  // Pet chat responses based on stats and activities
  const getPetResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Contextual responses based on pet stats
    if (pet.hunger < 30) {
      return "Woof woof! I'm getting really hungry... could you feed me please? 🍖😋";
    }
    if (pet.thirst < 30) {
      return "Pant pant... I'm so thirsty! Could I have some fresh water? 💧🐕";
    }
    if (pet.health < 40) {
      return "I'm not feeling too well... maybe I need some rest and care? 😴💚";
    }
    if (pet.happiness < 40) {
      return "I'm feeling a bit sad today... want to play with me to cheer me up? 🎮😊";
    }
    
    // Responses to specific keywords
    if (message.includes('play') || message.includes('game')) {
      return "Yes! I love to play! Let's have some fun together! 🎮🐕💕";
    }
    if (message.includes('hungry') || message.includes('food') || message.includes('eat')) {
      return "Woof! Food sounds amazing right now! I love treats! 🍖😋";
    }
    if (message.includes('water') || message.includes('drink') || message.includes('thirsty')) {
      return "Fresh water is the best! Glug glug glug! 💧😊";
    }
    if (message.includes('good') || message.includes('love') || message.includes('cute')) {
      return "Aww, you're the best! I love you too! You take such good care of me! 💕🐕";
    }
    if (message.includes('tired') || message.includes('sleep') || message.includes('rest')) {
      return "A good nap sounds perfect right now... zzz... 😴💤";
    }
    if (message.includes('happy') || message.includes('joy')) {
      return "I'm so happy when we're together! You make me feel loved! 😊🎉";
    }
    if (message.includes('sick') || message.includes('hurt') || message.includes('pain')) {
      return "Don't worry about me! With your love and care, I'll feel better soon! 💚🐕";
    }
    
    // General friendly responses
    const generalResponses = [
      "Woof woof! I'm so happy you're talking to me! 🐕💕",
      "You're the best pet parent ever! Thank you for taking care of me! 😊🎉",
      "I love spending time with you! What should we do next? 🎮💚",
      "Being with you makes me so happy! Tail wagging intensifies! 🐕💕",
      "You always know just what to say! I'm lucky to have you! 😊🌟",
      "Every day with you is an adventure! What fun thing should we do? 🎯💫",
      "I can tell you care about me so much! That makes me feel safe and loved! 💕🏠"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  // Send chat message
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user' as const,
      message: currentMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    
    // Generate pet response after a short delay
    setTimeout(() => {
      const petResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'pet' as const,
        message: getPetResponse(currentMessage),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, petResponse]);
    }, 1000);
    
    setCurrentMessage('');
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const performActivity = (activity: Activity) => {
    if (cooldowns[activity.id] && cooldowns[activity.id] > 0) return;

    // Trigger animation
    setCurrentAnimation(activity.animation);
    setIsAnimating(true);

    // Update pet stats
    setPet(prev => ({
      ...prev,
      health: Math.min(100, prev.health + (activity.effect.health || 0)),
      happiness: Math.min(100, prev.happiness + (activity.effect.happiness || 0)),
      hunger: Math.min(100, prev.hunger + (activity.effect.hunger || 0)),
      thirst: Math.min(100, prev.thirst + (activity.effect.thirst || 0)),
      experience: prev.experience + activity.effect.experience,
      lastFed: activity.id === 'feed' ? Date.now() : prev.lastFed,
      lastPlayed: activity.id === 'play' ? Date.now() : prev.lastPlayed
    }));

    setCooldowns(prev => ({
      ...prev,
      [activity.id]: activity.cooldown
    }));

    // Reset animation after 3 seconds
    setTimeout(() => {
      setCurrentAnimation('idle');
      setIsAnimating(false);
    }, 3000);
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPetEmoji = () => {
    if (pet.happiness >= 80) return '😊';
    if (pet.happiness >= 60) return '🙂';
    if (pet.happiness >= 40) return '😐';
    if (pet.happiness >= 20) return '😔';
    return '😢';
  };

  // Animated Dog Component
  const AnimatedDog = () => {
    const getDogState = () => {
      if (pet.health < 30) return { emoji: '🐕‍🦺', animation: 'tired', color: 'text-red-500' };
      if (pet.hunger < 20) return { emoji: '🐕', animation: 'hungry', color: 'text-orange-500' };
      if (pet.happiness < 30) return { emoji: '🐕', animation: 'sad', color: 'text-gray-500' };
      if (currentAnimation === 'eating') return { emoji: '🍖', animation: 'eating', color: 'text-green-500' };
      if (currentAnimation === 'drinking') return { emoji: '💧', animation: 'drinking', color: 'text-blue-500' };
      if (currentAnimation === 'playing') return { emoji: '🎾', animation: 'playing', color: 'text-purple-500' };
      if (currentAnimation === 'sleeping') return { emoji: '😴', animation: 'sleeping', color: 'text-indigo-500' };
      if (pet.happiness >= 80) return { emoji: '🐕', animation: 'happy', color: 'text-green-500' };
      return { emoji: '🐕', animation: 'idle', color: 'text-blue-500' };
    };

    const dogState = getDogState();

    return (
      <div className="relative flex items-center justify-center p-8">
        {/* Background effects based on mood */}
        <div className={`absolute inset-0 rounded-full ${
          pet.health < 30 ? 'bg-red-100 animate-pulse' :
          pet.hunger < 20 ? 'bg-orange-100 animate-bounce' :
          pet.happiness < 30 ? 'bg-gray-100' :
          currentAnimation === 'playing' ? 'bg-purple-100 animate-spin' :
          'bg-blue-100'
        } opacity-30`} style={{animationDuration: currentAnimation === 'playing' ? '2s' : '3s'}} />
        
        {/* Main dog */}
        <div className={`relative z-10 transition-all duration-500 ${
          currentAnimation === 'eating' ? 'animate-bounce' :
          currentAnimation === 'drinking' ? 'animate-pulse' :
          currentAnimation === 'playing' ? 'animate-spin' :
          currentAnimation === 'sleeping' ? 'opacity-70' :
          pet.health < 30 ? 'animate-pulse opacity-50' :
          pet.hunger < 20 ? 'animate-bounce' :
          'animate-pulse'
        }`} style={{animationDuration: 
          currentAnimation === 'eating' ? '0.5s' :
          currentAnimation === 'drinking' ? '1s' :
          currentAnimation === 'playing' ? '1s' :
          '3s'
        }}>
          <div className="text-8xl mb-2">{dogState.emoji}</div>
          
          {/* Activity indicators */}
          {currentAnimation === 'eating' && (
            <div className="absolute -top-2 -right-2 animate-bounce">
              <div className="text-2xl">🍖</div>
            </div>
          )}
          {currentAnimation === 'drinking' && (
            <div className="absolute -top-2 -right-2 animate-pulse">
              <div className="text-2xl">💧</div>
            </div>
          )}
          {currentAnimation === 'playing' && (
            <div className="absolute -top-2 -right-2 animate-spin">
              <div className="text-2xl">🎾</div>
            </div>
          )}
          {currentAnimation === 'sleeping' && (
            <div className="absolute -top-2 -right-2 animate-pulse">
              <div className="text-2xl">💤</div>
            </div>
          )}
        </div>
        
        {/* Status indicators */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          {pet.health < 30 && (
            <Badge className="bg-red-100 text-red-800 animate-pulse">Needs Rest</Badge>
          )}
          {pet.hunger < 20 && (
            <Badge className="bg-orange-100 text-orange-800 animate-bounce">Very Hungry</Badge>
          )}
          {pet.happiness < 30 && (
            <Badge className="bg-gray-100 text-gray-800">Feeling Sad</Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <PawPrint className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Pet Care Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Take care of your virtual pet to practice responsibility and mindfulness
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Play Time: {Math.floor(playTime / 20)}min</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>Achievements: {achievements.length}</span>
          </div>
        </div>
      </div>

      {/* Pet Status with Animated Dog */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="text-center pb-4">
          <AnimatedDog />
          <CardTitle className="text-2xl text-gray-800">
            {pet.name} - Level {pet.level}
          </CardTitle>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-white/50">
              {pet.experience}/{pet.maxExperience} XP
            </Badge>
            <Badge className={`${
              pet.mood === 'happy' ? 'bg-green-100 text-green-800' :
              pet.mood === 'sad' ? 'bg-gray-100 text-gray-800' :
              pet.mood === 'tired' ? 'bg-red-100 text-red-800' :
              pet.mood === 'hungry' ? 'bg-orange-100 text-orange-800' :
              pet.mood === 'playful' ? 'bg-purple-100 text-purple-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {pet.mood.charAt(0).toUpperCase() + pet.mood.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(pet.experience / pet.maxExperience) * 100} className="h-3" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-1">
                <Heart className={`w-5 h-5 ${getStatColor(pet.health)}`} />
                <span className="font-semibold">Health</span>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${getStatColor(pet.health)}`}>
                  {pet.health}%
                </div>
                <Progress value={pet.health} className="h-2" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-1">
                <Sparkles className={`w-5 h-5 ${getStatColor(pet.happiness)}`} />
                <span className="font-semibold">Happiness</span>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${getStatColor(pet.happiness)}`}>
                  {pet.happiness}%
                </div>
                <Progress value={pet.happiness} className="h-2" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-1">
                <Apple className={`w-5 h-5 ${getStatColor(pet.hunger)}`} />
                <span className="font-semibold">Hunger</span>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${getStatColor(pet.hunger)}`}>
                  {pet.hunger}%
                </div>
                <Progress value={pet.hunger} className="h-2" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-1">
                <Droplets className={`w-5 h-5 ${getStatColor(pet.thirst)}`} />
                <span className="font-semibold">Thirst</span>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${getStatColor(pet.thirst)}`}>
                  {pet.thirst}%
                </div>
                <Progress value={pet.thirst} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Pet Care Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              const isOnCooldown = !!(cooldowns[activity.id] && cooldowns[activity.id] > 0);
              const cooldownPercent = isOnCooldown ? (cooldowns[activity.id] / activity.cooldown) * 100 : 0;

              return (
                <Button
                  key={activity.id}
                  onClick={() => performActivity(activity)}
                  disabled={isOnCooldown}
                  variant={isOnCooldown ? "outline" : "default"}
                  className={`h-auto p-4 flex flex-col gap-2 ${!isOnCooldown ? 'hover:scale-105' : ''} transition-all duration-200`}
                >
                  <IconComponent className={`w-6 h-6 ${activity.color}`} />
                  <span className="font-semibold">{activity.name}</span>
                  <span className="text-xs text-gray-500 text-center leading-tight">
                    {activity.description}
                  </span>
                  {isOnCooldown && (
                    <Progress value={100 - cooldownPercent} className="h-1 mt-1" />
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Achievements Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <Badge key={achievement} className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <Star className="w-3 h-3 mr-1" />
                  {achievement.replace('_', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pet Chat */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            Chat with {pet.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto bg-white/70 rounded-lg p-4 space-y-3 border border-purple-100">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white border border-purple-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">
                    {msg.sender === 'user' ? 'You' : pet.name}
                  </div>
                  <div className="text-sm leading-relaxed">{msg.message}</div>
                  <div className={`text-xs mt-1 opacity-70`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Talk to ${pet.name}...`}
              className="flex-1 bg-white/70 border-purple-200 focus:border-purple-400"
            />
            <Button
              onClick={sendMessage}
              disabled={!currentMessage.trim()}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Tips */}
          <div className="text-xs text-gray-600 bg-white/50 p-3 rounded-lg border border-purple-100">
            💡 <strong>Chat Tips:</strong> Ask {pet.name} how they're feeling, tell them about your day, or just say hi! 
            Your pet will respond based on their current needs and mood. Try words like "play", "hungry", "happy", or "love"!
          </div>
        </CardContent>
      </Card>

      {/* Game Benefits */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Therapeutic Benefits of Pet Care
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong className="text-green-600">Responsibility:</strong> Learn time management and consistent care routines
            </div>
            <div>
              <strong className="text-blue-600">Empathy:</strong> Develop emotional awareness and caregiving skills
            </div>
            <div>
              <strong className="text-purple-600">Mindfulness:</strong> Practice being present and attentive to needs
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};