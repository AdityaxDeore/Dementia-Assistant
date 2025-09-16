import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Search, 
  Filter,
  BookOpen,
  Award,
  Users,
  Calendar,
  MapPin
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TherapistPost {
  id: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorSpecialty: string[];
  authorExperience: number;
  authorRating: number;
  authorLocation: string;
  authorVerified: boolean;
  title: string;
  content: string;
  category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'academic' | 'trauma' | 'general';
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  helpfulCount: number;
  userFound: 'helpful' | 'not-helpful' | null;
  readTime: string;
}

interface Comment {
  id: string;
  authorName: string;
  authorType: 'therapist' | 'student';
  content: string;
  createdAt: string;
  likes: number;
}

const mockTherapistPosts: TherapistPost[] = [
  {
    id: '1',
    authorId: 'dr-sarah',
    authorName: 'Dr. Sarah Chen',
    authorTitle: 'Licensed Clinical Psychologist',
    authorSpecialty: ['Anxiety', 'Depression', 'CBT'],
    authorExperience: 8,
    authorRating: 4.9,
    authorLocation: 'California, USA',
    authorVerified: true,
    title: 'Managing Exam Anxiety: Evidence-Based Strategies That Actually Work',
    content: 'As someone who has worked with hundreds of students facing exam anxiety, I want to share some practical strategies that have shown consistent results...',
    category: 'anxiety',
    tags: ['exam-stress', 'anxiety-management', 'study-tips'],
    createdAt: '2024-01-15',
    likes: 245,
    comments: 34,
    helpfulCount: 189,
    userFound: null,
    readTime: '5 min read'
  },
  {
    id: '2',
    authorId: 'dr-michael',
    authorName: 'Dr. Michael Rodriguez',
    authorTitle: 'Trauma-Informed Therapist',
    authorSpecialty: ['Trauma', 'EMDR', 'PTSD'],
    authorExperience: 12,
    authorRating: 4.8,
    authorLocation: 'Texas, USA',
    authorVerified: true,
    title: 'Building Healthy Relationships After Difficult Experiences',
    content: 'Recovery is not just about healing from the past, but also about building meaningful connections for the future...',
    category: 'relationships',
    tags: ['trauma-recovery', 'healthy-relationships', 'healing'],
    createdAt: '2024-01-12',
    likes: 156,
    comments: 28,
    helpfulCount: 142,
    userFound: null,
    readTime: '7 min read'
  },
  {
    id: '3',
    authorId: 'dr-priya',
    authorName: 'Dr. Priya Patel',
    authorTitle: 'Mindfulness-Based Therapist',
    authorSpecialty: ['Mindfulness', 'Stress Management', 'Academic Pressure'],
    authorExperience: 6,
    authorRating: 4.7,
    authorLocation: 'New York, USA',
    authorVerified: true,
    title: 'The Science of Sleep: Why Students Need Better Rest for Mental Health',
    content: 'Sleep is not just about physical recovery - it is fundamental to emotional regulation and cognitive function...',
    category: 'stress',
    tags: ['sleep-hygiene', 'mental-health', 'student-wellness'],
    createdAt: '2024-01-10',
    likes: 198,
    comments: 45,
    helpfulCount: 167,
    userFound: null,
    readTime: '6 min read'
  }
];

export function TherapistCommunity() {
  const [posts, setPosts] = useState<TherapistPost[]>(mockTherapistPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<TherapistPost | null>(null);

  const handleHelpfulVote = (postId: string, helpful: boolean) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            helpfulCount: helpful 
              ? post.helpfulCount + (post.userFound === 'helpful' ? 0 : 1)
              : post.helpfulCount - (post.userFound === 'helpful' ? 1 : 0),
            userFound: helpful ? 'helpful' : 'not-helpful'
          }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      anxiety: 'bg-red-100 text-red-800 border-red-200',
      depression: 'bg-blue-100 text-blue-800 border-blue-200',
      stress: 'bg-orange-100 text-orange-800 border-orange-200',
      relationships: 'bg-pink-100 text-pink-800 border-pink-200',
      academic: 'bg-green-100 text-green-800 border-green-200',
      trauma: 'bg-purple-100 text-purple-800 border-purple-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div className="space-y-6" data-testid="therapist-community">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          Professional Insights
        </h2>
        <p className="text-muted-foreground">
          Evidence-based guidance and insights from verified mental health professionals
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search posts, topics, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="anxiety">Anxiety</SelectItem>
            <SelectItem value="depression">Depression</SelectItem>
            <SelectItem value="stress">Stress Management</SelectItem>
            <SelectItem value="relationships">Relationships</SelectItem>
            <SelectItem value="academic">Academic Pressure</SelectItem>
            <SelectItem value="trauma">Trauma & Recovery</SelectItem>
            <SelectItem value="general">General Wellness</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="card-enhanced-hover group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`/api/avatar/${post.authorId}`} />
                    <AvatarFallback>{post.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{post.authorName}</h4>
                      {post.authorVerified && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{post.authorTitle}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {post.authorRating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.authorExperience} years experience
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {post.authorLocation}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={getCategoryColor(post.category)} variant="outline">
                  {post.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {post.helpfulCount} found helpful
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                        Read More
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{post.title}</DialogTitle>
                        <DialogDescription>
                          By {post.authorName} • {post.readTime}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="prose prose-sm max-w-none">
                          <p>{post.content}</p>
                          <p>This is a detailed explanation of the topic with evidence-based strategies and practical advice for students dealing with mental health challenges...</p>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-4 border-t">
                          <span className="text-sm text-muted-foreground">Was this helpful?</span>
                          <div className="flex gap-2">
                            <Button
                              variant={post.userFound === 'helpful' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleHelpfulVote(post.id, true)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              Helpful
                            </Button>
                            <Button
                              variant={post.userFound === 'not-helpful' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleHelpfulVote(post.id, false)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsDown className="w-4 h-4" />
                              Not Helpful
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find relevant content.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}