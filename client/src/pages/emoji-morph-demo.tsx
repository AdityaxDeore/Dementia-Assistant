import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Sparkles, MessageCircle, Heart } from "lucide-react";
import { MoodChatMorph, moodOptions, type MoodOption } from "@/components/mood-chat-morph";

export default function EmojiMorphDemo() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  const handleCloseMorph = () => {
    setSelectedMood(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <BackButton to="/dashboard" />
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-blue-500" />
            Emoji Morph Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click any emoji below to see the morphing chat box with mood-specific quotes and AI chat options!
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl flex items-center justify-center gap-3">
              <Heart className="w-6 h-6 text-red-500" />
              How are you feeling today?
            </CardTitle>
            <p className="text-muted-foreground">
              Try clicking on any emoji to experience the morphing interaction
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
              {moodOptions.map((mood, index) => (
                <Button
                  key={mood.value}
                  variant="outline"
                  onClick={() => handleMoodSelect(mood)}
                  className="h-32 flex flex-col items-center justify-center gap-3 border-2 rounded-2xl hover:scale-105 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-gray-800"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideInBounce 0.8s ease-out forwards'
                  }}
                >
                  <div className="text-5xl transition-transform duration-300 group-hover:scale-125">
                    {mood.emoji}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{mood.label}</div>
                    <div className="text-xs text-muted-foreground">{mood.description}</div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Click any emoji to see the magic! ✨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature explanation */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">Mood-Specific Quotes</h3>
              <p className="text-sm text-muted-foreground">
                Each emoji triggers personalized motivational quotes that match your current emotional state.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="font-semibold mb-2">AI Companion Match</h3>
              <p className="text-sm text-muted-foreground">
                Smart AI personality suggestions based on your mood, connecting you with the right support.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-semibold mb-2">Smooth Morphing</h3>
              <p className="text-sm text-muted-foreground">
                Beautiful animated transitions that make the interaction feel magical and engaging.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Morphing chat box */}
      <MoodChatMorph 
        selectedMood={selectedMood}
        onClose={handleCloseMorph}
        onBack={handleCloseMorph}
      />
    </div>
  );
}