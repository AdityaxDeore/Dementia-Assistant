import { useState } from "react";
import { MessageSquare, ThumbsUp, Reply, MoreHorizontal, Clock, Shield, Users, Heart, BookOpen, Accessibility, Volume2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  replies: number;
  category: string;
  community: string;
  isAnonymous: boolean;
  isLiked?: boolean;
  accessibility?: {
    hasAudioDescription?: boolean;
    hasSignLanguage?: boolean;
    isScreenReaderFriendly?: boolean;
  };
}

interface Community {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  isSpecialized: boolean;
  accessibilitySupport?: string[];
}

export function PeerSupportForum() {
  const [newPost, setNewPost] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState("general");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [activeTab, setActiveTab] = useState("all");
  
  // Define specialized communities
  const communities: Community[] = [
    {
      id: "general",
      name: "General Support",
      description: "Open community for all students",
      icon: Users,
      color: "text-blue-600",
      isSpecialized: false
    },
    {
      id: "visual-impaired",
      name: "Vision Support",
      description: "Community for students with visual impairments",
      icon: Eye,
      color: "text-purple-600",
      isSpecialized: true,
      accessibilitySupport: ["Screen reader compatible", "High contrast support", "Audio descriptions"]
    },
    {
      id: "hearing-impaired",
      name: "Hearing Support",
      description: "Community for students with hearing impairments",
      icon: Volume2,
      color: "text-green-600",
      isSpecialized: true,
      accessibilitySupport: ["Sign language support", "Visual indicators", "Captions available"]
    },
    {
      id: "mobility-support",
      name: "Mobility Support",
      description: "Community for students with mobility challenges",
      icon: Accessibility,
      color: "text-orange-600",
      isSpecialized: true,
      accessibilitySupport: ["Campus accessibility info", "Transportation support", "Adaptive resources"]
    },
    {
      id: "learning-differences",
      name: "Learning Differences",
      description: "Support for neurodiverse learners",
      icon: BookOpen,
      color: "text-pink-600",
      isSpecialized: true,
      accessibilitySupport: ["Learning strategies", "Study accommodations", "Time management tools"]
    },
    {
      id: "mental-wellness",
      name: "Mental Wellness",
      description: "Mental health support community",
      icon: Heart,
      color: "text-red-600",
      isSpecialized: true,
      accessibilitySupport: ["Crisis support", "Peer counseling", "Wellness resources"]
    }
  ];
  
  // Mock posts with enhanced community support
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'Dealing with exam stress',
      content: 'Final exams are coming up and I\'m feeling overwhelmed. Anyone have tips for managing the anxiety?',
      author: 'Anonymous Student',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      replies: 5,
      category: 'Academic Stress',
      community: 'mental-wellness',
      isAnonymous: true,
      isLiked: false
    },
    {
      id: '2',
      title: 'Finding my study group',
      content: 'Looking for supportive study partners for engineering courses. Let\'s help each other succeed!',
      author: 'StudyBuddy23',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 8,
      replies: 12,
      category: 'Study Groups',
      community: 'general',
      isAnonymous: false,
      isLiked: true
    },
    {
      id: '3',
      title: 'Mindfulness changed my life',
      content: 'Started practicing meditation 3 months ago. My stress levels have decreased significantly. Happy to share resources!',
      author: 'Anonymous Student',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 24,
      replies: 8,
      category: 'Wellness Tips',
      community: 'mental-wellness',
      isAnonymous: true,
      isLiked: false
    },
    {
      id: '4',
      title: 'Screen reader tips for online learning',
      content: 'Sharing some great screen reader shortcuts that have helped me navigate online courses better. NVDA users especially!',
      author: 'Anonymous Student',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 15,
      replies: 7,
      category: 'Study Tips',
      community: 'visual-impaired',
      isAnonymous: true,
      isLiked: false,
      accessibility: { isScreenReaderFriendly: true }
    },
    {
      id: '5',
      title: 'Campus accessibility map update',
      content: 'The new accessibility map for campus is fantastic! All elevator locations and accessible routes are clearly marked.',
      author: 'AccessibilityAdvocate',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 28,
      replies: 11,
      category: 'Campus Info',
      community: 'mobility-support',
      isAnonymous: false,
      isLiked: true
    }
  ]);

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.substring(0, 60) + (newPost.length > 60 ? '...' : ''),
      content: newPost,
      author: isAnonymous ? 'Anonymous Student' : 'You',
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      category: selectedCategory,
      community: selectedCommunity,
      isAnonymous
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost("");
    console.log('Posted to forum:', post);
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
    console.log(`Liked post: ${postId}`);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Filter posts based on active tab
  const filteredPosts = posts.filter(post => {
    if (activeTab === "all") return true;
    return post.community === activeTab;
  });

  const getCommunityInfo = (communityId: string) => {
    return communities.find(c => c.id === communityId) || communities[0];
  };

  return (
    <div className="space-y-6" data-testid="peer-support-forum">
      {/* Community Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Specialized Communities
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Connect with communities that understand your unique experiences and challenges
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              {communities.map((community) => (
                <TabsTrigger key={community.id} value={community.id} className="text-xs">
                  <community.icon className={`w-4 h-4 mr-1 ${community.color}`} />
                  {community.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Community Info Cards */}
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {communities.filter(c => c.isSpecialized).map((community) => (
                <Card key={community.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <community.icon className={`w-6 h-6 ${community.color} mt-1`} />
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">{community.name}</h4>
                        <p className="text-xs text-muted-foreground">{community.description}</p>
                        {community.accessibilitySupport && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {community.accessibilitySupport.slice(0, 2).map((support) => (
                              <Badge key={support} variant="secondary" className="text-xs">
                                {support}
                              </Badge>
                            ))}
                            {community.accessibilitySupport.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{community.accessibilitySupport.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Share with the Community
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
              <SelectTrigger>
                <SelectValue placeholder="Select community" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((community) => (
                  <SelectItem key={community.id} value={community.id}>
                    <div className="flex items-center gap-2">
                      <community.icon className={`w-4 h-4 ${community.color}`} />
                      {community.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Academic Stress">Academic Stress</SelectItem>
                <SelectItem value="Study Tips">Study Tips</SelectItem>
                <SelectItem value="Campus Info">Campus Info</SelectItem>
                <SelectItem value="Wellness Tips">Wellness Tips</SelectItem>
                <SelectItem value="Study Groups">Study Groups</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            placeholder="Share your thoughts, ask for support, or offer encouragement to fellow students..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] resize-none"
            data-testid="textarea-new-post"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded"
                data-testid="checkbox-anonymous"
              />
              <label htmlFor="anonymous" className="text-sm flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Post anonymously
              </label>
            </div>
            <Button 
              onClick={handleSubmitPost}
              disabled={!newPost.trim()}
              data-testid="button-submit-post"
            >
              Share Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forum Posts */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "all" ? "All Community Discussions" : 
             `${getCommunityInfo(activeTab).name} Discussions`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredPosts.map((post, index) => {
            const communityInfo = getCommunityInfo(post.community);
            return (
              <div key={post.id}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {post.isAnonymous ? '?' : post.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{post.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <communityInfo.icon className={`w-3 h-3 ${communityInfo.color}`} />
                          <span className="text-xs text-muted-foreground">{communityInfo.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(post.timestamp)}
                        </span>
                        {post.accessibility?.isScreenReaderFriendly && (
                          <Badge variant="secondary" className="text-xs">
                            Screen Reader Friendly
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">{post.content}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`text-xs ${post.isLiked ? 'text-primary' : ''}`}
                          data-testid={`button-like-${post.id}`}
                        >
                          <ThumbsUp className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          data-testid={`button-reply-${post.id}`}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          {post.replies} replies
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          data-testid={`button-more-${post.id}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {index < filteredPosts.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}