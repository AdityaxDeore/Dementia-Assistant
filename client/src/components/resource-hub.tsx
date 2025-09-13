import { BookOpen, Video, FileText, ExternalLink, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'exercise';
  category: string;
  readTime?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url: string;
}

export function ResourceHub() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // TODO: remove mock functionality
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Managing Exam Anxiety: A Student\'s Guide',
      description: 'Practical strategies for reducing stress during exam periods and improving performance.',
      type: 'article',
      category: 'Academic Stress',
      readTime: '8 min read',
      difficulty: 'beginner',
      url: '#'
    },
    {
      id: '2',
      title: 'Breathing Exercises for Immediate Calm',
      description: 'Simple breathing techniques you can use anywhere to reduce anxiety and find focus.',
      type: 'exercise',
      category: 'Mindfulness',
      readTime: '5 min practice',
      difficulty: 'beginner',
      url: '#'
    },
    {
      id: '3',
      title: 'Building Healthy Study Habits',
      description: 'Video guide on creating sustainable study routines that support both academic success and mental wellbeing.',
      type: 'video',
      category: 'Study Skills',
      readTime: '12 min watch',
      difficulty: 'intermediate',
      url: '#'
    },
    {
      id: '4',
      title: 'Understanding Depression in College Students',
      description: 'Comprehensive guide to recognizing signs, seeking help, and supporting recovery.',
      type: 'guide',
      category: 'Mental Health',
      readTime: '15 min read',
      difficulty: 'intermediate',
      url: '#'
    },
    {
      id: '5',
      title: 'Sleep Hygiene for Students',
      description: 'Evidence-based tips for improving sleep quality and establishing healthy sleep patterns.',
      type: 'article',
      category: 'Wellness',
      readTime: '6 min read',
      difficulty: 'beginner',
      url: '#'
    },
    {
      id: '6',
      title: 'Progressive Muscle Relaxation',
      description: 'Guided exercise to release physical tension and promote deep relaxation.',
      type: 'exercise',
      category: 'Mindfulness',
      readTime: '10 min practice',
      difficulty: 'beginner',
      url: '#'
    }
  ];

  const categories = ['All', 'Academic Stress', 'Mental Health', 'Mindfulness', 'Study Skills', 'Wellness'];

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'exercise': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResourceClick = (resource: Resource) => {
    console.log(`Opening resource: ${resource.title}`);
    // TODO: Navigate to resource or open modal with content
  };

  const resourcesByCategory = (category: string) => {
    if (category === 'All') return filteredResources;
    return filteredResources.filter(resource => resource.category === category);
  };

  return (
    <div className="space-y-6" data-testid="resource-hub">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Resource Hub
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-resources"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Categories */}
      <Tabs defaultValue="All" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="text-xs"
              data-testid={`tab-${category.toLowerCase().replace(' ', '-')}`}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resourcesByCategory(category).map((resource) => (
                <Card 
                  key={resource.id} 
                  className="hover-elevate cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                  data-testid={`card-resource-${resource.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="font-medium text-sm leading-tight mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                    </div>
                    
                    {resource.readTime && (
                      <div className="text-xs text-muted-foreground">
                        {resource.readTime}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {resourcesByCategory(category).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No resources found for "{searchQuery || category}"</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}