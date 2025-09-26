import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Sparkles, MessageCircle } from "lucide-react";

// Motivating quotes for positive moods
const motivatingQuotes = [
  "✨ Your positive energy is contagious! Keep shining and inspiring others around you.",
  "🌟 You're doing amazing! Your resilience and strength are truly remarkable.",
  "🚀 Great mindset leads to great achievements! You're on the right path to success.",
  "💖 Your happiness radiates joy! Thank you for being such a positive force.",
  "🌈 Keep this beautiful energy flowing! You're creating ripples of positivity.",
  "⭐ Your optimism is your superpower! Use it to conquer any challenge today.",
  "🦋 You're blooming beautifully! Your growth and positivity inspire everyone.",
  "🎯 Fantastic mood, fantastic you! Your positive attitude is your greatest asset.",
  "🌺 Your joy is a gift to the world! Keep spreading those good vibes.",
  "💫 Stellar mood today! Your enthusiasm and energy light up every room."
];

const moodOptions = [
  { emoji: "😊", label: "Great", value: 5, color: "bg-emerald-100 text-emerald-800", bgGradient: "from-emerald-100 to-green-100" },
  { emoji: "🙂", label: "Good", value: 4, color: "bg-green-100 text-green-800", bgGradient: "from-green-100 to-lime-100" },
  { emoji: "😐", label: "Neutral", value: 3, color: "bg-yellow-100 text-yellow-800", bgGradient: "from-yellow-100 to-amber-100" },
  { emoji: "🙁", label: "Low", value: 2, color: "bg-orange-100 text-orange-800", bgGradient: "from-orange-100 to-yellow-100" },
  { emoji: "😔", label: "Very Low", value: 1, color: "bg-red-100 text-red-800", bgGradient: "from-red-100 to-pink-100" },
];

// Reverse the order for left-to-right display (Great → Very Low)
const displayMoodOptions = [...moodOptions].reverse();

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Fetch mood history
  const { data: moodData, isLoading } = useQuery({
    queryKey: ['/api/mood/history'],
    queryFn: async () => {
      // Return mock data for now since database tables don't exist yet
      return {
        entries: [
          { id: '1', moodValue: 4, date: '2024-01-15', notes: 'Feeling good today!' },
          { id: '2', moodValue: 3, date: '2024-01-14', notes: 'Neutral day' },
          { id: '3', moodValue: 5, date: '2024-01-13', notes: 'Great mood!' }
        ],
        streak: 3,
        weekProgress: 5
      };
    }
  });

  // Submit mood mutation
  const submitMoodMutation = useMutation({
    mutationFn: async (moodValue: number) => {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodValue })
      });
      if (!response.ok) throw new Error('Failed to submit mood');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood/history'] });
      setSelectedMood(null);
      toast({
        title: "Mood saved!",
        description: "Your mood check-in has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
    
    // If "Great" mood (value 5) is selected, show motivating quote
    if (moodValue === 5) {
      const randomQuote = motivatingQuotes[Math.floor(Math.random() * motivatingQuotes.length)];
      setCurrentQuote(randomQuote);
      setShowQuote(true);
    } else {
      // For other moods, clear quote state
      setShowQuote(false);
      setCurrentQuote("");
    }
  };
  
  const handleAIChatRedirect = () => {
    navigate("/ai-buddy");
  };

  const handleSubmit = () => {
    if (selectedMood) {
      if (selectedMood === 5) {
        // For "Great" mood, just save without redirect
        submitMoodMutation.mutate(selectedMood);
      } else {
        // For other moods, save and redirect to AI chat
        submitMoodMutation.mutate(selectedMood);
        setTimeout(() => {
          toast({
            title: "Let's talk! 💬",
            description: "I'm here to support you. Let's have a conversation to help you feel better.",
          });
          handleAIChatRedirect();
        }, 1500);
      }
    }
  };

  const streak = moodData?.streak || 0;
  const weekProgress = Math.min(moodData?.entries?.length || 0, 7);

  return (
    <Card data-testid="card-mood-tracker" className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3 xs:pb-4">
        <CardTitle className="text-lg xs:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Daily Mood Check-In
        </CardTitle>
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-medium text-xs xs:text-sm" data-testid="text-mood-streak">
            🔥 {streak} day streak
          </Badge>
          <div className="flex-1 w-full xs:w-auto">
            <div className="flex justify-between text-xs xs:text-sm text-muted-foreground mb-1 xs:mb-2">
              <span className="font-medium">This week</span>
              <span className="font-medium">{weekProgress}/7</span>
            </div>
            <Progress value={(weekProgress / 7) * 100} className="h-2 xs:h-3 bg-gray-200" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 xs:space-y-6">
        <div className="text-center">
          <p className="text-base xs:text-lg font-medium text-gray-700 mb-1 xs:mb-2">How are you feeling today?</p>
          <p className="text-xs xs:text-sm text-muted-foreground">Select the emoji that best represents your mood</p>
        </div>
        
        <div className="flex justify-center gap-1 xs:gap-2 sm:gap-3 px-1 xs:px-2">
          {displayMoodOptions.map((mood, index) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "ghost"}
              className={`
                relative flex flex-col items-center p-1 xs:p-2 sm:p-4 h-auto min-h-[70px] xs:min-h-[80px] sm:min-h-[100px] w-full max-w-[55px] xs:max-w-[65px] sm:max-w-[80px]
                transition-all duration-500 ease-out transform
                hover:scale-110 sm:hover:scale-125 hover:-translate-y-1 sm:hover:-translate-y-3 hover:shadow-lg sm:hover:shadow-2xl hover:rotate-1 sm:hover:rotate-3
                active:scale-95 active:rotate-0
                ${
                  selectedMood === mood.value 
                    ? `bg-gradient-to-br ${mood.bgGradient} border-2 border-current shadow-lg sm:shadow-2xl scale-105 sm:scale-110 -translate-y-1 sm:-translate-y-2 animate-pulse` 
                    : 'hover:bg-gradient-to-br hover:from-white hover:to-gray-50 border border-gray-200 hover:border-blue-300'
                }
                group rounded-xl xs:rounded-2xl backdrop-blur-sm mood-emoji-stagger-${index + 1}
              `}
              onClick={() => handleMoodSelect(mood.value)}
              data-testid={`button-mood-${mood.value}`}
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'slideInBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                '--bounce-delay': `${index * 150}ms`
              } as React.CSSProperties}
            >
              <div className="relative">
                <span 
                  className={`text-2xl xs:text-3xl sm:text-5xl mb-1 xs:mb-2 block transition-all duration-500 group-hover:scale-125 sm:group-hover:scale-150 group-hover:rotate-[180deg] sm:group-hover:rotate-[360deg] group-active:scale-110 sm:group-active:scale-125 ${
                    selectedMood === mood.value ? 'emoji-selected' : ''
                  }`}
                  style={{
                    filter: selectedMood === mood.value ? 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))',
                    textShadow: selectedMood === mood.value ? '0 2px 4px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  {mood.emoji}
                </span>
                {selectedMood === mood.value && (
                  <>
                    <div className="absolute -inset-2 xs:-inset-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-30 animate-ping" />
                    <div className="absolute -inset-1 xs:-inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse" />
                    <div className="absolute -inset-0.5 xs:-inset-1 bg-gradient-to-r from-white to-blue-100 rounded-full opacity-40" style={{
                      animation: 'spin 3s linear infinite'
                    }} />
                  </>
                )}
              </div>
              <span className={`text-xs xs:text-xs sm:text-sm font-medium transition-all duration-200 text-center leading-tight ${
                selectedMood === mood.value ? 'text-gray-800' : 'text-gray-600'
              }`}>
                {mood.label}
              </span>
            </Button>
          ))}
        </div>

        {selectedMood && (
          <div 
            className="space-y-4 animate-in slide-in-from-bottom-4 duration-500"
            style={{
              animation: 'slideInFadeIn 0.5s ease-out forwards'
            }}
          >
            <div className="text-center">
              <Badge className={`${moodOptions.find(m => m.value === selectedMood)?.color} text-lg py-2 px-4 font-semibold`}>
                Today: {moodOptions.find(m => m.value === selectedMood)?.label} {moodOptions.find(m => m.value === selectedMood)?.emoji}
              </Badge>
            </div>
            
            {/* Show motivating quote for "Great" mood */}
            {showQuote && selectedMood === 5 && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 xs:p-4 sm:p-6 rounded-xl xs:rounded-2xl border-2 border-emerald-200 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-start gap-2 xs:gap-3">
                  <Sparkles className="w-5 h-5 xs:w-6 xs:h-6 text-emerald-600 mt-0.5 xs:mt-1 animate-pulse flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-800 mb-1 xs:mb-2 text-sm xs:text-base">Daily Motivation 🌟</h4>
                    <p className="text-emerald-700 leading-relaxed font-medium text-xs xs:text-sm">
                      {currentQuote}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Show AI chat suggestion for other moods */}
            {selectedMood && selectedMood < 5 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 xs:p-4 sm:p-6 rounded-xl xs:rounded-2xl border-2 border-blue-200 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-start gap-2 xs:gap-3">
                  <MessageCircle className="w-5 h-5 xs:w-6 xs:h-6 text-blue-600 mt-0.5 xs:mt-1 animate-bounce flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1 xs:mb-2 text-sm xs:text-base">I'm Here for You 💙</h4>
                    <p className="text-blue-700 leading-relaxed font-medium mb-2 xs:mb-3 text-xs xs:text-sm">
                      It's okay to feel this way. Let's have a supportive conversation to help you process these emotions.
                    </p>
                    <p className="text-xs xs:text-sm text-blue-600 font-medium">
                      ✨ After saving your mood, I'll take you to our AI buddy for a caring chat.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleSubmit} 
              className={`w-full h-12 text-lg font-semibold transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                selectedMood === 5 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
              disabled={submitMoodMutation.isPending}
              data-testid="button-submit-mood"
            >
              {submitMoodMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : selectedMood === 5 ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Save & Keep Shining!
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Save & Talk to AI Buddy
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}