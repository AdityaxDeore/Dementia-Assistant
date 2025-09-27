import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Sparkles, MessageCircle, PenTool } from "lucide-react";
import { MoodChatMorph, moodOptions, type MoodOption } from "@/components/mood-chat-morph";

interface MoodEntry {
  id: number;
  value: number;
  note?: string;
  createdAt: string;
}

interface MoodTrackerProps {
  variant?: 'full' | 'compact';
}

export function MoodTracker({ variant = 'full' }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedMoodForMorph, setSelectedMoodForMorph] = useState<MoodOption | null>(null);
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: recentEntries } = useQuery({
    queryKey: ['/api/mood/recent'],
    queryFn: async () => {
      const response = await fetch('/api/mood/recent?limit=7');
      if (!response.ok) throw new Error('Failed to fetch mood entries');
      return response.json() as Promise<MoodEntry[]>;
    },
  });

  const { data: weeklyAverage } = useQuery({
    queryKey: ['/api/mood/weekly-average'],
    queryFn: async () => {
      const response = await fetch('/api/mood/weekly-average');
      if (!response.ok) throw new Error('Failed to fetch weekly average');
      const data = await response.json();
      return data.average || 0;
    },
  });

  const addMoodMutation = useMutation({
    mutationFn: async (mood: { value: number; note?: string }) => {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mood),
      });
      if (!response.ok) throw new Error('Failed to add mood entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mood/weekly-average'] });
      toast({
        title: "Mood logged successfully!",
        description: "Your mood entry has been saved.",
      });
      setSelectedMood(null);
      setNote("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
      console.error('Failed to add mood entry:', error);
    },
  });

  const handleMoodSelect = (mood: MoodOption) => {
    if (variant === 'compact') {
      // For compact variant, show the morphing box instead of direct navigation
      setSelectedMoodForMorph(mood);
      return;
    }
    setSelectedMood(mood.value);
  };

  const handleCloseMorph = () => {
    setSelectedMoodForMorph(null);
  };

  const handleSubmit = () => {
    if (selectedMood === null) return;
    addMoodMutation.mutate({
      value: selectedMood,
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
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <span className="text-blue-500">How are you feeling?</span>
                <p className="text-xs text-muted-foreground font-normal">Quick mood check-in</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-2 xxs:gap-1 sm:gap-3 overflow-x-auto px-2 mood-scroll android-scroll">
              {moodOptions.map((mood, index) => (
                <Button
                  key={mood.value}
                  variant="outline"
                  size="lg"
                  onClick={() => handleMoodSelect(mood)}
                  className="modern-button relative flex flex-col items-center p-3 xxs:p-2 sm:p-4 h-auto min-h-[80px] xxs:min-h-[70px] sm:min-h-[100px] w-16 xxs:w-14 sm:w-20 flex-shrink-0 transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl active:scale-95 group rounded-2xl border-0 bg-white dark:bg-gray-800 shadow-lg"
                  data-testid={`button-mood-${mood.value}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideInBounce 0.8s ease-out forwards'
                  }}
                >
                  <div className="text-3xl xxs:text-2xl sm:text-4xl mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-125 emoji-hover">
                    {mood.emoji}
                  </div>
                  <span className="text-xs xxs:text-2xs sm:text-xs font-semibold text-center leading-tight">
                    {mood.label}
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <MessageCircle className="h-4 w-4" />
                <span>Tap any emoji to chat with an AI buddy</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Morphing chat box */}
        <MoodChatMorph 
          selectedMood={selectedMoodForMorph}
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
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <span className="text-blue-500">How are you feeling today?</span>
              <p className="text-sm text-muted-foreground font-normal">Track your daily mood</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-center gap-3 xxs:gap-2 sm:gap-4 md:gap-6 overflow-x-auto px-2 pb-2 mood-scroll android-scroll">
            {moodOptions.map((mood, index) => {
              const isSelected = selectedMood === mood.value;
              return (
                <Button
                  key={mood.value}
                  variant="outline"
                  size="lg"
                  onClick={() => handleMoodSelect(mood)}
                  className={`modern-button relative flex flex-col items-center p-4 xxs:p-3 sm:p-6 h-auto min-h-[100px] xxs:min-h-[80px] sm:min-h-[120px] w-20 xxs:w-16 sm:w-24 flex-shrink-0 transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl active:scale-95 group rounded-2xl border-0 ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground shadow-2xl scale-105 -translate-y-1 ring-2 ring-primary/50' 
                      : 'bg-white dark:bg-gray-800 shadow-lg'
                  }`}
                  data-testid={`button-mood-${mood.value}`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'slideInBounce 0.8s ease-out forwards'
                  }}
                >
                  <div className="text-4xl xxs:text-3xl sm:text-5xl mb-2 xxs:mb-1 sm:mb-3 transition-transform duration-300 group-hover:scale-125 emoji-hover">
                    {mood.emoji}
                  </div>
                  <span className="text-xs xxs:text-2xs sm:text-sm font-semibold text-center leading-tight">
                    {mood.label}
                  </span>
                  <span className="text-xs text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {mood.description}
                  </span>
                  {isSelected && (
                    <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-sm pointer-events-none" />
                  )}
                </Button>
              );
            })}
            </div>
          </div>

          {selectedMood && (
            <div className="space-y-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Add a note <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="How was your day? What's on your mind?"
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none bg-white dark:bg-gray-800 transition-all duration-200"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedMood(null);
                    setNote("");
                  }}
                  className="modern-button px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={addMoodMutation.isPending}
                  className="modern-button bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  {addMoodMutation.isPending ? "Saving..." : "Save Mood"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MoodTracker;