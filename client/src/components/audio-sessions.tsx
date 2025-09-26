import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Heart, Moon, Music, Wind, Timer, Star, Headphones, SkipBack, SkipForward, Shuffle, Repeat, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
  plays?: number;
  coverImage?: string;
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
    isPopular: true,
    plays: 12450,
    coverImage: "🌙"
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
    backgroundSound: "ocean",
    plays: 8920,
    coverImage: "🏖️"
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
    backgroundSound: "forest",
    plays: 15630,
    coverImage: "🌲"
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
    isPopular: true,
    plays: 9870,
    coverImage: "🧘‍♂️"
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
    backgroundSound: "bells",
    plays: 7450,
    coverImage: "🕉️"
  },
  {
    id: "med-3",
    title: "Self-Compassion Practice",
    description: "Develop kindness toward yourself during challenging times",
    duration: 25,
    category: "meditation",
    difficulty: "intermediate", 
    instructor: "Dr. Sarah Chen",
    tags: ["self-love", "compassion", "healing"],
    plays: 6780,
    coverImage: "💝"
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
    isPopular: true,
    plays: 23450,
    coverImage: "📚"
  },
  {
    id: "focus-2",
    title: "Pomodoro Focus Sessions",
    description: "25-minute focus blocks with guided transitions",
    duration: 25,
    category: "focus",
    difficulty: "beginner",
    instructor: "Alex Thompson",
    tags: ["pomodoro", "productivity", "time-management"],
    plays: 11200,
    coverImage: "⏰"
  },
  {
    id: "focus-3",
    title: "Deep Work Ambience", 
    description: "Extended focus session for deep, uninterrupted work",
    duration: 90,
    category: "focus",
    difficulty: "advanced",
    tags: ["deep-work", "extended", "ambient"],
    backgroundSound: "cafe",
    plays: 5670,
    coverImage: "☕"
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
    isPopular: true,
    plays: 14520,
    coverImage: "🌬️"
  },
  {
    id: "breath-2",
    title: "Box Breathing for Focus",
    description: "Military-grade breathing technique to enhance concentration",
    duration: 15,
    category: "breathing",
    difficulty: "intermediate",
    instructor: "Captain Sarah Miller",
    tags: ["focus", "discipline", "clarity"],
    plays: 8930,
    coverImage: "⭐"
  },
  {
    id: "breath-3",
    title: "Wim Hof Breathing Method",
    description: "Advanced breathing technique for energy and stress resilience",
    duration: 20,
    category: "breathing",
    difficulty: "advanced",
    instructor: "David Kumar",
    tags: ["energy", "advanced", "resilience"],
    plays: 6120,
    coverImage: "❄️"
  }
];

export function AudioSessions() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentSession, setCurrentSession] = useState<AudioSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [favorites, setFavorites] = useState<string[]>([]);
  
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

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
    return plays.toString();
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
    setIsPlaying(true);
    setSelectedDuration(null);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFavorite = (sessionId: string) => {
    setFavorites(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
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
      case "sleep": return "text-indigo-600 bg-indigo-100 border border-indigo-200";
      case "meditation": return "text-purple-600 bg-purple-100 border border-purple-200";
      case "focus": return "text-blue-600 bg-blue-100 border border-blue-200"; 
      case "breathing": return "text-green-600 bg-green-100 border border-green-200";
      default: return "text-gray-600 bg-gray-100 border border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 bg-green-900/50";
      case "intermediate": return "text-yellow-400 bg-yellow-900/50";
      case "advanced": return "text-red-400 bg-red-900/50";
      default: return "text-gray-400 bg-gray-900/50";
    }
  };

  const filteredSessions = AUDIO_SESSIONS.filter(session => {
    const matchesCategory = activeTab === "all" || session.category === activeTab;
    const matchesSearch = searchTerm === "" || 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalDuration = selectedDuration || (currentSession?.duration ?? 0);
  const progress = totalDuration > 0 ? (currentTime / (totalDuration * 60)) * 100 : 0;

  return (
    <div className="min-h-screen text-gray-800 px-4 pb-6">
      {/* Clean Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
            <Headphones className="w-12 h-12 text-blue-600" />
          </div>
          <div>
            <h1 className="text-5xl font-light text-gray-800 mb-2">
              Wellness Audio
            </h1>
            <p className="text-gray-600 text-lg">
              {AUDIO_SESSIONS.length} sessions • By certified instructors • Made for you
            </p>
          </div>
        </div>
        
        {/* Play All Button */}
        <div className="flex items-center gap-4">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => filteredSessions.length > 0 && handleSessionSelect(filteredSessions[0])}
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            Play All
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-800 p-3 rounded-full hover:bg-gray-100"
            onClick={() => setIsShuffled(!isShuffled)}
          >
            <Shuffle className={`w-6 h-6 ${isShuffled ? 'text-blue-600' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-800 p-3 rounded-full hover:bg-gray-100"
            onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
          >
            <Repeat className={`w-6 h-6 ${repeatMode !== 'none' ? 'text-blue-600' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search sessions, instructors, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-white border-gray-200 text-gray-800 placeholder-gray-400 rounded-full h-12 focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-40 bg-white border-gray-200 text-gray-800 rounded-full shadow-sm">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sleep">Sleep</SelectItem>
            <SelectItem value="meditation">Meditation</SelectItem>
            <SelectItem value="focus">Focus</SelectItem>
            <SelectItem value="breathing">Breathing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clean Track List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-light text-gray-800">Sessions</h2>
          <div className="text-sm text-gray-500">
            {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Track List Header */}
        <div className="grid grid-cols-12 gap-4 items-center text-sm text-gray-500 border-b border-gray-200 pb-2 mb-4">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Plays</div>
          <div className="col-span-1 text-center">
            <Heart className="w-4 h-4 mx-auto" />
          </div>
        </div>
        
        {/* Track List */}
        <div className="space-y-1">
          {filteredSessions.map((session, index) => {
            const isCurrentSession = currentSession?.id === session.id;
            const isFavorited = favorites.includes(session.id);
            
            return (
              <div 
                key={session.id}
                className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group ${
                  isCurrentSession ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSessionSelect(session)}
              >
                {/* Track Number / Play Button */}
                <div className="col-span-1">
                  <div className="relative">
                    <span className={`text-sm ${
                      isCurrentSession ? 'text-blue-600' : 'text-gray-500 group-hover:hidden'
                    }`}>
                      {isCurrentSession && isPlaying ? '♪' : index + 1}
                    </span>
                    <Play className="w-4 h-4 text-blue-600 hidden group-hover:block absolute top-0 left-0" />
                  </div>
                </div>
                
                {/* Title and Artist */}
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-lg">
                    {session.coverImage}
                  </div>
                  <div>
                    <div className={`font-medium ${
                      isCurrentSession ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {session.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {session.instructor || 'Various Artists'}
                    </div>
                  </div>
                </div>
                
                {/* Category */}
                <div className="col-span-2">
                  <Badge className={`${getCategoryColor(session.category)} border-0`}>
                    {session.category}
                  </Badge>
                </div>
                
                {/* Plays */}
                <div className="col-span-2 text-gray-500 text-sm">
                  {formatPlays(session.plays || 0)}
                </div>
                
                {/* Favorite Button */}
                <div className="col-span-1 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto w-auto hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(session.id);
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        isFavorited 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Player - Above Navigation */}
      {currentSession && (
        <div className="fixed bottom-16 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 z-[1001] shadow-xl">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Current Track Info */}
              <div className="flex items-center gap-4 min-w-0 w-1/4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {currentSession.coverImage}
                </div>
                <div className="min-w-0">
                  <div className="text-gray-800 font-medium truncate">{currentSession.title}</div>
                  <div className="text-gray-500 text-sm truncate">{currentSession.instructor || 'Various Artists'}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto w-auto hover:bg-transparent flex-shrink-0"
                  onClick={() => toggleFavorite(currentSession.id)}
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      favorites.includes(currentSession.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`} 
                  />
                </Button>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col items-center gap-2 w-2/4 max-w-lg">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-800">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 p-0"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-800">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
                  <div className="flex-1">
                    <Progress value={progress} className="h-1 bg-gray-200" />
                  </div>
                  <span className="text-xs text-gray-500 w-10">{formatTime(totalDuration * 60)}</span>
                </div>
              </div>

              {/* Volume and Options */}
              <div className="flex items-center gap-4 w-1/4 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-800"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Padding for Fixed Player - accounts for both player and navigation */}
      {currentSession && <div className="h-32" />}
    </div>
  );
}