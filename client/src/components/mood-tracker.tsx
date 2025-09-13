import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const moodOptions = [
  { emoji: "😔", label: "Very Low", value: 1, color: "bg-red-100 text-red-800" },
  { emoji: "🙁", label: "Low", value: 2, color: "bg-orange-100 text-orange-800" },
  { emoji: "😐", label: "Neutral", value: 3, color: "bg-yellow-100 text-yellow-800" },
  { emoji: "🙂", label: "Good", value: 4, color: "bg-green-100 text-green-800" },
  { emoji: "😊", label: "Great", value: 5, color: "bg-emerald-100 text-emerald-800" },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [streak, setStreak] = useState(7); // TODO: remove mock functionality
  const [weekProgress, setWeekProgress] = useState(5); // TODO: remove mock functionality

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
    console.log(`Mood selected: ${moodValue}`);
    // TODO: In real app, save to backend
  };

  const handleSubmit = () => {
    if (selectedMood) {
      console.log(`Submitting mood: ${selectedMood}`);
      setWeekProgress(prev => Math.min(prev + 1, 7));
      // TODO: Submit to backend
    }
  };

  return (
    <Card data-testid="card-mood-tracker">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Daily Mood Check-In</CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" data-testid="text-mood-streak">
            🔥 {streak} day streak
          </Badge>
          <div className="flex-1">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>This week</span>
              <span>{weekProgress}/7</span>
            </div>
            <Progress value={(weekProgress / 7) * 100} className="h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          How are you feeling today?
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => handleMoodSelect(mood.value)}
              data-testid={`button-mood-${mood.value}`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>

        {selectedMood && (
          <div className="space-y-3">
            <Badge className={moodOptions[selectedMood - 1].color}>
              Today: {moodOptions[selectedMood - 1].label}
            </Badge>
            <Button 
              onClick={handleSubmit} 
              className="w-full"
              data-testid="button-submit-mood"
            >
              Save Check-In
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}