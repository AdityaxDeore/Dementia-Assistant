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
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/peer-support")}
            className="hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-300 rounded-full px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Communities
          </Button>
        </div>
        
        <Card className="border-0 shadow-xl overflow-hidden" style={{ borderRadius: '16px' }}>
          <div className="bg-blue-500 dark:bg-blue-600 p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
                <community.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-white">{community.name}</h1>
                  {community.isSpecialized && (
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      <Shield className="w-3 h-3 mr-1" />
                      Specialized Community
                    </Badge>
                  )}
                </div>
                <p className="text-white/90 text-lg leading-relaxed">{community.longDescription}</p>
                <div className="flex items-center gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{formatNumber(community.memberCount)} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="font-medium">{community.onlineCount} online</span>
                  </div>
                </div>
                {community.accessibilitySupport && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {community.accessibilitySupport.map((support) => (
                      <Badge key={support} className="bg-white/10 text-white border-white/20 text-xs">
                        {support}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Post Creation */}
          <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="bg-green-500 dark:bg-green-600 p-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="w-5 h-5" />
                Create Post in {community.displayName}
              </CardTitle>
            </div>
            <CardContent className="p-6 space-y-4">
              <Input
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="border-2 focus:border-emerald-400 transition-colors"
              />
              <Textarea
                placeholder="What would you like to share with the community?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] border-2 focus:border-emerald-400 transition-colors"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40 border-2 focus:border-emerald-400">
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
                      className="accent-emerald-500"
                    />
                    <label htmlFor="anonymous" className="text-sm flex items-center gap-1">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      Anonymous
                    </label>
                  </div>
                </div>
                <Button 
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim() || !newPostTitle.trim()}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sort and Search */}
          <Card className="border-0 shadow-lg" style={{ borderRadius: '16px' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-500" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-2 focus:border-violet-400 transition-colors"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 border-2 focus:border-violet-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        Hot
                      </div>
                    </SelectItem>
                    <SelectItem value="new">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        New
                      </div>
                    </SelectItem>
                    <SelectItem value="top">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        Top
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Card key={post.id} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden ${
                post.isPinned ? 'ring-2 ring-green-400 bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'
              }`} style={{ borderRadius: '16px' }}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-1 min-w-[50px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`p-2 h-auto rounded-full transition-all duration-300 hover:scale-110 ${
                          post.isLiked ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:bg-orange-100 dark:hover:bg-orange-900/20'
                        }`}
                      >
                        <ThumbsUp className="w-5 h-5" />
                      </Button>
                      <span className={`text-sm font-bold ${
                        post.isLiked ? 'text-orange-600' : 'text-gray-700'
                      }`}>{formatNumber(post.likes)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 h-auto rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-300 hover:scale-110"
                      >
                        <ThumbsUp className="w-5 h-5 rotate-180" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.isPinned && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                            <Pin className="w-3 h-3" />
                            Pinned
                          </div>
                        )}
                        {post.flairText && (
                          <Badge className={`text-xs font-medium ${post.flairColor} border-0`}>
                            {post.flairText}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 font-medium">
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
                      
                      <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 cursor-pointer transition-colors duration-300 leading-tight">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">{post.content}</p>
                      
                      <div className="flex items-center gap-4 pt-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 rounded-full px-3 py-2"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {post.replies} comments
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs hover:bg-purple-100 hover:text-purple-700 transition-all duration-300 rounded-full px-3 py-2"
                        >
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs hover:bg-gray-100 hover:text-gray-700 transition-all duration-300 rounded-full px-3 py-2"
                        >
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
          <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="bg-purple-500 dark:bg-purple-600 p-4">
              <CardTitle className="text-lg text-white">About Community</CardTitle>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{community.description}</p>
              
              <Separator className="bg-gray-200" />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Members</span>
                  <span className="font-bold text-violet-600">{formatNumber(community.memberCount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Online</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-bold text-green-600">{community.onlineCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Rules */}
          <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="bg-orange-500 dark:bg-orange-600 p-4">
              <CardTitle className="text-lg text-white">Community Rules</CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {community.rules.map((rule, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Moderators */}
          <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="bg-pink-500 dark:bg-pink-600 p-4">
              <CardTitle className="text-lg text-white">Moderators</CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                {community.moderators.map((mod) => (
                  <div key={mod} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-pink-50 transition-colors duration-300">
                    <Avatar className="w-8 h-8 border-2 border-pink-200 dark:border-pink-700">
                      <AvatarFallback className="text-xs bg-pink-500 text-white font-bold">{mod[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">u/{mod}</span>
                    </div>
                    <Badge className="bg-pink-500 text-white border-0 text-xs">
                      MOD
                    </Badge>
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