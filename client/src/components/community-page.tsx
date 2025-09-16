import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { MessageSquare, ThumbsUp, Reply, MoreHorizontal, Clock, Shield, Users, TrendingUp, Pin, Award, ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  replies: number;
  category: string;
  isAnonymous: boolean;
  isPinned?: boolean;
  isLiked?: boolean;
  flairText?: string;
  flairColor?: string;
  awards?: string[];
}

interface CommunityInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  longDescription: string;
  icon: any;
  color: string;
  memberCount: number;
  onlineCount: number;
  rules: string[];
  moderators: string[];
  categories: string[];
  isSpecialized: boolean;
  accessibilitySupport?: string[];
}

// Mock community data
const COMMUNITIES: Record<string, CommunityInfo> = {
  "general": {
    id: "general",
    name: "r/GeneralSupport",
    displayName: "General Support",
    description: "A supportive community for all students",
    longDescription: "Welcome to General Support! This is an inclusive space for all students to share experiences, ask questions, and support each other through academic and personal challenges.",
    icon: Users,
    color: "text-blue-600",
    memberCount: 12543,
    onlineCount: 234,
    rules: [
      "Be respectful and kind to all members",
      "No spam or promotional content",
      "Use appropriate post flairs",
      "Search before posting duplicate questions"
    ],
    moderators: ["StudentHelper", "CampusGuide", "WellnessAdvocate"],
    categories: ["Academic", "Social", "General", "Study Tips"],
    isSpecialized: false
  },
  "visual-impaired": {
    id: "visual-impaired",
    name: "r/VisionSupport", 
    displayName: "Vision Support Community",
    description: "Supporting students with visual impairments",
    longDescription: "A dedicated community for students with visual impairments. Share tips, resources, and experiences about navigating academic life with accessibility tools and support.",
    icon: Users,
    color: "text-purple-600", 
    memberCount: 892,
    onlineCount: 23,
    rules: [
      "All posts must be screen reader compatible",
      "Describe images and visual content",
      "Share accessibility resources",
      "Respect diverse levels of vision"
    ],
    moderators: ["AccessibilityExpert", "ScreenReaderPro"],
    categories: ["Screen Readers", "Accessibility Tools", "Campus Navigation", "Study Resources"],
    isSpecialized: true,
    accessibilitySupport: ["Screen reader compatible", "High contrast support", "Audio descriptions"]
  },
  "hearing-impaired": {
    id: "hearing-impaired",
    name: "r/HearingSupport",
    displayName: "Hearing Support Community", 
    description: "Community for students with hearing impairments",
    longDescription: "Connect with fellow students who are deaf or hard of hearing. Share experiences, accessibility tips, and support each other in academic success.",
    icon: Users,
    color: "text-green-600",
    memberCount: 654,
    onlineCount: 18,
    rules: [
      "Provide captions for video content",
      "Use clear, simple language when possible", 
      "Share sign language resources",
      "Be patient with communication differences"
    ],
    moderators: ["SignLanguageHelper", "CaptionExpert"],
    categories: ["Sign Language", "Assistive Technology", "Campus Resources", "Communication"],
    isSpecialized: true,
    accessibilitySupport: ["Sign language support", "Visual indicators", "Captions available"]
  },
  "mobility-support": {
    id: "mobility-support", 
    name: "r/MobilitySupport",
    displayName: "Mobility Support Community",
    description: "Support for students with mobility challenges",
    longDescription: "A community for students with mobility impairments. Share campus accessibility information, adaptive resources, and support each other's academic journey.",
    icon: Users,
    color: "text-orange-600",
    memberCount: 743,
    onlineCount: 15,
    rules: [
      "Share campus accessibility updates",
      "Respect different mobility needs",
      "Provide detailed location information",
      "Support adaptive technology discussions"
    ],
    moderators: ["MobilityAdvocate", "CampusAccessibility"],
    categories: ["Campus Accessibility", "Adaptive Technology", "Transportation", "Resources"],
    isSpecialized: true,
    accessibilitySupport: ["Campus accessibility info", "Transportation support", "Adaptive resources"]
  },
  "learning-differences": {
    id: "learning-differences",
    name: "r/LearningDifferences", 
    displayName: "Learning Differences Community",
    description: "Support for neurodiverse learners",
    longDescription: "A welcoming space for students with learning differences, ADHD, autism, dyslexia, and other neurodivergent conditions. Share strategies, accommodations, and celebrate diverse learning styles.",
    icon: Users,
    color: "text-pink-600",
    memberCount: 1834,
    onlineCount: 67,
    rules: [
      "Celebrate neurodiversity", 
      "Share learning strategies respectfully",
      "No medical advice - share experiences only",
      "Support different learning paces"
    ],
    moderators: ["NeuroAdvocate", "LearningExpert", "StudyStrategist"], 
    categories: ["Study Strategies", "Accommodations", "Time Management", "Self-Advocacy"],
    isSpecialized: true,
    accessibilitySupport: ["Learning strategies", "Study accommodations", "Time management tools"]
  },
  "mental-wellness": {
    id: "mental-wellness",
    name: "r/MentalWellness",
    displayName: "Mental Wellness Community", 
    description: "Mental health support and resources",  
    longDescription: "A safe space for students to discuss mental health, share coping strategies, and support each other's wellness journey. Professional resources and peer support available.",
    icon: Users,
    color: "text-red-600",
    memberCount: 3247,
    onlineCount: 89,
    rules: [
      "Be supportive and non-judgmental",
      "No medical advice - share experiences only", 
      "Use trigger warnings when appropriate",
      "Crisis situations - contact emergency services"
    ],
    moderators: ["WellnessGuide", "PeerCounselor", "MentalHealthAdvocate"],
    categories: ["Coping Strategies", "Academic Stress", "Self-Care", "Resources"],
    isSpecialized: true,
    accessibilitySupport: ["Crisis support", "Peer counseling", "Wellness resources"]
  }
};

export function CommunityPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const communityId = params.id || "general";
  const community = COMMUNITIES[communityId];
  
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("hot");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock posts for each community
  useEffect(() => {
    const mockPosts: Record<string, CommunityPost[]> = {
      "general": [
        {
          id: "1",
          title: "First semester tips for new students?",
          content: "Starting university next month and feeling nervous. What advice would you give to incoming freshmen?",
          author: "NewStudent2024",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 234,
          replies: 67,
          category: "Academic",
          isAnonymous: false,
          isPinned: true,
          flairText: "Discussion",
          flairColor: "bg-blue-100 text-blue-800"
        },
        {
          id: "2", 
          title: "Study group for Engineering Math",
          content: "Looking for people to form a study group for Engineering Mathematics. Meeting twice a week at the library.",
          author: "MathWhiz",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          likes: 89,
          replies: 23,
          category: "Study Tips",
          isAnonymous: false,
          flairText: "Study Group",
          flairColor: "bg-green-100 text-green-800"
        }
      ],
      "visual-impaired": [
        {
          id: "v1",
          title: "Best screen reader settings for online exams",
          content: "Sharing my optimal NVDA configuration for taking online exams. These settings have helped me significantly improve my test-taking speed and accuracy.",
          author: "AccessibilityPro",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          likes: 156,
          replies: 34,
          category: "Screen Readers",
          isAnonymous: false,
          isPinned: true,
          flairText: "Resource",
          flairColor: "bg-purple-100 text-purple-800"
        }
      ],
      "hearing-impaired": [
        {
          id: "h1",
          title: "New ASL interpreter services on campus",
          content: "The university just expanded their ASL interpreter services! Now available for all lectures and study groups. Here's how to request one.",
          author: "DeafStudentUnion",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 98,
          replies: 12,
          category: "Campus Resources",
          isAnonymous: false,
          isPinned: true,
          flairText: "News",
          flairColor: "bg-green-100 text-green-800"
        }
      ],
      "mobility-support": [
        {
          id: "m1",
          title: "Campus accessibility map updated!",
          content: "The new interactive accessibility map is amazing! Shows all ramps, elevators, accessible bathrooms, and parking. Link in comments.",
          author: "MobilityAdvocate",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          likes: 187,
          replies: 45,
          category: "Campus Accessibility",
          isAnonymous: false,
          isPinned: true,
          flairText: "Resource",
          flairColor: "bg-orange-100 text-orange-800"
        }
      ],
      "learning-differences": [
        {
          id: "l1",
          title: "ADHD study techniques that actually work",
          content: "After years of trial and error, here are the study methods that have genuinely helped me focus and retain information better.",
          author: "ADHDSuccess", 
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          likes: 312,
          replies: 89,
          category: "Study Strategies",
          isAnonymous: false,
          flairText: "Success Story",
          flairColor: "bg-pink-100 text-pink-800",
          awards: ["helpful", "wholesome"]
        }
      ],
      "mental-wellness": [
        {
          id: "w1",
          title: "Managing exam anxiety - what works for you?",
          content: "Finals are approaching and my anxiety is through the roof. Looking for practical strategies that have helped others cope with test anxiety.",
          author: "Anonymous Student",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 445,
          replies: 156,
          category: "Academic Stress",
          isAnonymous: true,
          flairText: "Support",
          flairColor: "bg-red-100 text-red-800"
        }
      ]
    };

    setPosts(mockPosts[communityId] || []);
  }, [communityId]);

  if (!community) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Community Not Found</h2>
          <p className="text-muted-foreground">The community you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/peer-support")}>
            Back to Communities
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmitPost = () => {
    if (!newPost.trim() || !newPostTitle.trim()) return;
    
    const post: CommunityPost = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPost,
      author: isAnonymous ? 'Anonymous Student' : 'You',
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      category: selectedCategory || community.categories[0],
      isAnonymous,
      flairText: "Discussion",
      flairColor: "bg-blue-100 text-blue-800"
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost("");
    setNewPostTitle("");
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation("/peer-support")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Communities
          </Button>
        </div>
        
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full bg-white shadow-md`}>
                <community.icon className={`w-8 h-8 ${community.color}`} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{community.name}</h1>
                  {community.isSpecialized && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Specialized
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{community.longDescription}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{formatNumber(community.memberCount)} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{community.onlineCount} online</span>
                  </div>
                </div>
                {community.accessibilitySupport && (
                  <div className="flex flex-wrap gap-2">
                    {community.accessibilitySupport.map((support) => (
                      <Badge key={support} variant="outline" className="text-xs">
                        {support}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Post Creation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Create Post in {community.displayName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="What would you like to share with the community?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {community.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <label htmlFor="anonymous" className="text-sm flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Anonymous
                    </label>
                  </div>
                </div>
                <Button 
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim() || !newPostTitle.trim()}
                >
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sort and Search */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Hot
                  </div>
                </SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="top">Top</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Card key={post.id} className={`hover:shadow-md transition-shadow ${post.isPinned ? 'border-green-200 bg-green-50/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`p-1 h-auto ${post.isLiked ? 'text-orange-600' : 'text-muted-foreground'}`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                      <Button variant="ghost" size="sm" className="p-1 h-auto text-muted-foreground">
                        <ThumbsUp className="w-4 h-4 rotate-180" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.isPinned && (
                          <Pin className="w-4 h-4 text-green-600" />
                        )}
                        {post.flairText && (
                          <Badge className={`text-xs ${post.flairColor}`}>
                            {post.flairText}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Posted by u/{post.author} • {formatTimeAgo(post.timestamp)}
                        </span>
                        {post.awards && post.awards.length > 0 && (
                          <div className="flex gap-1">
                            {post.awards.map((award) => (
                              <Award key={award} className="w-4 h-4 text-yellow-500" />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm">{post.content}</p>
                      
                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.replies} comments
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{community.description}</p>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Members</span>
                  <span className="font-medium">{formatNumber(community.memberCount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Online</span>
                  <span className="font-medium">{community.onlineCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {community.rules.map((rule, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{index + 1}. </span>
                    <span className="text-muted-foreground">{rule}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Moderators */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {community.moderators.map((mod) => (
                  <div key={mod} className="flex items-center gap-2 text-sm">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">{mod[0]}</AvatarFallback>
                    </Avatar>
                    <span>u/{mod}</span>
                    <Badge variant="outline" className="text-xs">MOD</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}