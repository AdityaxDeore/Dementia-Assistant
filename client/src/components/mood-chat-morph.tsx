"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface MoodOption {
  emoji: string;
  label: string;
  value: number;
  description: string;
  quotes: string[];
  aiSuggestion: string;
}

export type { MoodOption };

const moodOptions: MoodOption[] = [
  {
    emoji: "😭",
    label: "Very Low",
    value: 1,
    description: "I need support",
    quotes: [
      "This too shall pass. You're stronger than you know. 💙",
      "Every storm runs out of rain. Healing takes time, and that's okay.",
      "You've survived 100% of your difficult days so far. That's a perfect record.",
      "It's okay to not be okay. What matters is that you're here and you're trying."
    ],
    aiSuggestion: "Talk to Alex - our calm, empathetic AI buddy who specializes in providing gentle support during difficult times."
  },
  {
    emoji: "😔",
    label: "Low", 
    value: 2,
    description: "Not my best day",
    quotes: [
      "Tomorrow is a fresh start. Today's struggles don't define tomorrow's possibilities.",
      "Be gentle with yourself. You're doing the best you can with what you have.",
      "Small steps count. Even breathing through this moment is an act of courage.",
      "Your feelings are valid, and it's okay to have difficult days."
    ],
    aiSuggestion: "Chat with Luna - our gentle nighttime companion who offers soothing conversations and peaceful guidance."
  },
  {
    emoji: "😐",
    label: "Medium",
    value: 3,
    description: "It's okay",
    quotes: [
      "Neutral days are perfectly valid. Sometimes 'okay' is exactly enough.",
      "Balance is beautiful. Not every day needs to be extraordinary.",
      "You're in the middle of your story, not at the end. Keep going.",
      "Sometimes the most productive thing you can do is rest and reset."
    ],
    aiSuggestion: "Connect with Sage - our thoughtful AI companion who helps you process and understand your feelings."
  },
  {
    emoji: "😊",
    label: "Good",
    value: 4,
    description: "Feeling positive",
    quotes: [
      "Your positivity is a gift to yourself and others. Keep shining! ✨",
      "Good days are meant to be celebrated. Take a moment to appreciate this feeling.",
      "You're creating beautiful moments. This energy is contagious!",
      "Gratitude turns what we have into enough. You're doing amazing today."
    ],
    aiSuggestion: "Share with Maya - our enthusiastic AI buddy who loves celebrating your wins and keeping the positive momentum going!"
  },
  {
    emoji: "😄",
    label: "Excellent", 
    value: 5,
    description: "Amazing day!",
    quotes: [
      "Your joy is infectious! This is the energy the world needs more of! 🌟",
      "Amazing days like this remind us what we're capable of. Celebrate yourself!",
      "You're radiating happiness! This feeling is proof of your resilience and strength.",
      "Life is beautiful when we're present for moments like these. Soak it all in!"
    ],
    aiSuggestion: "Celebrate with Rio - our social AI buddy who loves sharing in your excitement and helping you spread the joy!"
  }
];

interface MoodChatMorphProps {
  selectedMood: MoodOption | null;
  onClose: () => void;
  onBack?: () => void;
  className?: string;
}

export function MoodChatMorph({ selectedMood, onClose, onBack, className }: MoodChatMorphProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (selectedMood) {
      setIsVisible(true);
      // Pick a random quote for this mood
      const randomQuote = selectedMood.quotes[Math.floor(Math.random() * selectedMood.quotes.length)];
      setCurrentQuote(randomQuote);
    } else {
      setIsVisible(false);
    }
  }, [selectedMood]);

  const handleChatWithAI = () => {
    if (selectedMood) {
      setLocation(`/ai-buddy?mood=${selectedMood.value}&emoji=${encodeURIComponent(selectedMood.emoji)}`);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!selectedMood) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm",
      "transition-all duration-300 ease-out",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      className
    )}>
      <Card className={cn(
        "relative w-full max-w-lg mx-4 p-0 border-0 shadow-2xl overflow-hidden",
        "transition-all duration-500 ease-out transform",
        isVisible 
          ? "opacity-100 scale-100 translate-y-0" 
          : "opacity-0 scale-90 translate-y-8"
      )}>
        {/* Header with back button and close button */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {!onBack && <div></div>}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Header with emoji and mood */}
        <div className="relative bg-white dark:bg-gray-900 p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-4xl",
              "shadow-lg transition-transform duration-300 hover:scale-110",
              selectedMood.value === 1 ? "bg-red-50 dark:bg-red-900/20" :
              selectedMood.value === 2 ? "bg-orange-50 dark:bg-orange-900/20" :
              selectedMood.value === 3 ? "bg-yellow-50 dark:bg-yellow-900/20" :
              selectedMood.value === 4 ? "bg-green-50 dark:bg-green-900/20" :
              "bg-blue-50 dark:bg-blue-900/20"
            )}>
              {selectedMood.emoji}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedMood.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMood.description}
              </p>
            </div>
          </div>
        </div>

        {/* Quote section */}
        <div className="px-6 pb-4">
          <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentQuote}
              </p>
            </div>
          </div>
        </div>

        {/* AI Chat suggestion */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedMood.aiSuggestion}
              </p>
            </div>

            <Button
              onClick={handleChatWithAI}
              className={cn(
                "w-full h-12 rounded-xl font-semibold text-white transition-all duration-300",
                "flex items-center justify-center gap-3 group shadow-lg hover:shadow-xl",
                "transform hover:scale-105 active:scale-95",
                selectedMood.value === 1 ? "bg-red-500 hover:bg-red-600" :
                selectedMood.value === 2 ? "bg-orange-500 hover:bg-orange-600" :
                selectedMood.value === 3 ? "bg-yellow-500 hover:bg-yellow-600" :
                selectedMood.value === 4 ? "bg-green-500 hover:bg-green-600" :
                "bg-blue-500 hover:bg-blue-600"
              )}
            >
              <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Chat with AI Buddy</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI companion ready to chat</span>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="w-full h-full rounded-full bg-current transform rotate-45 translate-x-16 -translate-y-16"></div>
        </div>
      </Card>
    </div>
  );
}

export { moodOptions };