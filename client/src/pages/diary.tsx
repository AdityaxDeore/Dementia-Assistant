import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Search, 
  Save
} from "lucide-react";
import { format } from "date-fns";

// Dynamic import for Calendar to avoid build issues
const Calendar = ({ mode, selected, onSelect, initialFocus, ...props }: any) => {
  return (
    <div className="p-4 text-center">
      <input 
        type="date" 
        value={selected ? format(selected, "yyyy-MM-dd") : ""}
        onChange={(e) => onSelect(e.target.value ? new Date(e.target.value) : null)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: number;
  traumaLevel: number;
  triggers: string[];
  categories: string[];
  isPrivate: boolean;
  insights?: string;
}

const traumaLevels = [
  { value: 1, label: "Minimal", color: "bg-muted text-muted-foreground", icon: "😌" },
  { value: 2, label: "Mild", color: "bg-muted text-muted-foreground", icon: "😐" },
  { value: 3, label: "Moderate", color: "bg-muted text-muted-foreground", icon: "😟" },
  { value: 4, label: "High", color: "bg-muted text-muted-foreground", icon: "😰" },
  { value: 5, label: "Severe", color: "bg-muted text-muted-foreground", icon: "😨" }
];

const moodEmojis = [
  { value: 1, emoji: "😔", label: "Very Low", color: "bg-muted text-muted-foreground" },
  { value: 2, emoji: "🙁", label: "Low", color: "bg-muted text-muted-foreground" },
  { value: 3, emoji: "😐", label: "Neutral", color: "bg-muted text-muted-foreground" },
  { value: 4, emoji: "🙂", label: "Good", color: "bg-muted text-muted-foreground" },
  { value: 5, emoji: "😊", label: "Great", color: "bg-muted text-muted-foreground" }
];

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<DiaryEntry>>({
    title: "",
    content: "",
    date: new Date(),
    mood: 3,
    traumaLevel: 1,
    triggers: [],
    categories: [],
    isPrivate: true
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Load mock data
  useEffect(() => {
    const mockEntries: DiaryEntry[] = [
      {
        id: "1",
        title: "Therapy Session Insights",
        content: "Had a breakthrough in therapy today. Dr. Smith helped me understand my trigger patterns better. I'm starting to see how certain situations remind me of past experiences.",
        date: new Date(2024, 0, 15),
        mood: 4,
        traumaLevel: 2,
        triggers: ["Therapy", "Past memories"],
        categories: ["Therapy", "Breakthrough"],
        isPrivate: true,
        insights: "Progress in understanding trigger patterns"
      },
      {
        id: "2",
        title: "Difficult Day",
        content: "Today was challenging. The presentation at school triggered some anxiety, but I used the breathing techniques we practiced. Small victories count.",
        date: new Date(2024, 0, 12),
        mood: 2,
        traumaLevel: 3,
        triggers: ["Academic pressure", "Social situations"],
        categories: ["Self-care", "Recovery"],
        isPrivate: true
      }
    ];
    setEntries(mockEntries);
  }, []);

  const handleSaveEntry = () => {
    if (!newEntry.title || !newEntry.content) {
      toast({
        title: "Missing Information",
        description: "Please add both a title and content for your entry.",
        variant: "destructive"
      });
      return;
    }

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      title: newEntry.title!,
      content: newEntry.content!,
      date: newEntry.date || new Date(),
      mood: newEntry.mood || 3,
      traumaLevel: newEntry.traumaLevel || 1,
      triggers: newEntry.triggers || [],
      categories: newEntry.categories || [],
      isPrivate: newEntry.isPrivate ?? true
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      title: "",
      content: "",
      date: new Date(),
      mood: 3,
      traumaLevel: 1,
      triggers: [],
      categories: [],
      isPrivate: true
    });

    toast({
      title: "Entry Saved",
      description: "Your diary entry has been saved securely.",
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getTraumaLevelInfo = (level: number) => {
    return traumaLevels.find(t => t.value === level) || traumaLevels[0];
  };

  const getMoodInfo = (moodLevel: number) => {
    return moodEmojis.find(m => m.value === moodLevel) || moodEmojis[2];
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-diary">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <BackButton to="/dashboard" />
        
        {/* Simple Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Personal Diary
          </h1>
          <p className="text-muted-foreground">
            Your safe sanctuary for thoughts and reflections
          </p>
        </div>

        {/* Always Visible Notebook Writing Interface */}
        <Card className="bg-card border-card-border shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="notebook-container">
              {/* Notebook holes decoration */}
              <div className="notebook-holes">
                <div className="notebook-hole"></div>
                <div className="notebook-hole"></div>
                <div className="notebook-hole"></div>
              </div>
              
              {/* Title input */}
              <div className="mb-4">
                <Input
                  placeholder="Give your entry a title..."
                  value={newEntry.title || ""}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-background border-border focus:border-primary rounded-lg h-12 text-base font-medium"
                  aria-label="Diary entry title"
                />
              </div>
              
              {/* Notebook header */}
              <div className="notebook-header relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 -ml-4"></div>
                {newEntry.title || "Untitled Entry"}
              </div>
              
              {/* Notebook writing area */}
              <Textarea
                placeholder="Dear diary, today I want to share...&#10;&#10;Write your thoughts naturally as if you're writing in a real notebook. Each line will align with the ruled paper below."
                value={newEntry.content || ""}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                className="notebook-paper border-0 resize-none"
                rows={12}
                aria-label="Diary entry content"
              />
              
              {/* Quick metadata controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Mood</label>
                  <Select value={newEntry.mood?.toString()} onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: parseInt(value) }))}>
                    <SelectTrigger className="bg-background border-border rounded-lg h-10" aria-label="Select your mood">
                      <SelectValue placeholder="How are you feeling?" />
                    </SelectTrigger>
                    <SelectContent>
                      {moodEmojis.map(mood => (
                        <SelectItem key={mood.value} value={mood.value.toString()}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg" aria-hidden="true">{mood.emoji}</span>
                            <span>{mood.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Stress Level</label>
                  <Select value={newEntry.traumaLevel?.toString()} onValueChange={(value) => setNewEntry(prev => ({ ...prev, traumaLevel: parseInt(value) }))}>
                    <SelectTrigger className="bg-background border-border rounded-lg h-10" aria-label="Select stress level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {traumaLevels.map(level => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          <div className="flex items-center gap-2">
                            <span aria-hidden="true">{level.icon}</span>
                            <span>{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-background border-border hover:border-primary rounded-lg h-10"
                        aria-label="Select entry date"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                        {newEntry.date ? format(newEntry.date, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover border border-popover-border rounded-lg shadow-xl">
                      <Calendar
                        mode="single"
                        selected={newEntry.date}
                        onSelect={(date) => setNewEntry(prev => ({ ...prev, date: date || new Date() }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Save button */}
              <div className="mt-8">
                <Button 
                  onClick={handleSaveEntry} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!newEntry.title && !newEntry.content}
                  aria-label="Save diary entry"
                >
                  <Save className="w-5 h-5 mr-2" aria-hidden="true" />
                  Save Entry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Entries - Enhanced Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Your Journey</h2>
              <p className="text-muted-foreground">Reflecting on your thoughts and experiences</p>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </div>
          </div>
          
          {/* Enhanced Search */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground/60" aria-hidden="true" />
            </div>
            <Input
              placeholder="Search your memories and thoughts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-card border-card-border focus:border-primary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-base"
              aria-label="Search diary entries"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted rounded-full"
                aria-label="Clear search"
              >
                ✕
              </Button>
            )}
          </div>

          {filteredEntries.length === 0 ? (
            <Card className="bg-card border-card-border shadow-md rounded-lg">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {entries.length === 0 ? "Start Writing" : "No Entries Found"}
                </h3>
                <p className="text-muted-foreground">
                  {entries.length === 0 
                    ? "Begin your journaling journey by writing your first entry above."
                    : "Try adjusting your search terms to find your entries."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredEntries.map((entry, index) => {
                const traumaInfo = getTraumaLevelInfo(entry.traumaLevel);
                const moodInfo = getMoodInfo(entry.mood);
                return (
                  <Card 
                    key={entry.id} 
                    className="group bg-card border-card-border hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1 relative"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Mood color accent bar */}
                    <div className={`absolute left-0 top-0 w-2 h-full ${
                      entry.mood === 5 ? 'bg-gradient-to-b from-emerald-400 to-green-500' :
                      entry.mood === 4 ? 'bg-gradient-to-b from-sky-400 to-blue-500' :
                      entry.mood === 3 ? 'bg-gradient-to-b from-slate-300 to-slate-400' :
                      entry.mood === 2 ? 'bg-gradient-to-b from-amber-400 to-orange-500' :
                      'bg-gradient-to-b from-rose-400 to-red-500'
                    }`}></div>
                    
                    {/* Sparkle decoration */}
                    <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                      <div className="w-8 h-8 text-primary animate-pulse">
                        ✨
                      </div>
                    </div>
                    
                    <CardHeader className="pb-4 pl-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full shadow-lg ${
                              entry.mood === 5 ? 'bg-emerald-100 border-2 border-emerald-200' :
                              entry.mood === 4 ? 'bg-sky-100 border-2 border-sky-200' :
                              entry.mood === 3 ? 'bg-slate-100 border-2 border-slate-200' :
                              entry.mood === 2 ? 'bg-amber-100 border-2 border-amber-200' :
                              'bg-rose-100 border-2 border-rose-200'
                            }`}>
                              <span className="text-2xl" aria-hidden="true">{moodInfo.emoji}</span>
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
                                {entry.title}
                              </CardTitle>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-full">
                                  <CalendarIcon className="w-3 h-3" aria-hidden="true" />
                                  <span className="font-medium">{format(entry.date, "MMM d, yyyy")}</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${
                                  entry.mood === 5 ? 'bg-emerald-50 text-emerald-700' :
                                  entry.mood === 4 ? 'bg-sky-50 text-sky-700' :
                                  entry.mood === 3 ? 'bg-slate-50 text-slate-700' :
                                  entry.mood === 2 ? 'bg-amber-50 text-amber-700' :
                                  'bg-rose-50 text-rose-700'
                                }`}>
                                  <span className="font-semibold">{moodInfo.label}</span>
                                </div>
                                {traumaInfo.value > 2 && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
                                    <span className="text-xs" aria-hidden="true">{traumaInfo.icon}</span>
                                    <span className="text-xs font-medium">{traumaInfo.label} Stress</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pl-6 pb-6">
                      <div className="bg-muted/20 rounded-lg p-4 border-l-4 border-l-primary/30">
                        <p className="text-card-foreground leading-relaxed text-base font-medium italic">
                          "{entry.content.length > 200 
                            ? `${entry.content.substring(0, 200)}...` 
                            : entry.content}"
                        </p>
                      </div>
                      
                      {/* Interactive footer */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <span className="text-xs text-muted-foreground font-medium">Personal & Private</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-3 text-xs hover:bg-primary/10 hover:text-primary rounded-full"
                          >
                            📖 Read More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );              
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}