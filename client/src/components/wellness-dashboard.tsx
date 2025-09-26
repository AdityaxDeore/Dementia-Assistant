import { Heart, Target, BookOpen, Palette, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function WellnessDashboard() {
  const [, setLocation] = useLocation();

  // Fetch mood data
  const { data: moodData, isLoading: moodLoading } = useQuery({
    queryKey: ['/api/mood/history'],
    queryFn: async () => {
      // Return mock data for now
      return {
        entries: [{ moodValue: 4 }, { moodValue: 3 }, { moodValue: 5 }],
        streak: 3
      };
    }
  });

  // Fetch goals data
  const { data: goalsData, isLoading: goalsLoading } = useQuery({
    queryKey: ['/api/goals'],
    queryFn: async () => {
      // Return mock data for now
      return {
        goals: [
          { id: '1', title: 'Exercise daily', isCompleted: true },
          { id: '2', title: 'Meditate 10 minutes', isCompleted: false },
          { id: '3', title: 'Read a book', isCompleted: true }
        ]
      };
    }
  });

  const isLoading = moodLoading || goalsLoading;

  // Calculate wellness metrics from real data
  const moodStreak = moodData?.streak || 0;
  const goals = goalsData?.goals || [];
  const goalsCompleted = goals.filter((goal: any) => goal.isCompleted).length;
  const totalGoals = goals.length;
  
  // Calculate weekly progress based on recent activity
  const recentMoodEntries = moodData?.entries?.length || 0;
  const goalCompletionRate = totalGoals > 0 ? (goalsCompleted / totalGoals) * 100 : 0;
  const weeklyProgress = Math.round((goalCompletionRate + Math.min(recentMoodEntries * 10, 50)) / 2);

  // Dynamic badge system based on real data
  const badges = [
    { 
      name: "Streak Master", 
      icon: "🔥", 
      earned: moodStreak >= 3,
      description: `${moodStreak >= 3 ? 'Earned' : 'Reach 3-day streak'}`
    },
    { 
      name: "Goal Achiever", 
      icon: "🎯", 
      earned: goalsCompleted >= 1,
      description: `${goalsCompleted >= 1 ? 'Earned' : 'Complete your first goal'}`
    },
    { 
      name: "Consistent Tracker", 
      icon: "📈", 
      earned: recentMoodEntries >= 5,
      description: `${recentMoodEntries >= 5 ? 'Earned' : 'Track mood 5 times'}`
    },
    { 
      name: "Wellness Champion", 
      icon: "🏆", 
      earned: moodStreak >= 7 && goalsCompleted >= 2,
      description: `${moodStreak >= 7 && goalsCompleted >= 2 ? 'Earned' : '7-day streak + 2 goals'}`
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'mood-checkin':
        setLocation('/');
        break;
      case 'journal':
        setLocation('/journal');
        break;
      case 'meditation':
        setLocation('/resources');
        break;
      case 'creative':
        setLocation('/creative');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="wellness-dashboard">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading your wellness data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="wellness-dashboard">
      {/* Weekly Progress Overview - Modern glass card */}
      <Card className="modern-card border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/20">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <span className="text-red-500">Weekly Progress</span>
              <p className="text-xs text-muted-foreground font-normal">Your wellness journey</p>
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
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <div className="text-2xl font-bold text-blue-600">{moodStreak}</div>
                <div className="text-xs text-blue-600/70">Streak</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600">{recentMoodEntries}</div>
                <div className="text-xs text-green-600/70">Entries</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <div className="text-2xl font-bold text-purple-600">{totalGoals}</div>
                <div className="text-xs text-purple-600/70">Goals</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
                <div className="text-2xl font-bold text-emerald-600">{goalsCompleted}/{totalGoals}</div>
                <div className="text-xs text-emerald-600/70">Complete</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Enhanced modern buttons */}
      <Card className="modern-card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="group relative h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              onClick={() => handleQuickAction('mood-checkin')}
              data-testid="button-quick-mood"
              style={{ borderRadius: '16px' }}
            >
              <div className="relative w-full p-4 bg-gradient-to-br from-rose-300 to-pink-400 text-white flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-700" />
                <Heart className="relative z-10 w-6 h-6 text-white icon-interactive group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs font-bold">Mood</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="group relative h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              onClick={() => handleQuickAction('journal')}
              data-testid="button-quick-journal"
              style={{ borderRadius: '16px' }}
            >
              <div className="relative w-full p-4 bg-gradient-to-br from-sky-300 to-blue-400 text-white flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-700" />
                <BookOpen className="relative z-10 w-6 h-6 text-white icon-interactive group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs font-bold">Journal</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="group relative h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              onClick={() => handleQuickAction('meditation')}
              data-testid="button-quick-meditation"
              style={{ borderRadius: '16px' }}
            >
              <div className="relative w-full p-4 bg-gradient-to-br from-violet-300 to-purple-400 text-white flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-700" />
                <Calendar className="relative z-10 w-6 h-6 text-white icon-interactive group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs font-bold">Meditate</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="group relative h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              onClick={() => handleQuickAction('creative')}
              data-testid="button-quick-creative"
              style={{ borderRadius: '16px' }}
            >
              <div className="relative w-full p-4 bg-gradient-to-br from-amber-300 to-orange-400 text-white flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-700" />
                <Palette className="relative z-10 w-6 h-6 text-white icon-interactive group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs font-bold">Create</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements - Enhanced modern badge system */}
      <Card className="modern-card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-400">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-amber-500 dark:text-amber-400">Achievements</span>
              <p className="text-xs text-muted-foreground font-normal">Your progress badges</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 shadow-lg hover:shadow-xl' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 opacity-60 hover:opacity-80'
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
    </div>
  );
}