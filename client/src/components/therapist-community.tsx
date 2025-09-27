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
      <div className="flex flex-col gap-3 xxs:gap-2 sm:flex-row sm:gap-4">
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
      <div className="space-y-3 xxs:space-y-2 sm:space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-900 rounded-xl xxs:rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg overflow-hidden group">
            {/* Header with Author Info */}
            <div className="p-3 xxs:p-2 sm:p-4 pb-2 xxs:pb-1 sm:pb-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-gray-100 dark:ring-gray-800">
                      <AvatarImage src={`/api/avatar/${post.authorId}`} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {post.authorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {post.authorVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{post.authorName}</h4>
                      <Badge className={getCategoryColor(post.category)} variant="outline">
                        {post.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{post.authorTitle}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {post.authorRating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.authorExperience}y exp
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {post.authorLocation}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">{post.readTime}</span>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                {post.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed mb-3">
                {post.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group/heart">
                    <Heart className="w-4 h-4 group-hover/heart:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group/comment">
                    <MessageCircle className="w-4 h-4 group-hover/comment:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors group/helpful">
                    <ThumbsUp className="w-4 h-4 group-hover/helpful:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{post.helpfulCount}</span>
                  </button>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedPost(post)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium px-4 py-2 rounded-full transition-all duration-200"
                    >
                      Read More
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl">
                    <DialogHeader className="pb-4">
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`/api/avatar/${post.authorId}`} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {post.authorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{post.authorName}</h4>
                            {post.authorVerified && (
                              <Badge variant="secondary" className="text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{post.authorTitle}</p>
                        </div>
                      </div>
                      <DialogTitle className="text-xl font-bold leading-tight">{post.title}</DialogTitle>
                      <DialogDescription className="text-base">
                        {post.readTime} • {post.category}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="text-base leading-relaxed">{post.content}</p>
                        <p className="text-base leading-relaxed">This is a detailed explanation of the topic with evidence-based strategies and practical advice for students dealing with mental health challenges. The approach combines clinical expertise with practical, actionable steps that students can implement in their daily lives.</p>
                        <p className="text-base leading-relaxed">Research shows that early intervention and proper coping strategies can significantly improve outcomes for students facing mental health challenges. By implementing these evidence-based techniques, students can develop resilience and maintain their wellbeing throughout their academic journey.</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <span className="text-sm font-medium">Was this helpful?</span>
                        <div className="flex gap-3">
                          <Button
                            variant={post.userFound === 'helpful' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleHelpfulVote(post.id, true)}
                            className="flex items-center gap-2 rounded-full"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({post.helpfulCount})
                          </Button>
                          <Button
                            variant={post.userFound === 'not-helpful' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleHelpfulVote(post.id, false)}
                            className="flex items-center gap-2 rounded-full"
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
          </div>
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