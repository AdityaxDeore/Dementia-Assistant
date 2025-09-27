"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  ThumbsUp, 
  HandHeart, 
  Star, 
  Zap,
  Flame
} from "lucide-react";
import { useReaction, useUserReactions, useReactionCounts } from "@/hooks/useReaction";

interface ReactionButtonProps {
  targetType: 'post' | 'comment' | 'journal' | 'resource';
  targetId: string;
  type: 'like' | 'heart' | 'helpful' | 'support' | 'thumbsup';
  variant?: 'default' | 'compact' | 'minimal';
  showCount?: boolean;
  showStreak?: boolean;
  className?: string;
  onReaction?: (type: string, added: boolean) => void;
}

const reactionConfig = {
  like: {
    icon: Zap,
    label: 'Like',
    color: 'text-yellow-500',
    hoverColor: 'hover:text-yellow-600',
    activeColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    activeBgColor: 'bg-yellow-100 dark:bg-yellow-900/40',
    gradient: 'from-yellow-400 to-amber-500'
  },
  heart: {
    icon: Heart,
    label: 'Love',
    color: 'text-rose-500',
    hoverColor: 'hover:text-rose-600',
    activeColor: 'text-rose-600',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    activeBgColor: 'bg-rose-100 dark:bg-rose-900/40',
    gradient: 'from-rose-400 to-pink-500'
  },
  helpful: {
    icon: HandHeart,
    label: 'Helpful',
    color: 'text-green-500',
    hoverColor: 'hover:text-green-600',
    activeColor: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    activeBgColor: 'bg-green-100 dark:bg-green-900/40',
    gradient: 'from-green-400 to-emerald-500'
  },
  support: {
    icon: Star,
    label: 'Support',
    color: 'text-purple-500',
    hoverColor: 'hover:text-purple-600',
    activeColor: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    activeBgColor: 'bg-purple-100 dark:bg-purple-900/40',
    gradient: 'from-purple-400 to-violet-500'
  },
  thumbsup: {
    icon: ThumbsUp,
    label: 'Thumbs Up',
    color: 'text-blue-500',
    hoverColor: 'hover:text-blue-600',
    activeColor: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    activeBgColor: 'bg-blue-100 dark:bg-blue-900/40',
    gradient: 'from-blue-400 to-indigo-500'
  }
};

export function ReactionButton({
  targetType,
  targetId,
  type,
  variant = 'default',
  showCount = true,
  showStreak = false,
  className,
  onReaction
}: ReactionButtonProps) {
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  
  const { addReaction, removeReaction, isLoading } = useReaction({
    onSuccess: () => {
      if (showStreak) {
        setShowStreakAnimation(true);
        setTimeout(() => setShowStreakAnimation(false), 2000);
      }
    }
  });
  
  const { hasReacted } = useUserReactions(targetType, targetId);
  const { counts } = useReactionCounts(targetType, targetId);
  
  const config = reactionConfig[type];
  const IconComponent = config.icon;
  const isReacted = hasReacted(type);
  const count = counts[type] || 0;

  const handleClick = () => {
    if (isLoading) return;
    
    if (isReacted) {
      removeReaction({ targetType, targetId, type });
      onReaction?.(type, false);
    } else {
      addReaction({ targetType, targetId, type });
      onReaction?.(type, true);
    }
  };

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "h-8 px-2 transition-all duration-300 group",
          isReacted ? config.activeColor : config.color,
          config.hoverColor,
          className
        )}
      >
        <IconComponent 
          className={cn(
            "w-4 h-4 transition-all duration-300",
            isReacted && "fill-current scale-110",
            isLoading && "animate-pulse"
          )} 
        />
        {showCount && count > 0 && (
          <span className="ml-1 text-xs font-medium">{count}</span>
        )}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          disabled={isLoading}
          className={cn(
            "h-9 px-3 rounded-full transition-all duration-300 group",
            isReacted 
              ? `${config.activeBgColor} ${config.activeColor}` 
              : `${config.bgColor} ${config.color}`,
            config.hoverColor,
            "hover:scale-105 active:scale-95",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <IconComponent 
              className={cn(
                "w-4 h-4 transition-all duration-300",
                isReacted && "fill-current scale-110",
                isLoading && "animate-pulse"
              )} 
            />
            {showCount && (
              <span className="text-sm font-medium">{count}</span>
            )}
          </div>
        </Button>
        
        {showStreak && showStreakAnimation && (
          <div className="absolute -top-2 -right-2 animate-bounce">
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs rounded-full shadow-lg">
              <Flame className="w-3 h-3" />
              <span>+1</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500",
          isReacted 
            ? `bg-gradient-to-r ${config.gradient} text-white hover:scale-105` 
            : `${config.bgColor} ${config.color} hover:scale-105`,
          "rounded-xl p-4",
          className
        )}
      >
        <div className="relative z-10 flex flex-col items-center gap-2">
          <IconComponent 
            className={cn(
              "w-6 h-6 transition-all duration-300",
              isReacted && "fill-current scale-110",
              isLoading && "animate-pulse"
            )} 
          />
          <span className="text-xs font-bold">{config.label}</span>
          {showCount && count > 0 && (
            <span className="text-sm font-medium">{count}</span>
          )}
        </div>
        
        {isReacted && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        )}
      </Button>
      
      {showStreak && showStreakAnimation && (
        <div className="absolute -top-3 -right-3 animate-bounce">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-full shadow-lg border-2 border-white">
            <Flame className="w-4 h-4" />
            <span className="font-bold">Streak!</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Multi-reaction component for posts
interface MultiReactionProps {
  targetType: 'post' | 'comment' | 'journal' | 'resource';
  targetId: string;
  variant?: 'default' | 'compact' | 'minimal';
  showStreak?: boolean;
  className?: string;
  onReaction?: (type: string, added: boolean) => void;
}

export function MultiReaction({
  targetType,
  targetId,
  variant = 'compact',
  showStreak = true,
  className,
  onReaction
}: MultiReactionProps) {
  const reactionTypes: Array<'like' | 'heart' | 'helpful' | 'support' | 'thumbsup'> = 
    ['heart', 'thumbsup', 'helpful', 'support'];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {reactionTypes.map((type) => (
        <ReactionButton
          key={type}
          targetType={targetType}
          targetId={targetId}
          type={type}
          variant={variant}
          showCount={variant !== 'minimal'}
          showStreak={showStreak}
          onReaction={onReaction}
        />
      ))}
    </div>
  );
}