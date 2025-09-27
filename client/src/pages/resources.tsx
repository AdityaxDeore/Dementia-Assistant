import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink, 
  Search, 
  Star,
  Clock,
  Users,
  Award,
  Brain,
  Heart,
  Target,
  Lightbulb,
  Headphones,
  Play,
  Download,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Share2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'exercise' | 'audio' | 'interactive';
  category: string;
  readTime?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  featured: boolean;
  author: string;
  tags: string[];
  url: string;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();
  
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Managing Exam Anxiety: A Complete Student Guide',
      description: 'Evidence-based strategies to overcome test anxiety, improve performance, and maintain mental wellness during exam periods.',
      type: 'article',
      category: 'Academic Stress',
      readTime: '12 min read',
      difficulty: 'beginner',
      rating: 4.8,
      downloads: 2847,
      featured: true,
      author: 'Dr. Sarah Chen',
      tags: ['anxiety', 'exams', 'study-tips', 'mindfulness'],
      url: '#',
      likes: 234,
      comments: 45,
      shares: 78,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      title: 'Breathing Techniques for Instant Calm',
      description: 'Quick and effective breathing exercises you can practice anywhere to reduce stress and anxiety in moments.',
      type: 'video',
      category: 'Mindfulness',
      readTime: '8 min watch',
      difficulty: 'beginner',
      rating: 4.9,
      downloads: 3521,
      featured: true,
      author: 'Mindfulness Institute',
      tags: ['breathing', 'relaxation', 'stress-relief'],
      url: '#',
      likes: 412,
      comments: 89,
      shares: 156,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '3',
      title: 'Building Resilience Through Daily Habits',
      description: 'Comprehensive guide to developing mental resilience through small, consistent daily practices.',
      type: 'guide',
      category: 'Mental Health',
      readTime: '18 min read',
      difficulty: 'intermediate',
      rating: 4.7,
      downloads: 1923,
      featured: false,
      author: 'Dr. Michael Rodriguez',
      tags: ['resilience', 'habits', 'mental-health'],
      url: '#',
      likes: 187,
      comments: 32,
      shares: 54,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '4',
      title: 'Sleep Hygiene for Better Mental Health',
      description: 'Scientific approaches to improving sleep quality and its impact on mood, focus, and overall wellbeing.',
      type: 'article',
      category: 'Wellness',
      readTime: '10 min read',
      difficulty: 'beginner',
      rating: 4.6,
      downloads: 2156,
      featured: false,
      author: 'Sleep Research Center',
      tags: ['sleep', 'wellness', 'mental-health'],
      url: '#',
      likes: 298,
      comments: 67,
      shares: 123,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '5',
      title: 'Progressive Muscle Relaxation Session',
      description: 'Guided audio session to release physical tension and promote deep relaxation for body and mind.',
      type: 'audio',
      category: 'Mindfulness',
      readTime: '15 min session',
      difficulty: 'beginner',
      rating: 4.8,
      downloads: 4102,
      featured: true,
      author: 'Wellness Audio',
      tags: ['relaxation', 'meditation', 'audio'],
      url: '#',
      likes: 356,
      comments: 78,
      shares: 201,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '6',
      title: 'Interactive Mood Tracking Workshop',
      description: 'Learn to identify patterns in your emotions and develop personalized coping strategies.',
      type: 'interactive',
      category: 'Self-Discovery',
      readTime: '25 min activity',
      difficulty: 'intermediate',
      rating: 4.9,
      downloads: 1756,
      featured: true,
      author: 'Clarity Team',
      tags: ['mood-tracking', 'self-awareness', 'interactive'],
      url: '#',
      likes: 445,
      comments: 123,
      shares: 89,
      isLiked: false,
      isBookmarked: false
    }
  ]);

  const categories = [
    { name: 'All', count: resources.length, color: 'bg-gray-500' },
    { name: 'Academic Stress', count: resources.filter(r => r.category === 'Academic Stress').length, color: 'bg-red-500' },
    { name: 'Mental Health', count: resources.filter(r => r.category === 'Mental Health').length, color: 'bg-blue-500' },
    { name: 'Mindfulness', count: resources.filter(r => r.category === 'Mindfulness').length, color: 'bg-green-500' },
    { name: 'Wellness', count: resources.filter(r => r.category === 'Wellness').length, color: 'bg-purple-500' },
    { name: 'Self-Discovery', count: resources.filter(r => r.category === 'Self-Discovery').length, color: 'bg-orange-500' }
  ];

  // Interaction handlers
  const handleLike = (resourceId: string) => {
    setResources(prev => prev.map(resource => {
      if (resource.id === resourceId) {
        const isCurrentlyLiked = resource.isLiked;
        return {
          ...resource,
          isLiked: !isCurrentlyLiked,
          likes: (resource.likes || 0) + (isCurrentlyLiked ? -1 : 1)
        };
      }
      return resource;
    }));
    
    toast({
      title: resources.find(r => r.id === resourceId)?.isLiked ? "Removed like" : "Liked!",
      description: resources.find(r => r.id === resourceId)?.isLiked ? "Removed from your liked resources" : "Added to your liked resources",
      duration: 2000,
    });
  };

  const handleComment = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    toast({
      title: "Comments",
      description: `View ${resource?.comments || 0} comments for "${resource?.title}"`,
      duration: 3000,
    });
  };

  const handleShare = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, shares: (r.shares || 0) + 1 } : r
    ));
    
    toast({
      title: "Shared!",
      description: `"${resource?.title}" has been shared`,
      duration: 2000,
    });
  };

  const handleBookmark = (resourceId: string) => {
    setResources(prev => prev.map(resource => {
      if (resource.id === resourceId) {
        return {
          ...resource,
          isBookmarked: !resource.isBookmarked
        };
      }
      return resource;
    }));
    
    const resource = resources.find(r => r.id === resourceId);
    toast({
      title: resource?.isBookmarked ? "Bookmark removed" : "Bookmarked!",
      description: resource?.isBookmarked ? "Removed from your bookmarks" : "Added to your bookmarks",
      duration: 2000,
    });
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return Video;
      case 'guide': return BookOpen;
      case 'exercise': return Target;
      case 'audio': return Headphones;
      case 'interactive': return Brain;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'intermediate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'article': return 'bg-blue-500';
      case 'video': return 'bg-red-500';
      case 'guide': return 'bg-green-500';
      case 'exercise': return 'bg-purple-500';
      case 'audio': return 'bg-orange-500';
      case 'interactive': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredResources = resources.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="p-4 xxs:p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 xxs:space-y-3 sm:space-y-6">
          <BackButton to="/dashboard" />
          
          {/* Compact Hero Section with Gradient Background */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"36\" cy=\"14\" r=\"3\"/%3E%3Ccircle cx=\"6\" cy=\"44\" r=\"3\"/%3E%3Ccircle cx=\"36\" cy=\"44\" r=\"6\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                }}></div>
              </div>
            </div>
            
            <div className="relative px-6 py-8 xxs:px-4 xxs:py-6 sm:px-8 sm:py-10">
              <div className="max-w-4xl mx-auto text-center space-y-4 xxs:space-y-3">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-3xl xxs:text-2xl sm:text-4xl font-bold">
                  Mental Health Resources
                </h1>
                <p className="text-lg xxs:text-base sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Evidence-based tools, guides, and exercises curated by mental health professionals
                </p>
                
                {/* Enhanced Search Bar */}
                <div className="max-w-2xl mx-auto relative mt-6">
                  <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-1 shadow-xl border border-white/20">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        placeholder="Search resources, topics, or techniques..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-4 border-0 bg-transparent text-lg placeholder:text-gray-500 focus:ring-0 focus:outline-none text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center justify-center gap-6 xxs:gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl xxs:text-xl font-bold">{resources.length}+</div>
                    <div className="text-sm text-white/80">Resources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl xxs:text-xl font-bold">{categories.length - 1}</div>
                    <div className="text-sm text-white/80">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl xxs:text-xl font-bold">{featuredResources.length}</div>
                    <div className="text-sm text-white/80">Featured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Category Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Browse by Category</h2>
            </div>
            
            <div className="grid grid-cols-2 xxs:grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 xxs:gap-2 sm:gap-4">
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name === 'All' ? 'all' : category.name)}
                  className={`group relative overflow-hidden rounded-2xl xxs:rounded-xl p-4 xxs:p-3 sm:p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    (selectedCategory === 'all' && category.name === 'All') || selectedCategory === category.name
                      ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
                      : 'hover:shadow-lg'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className={`absolute inset-0 ${category.color} opacity-90`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all duration-300"></div>
                  <div className="relative text-white text-center space-y-2">
                    <div className="text-sm xxs:text-xs sm:text-base font-bold">{category.name}</div>
                    <div className="text-xs xxs:text-2xs sm:text-sm opacity-90 font-medium">{category.count} resources</div>
                    <div className="w-8 h-1 bg-white/30 rounded-full mx-auto group-hover:bg-white/50 transition-colors"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Featured Resources */}
          {selectedCategory === 'all' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Resources</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Handpicked by our experts</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 xxs:grid-cols-1 lg:grid-cols-3 gap-4 xxs:gap-3 sm:gap-6">
                {featuredResources.map((resource, index) => {
                  const IconComponent = getResourceIcon(resource.type);
                  return (
                    <Card 
                      key={resource.id} 
                      className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden bg-white dark:bg-gray-800"
                      style={{
                        borderRadius: '24px',
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="relative">
                        <div className={`absolute inset-0 ${getTypeColor(resource.type)} opacity-5`}></div>
                        <CardHeader className="relative pb-3">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-2xl ${getTypeColor(resource.type)} shadow-lg`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Featured
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {resource.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative space-y-4">
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                            {resource.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {resource.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 rounded-full">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Interaction buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => handleLike(resource.id)}
                                className={`flex items-center gap-1 text-sm transition-colors ${
                                  resource.isLiked 
                                    ? 'text-red-500 hover:text-red-600' 
                                    : 'text-gray-500 hover:text-red-500'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${resource.isLiked ? 'fill-current' : ''}`} />
                                <span>{resource.likes || 0}</span>
                              </button>
                              <button 
                                onClick={() => handleComment(resource.id)}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>{resource.comments || 0}</span>
                              </button>
                              <button 
                                onClick={() => handleShare(resource.id)}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-500 transition-colors"
                              >
                                <Share2 className="w-4 h-4" />
                                <span>{resource.shares || 0}</span>
                              </button>
                            </div>
                            <Badge className={getDifficultyColor(resource.difficulty)} variant="outline">
                              {resource.difficulty}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
                              <IconComponent className="w-4 h-4 mr-2" />
                              {resource.type === 'video' ? 'Watch Now' : resource.type === 'audio' ? 'Listen Now' : 'Read Now'}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                            <Button 
                              onClick={() => handleBookmark(resource.id)}
                              variant="outline" 
                              size="sm"
                              className={`rounded-xl transition-colors ${
                                resource.isBookmarked 
                                  ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                                  : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enhanced All Resources */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedCategory === 'all' ? 'All Resources' : `${selectedCategory} Resources`}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive collection for your growth</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 px-4 py-2 rounded-xl">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredResources.length}</div>
                <div className="text-xs text-blue-500 dark:text-blue-400">resources</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 xxs:grid-cols-1 lg:grid-cols-3 gap-4 xxs:gap-3 sm:gap-6">
              {filteredResources.map((resource, index) => {
                const IconComponent = getResourceIcon(resource.type);
                return (
                  <Card 
                    key={resource.id} 
                    className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden bg-white dark:bg-gray-800"
                    style={{
                      borderRadius: '20px',
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="relative">
                      <div className={`absolute inset-0 ${getTypeColor(resource.type)} opacity-3`}></div>
                      <CardHeader className="relative pb-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2.5 rounded-xl ${getTypeColor(resource.type)} shadow-md`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {resource.rating}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {resource.title}
                        </CardTitle>
                        <p className="text-xs text-gray-500 dark:text-gray-400">by {resource.author}</p>
                      </CardHeader>
                      <CardContent className="relative space-y-3">
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                          {resource.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {resource.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Interaction Section */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleLike(resource.id)}
                              className={`flex items-center gap-1 text-xs transition-colors ${
                                resource.isLiked 
                                  ? 'text-red-500 hover:text-red-600' 
                                  : 'text-gray-500 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${resource.isLiked ? 'fill-current' : ''}`} />
                              <span>{resource.likes || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleComment(resource.id)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>{resource.comments || 0}</span>
                            </button>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              {resource.readTime}
                            </div>
                          </div>
                          <Badge className={getDifficultyColor(resource.difficulty)} variant="outline">
                            {resource.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <IconComponent className="w-3 h-3 mr-1" />
                            {resource.type === 'video' ? 'Watch' : resource.type === 'audio' ? 'Listen' : 'Read'}
                          </Button>
                          <Button 
                            onClick={() => handleBookmark(resource.id)}
                            size="sm" 
                            variant="outline" 
                            className={`rounded-xl transition-colors ${
                              resource.isBookmarked 
                                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                                : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
                            }`}
                          >
                            <Bookmark className={`w-3 h-3 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                          </Button>
                          <Button 
                            onClick={() => handleShare(resource.id)}
                            size="sm" 
                            variant="outline" 
                            className="rounded-xl border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {filteredResources.length === 0 && (
              <div className="text-center py-16">
                <div className="relative">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No resources found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search terms or browse different categories
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}