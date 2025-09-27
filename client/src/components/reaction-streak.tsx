"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  Heart, 
  ThumbsUp, 
  HandHeart, 
  Star, 
  Award, 
  Target,
  TrendingUp,
  Zap,
  Trophy,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReactionStreak {
  _id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastReactionDate: string;
  totalReactions: number;
  reactionsByType: {
    like: number;
    heart: number;
    helpful: number;
    support: number;
    thumbsup: number;
  };
  weeklyReactions: number;
  monthlyReactions: number;
  achievements: {
    firstReaction: boolean;
    streak3Days: boolean;
    streak7Days: boolean;
    streak30Days: boolean;
    streak100Days: boolean;
    socialButterflyWeekly: boolean;
    helpfulMember: boolean;
    supportiveUser: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface ReactionStreakProps {
  userId?: string;
  className?: string;
  compact?: boolean;
}

export function ReactionStreak({ userId, className, compact = false }: ReactionStreakProps) {
  const queryClient = useQueryClient();

  // Fetch reaction streak data
  const { data: streakData, isLoading, error } = useQuery<ReactionStreak>({
    queryKey: ['/api/reaction-streak', userId],
    queryFn: async () => {
      const response = await fetch(`/api/reaction-streak${userId ? `?userId=${userId}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reaction streak');
      }
      return response.json();
    }
  });

  // Calculate streak status
  const isStreakActive = () => {
    if (!streakData?.lastReactionDate) return false;
    const lastReaction = new Date(streakData.lastReactionDate);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastReaction.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 48; // Streak is active if last reaction was within 48 hours
  };

  // Calculate progress to next milestone
  const getNextMilestone = () => {
    const streak = streakData?.currentStreak || 0;
    if (streak < 3) return { target: 3, label: "First Milestone" };
    if (streak < 7) return { target: 7, label: "Weekly Warrior" };
    if (streak < 30) return { target: 30, label: "Monthly Master" };
    if (streak < 100) return { target: 100, label: "Streak Legend" };
    return { target: streak + 50, label: "Keep Going!" };
  };

  const nextMilestone = getNextMilestone();
  const progress = streakData ? (streakData.currentStreak / nextMilestone.target) * 100 : 0;

  // Achievement badges configuration
  const achievementBadges = [
    {
      key: 'firstReaction',
      name: 'First Step',
      icon: Star,
      description: 'Made your first reaction',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      key: 'streak3Days',
      name: '3-Day Starter',
      icon: Flame,
      description: '3 consecutive days of reactions',
      color: 'from-orange-400 to-red-500'
    },
    {
      key: 'streak7Days',
      name: 'Weekly Warrior',
      icon: Trophy,
      description: '7 consecutive days of reactions',
      color: 'from-purple-400 to-pink-500'
    },
    {
      key: 'streak30Days',
      name: 'Monthly Master',
      icon: Award,
      description: '30 consecutive days of reactions',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      key: 'streak100Days',
      name: 'Streak Legend',
      icon: Zap,
      description: '100 consecutive days of reactions',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      key: 'socialButterflyWeekly',
      name: 'Social Butterfly',
      icon: Heart,
      description: '50+ reactions in a week',
      color: 'from-rose-400 to-pink-500'
    },
    {
      key: 'helpfulMember',
      name: 'Helpful Soul',
      icon: HandHeart,
      description: '100+ helpful reactions',
      color: 'from-green-400 to-emerald-500'
    },
    {
      key: 'supportiveUser',
      name: 'Support Champion',
      icon: ThumbsUp,
      description: '100+ support reactions',
      color: 'from-cyan-400 to-blue-500'
    }
  ];

  if (isLoading) {
    return (
      <Card className={cn("border-0 shadow-lg", className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading streak data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !streakData) {
    return (
      <Card className={cn("border-0 shadow-lg", className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No streak data available. Start reacting to posts to build your streak!
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30", className)}>
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400 to-red-500">
          <Flame className={cn("w-5 h-5 text-white", isStreakActive() && "animate-pulse")} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-orange-600">{streakData.currentStreak}</span>
            <span className="text-sm text-orange-600/70">day streak</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {streakData.totalReactions} total reactions
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-400 to-red-500">
            <Flame className={cn("w-6 h-6 text-white", isStreakActive() && "animate-pulse")} />
          </div>
          <div>
            <span className="text-orange-500">Reaction Streak</span>
            <p className="text-xs text-muted-foreground font-normal">Your engagement journey</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Streak Display */}
        <div className="text-center space-y-2">
          <div className="relative">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">
              {streakData.currentStreak === 1 ? 'day streak' : 'days streak'}
            </div>
            {isStreakActive() && (
              <div className="absolute -top-2 -right-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="font-medium text-blue-600">{streakData.longestStreak}</div>
              <div className="text-xs">Best</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-600">{streakData.weeklyReactions}</div>
              <div className="text-xs">This Week</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-purple-600">{streakData.totalReactions}</div>
              <div className="text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Next: {nextMilestone.label}</span>
            <span className="text-sm text-muted-foreground">
              {streakData.currentStreak}/{nextMilestone.target}
            </span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
        </div>

        {/* Reaction Types Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Reaction Breakdown</h4>
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <div className="text-xs font-medium">{streakData.reactionsByType.heart}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <ThumbsUp className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <div className="text-xs font-medium">{streakData.reactionsByType.thumbsup}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <HandHeart className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <div className="text-xs font-medium">{streakData.reactionsByType.helpful}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Star className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <div className="text-xs font-medium">{streakData.reactionsByType.support}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Zap className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
              <div className="text-xs font-medium">{streakData.reactionsByType.like}</div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Achievements</h4>
          <div className="grid grid-cols-2 gap-3">
            {achievementBadges.map((badge) => {
              const isEarned = streakData.achievements[badge.key as keyof typeof streakData.achievements];
              const IconComponent = badge.icon;
              
              return (
                <div
                  key={badge.key}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-300",
                    isEarned
                      ? `bg-gradient-to-br ${badge.color} text-white shadow-lg`
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs font-medium">{badge.name}</span>
                  </div>
                  <div className="text-xs opacity-90">
                    {badge.description}
                  </div>
                  {isEarned && (
                    <Badge className="mt-2 text-xs bg-white/20 text-white border-white/30">
                      ✨ Earned
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">
            {streakData.currentStreak === 0 
              ? "Ready to start your reaction streak? 🚀"
              : isStreakActive()
              ? "Keep the streak alive! 🔥"
              : "Your streak needs attention! React to something today 💫"
            }
          </div>
          {!isStreakActive() && streakData.currentStreak > 0 && (
            <div className="text-xs text-orange-600">
              ⚠️ Streak at risk! React within the next {
                48 - Math.floor((new Date().getTime() - new Date(streakData.lastReactionDate).getTime()) / (1000 * 60 * 60))
              } hours to keep it going.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}