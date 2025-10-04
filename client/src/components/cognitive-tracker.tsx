import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Brain, MessageCircle, PenTool } from "lucide-react";
import { MoodChatMorph, moodOptions, type MoodOption } from "@/components/mood-chat-morph";

interface CognitiveEntry {
  id: number;
  value: number;
  note?: string;
  createdAt: string;
}

interface CognitiveTrackerProps {
  variant?: 'full' | 'compact';
}

// Cognitive wellness options for dementia care
const cognitiveOptions: MoodOption[] = [
  {
    emoji: "😞",
    label: "Confused",
    value: 1,
    description: "Feeling lost",
    quotes: [
      "It's okay to feel confused. Let's take things one step at a time. 💙",
      "Every moment of clarity is precious. You're doing your best.",
      "Confusion is part of the journey. You're not alone in this.",
      "Take a deep breath. Let's focus on the present moment."
    ],
    colors: ["from-red-100", "to-red-200", "border-red-300", "text-red-700"]
  },
  {
    emoji: "😕",
    label: "Foggy",
    value: 2,
    description: "Mental fog",
    quotes: [
      "Mental fog is common. Rest and gentle activities can help.",
      "Some days are cloudier than others. That's perfectly normal.",
      "Let's try some simple cognitive exercises together.",
      "Your brain is working hard. Be patient with yourself."
    ],
    colors: ["from-orange-100", "to-orange-200", "border-orange-300", "text-orange-700"]
  },
  {
    emoji: "😐",
    label: "Okay",
    value: 3,
    description: "Managing",
    quotes: [
      "You're managing well today. Keep up the good work!",
      "Steady progress is still progress. You're doing great.",
      "Finding balance is important. You're on the right track.",
      "Some days are just okay, and that's perfectly fine."
    ],
    colors: ["from-yellow-100", "to-yellow-200", "border-yellow-300", "text-yellow-700"]
  },
  {
    emoji: "🙂",
    label: "Clear",
    value: 4,
    description: "Thinking well",
    quotes: [
      "Your mind is clear today! Enjoy this feeling of clarity.",
      "Clear thinking days are wonderful. Make the most of it!",
      "You're having a good cognitive day. That's fantastic!",
      "Mental clarity is a gift. Embrace these moments."
    ],
    colors: ["from-green-100", "to-green-200", "border-green-300", "text-green-700"]
  },
  {
    emoji: "😊",
    label: "Sharp",
    value: 5,
    description: "Very alert",
    quotes: [
      "Your mind is sharp today! You're functioning wonderfully.",
      "Excellent cognitive function today. You should feel proud!",
      "Sharp thinking and clear memory - you're doing amazing!",
      "Days like this remind us of your inner strength and resilience."
    ],
    colors: ["from-blue-100", "to-blue-200", "border-blue-300", "text-blue-700"]
  }
];

export function CognitiveTracker({ variant = 'full' }: CognitiveTrackerProps) {
  const [selectedCognitive, setSelectedCognitive] = useState<number | null>(null);
  const [selectedCognitiveForMorph, setSelectedCognitiveForMorph] = useState<MoodOption | null>(null);
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: recentEntries } = useQuery({
    queryKey: ['/api/cognitive/recent'],
    queryFn: async () => {
      const response = await fetch('/api/cognitive/recent?limit=7');
      if (!response.ok) throw new Error('Failed to fetch cognitive entries');
      return response.json() as Promise<CognitiveEntry[]>;
    },
  });

  const { data: weeklyAverage } = useQuery({
    queryKey: ['/api/cognitive/weekly-average'],
    queryFn: async () => {
      const response = await fetch('/api/cognitive/weekly-average');
      if (!response.ok) throw new Error('Failed to fetch weekly average');
      const data = await response.json();
      return data.average || 0;
    },
  });

  const addCognitiveMutation = useMutation({
    mutationFn: async (cognitive: { value: number; note?: string }) => {
      const response = await fetch('/api/cognitive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cognitive),
      });
      if (!response.ok) throw new Error('Failed to add cognitive entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cognitive/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cognitive/weekly-average'] });
      toast({
        title: "Cognitive state logged successfully!",
        description: "Your cognitive entry has been saved.",
      });
      setSelectedCognitive(null);
      setNote("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log cognitive state. Please try again.",
        variant: "destructive",
      });
      console.error('Failed to add cognitive entry:', error);
    },
  });

  const handleCognitiveSelect = (cognitive: MoodOption) => {
    if (variant === 'compact') {
      // For compact variant, show the morphing box instead of direct navigation
      setSelectedCognitiveForMorph(cognitive);
      return;
    }
    setSelectedCognitive(cognitive.value);
  };

  const handleCloseMorph = () => {
    setSelectedCognitiveForMorph(null);
  };

  const handleSubmit = () => {
    if (selectedCognitive === null) return;
    addCognitiveMutation.mutate({
      value: selectedCognitive,
      note: note.trim() || undefined,
    });
  };

  if (variant === 'compact') {
    return (
      <>
        <Card className="modern-card border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg font-semibold flex items-center justify-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <Brain className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <span className="text-blue-500">How clear is your thinking?</span>
                <p className="text-xs text-muted-foreground font-normal">Quick cognitive check-in</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-2 xxs:gap-1 sm:gap-3 overflow-x-auto px-2 cognitive-scroll android-scroll">
              {cognitiveOptions.map((cognitive, index) => (
                <Button
                  key={cognitive.value}
                  variant="outline"
                  size="lg"
                  onClick={() => handleCognitiveSelect(cognitive)}
                  className="modern-button relative flex flex-col items-center p-3 xxs:p-2 sm:p-4 h-auto min-h-[80px] xxs:min-h-[70px] sm:min-h-[100px] w-16 xxs:w-14 sm:w-20 flex-shrink-0 transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl active:scale-95 group rounded-2xl border-0 bg-white dark:bg-gray-800 shadow-lg"
                  data-testid={`button-cognitive-${cognitive.value}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideInBounce 0.8s ease-out forwards'
                  }}
                >
                  <div className="text-3xl xxs:text-2xl sm:text-4xl mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-125 emoji-hover">
                    {cognitive.emoji}
                  </div>
                  <span className="text-xs xxs:text-2xs sm:text-xs font-semibold text-center leading-tight">
                    {cognitive.label}
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <MessageCircle className="h-4 w-4" />
                <span>Tap any emoji to chat with cognitive support</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Morphing chat box */}
        <MoodChatMorph 
          selectedMood={selectedCognitiveForMorph}
          onClose={handleCloseMorph}
          onBack={handleCloseMorph}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="modern-card border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-xl font-semibold flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
              <Brain className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <span className="text-blue-500">How clear is your thinking today?</span>
              <p className="text-sm text-muted-foreground font-normal">Track your cognitive wellness</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-center gap-3 xxs:gap-2 sm:gap-4 md:gap-6 overflow-x-auto px-2 pb-2 cognitive-scroll android-scroll">
            {cognitiveOptions.map((cognitive, index) => {
              const isSelected = selectedCognitive === cognitive.value;
              return (
                <Button
                  key={cognitive.value}
                  variant="outline"
                  size="lg"
                  onClick={() => handleCognitiveSelect(cognitive)}
                  className={`modern-button relative flex flex-col items-center p-4 xxs:p-3 sm:p-6 h-auto min-h-[100px] xxs:min-h-[80px] sm:min-h-[120px] w-20 xxs:w-16 sm:w-24 flex-shrink-0 transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl active:scale-95 group rounded-2xl border-0 ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground shadow-2xl scale-105 -translate-y-1 ring-2 ring-primary/50' 
                      : 'bg-white dark:bg-gray-800 shadow-lg'
                  }`}
                  data-testid={`button-cognitive-${cognitive.value}`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'slideInBounce 0.8s ease-out forwards'
                  }}
                >
                  <div className="text-4xl xxs:text-3xl sm:text-5xl mb-2 xxs:mb-1 sm:mb-3 transition-transform duration-300 group-hover:scale-125 emoji-hover">
                    {cognitive.emoji}
                  </div>
                  <span className="text-xs xxs:text-2xs sm:text-sm font-semibold text-center leading-tight">
                    {cognitive.label}
                  </span>
                  <span className="text-xs text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cognitive.description}
                  </span>
                  {isSelected && (
                    <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-sm pointer-events-none" />
                  )}
                </Button>
              );
            })}
            </div>
          </div>

          {selectedCognitive && (
            <div className="space-y-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Add a note <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="How was your mental clarity today? Any specific thoughts or concerns?"
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none bg-white dark:bg-gray-800 transition-all duration-200"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCognitive(null);
                    setNote("");
                  }}
                  className="modern-button px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={addCognitiveMutation.isPending}
                  className="modern-button bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  {addCognitiveMutation.isPending ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CognitiveTracker;