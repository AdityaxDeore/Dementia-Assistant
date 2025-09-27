import { ReactionStreak } from "@/components/reaction-streak";
import { MultiReaction } from "@/components/reaction-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Trophy, Star } from "lucide-react";

export function ReactionStreakDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Flame className="w-8 h-8 text-orange-500" />
          Reaction Streak System
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Build your engagement streak by reacting to posts, comments, and content!
          Each reaction counts towards your daily streak and unlocks achievements.
        </p>
      </div>

      {/* Reaction Streak Display */}
      <ReactionStreak className="mb-8" />

      {/* Demo Posts with Reactions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Try Reacting to These Posts!</h2>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Sample Mental Health Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              "Remember: Progress isn't always linear. It's okay to have difficult days. 
              What matters is that you keep moving forward, one step at a time. 💙"
            </p>
            <div className="flex items-center justify-between pt-4 border-t">
              <MultiReaction 
                targetType="post"
                targetId="demo-post-1"
                variant="compact"
                showStreak={true}
              />
              <div className="text-sm text-muted-foreground">
                React to build your streak! 🔥
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Wellness Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              "5-minute breathing exercise: Inhale for 4 counts, hold for 4, exhale for 6. 
              Repeat 5 times. Perfect for reducing anxiety and finding calm. ✨"
            </p>
            <div className="flex items-center justify-between pt-4 border-t">
              <MultiReaction 
                targetType="post"
                targetId="demo-post-2"
                variant="compact"
                showStreak={true}
              />
              <div className="text-sm text-muted-foreground">
                Show some love for helpful content! 💫
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Study Motivation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              "Just finished my final exams! The key was breaking down each subject into 
              manageable chunks and celebrating small wins along the way. You've got this! 🎯"
            </p>
            <div className="flex items-center justify-between pt-4 border-t">
              <MultiReaction 
                targetType="post"
                targetId="demo-post-3"
                variant="compact"
                showStreak={true}
              />
              <div className="text-sm text-muted-foreground">
                Support fellow students! 🚀
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Preview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-orange-600">
            <Trophy className="w-6 h-6" />
            Streak Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold">First Step</h4>
              <p className="text-sm text-muted-foreground">Make your first reaction</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-semibold">3-Day Starter</h4>
              <p className="text-sm text-muted-foreground">React for 3 consecutive days</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold">Weekly Warrior</h4>
              <p className="text-sm text-muted-foreground">Maintain a 7-day streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}