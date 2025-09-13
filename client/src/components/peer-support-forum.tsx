import { useState } from "react";
import { MessageSquare, ThumbsUp, Reply, MoreHorizontal, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  replies: number;
  category: string;
  isAnonymous: boolean;
  isLiked?: boolean;
}

export function PeerSupportForum() {
  const [newPost, setNewPost] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  
  // TODO: remove mock functionality
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
      isAnonymous: true,
      isLiked: false
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
      category: 'General',
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

  return (
    <div className="space-y-6" data-testid="peer-support-forum">
      {/* Create New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Share with the Community
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <CardTitle>Community Discussions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.map((post, index) => (
            <div key={post.id}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {post.isAnonymous ? '?' : post.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{post.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(post.timestamp)}
                      </span>
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
              {index < posts.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}