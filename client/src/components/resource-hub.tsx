import { BookOpen, Video, FileText, ExternalLink, Search, Users, Shield, Heart, Phone, MapPin, Calendar } from "lucide-react";
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
  type: 'article' | 'video' | 'guide' | 'directory' | 'support' | 'safety';
  category: string;
  readTime?: string;
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  url: string;
  helpline?: string;
}

export function ResourceHub() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dementia care resources based on Alzheimer's Association and research
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Daily Care Planning for Dementia',
      description: 'Organize routines, activities, and create structure for better daily management.',
      type: 'guide',
      category: 'Daily Care',
      readTime: '10 min read',
      urgency: 'medium',
      url: '#'
    },
    {
      id: '2',
      title: 'Alzheimer\'s Association 24/7 Helpline',
      description: 'Free confidential support, crisis assistance, and local resources in 200+ languages.',
      type: 'support',
      category: 'Crisis Support',
      readTime: 'Available 24/7',
      urgency: 'crisis',
      url: 'https://www.alz.org/help-support/resources/helpline',
      helpline: '800-272-3900'
    },
    {
      id: '3',
      title: 'Wandering Prevention & Safety',
      description: 'Learn warning signs, safety tips, and prevention strategies for wandering behavior.',
      type: 'safety',
      category: 'Safety & Wandering',
      readTime: '8 min read',
      urgency: 'high',
      url: '#'
    },
    {
      id: '4',
      title: 'Local Support Groups Directory',
      description: 'Find in-person and online support groups for caregivers and families in your area.',
      type: 'directory',
      category: 'Support Groups',
      readTime: 'Search locations',
      urgency: 'medium',
      url: '#'
    },
    {
      id: '5',
      title: 'Communication Strategies',
      description: 'Effective techniques for connecting and communicating with people living with dementia.',
      type: 'video',
      category: 'Communication',
      readTime: '15 min watch',
      urgency: 'medium',
      url: '#'
    },
    {
      id: '6',
      title: 'Caregiver Health & Stress Management',
      description: 'Essential self-care strategies for maintaining physical and emotional wellbeing.',
      type: 'article',
      category: 'Caregiver Support',
      readTime: '12 min read',
      urgency: 'medium',
      url: '#'
    },
    {
      id: '7',
      title: 'Memory Care Facility Finder',
      description: 'Directory of specialized dementia care facilities and in-home care services.',
      type: 'directory',
      category: 'Professional Care',
      readTime: 'Search locations',
      urgency: 'low',
      url: '#'
    },
    {
      id: '8',
      title: 'Legal & Financial Planning',
      description: 'Planning ahead for legal matters, advance directives, and care costs.',
      type: 'guide',
      category: 'Planning',
      readTime: '20 min read',
      urgency: 'medium',
      url: '#'
    }
  ];

  const categories = ['All', 'Daily Care', 'Crisis Support', 'Safety & Wandering', 'Support Groups', 'Communication', 'Caregiver Support'];

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'directory': return <MapPin className="w-4 h-4" />;
      case 'support': return <Phone className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: Resource['urgency']) => {
    switch (urgency) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'crisis': return 'bg-red-100 text-red-800';
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
                        <Badge className={getUrgencyColor(resource.urgency)}>
                          {resource.urgency === 'crisis' ? '24/7' : resource.urgency}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                      {resource.helpline && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Phone className="w-3 h-3" />
                          {resource.helpline}
                        </div>
                      )}
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