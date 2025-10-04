import { Brain, Target, BookOpen, Palette, Calendar, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ReactionStreak } from "@/components/reaction-streak";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function CareDashboard() {
  const [, setLocation] = useLocation();

  // Fetch reaction streak data
  const { data: reactionStreakData } = useQuery({
    queryKey: ['/api/reaction-streak'],
    queryFn: async () => {
      // Return mock data for now
      return {
        currentStreak: 5,
        longestStreak: 12,
        totalReactions: 147,
        weeklyReactions: 23,
        achievements: {
          firstReaction: true,
          streak3Days: true,
          streak7Days: false,
        }
      };
    }
  });

  // Fetch cognitive data
  const { data: cognitiveData, isLoading: cognitiveLoading } = useQuery({
    queryKey: ['/api/cognitive/history'],
    queryFn: async () => {
      // Return mock data for now
      return {
        entries: [{ cognitiveValue: 4 }, { cognitiveValue: 3 }, { cognitiveValue: 5 }],
        streak: 3
      };
    }
  });

  // Fetch care routines data
  const { data: routinesData, isLoading: routinesLoading } = useQuery({
    queryKey: ['/api/care-routines'],
    queryFn: async () => {
      // Return mock data for now
      return {
        routines: [
          { id: '1', title: 'Morning memory exercises', isCompleted: true },
          { id: '2', title: 'Afternoon cognitive activities', isCompleted: false },
          { id: '3', title: 'Evening relaxation', isCompleted: true }
        ]
      };
    }
  });

  const isLoading = cognitiveLoading || routinesLoading;

  // Calculate care metrics from real data
  const cognitiveStreak = cognitiveData?.streak || 0;
  const reactionStreak = reactionStreakData?.currentStreak || 0;
  const routines = routinesData?.routines || [];
  const routinesCompleted = routines.filter((routine: any) => routine.isCompleted).length;
  const totalRoutines = routines.length;
  
  // Calculate weekly progress based on recent activity
  const recentCognitiveEntries = cognitiveData?.entries?.length || 0;
  const routineCompletionRate = totalRoutines > 0 ? (routinesCompleted / totalRoutines) * 100 : 0;
  const reactionActivity = reactionStreakData?.weeklyReactions || 0;
  const weeklyProgress = Math.round((routineCompletionRate + Math.min(recentCognitiveEntries * 10, 50) + Math.min(reactionActivity * 2, 30)) / 3);

  // Dynamic badge system based on real data for dementia care
  const badges = [
    { 
      name: "Cognitive Streak", 
      icon: "🧠", 
      earned: cognitiveStreak >= 3,
      description: `${cognitiveStreak >= 3 ? 'Earned' : 'Reach 3-day cognitive tracking streak'}`
    },
    { 
      name: "Memory Champion", 
      icon: "⚡", 
      earned: reactionStreak >= 3,
      description: `${reactionStreak >= 3 ? 'Earned' : 'Complete memory activities for 3 days'}`
    },
    { 
      name: "Care Routine Master", 
      icon: "🎯", 
      earned: routinesCompleted >= 1,
      description: `${routinesCompleted >= 1 ? 'Earned' : 'Complete your first care routine'}`
    },
    { 
      name: "Consistent Tracker", 
      icon: "📈", 
      earned: recentCognitiveEntries >= 5,
      description: `${recentCognitiveEntries >= 5 ? 'Earned' : 'Track cognitive state 5 times'}`
    },
    { 
      name: "Social Engagement", 
      icon: "🤝", 
      earned: reactionActivity >= 20,
      description: `${reactionActivity >= 20 ? 'Earned' : '20+ social interactions this week'}`
    },
    { 
      name: "Care Champion", 
      icon: "🏆", 
      earned: cognitiveStreak >= 7 && routinesCompleted >= 2 && reactionStreak >= 5,
      description: `${cognitiveStreak >= 7 && routinesCompleted >= 2 && reactionStreak >= 5 ? 'Earned' : 'Master all care areas'}`
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'cognitive-checkin':
        setLocation('/');
        break;
      case 'memory-journal':
        setLocation('/diary');
        break;
      case 'cognitive-activities':
        setLocation('/resources');
        break;
      case 'memory-games':
        setLocation('/petcare-game');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="care-dashboard">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading your care data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="care-dashboard">
      {/* Weekly Progress Overview - Modern glass card */}
      <Card className="modern-card border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/20">
              <Brain className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <span className="text-blue-500">Weekly Care Progress</span>
              <p className="text-xs text-muted-foreground font-normal">Your cognitive wellness journey</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-lg font-bold text-primary">{weeklyProgress}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-3 rounded-full" />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <div className="text-2xl font-bold text-blue-600">{cognitiveStreak}</div>
                <div className="text-xs text-blue-600/70">Cognitive Streak</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-orange-100 dark:bg-orange-900/20">
                <div className="text-2xl font-bold text-orange-600">{reactionStreak}</div>
                <div className="text-xs text-orange-600/70">Activity Streak</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600">{recentCognitiveEntries}</div>
                <div className="text-xs text-green-600/70">Check-ins</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <div className="text-2xl font-bold text-purple-600">{totalRoutines}</div>
                <div className="text-xs text-purple-600/70">Care Routines</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
                <div className="text-2xl font-bold text-emerald-600">{routinesCompleted}/{totalRoutines}</div>
                <div className="text-xs text-emerald-600/70">Complete</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Enhanced modern buttons */}
      <Card className="modern-card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Quick Care Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="group relative h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              onClick={() => handleQuickAction('cognitive-checkin')}
              data-testid="button-quick-cognitive"
              style={{ borderRadius: '16px' }}
            >
              <div className="relative w-full p-4 bg-blue-400 text-white flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-700" />
                <Brain className="relative z-10 w-6 h-6 text-white icon-interactive group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs font-bold">Cognitive</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="group relative h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              onClick={() => handleQuickAction('memory-journal')}
              data-testid="button-quick-journal"
              style={{ borderRadius: '16px' }}
            >
              <div className="relative w-full p-4 bg-green-400 text-white flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-700" />
                <BookOpen className="relative z-10 w-6 h-6 text-white icon-interactive group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs font-bold">Memory Journal</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="group relative h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              onClick={() => handleQuickAction('cognitive-activities')}
              data-testid="button-quick-activities"
              style={{ borderRadius: '16px' }}
            >
              <div className="relative w-full p-4 bg-purple-400 text-white flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-700" />
                <Calendar className="relative z-10 w-6 h-6 text-white icon-interactive group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs font-bold">Activities</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="group relative h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              onClick={() => handleQuickAction('memory-games')}
              data-testid="button-quick-games"
              style={{ borderRadius: '16px' }}
            >
              <div className="relative w-full p-4 bg-orange-400 text-white flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-700" />
                <Palette className="relative z-10 w-6 h-6 text-white icon-interactive group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs font-bold">Memory Games</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements - Enhanced modern badge system */}
      <Card className="modern-card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-3 rounded-2xl bg-amber-400">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-amber-500 dark:text-amber-400">Care Achievements</span>
              <p className="text-xs text-muted-foreground font-normal">Your cognitive wellness badges</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer ${
                  badge.earned 
                    ? 'bg-green-100 dark:bg-green-900/30 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-100 dark:bg-gray-800 opacity-60 hover:opacity-80'
                }`}
                style={{ borderRadius: '16px', padding: '1rem' }}
                data-testid={`badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {badge.earned && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/20 rounded-full -translate-y-4 translate-x-4 group-hover:scale-150 transition-transform duration-700" />
                )}
                <div className="relative z-10 text-center space-y-3">
                  <div className="text-4xl transition-transform duration-300 group-hover:scale-125">{badge.icon}</div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold">{badge.name}</div>
                    {badge.earned && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-3 py-1 bg-emerald-500 text-white border-0 font-semibold"
                        style={{ borderRadius: '12px' }}
                      >
                        ✨ Earned
                      </Badge>
                    )}
                  </div>
                </div>
                {badge.earned && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reaction Streak Details */}
      <ReactionStreak className="col-span-full" />
    </div>
  );
}