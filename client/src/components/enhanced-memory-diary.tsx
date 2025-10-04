import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  PenTool, 
  Mic, 
  MicOff, 
  Camera, 
  Image as ImageIcon, 
  Heart, 
  Calendar, 
  Clock,
  Tag,
  Smile,
  MapPin,
  Users,
  Save,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  voiceNote?: string;
  photos: string[];
  tags: string[];
  mood: 'happy' | 'sad' | 'peaceful' | 'confused' | 'excited' | 'nostalgic';
  location?: string;
  people: string[];
  date: string;
  timestamp: string;
  emotionalTone: 'positive' | 'neutral' | 'negative';
  memoryClarity: number; // 1-5 scale
}

interface EnhancedMemoryDiaryProps {
  onEntryCreated?: (entry: MemoryEntry) => void;
}

export function EnhancedMemoryDiary({ onEntryCreated }: EnhancedMemoryDiaryProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [entry, setEntry] = useState<Partial<MemoryEntry>>({
    title: '',
    content: '',
    tags: [],
    people: [],
    photos: [],
    mood: 'peaceful',
    memoryClarity: 5,
    date: new Date().toISOString().split('T')[0],
  });
  
  const [newTag, setNewTag] = useState('');
  const [newPerson, setNewPerson] = useState('');
  const [voiceRecordingUrl, setVoiceRecordingUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch recent entries
  const { data: recentEntries } = useQuery({
    queryKey: ['/api/memory-diary/recent'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: '1',
          title: 'Morning with grandchildren',
          content: 'Had a wonderful morning playing with the kids...',
          tags: ['family', 'joy'],
          mood: 'happy' as const,
          date: '2025-10-04',
          memoryClarity: 5,
        },
        {
          id: '2',
          title: 'Visit to the park',
          content: 'Went for a walk in the park, saw beautiful flowers...',
          tags: ['nature', 'peaceful'],
          mood: 'peaceful' as const,
          date: '2025-10-03',
          memoryClarity: 4,
        },
      ];
    },
  });

  // Save entry mutation
  const saveEntryMutation = useMutation({
    mutationFn: async (newEntry: Partial<MemoryEntry>) => {
      // Mock API call - replace with actual implementation
      const response = await new Promise<MemoryEntry>((resolve) => {
        setTimeout(() => {
          resolve({
            ...newEntry,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            emotionalTone: newEntry.mood === 'happy' || newEntry.mood === 'excited' ? 'positive' :
                          newEntry.mood === 'sad' || newEntry.mood === 'confused' ? 'negative' : 'neutral',
          } as MemoryEntry);
        }, 1000);
      });
      return response;
    },
    onSuccess: (savedEntry) => {
      queryClient.invalidateQueries({ queryKey: ['/api/memory-diary/recent'] });
      onEntryCreated?.(savedEntry);
      toast({
        title: "Memory saved!",
        description: "Your memory has been successfully recorded.",
      });
      // Reset form
      setEntry({
        title: '',
        content: '',
        tags: [],
        people: [],
        photos: [],
        mood: 'peaceful',
        memoryClarity: 5,
        date: new Date().toISOString().split('T')[0],
      });
      setVoiceRecordingUrl(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save memory. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setVoiceRecordingUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to access microphone.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !entry.tags?.includes(newTag.trim())) {
      setEntry(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEntry(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addPerson = () => {
    if (newPerson.trim() && !entry.people?.includes(newPerson.trim())) {
      setEntry(prev => ({
        ...prev,
        people: [...(prev.people || []), newPerson.trim()]
      }));
      setNewPerson('');
    }
  };

  const removePerson = (personToRemove: string) => {
    setEntry(prev => ({
      ...prev,
      people: prev.people?.filter(person => person !== personToRemove) || []
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === files.length) {
              setEntry(prev => ({
                ...prev,
                photos: [...(prev.photos || []), ...newPhotos]
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    peaceful: '😌',
    confused: '😕',
    excited: '🤗',
    nostalgic: '🥰',
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Create New Entry */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/20">
              <PenTool className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <span className="text-purple-500">Memory Journal</span>
              <p className="text-xs text-muted-foreground font-normal">Record your daily memories and experiences</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Memory Title</label>
              <Input
                value={entry.title}
                onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What happened today?"
                className="border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={entry.date}
                onChange={(e) => setEntry(prev => ({ ...prev, date: e.target.value }))}
                className="border-gray-200"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tell me about this memory</label>
            <Textarea
              value={entry.content}
              onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Describe what happened, how you felt, who was there..."
              className="min-h-32 border-gray-200"
              rows={4}
            />
          </div>

          {/* Voice Recording */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Voice Note (Optional)</label>
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <Button
                  onClick={startVoiceRecording}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Record Voice Note
                </Button>
              ) : (
                <Button
                  onClick={stopVoiceRecording}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <MicOff className="w-4 h-4" />
                  Stop ({formatTime(recordingTime)})
                </Button>
              )}
              
              {voiceRecordingUrl && (
                <div className="flex items-center gap-2">
                  <audio controls src={voiceRecordingUrl} className="h-8">
                    Your browser does not support audio playback.
                  </audio>
                  <Badge variant="secondary">Voice note added</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Photos (Optional)</label>
            <div className="space-y-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Add Photos
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                aria-label="Upload photos"
              />
              
              {entry.photos && entry.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {entry.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Memory photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => {
                          setEntry(prev => ({
                            ...prev,
                            photos: prev.photos?.filter((_, i) => i !== index) || []
                          }));
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mood and Clarity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">How did you feel?</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <Button
                    key={mood}
                    variant={entry.mood === mood ? "default" : "outline"}
                    onClick={() => setEntry(prev => ({ ...prev, mood: mood as any }))}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs capitalize">{mood}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Memory Clarity (1-5)</label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Foggy</span>
                  <span>Crystal Clear</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Button
                      key={level}
                      variant={entry.memoryClarity === level ? "default" : "outline"}
                      onClick={() => setEntry(prev => ({ ...prev, memoryClarity: level }))}
                      className="flex-1"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <Progress value={(entry.memoryClarity || 1) * 20} className="h-2" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {entry.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-xs hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., family, joy, nature)"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1"
              />
              <Button onClick={addTag} variant="outline">Add</Button>
            </div>
          </div>

          {/* People */}
          <div className="space-y-3">
            <label className="text-sm font-medium">People Involved</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {entry.people?.map((person) => (
                <Badge key={person} variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {person}
                  <button
                    onClick={() => removePerson(person)}
                    className="ml-1 text-xs hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Add a person (e.g., Sarah, Grandpa)"
                onKeyPress={(e) => e.key === 'Enter' && addPerson()}
                className="flex-1"
              />
              <Button onClick={addPerson} variant="outline">Add</Button>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location (Optional)</label>
            <Input
              value={entry.location || ''}
              onChange={(e) => setEntry(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Where did this happen?"
              className="border-gray-200"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => saveEntryMutation.mutate(entry)}
              disabled={!entry.title || !entry.content || saveEntryMutation.isPending}
              className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saveEntryMutation.isPending ? 'Saving...' : 'Save Memory'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            Recent Memories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries && recentEntries.length > 0 ? (
            <div className="space-y-4">
              {recentEntries.map((memory) => (
                <div key={memory.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{memory.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {memory.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {moodEmojis[memory.mood]} {memory.mood}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Clarity</div>
                      <div className="text-lg font-bold">{memory.memoryClarity}/5</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {memory.content.length > 150 
                      ? `${memory.content.substring(0, 150)}...` 
                      : memory.content}
                  </p>
                  {memory.tags && memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No memories recorded yet. Start by creating your first memory!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedMemoryDiary;