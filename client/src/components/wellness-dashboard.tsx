import { Heart, Target, BookOpen, Palette, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function WellnessDashboard() {
  // TODO: remove mock functionality
  const wellnessData = {
    moodStreak: 7,
    journalEntries: 12,
    meditationMinutes: 45,
    goalsCompleted: 3,
    totalGoals: 5,
    weeklyProgress: 71,
    badges: [
      { name: "7-Day Streak", icon: "🔥", earned: true },
      { name: "Mindful Meditator", icon: "🧘", earned: true },
      { name: "Creative Soul", icon: "🎨", earned: false },
      { name: "Goal Crusher", icon: "🎯", earned: false },
    ]
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // TODO: Navigate to appropriate section
  };

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
                <span className="font-medium">{wellnessData.weeklyProgress}%</span>
              </div>
              <Progress value={wellnessData.weeklyProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{wellnessData.moodStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{wellnessData.journalEntries}</div>
                <div className="text-sm text-muted-foreground">Journal Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{wellnessData.meditationMinutes}</div>
                <div className="text-sm text-muted-foreground">Minutes Meditated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted">{wellnessData.goalsCompleted}/{wellnessData.totalGoals}</div>
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
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleQuickAction('mood-checkin')}
              data-testid="button-quick-mood"
            >
              <Heart className="w-6 h-6" />
              <span className="text-sm">Mood Check-In</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleQuickAction('journal')}
              data-testid="button-quick-journal"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">Write Journal</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleQuickAction('meditation')}
              data-testid="button-quick-meditation"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Meditate</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleQuickAction('creative')}
              data-testid="button-quick-creative"
            >
              <Palette className="w-6 h-6" />
              <span className="text-sm">Create Art</span>
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
            {wellnessData.badges.map((badge, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border text-center ${
                  badge.earned 
                    ? 'bg-accent/10 border-accent' 
                    : 'bg-muted/50 border-muted opacity-50'
                }`}
                data-testid={`badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-sm font-medium">{badge.name}</div>
                {badge.earned && (
                  <Badge variant="secondary" className="mt-1 text-xs">
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