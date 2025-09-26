import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TraumaAnalytics } from "@/components/trauma-analytics";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter,
  Heart,
  AlertTriangle,
  Shield,
  TrendingUp,
  Edit3,
  Save,
  Eye,
  EyeOff,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

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
  { value: 1, label: "Minimal", color: "bg-green-100 text-green-800", icon: "😌" },
  { value: 2, label: "Mild", color: "bg-yellow-100 text-yellow-800", icon: "😐" },
  { value: 3, label: "Moderate", color: "bg-orange-100 text-orange-800", icon: "😟" },
  { value: 4, label: "High", color: "bg-red-100 text-red-800", icon: "😰" },
  { value: 5, label: "Severe", color: "bg-purple-100 text-purple-800", icon: "😨" }
];

const commonTriggers = [
  "Social situations", "Academic pressure", "Family issues", "Relationship problems",
  "Financial stress", "Health concerns", "Work stress", "Past memories",
  "Specific places", "Certain people", "Time of day", "Weather changes"
];

const entryCategories = [
  "General", "Recovery", "Therapy", "Medication", "Self-care", "Relationships",
  "Work/School", "Breakthrough", "Setback", "Gratitude", "Goals", "Dreams"
];

const moodEmojis = [
  { value: 1, emoji: "😔", label: "Very Low", color: "bg-red-50 border-red-200 text-red-700", bgColor: "bg-gradient-to-br from-red-50 to-red-100" },
  { value: 2, emoji: "🙁", label: "Low", color: "bg-orange-50 border-orange-200 text-orange-700", bgColor: "bg-gradient-to-br from-orange-50 to-orange-100" },
  { value: 3, emoji: "😐", label: "Neutral", color: "bg-gray-50 border-gray-200 text-gray-700", bgColor: "bg-gradient-to-br from-gray-50 to-gray-100" },
  { value: 4, emoji: "🙂", label: "Good", color: "bg-blue-50 border-blue-200 text-blue-700", bgColor: "bg-gradient-to-br from-blue-50 to-blue-100" },
  { value: 5, emoji: "😊", label: "Great", color: "bg-green-50 border-green-200 text-green-700", bgColor: "bg-gradient-to-br from-green-50 to-green-100" }
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
  const [isWriting, setIsWriting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
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
    setIsWriting(false);

    toast({
      title: "Entry Saved",
      description: "Your diary entry has been saved securely.",
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || entry.categories.includes(filterCategory);
    const matchesDate = !selectedDate || format(entry.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const getTraumaLevelInfo = (level: number) => {
    return traumaLevels.find(t => t.value === level) || traumaLevels[0];
  };

  const getMoodInfo = (moodLevel: number) => {
    return moodEmojis.find(m => m.value === moodLevel) || moodEmojis[2];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20" data-testid="page-diary">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <BackButton to="/dashboard" />
        {/* Enhanced Header */}
        <div className="relative">
          {/* Subtle decorative element */}
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-xl -z-10"></div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
                Personal Diary
              </h1>
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                Your safe sanctuary for thoughts, reflections, and healing insights ✨
              </p>
            </div>
          </div>
        </div>

        {/* Refined Privacy Notice */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-sm">
          <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg">
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">
              🔒 <span className="text-emerald-700">Private & Secure</span> - Your entries are encrypted and visible only to you
            </p>
          </div>
        </div>

        {/* Enhanced Main Content with Tabs */}
        <Tabs defaultValue="diary" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-sm p-1 rounded-2xl">
              <TabsTrigger value="diary" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">My Diary</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="diary" className="space-y-8">
            {/* Enhanced Controls */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setIsWriting(true)}
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Entry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
                  className="border-slate-200 hover:border-slate-300 bg-white/60 backdrop-blur-sm hover:bg-white/80 font-medium px-5 py-2.5 rounded-xl transition-all duration-200"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {viewMode === "list" ? "Calendar View" : "List View"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="relative min-w-0 flex-1 lg:flex-initial">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search your thoughts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full lg:w-72 bg-white/60 backdrop-blur-sm border-slate-200/60 focus:border-blue-300 rounded-xl"
                  />
                </div>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full lg:w-40 bg-white/60 backdrop-blur-sm border-slate-200/60 rounded-xl">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {entryCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Enhanced Writing Interface */}
            {isWriting && (
              <Card className="bg-white/70 backdrop-blur-sm border-2 border-blue-200/60 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100/50">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Edit3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xl font-bold text-slate-700">Create New Entry</span>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-blue-500" />
                      Give your entry a title
                    </label>
                    <Input
                      placeholder="Today I want to share..."
                      value={newEntry.title || ""}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-white/80 backdrop-blur-sm border-slate-200/60 focus:border-blue-300 rounded-xl h-12 text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-purple-500" />
                      When did this happen?
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-slate-300 rounded-xl h-12"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {newEntry.date ? format(newEntry.date, "EEEE, MMMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-xl">
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

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Share your thoughts and feelings
                  </label>
                  <Textarea
                    placeholder="This is your personal sanctuary. Write about your experiences, emotions, thoughts, or anything that's on your mind. Take your time and be gentle with yourself... ✨"
                    value={newEntry.content || ""}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    rows={7}
                    className="resize-none bg-white/80 backdrop-blur-sm border-slate-200/60 focus:border-blue-300 rounded-xl text-base leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">How are you feeling?</label>
                    <Select value={newEntry.mood?.toString()} onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: parseInt(value) }))}>
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-xl h-12">
                        <SelectValue placeholder="Select your mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moodEmojis.map(mood => (
                          <SelectItem key={mood.value} value={mood.value.toString()}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{mood.emoji}</span>
                              <span>{mood.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Stress/Trauma Level</label>
                    <Select value={newEntry.traumaLevel?.toString()} onValueChange={(value) => setNewEntry(prev => ({ ...prev, traumaLevel: parseInt(value) }))}>
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-xl h-12">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {traumaLevels.map(level => (
                          <SelectItem key={level.value} value={level.value.toString()}>
                            <div className="flex items-center gap-2">
                              <span>{level.icon}</span>
                              <span>{level.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Entry Privacy</label>
                    <Button
                      variant="outline"
                      onClick={() => setNewEntry(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                      className="w-full justify-start bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-slate-300 rounded-xl h-12"
                    >
                      {newEntry.isPrivate ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-green-700 font-medium">Private Entry</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-blue-700 font-medium">Shareable</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200/60">
                  <Button 
                    onClick={handleSaveEntry} 
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Entry Safely
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsWriting(false)}
                    className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-slate-300 rounded-xl font-medium py-3 px-6 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

            {/* Enhanced Entries List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Your Journey</h2>
                  <p className="text-slate-600">
                    <span className="font-semibold text-blue-600">{filteredEntries.length}</span> entries found
                  </p>
                </div>
                {entries.length > 0 && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <div className="text-sm">
                      <p className="font-medium text-emerald-800">Tracking since</p>
                      <p className="text-emerald-700">{format(entries[entries.length - 1]?.date || new Date(), "MMMM yyyy")}</p>
                    </div>
                  </div>
                )}
              </div>

              {filteredEntries.length === 0 ? (
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                      <BookOpen className="w-full h-full text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">
                      {entries.length === 0 ? "Begin Your Journey" : "No Entries Found"}
                    </h3>
                    <p className="text-slate-600 mb-6 text-lg leading-relaxed max-w-md mx-auto">
                      {entries.length === 0 
                        ? "Your healing journey starts with a single entry. Share your thoughts, feelings, and experiences in this safe space."
                        : "Try adjusting your search terms or filter settings to find your entries."
                      }
                    </p>
                    {entries.length === 0 && (
                      <Button 
                        onClick={() => setIsWriting(true)}
                        className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Write Your First Entry
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                {filteredEntries.map((entry, index) => {
                  const traumaInfo = getTraumaLevelInfo(entry.traumaLevel);
                  const moodInfo = getMoodInfo(entry.mood);
                  return (
                    <Card 
                      key={entry.id} 
                      className="group relative bg-white/80 backdrop-blur-sm hover:bg-white/95 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl border-0 shadow-lg overflow-hidden"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Mood indicator bar */}
                      <div className={`absolute left-0 top-0 w-1.5 h-full ${moodInfo.bgColor.replace('bg-gradient-to-br', 'bg-gradient-to-b')}`}></div>
                      
                      <CardHeader className="pb-4 pl-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-blue-700 transition-colors duration-300">
                              {entry.title}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4" />
                                <span className="font-medium">{format(entry.date, "MMM d, yyyy")}</span>
                              </div>
                              {entry.isPrivate && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full">
                                  <EyeOff className="w-3 h-3" />
                                  <span className="text-xs font-medium">Private</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Enhanced mood display */}
                          <div className="flex flex-col items-end gap-2">
                            <div className={`flex items-center gap-2 px-3 py-1.5 ${moodInfo.color} rounded-full border transition-all duration-300 group-hover:scale-110`}>
                              <span className="text-lg">{moodInfo.emoji}</span>
                              <span className="text-xs font-semibold">{moodInfo.label}</span>
                            </div>
                            <Badge className={`${traumaInfo.color} border-0 shadow-sm`}>
                              <span className="mr-1">{traumaInfo.icon}</span>
                              {traumaInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0 pl-6">
                        <p className="text-slate-700 mb-5 leading-relaxed text-base">
                          {entry.content.length > 180 
                            ? `${entry.content.substring(0, 180)}...` 
                            : entry.content
                          }
                        </p>
                        
                        {entry.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {entry.categories.map(category => (
                              <Badge 
                                key={category} 
                                variant="outline" 
                                className="text-xs font-medium px-2.5 py-1 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:border-slate-300 transition-colors duration-200 rounded-full"
                              >
                                {category}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {entry.insights && (
                          <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-4 rounded-xl border border-amber-100 relative overflow-hidden">
                            {/* Subtle sparkle effect */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-amber-200 rounded-full opacity-60"></div>
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 p-1.5 bg-amber-100 rounded-lg">
                                <Heart className="w-4 h-4 text-amber-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-amber-800 mb-2">✨ Personal Insight</p>
                                <p className="text-sm text-amber-700 leading-relaxed">{entry.insights}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <TraumaAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}