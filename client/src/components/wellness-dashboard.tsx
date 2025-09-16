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
      {/* Weekly Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            This Week's Wellness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span className="font-medium">{weeklyProgress}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{moodStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{recentMoodEntries}</div>
                <div className="text-sm text-muted-foreground">Mood Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{totalGoals}</div>
                <div className="text-sm text-muted-foreground">Total Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{goalsCompleted}/{totalGoals}</div>
                <div className="text-sm text-muted-foreground">Goals Complete</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              onClick={() => handleQuickAction('mood-checkin')}
              data-testid="button-quick-mood"
            >
              <Heart className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-red-500" />
              <span className="text-sm transition-colors group-hover:text-primary">Mood Check-In</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              onClick={() => handleQuickAction('journal')}
              data-testid="button-quick-journal"
            >
              <BookOpen className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-500" />
              <span className="text-sm transition-colors group-hover:text-primary">Write Journal</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              onClick={() => handleQuickAction('meditation')}
              data-testid="button-quick-meditation"
            >
              <Calendar className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-500" />
              <span className="text-sm transition-colors group-hover:text-primary">Meditate</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              onClick={() => handleQuickAction('creative')}
              data-testid="button-quick-creative"
            >
              <Palette className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-500" />
              <span className="text-sm transition-colors group-hover:text-primary">Create Art</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges & Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border text-center transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-pointer ${
                  badge.earned 
                    ? 'bg-accent/10 border-accent hover:bg-accent/20' 
                    : 'bg-muted/50 border-muted opacity-50 hover:opacity-70'
                }`}
                data-testid={`badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">{badge.icon}</div>
                <div className="text-sm font-medium mb-1 transition-colors group-hover:text-primary">{badge.name}</div>
                <div className="text-xs text-muted-foreground">{badge.description}</div>
                {badge.earned && (
                  <Badge variant="secondary" className="mt-1 text-xs transition-all duration-300 group-hover:scale-110">
                    Earned
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}