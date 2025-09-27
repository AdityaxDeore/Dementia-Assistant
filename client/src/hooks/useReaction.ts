import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "./use-toast";

interface UseReactionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface ReactionPayload {
  targetType: 'post' | 'comment' | 'journal' | 'resource';
  targetId: string;
  type: 'like' | 'heart' | 'helpful' | 'support' | 'thumbsup';
}

interface ReactionResponse {
  success: boolean;
  reaction?: {
    _id: string;
    userId: string;
    targetType: string;
    targetId: string;
    type: string;
    createdAt: string;
  };
  streak?: {
    currentStreak: number;
    longestStreak: number;
    totalReactions: number;
    newAchievements?: string[];
  };
  message?: string;
}

export function useReaction(options: UseReactionOptions = {}) {
  const queryClient = useQueryClient();

  const addReaction = useMutation<ReactionResponse, Error, ReactionPayload>({
    mutationFn: async (payload) => {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add reaction');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/reaction-streak'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reactions'] });
      
      // Show success toast with streak info
      if (data.streak) {
        if (data.streak.newAchievements && data.streak.newAchievements.length > 0) {
          toast({
            title: `🎉 New Achievement${data.streak.newAchievements.length > 1 ? 's' : ''} Unlocked!`,
            description: data.streak.newAchievements.join(', '),
          });
        } else if (data.streak.currentStreak > 1) {
          const streakMessages = [
            `🔥 ${data.streak.currentStreak} day streak!`,
            `💫 Streak power: ${data.streak.currentStreak} days!`,
            `⚡ ${data.streak.currentStreak} days of engagement!`,
            `🌟 ${data.streak.currentStreak} day reaction streak!`
          ];
          const randomMessage = streakMessages[Math.floor(Math.random() * streakMessages.length)];
          
          toast({
            title: randomMessage,
            description: `Total reactions: ${data.streak.totalReactions}`,
          });
        } else {
          toast({
            title: 'Reaction added! 👍',
            description: 'Keep reacting to build your streak!',
          });
        }
      }
      
      options.onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: 'Failed to add reaction',
        description: error.message,
        variant: 'destructive',
      });
      options.onError?.(error);
    },
  });

  const removeReaction = useMutation<ReactionResponse, Error, ReactionPayload>({
    mutationFn: async (payload) => {
      const response = await fetch('/api/reactions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove reaction');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/reaction-streak'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reactions'] });
      
      options.onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: 'Failed to remove reaction',
        description: error.message,
        variant: 'destructive',
      });
      options.onError?.(error);
    },
  });

  return {
    addReaction: addReaction.mutate,
    removeReaction: removeReaction.mutate,
    isAdding: addReaction.isPending,
    isRemoving: removeReaction.isPending,
    isLoading: addReaction.isPending || removeReaction.isPending,
  };
}

// Hook for checking if user has reacted to specific content
export function useUserReactions(targetType: string, targetId: string) {
  const { data: userReactions, isLoading } = useQuery({
    queryKey: ['/api/reactions', 'user', targetType, targetId],
    queryFn: async () => {
      const response = await fetch(`/api/reactions/user/${targetType}/${targetId}`);
      if (!response.ok) throw new Error('Failed to fetch user reactions');
      return response.json();
    },
  });

  const hasReacted = (type: string) => {
    return Array.isArray(userReactions) && userReactions.some(
      (reaction: any) => reaction.type === type && reaction.targetId === targetId
    );
  };

  return {
    userReactions: userReactions || [],
    hasReacted,
    isLoading,
  };
}

// Hook for getting reaction counts for content
export function useReactionCounts(targetType: string, targetId: string) {
  const { data: reactionCounts, isLoading } = useQuery({
    queryKey: ['/api/reactions', 'counts', targetType, targetId],
    queryFn: async () => {
      const response = await fetch(`/api/reactions/counts/${targetType}/${targetId}`);
      if (!response.ok) throw new Error('Failed to fetch reaction counts');
      return response.json();
    },
  });

  return {
    counts: reactionCounts || {},
    total: Object.values(reactionCounts || {}).reduce((sum: number, count: any) => sum + (count || 0), 0),
    isLoading,
  };
}