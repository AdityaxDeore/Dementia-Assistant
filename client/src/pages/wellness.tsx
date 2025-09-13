import { MoodTracker } from "@/components/mood-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Heart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WellnessPage() {
  const handleStartMeditation = () => {
    console.log('Starting meditation session');
    // TODO: Implement meditation timer/guide
  };

  const handleBreathingExercise = () => {
    console.log('Starting breathing exercise');
    // TODO: Implement breathing exercise guide
  };

  return (
    <div className="space-y-6" data-testid="page-wellness">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Wellness Center</h1>
        <p className="text-muted-foreground">
          Track your mental health, practice mindfulness, and build healthy habits for better wellbeing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mood Tracker */}
        <div className="lg:col-span-1">
          <MoodTracker />
        </div>

        {/* Mindfulness Tools */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Mindfulness & Relaxation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-4 text-center space-y-3">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto" />
                    <div>
                      <h3 className="font-medium">Guided Meditation</h3>
                      <p className="text-sm text-muted-foreground">5-20 minute sessions</p>
                    </div>
                    <Button 
                      onClick={handleStartMeditation}
                      className="w-full"
                      data-testid="button-start-meditation"
                    >
                      Start Session
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4 text-center space-y-3">
                    <Heart className="w-8 h-8 text-green-600 mx-auto" />
                    <div>
                      <h3 className="font-medium">Breathing Exercises</h3>
                      <p className="text-sm text-muted-foreground">Quick calm techniques</p>
                    </div>
                    <Button 
                      onClick={handleBreathingExercise}
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      data-testid="button-breathing-exercise"
                    >
                      Begin Exercise
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Wellness Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Week's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">Meditation Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-muted-foreground">Check-ins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-muted-foreground">Journal Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">7</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}