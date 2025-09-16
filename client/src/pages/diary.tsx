import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="space-y-6" data-testid="page-diary">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Personal Diary
            </h1>
            <p className="text-muted-foreground">
              A safe space to process thoughts, track patterns, and monitor your healing journey
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">🔒 Your Privacy is Protected</p>
              <p className="text-blue-700">
                All diary entries are encrypted and stored securely. Only you can access your personal thoughts and reflections.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="diary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="diary" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            My Diary
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Recovery Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setIsWriting(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {viewMode === "list" ? "Calendar View" : "List View"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {entryCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Writing Interface */}
          {isWriting && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  New Diary Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Entry Title</label>
                    <Input
                      placeholder="What's on your mind today?"
                      value={newEntry.title || ""}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {newEntry.date ? format(newEntry.date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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
                  <label className="text-sm font-medium mb-2 block">Your thoughts and feelings</label>
                  <Textarea
                    placeholder="Write freely about your thoughts, experiences, and emotions. This is your safe space..."
                    value={newEntry.content || ""}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mood Level (1-5)</label>
                    <Select value={newEntry.mood?.toString()} onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Low 😔</SelectItem>
                        <SelectItem value="2">2 - Low 🙁</SelectItem>
                        <SelectItem value="3">3 - Neutral 😐</SelectItem>
                        <SelectItem value="4">4 - Good 🙂</SelectItem>
                        <SelectItem value="5">5 - Great 😊</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Trauma/Stress Level</label>
                    <Select value={newEntry.traumaLevel?.toString()} onValueChange={(value) => setNewEntry(prev => ({ ...prev, traumaLevel: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {traumaLevels.map(level => (
                          <SelectItem key={level.value} value={level.value.toString()}>
                            {level.icon} {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Privacy</label>
                    <Button
                      variant="outline"
                      onClick={() => setNewEntry(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                      className="w-full justify-start"
                    >
                      {newEntry.isPrivate ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {newEntry.isPrivate ? "Private" : "Shareable"}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEntry} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </Button>
                  <Button variant="outline" onClick={() => setIsWriting(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Entries List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Entries ({filteredEntries.length})</h2>
              {entries.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  Tracking since {format(entries[entries.length - 1]?.date || new Date(), "MMM yyyy")}
                </div>
              )}
            </div>

            {filteredEntries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No entries found</h3>
                  <p className="text-muted-foreground mb-4">
                    {entries.length === 0 
                      ? "Start your healing journey by writing your first diary entry."
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  {entries.length === 0 && (
                    <Button onClick={() => setIsWriting(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Write First Entry
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredEntries.map((entry) => {
                  const traumaInfo = getTraumaLevelInfo(entry.traumaLevel);
                  return (
                    <Card key={entry.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg">{entry.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CalendarIcon className="w-4 h-4" />
                              {format(entry.date, "EEEE, MMMM d, yyyy")}
                              {entry.isPrivate && <EyeOff className="w-4 h-4" />}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={traumaInfo.color}>
                              {traumaInfo.icon} {traumaInfo.label}
                            </Badge>
                            <Badge variant="secondary">
                              Mood: {entry.mood}/5
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {entry.content.length > 200 
                            ? `${entry.content.substring(0, 200)}...` 
                            : entry.content
                          }
                        </p>
                        
                        {entry.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {entry.categories.map(category => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {entry.insights && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Heart className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-blue-800 mb-1">Insight</p>
                                <p className="text-sm text-blue-700">{entry.insights}</p>
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
  );
}