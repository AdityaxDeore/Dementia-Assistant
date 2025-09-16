import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Heart, Moon, Music, Wind, Timer, Star, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AudioSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: "sleep" | "meditation" | "focus" | "breathing";
  difficulty: "beginner" | "intermediate" | "advanced";
  instructor?: string;
  tags: string[];
  audioUrl?: string; // In a real app, this would be actual audio files
  backgroundSound?: string;
  isPopular?: boolean;
  isFavorite?: boolean;
}

const AUDIO_SESSIONS: AudioSession[] = [
  // Sleep Sessions
  {
    id: "sleep-1",
    title: "Deep Sleep Meditation",
    description: "Gentle guided meditation to help you fall into deep, restful sleep",
    duration: 30,
    category: "sleep",
    difficulty: "beginner",
    instructor: "Dr. Sarah Chen",
    tags: ["insomnia", "relaxation", "bedtime"],
    backgroundSound: "rain",
    isPopular: true
  },
  {
    id: "sleep-2", 
    title: "Body Scan for Sleep",
    description: "Progressive muscle relaxation to release tension and prepare for sleep",
    duration: 20,
    category: "sleep",
    difficulty: "beginner",
    instructor: "Mark Williams",
    tags: ["body scan", "tension relief", "peaceful"],
    backgroundSound: "ocean"
  },
  {
    id: "sleep-3",
    title: "Sleep Stories: Forest Journey",
    description: "Calming narrative to drift off to peaceful sleep",
    duration: 45,
    category: "sleep", 
    difficulty: "beginner",
    instructor: "Luna Hayes",
    tags: ["story", "nature", "visualization"],
    backgroundSound: "forest"
  },

  // Meditation Sessions
  {
    id: "med-1",
    title: "Mindfulness for Students",
    description: "Learn to stay present and manage academic stress through mindfulness",
    duration: 15,
    category: "meditation",
    difficulty: "beginner",
    instructor: "Prof. Michael Davis",
    tags: ["mindfulness", "stress", "academic"],
    isPopular: true
  },
  {
    id: "med-2",
    title: "Anxiety Relief Meditation",
    description: "Specific techniques to calm anxiety and racing thoughts",
    duration: 20,
    category: "meditation",
    difficulty: "intermediate",
    instructor: "Dr. Emily Rodriguez",
    tags: ["anxiety", "calm", "breathing"],
    backgroundSound: "bells"
  },
  {
    id: "med-3",
    title: "Self-Compassion Practice",
    description: "Develop kindness toward yourself during challenging times",
    duration: 25,
    category: "meditation",
    difficulty: "intermediate", 
    instructor: "Dr. Sarah Chen",
    tags: ["self-love", "compassion", "healing"]
  },

  // Focus Sessions
  {
    id: "focus-1",
    title: "Study Focus Soundscape",
    description: "Ambient sounds designed to enhance concentration and productivity",
    duration: 60,
    category: "focus",
    difficulty: "beginner",
    tags: ["study", "concentration", "productivity"],
    backgroundSound: "white-noise",
    isPopular: true
  },
  {
    id: "focus-2",
    title: "Pomodoro Focus Sessions",
    description: "25-minute focus blocks with guided transitions",
    duration: 25,
    category: "focus",
    difficulty: "beginner",
    instructor: "Alex Thompson",
    tags: ["pomodoro", "productivity", "time-management"]
  },
  {
    id: "focus-3",
    title: "Deep Work Ambience", 
    description: "Extended focus session for deep, uninterrupted work",
    duration: 90,
    category: "focus",
    difficulty: "advanced",
    tags: ["deep-work", "extended", "ambient"],
    backgroundSound: "cafe"
  },

  // Breathing Sessions
  {
    id: "breath-1",
    title: "4-7-8 Breathing Technique",
    description: "Powerful breathing pattern to reduce anxiety and promote calm",
    duration: 10,
    category: "breathing",
    difficulty: "beginner",
    instructor: "Dr. James Wilson",
    tags: ["anxiety", "quick", "calming"],
    isPopular: true
  },
  {
    id: "breath-2",
    title: "Box Breathing for Focus",
    description: "Military-grade breathing technique to enhance concentration",
    duration: 15,
    category: "breathing",
    difficulty: "intermediate",
    instructor: "Captain Sarah Miller",
    tags: ["focus", "discipline", "clarity"]
  },
  {
    id: "breath-3",
    title: "Wim Hof Breathing Method",
    description: "Advanced breathing technique for energy and stress resilience",
    duration: 20,
    category: "breathing",
    difficulty: "advanced",
    instructor: "David Kumar",
    tags: ["energy", "advanced", "resilience"]
  }
];

export function AudioSessions() {
  const [activeTab, setActiveTab] = useState("sleep");
  const [currentSession, setCurrentSession] = useState<AudioSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate audio playback (in real app, this would use actual audio files)
  useEffect(() => {
    if (isPlaying && currentSession) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const totalSeconds = (selectedDuration || currentSession.duration) * 60;
          if (newTime >= totalSeconds) {
            setIsPlaying(false);
            setCurrentTime(0);
            return 0;
          }
          return newTime;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentSession, playbackSpeed, selectedDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSessionSelect = (session: AudioSession) => {
    setCurrentSession(session);
    setCurrentTime(0);
    setIsPlaying(false);
    setSelectedDuration(null);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sleep": return Moon;
      case "meditation": return Heart;  
      case "focus": return Music;
      case "breathing": return Wind;
      default: return Headphones;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sleep": return "text-indigo-600 bg-indigo-50";
      case "meditation": return "text-purple-600 bg-purple-50";
      case "focus": return "text-blue-600 bg-blue-50"; 
      case "breathing": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-600 bg-green-50";
      case "intermediate": return "text-yellow-600 bg-yellow-50";
      case "advanced": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const filteredSessions = AUDIO_SESSIONS.filter(session => session.category === activeTab);
  const totalDuration = selectedDuration || (currentSession?.duration ?? 0);
  const progress = totalDuration > 0 ? (currentTime / (totalDuration * 60)) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Headphones className="w-8 h-8 text-primary" />
          Guided Audio Sessions
        </h1>
        <p className="text-muted-foreground">
          Professional audio sessions for sleep, meditation, focus, and breathing exercises. 
          Developed by certified instructors to support your mental wellness journey.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Sleep
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Focus
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            Breathing
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {/* Audio Player */}
          {currentSession && (
            <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {React.createElement(getCategoryIcon(currentSession.category), {
                    className: `w-6 h-6 ${getCategoryColor(currentSession.category).split(' ')[0]}`
                  })}
                  Now Playing: {currentSession.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{currentSession.description}</p>
                    {currentSession.instructor && (
                      <p className="text-xs text-muted-foreground">
                        Instructor: {currentSession.instructor}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedDuration && (
                      <Badge variant="outline">
                        Custom: {selectedDuration}min
                      </Badge>
                    )}
                    <Badge className={getDifficultyColor(currentSession.difficulty)}>
                      {currentSession.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalDuration * 60)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleRestart}
                      variant="outline"
                      size="sm"
                      disabled={currentTime === 0}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handlePlayPause}
                      size="lg"
                      className="h-12 w-12 rounded-full"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-20"
                      />
                    </div>

                    {/* Speed Control */}
                    <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="0.75">0.75x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="1.25">1.25x</SelectItem>
                        <SelectItem value="1.5">1.5x</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Custom Duration */}
                    {currentSession.category === "focus" && (
                      <Select value={selectedDuration?.toString() || ""} onValueChange={(value) => setSelectedDuration(value ? parseInt(value) : null)}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Default</SelectItem>
                          <SelectItem value="15">15min</SelectItem>
                          <SelectItem value="30">30min</SelectItem>
                          <SelectItem value="45">45min</SelectItem>
                          <SelectItem value="60">60min</SelectItem>
                          <SelectItem value="90">90min</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentSession.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map((session) => {
              const CategoryIcon = getCategoryIcon(session.category);
              return (
                <Card
                  key={session.id}
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    currentSession?.id === session.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSessionSelect(session)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(session.category)}`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold line-clamp-1">
                            {session.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(session.difficulty)} >
                              {session.difficulty}
                            </Badge>
                            {session.isPopular && (
                              <Badge className="bg-orange-100 text-orange-800">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {session.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration} min</span>
                      </div>
                      {session.instructor && (
                        <span className="text-xs text-muted-foreground">
                          {session.instructor}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {session.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {session.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{session.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Button 
                      className="w-full"
                      variant={currentSession?.id === session.id ? "secondary" : "default"}
                    >
                      {currentSession?.id === session.id ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Play Session
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Category-specific info */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-none">
            <CardContent className="p-6">
              {activeTab === "sleep" && (
                <div className="text-center space-y-2">
                  <Moon className="w-8 h-8 mx-auto text-indigo-600" />
                  <h3 className="text-lg font-semibold">Sleep Better Tonight</h3>
                  <p className="text-sm text-muted-foreground">
                    Our sleep sessions use proven techniques to help you fall asleep faster and enjoy deeper, more restful sleep.
                  </p>
                </div>
              )}
              {activeTab === "meditation" && (
                <div className="text-center space-y-2">
                  <Heart className="w-8 h-8 mx-auto text-purple-600" />
                  <h3 className="text-lg font-semibold">Mindful Moments</h3>
                  <p className="text-sm text-muted-foreground">
                    Develop mindfulness skills to manage stress, improve focus, and cultivate inner peace through regular practice.
                  </p>
                </div>
              )}
              {activeTab === "focus" && (
                <div className="text-center space-y-2">
                  <Music className="w-8 h-8 mx-auto text-blue-600" />
                  <h3 className="text-lg font-semibold">Enhanced Productivity</h3>
                  <p className="text-sm text-muted-foreground">
                    Scientifically designed soundscapes and focus sessions to boost concentration and academic performance.
                  </p>
                </div>
              )}
              {activeTab === "breathing" && (
                <div className="text-center space-y-2">
                  <Wind className="w-8 h-8 mx-auto text-green-600" />
                  <h3 className="text-lg font-semibold">Breathe & Reset</h3>
                  <p className="text-sm text-muted-foreground">
                    Powerful breathing techniques to quickly reduce anxiety, increase energy, and improve mental clarity.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}