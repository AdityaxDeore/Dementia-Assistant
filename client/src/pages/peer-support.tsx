import { useState } from "react";
import { Link } from "wouter";
import { Users, TrendingUp, MessageSquare, Star, Shield, Eye, Volume2, Accessibility, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Community {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: any;
  color: string;
  memberCount: number;
  onlineCount: number;
  isSpecialized: boolean;
  trending?: boolean;
  accessibilitySupport?: string[];
}

const COMMUNITIES: Community[] = [
  {
    id: "general",
    name: "r/GeneralSupport",
    displayName: "General Support",
    description: "A supportive community for all students to share experiences and help each other",
    icon: Users,
    color: "text-blue-600",
    memberCount: 12543,
    onlineCount: 234,
    isSpecialized: false,
    trending: true
  },
  {
    id: "mental-wellness",
    name: "r/MentalWellness",
    displayName: "Mental Wellness",
    description: "Dementia care support, coping strategies, and care resources",
    icon: Heart,
    color: "text-red-600",
    memberCount: 3247,
    onlineCount: 89,
    isSpecialized: true,
    trending: true,
    accessibilitySupport: ["Crisis support", "Peer counseling", "Wellness resources"]
  },
  {
    id: "learning-differences",
    name: "r/LearningDifferences",
    displayName: "Learning Differences",
    description: "Support for neurodiverse learners, ADHD, autism, dyslexia, and other learning differences",
    icon: BookOpen,
    color: "text-pink-600",
    memberCount: 1834,
    onlineCount: 67,
    isSpecialized: true,
    accessibilitySupport: ["Learning strategies", "Study accommodations", "Time management tools"]
  },
  {
    id: "visual-impaired",
    name: "r/VisionSupport",
    displayName: "Vision Support",
    description: "Community for students with visual impairments - screen readers, accessibility tools, and navigation",
    icon: Eye,
    color: "text-purple-600",
    memberCount: 892,
    onlineCount: 23,
    isSpecialized: true,
    accessibilitySupport: ["Screen reader compatible", "High contrast support", "Audio descriptions"]
  },
  {
    id: "mobility-support",
    name: "r/MobilitySupport",
    displayName: "Mobility Support",
    description: "Support for students with mobility challenges - campus accessibility and adaptive resources",
    icon: Accessibility,
    color: "text-orange-600",
    memberCount: 743,
    onlineCount: 15,
    isSpecialized: true,
    accessibilitySupport: ["Campus accessibility info", "Transportation support", "Adaptive resources"]
  },
  {
    id: "hearing-impaired",
    name: "r/HearingSupport",
    displayName: "Hearing Support",
    description: "Community for students with hearing impairments - sign language, captions, and communication",
    icon: Volume2,
    color: "text-green-600",
    memberCount: 654,
    onlineCount: 18,
    isSpecialized: true,
    accessibilitySupport: ["Sign language support", "Visual indicators", "Captions available"]
  }
];

export default function PeerSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const filteredCommunities = COMMUNITIES.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "specialized") return matchesSearch && community.isSpecialized;
    if (activeTab === "trending") return matchesSearch && community.trending;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <BackButton to="/dashboard" />
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Student Support Communities</h1>
          <p className="text-muted-foreground">
            Join specialized communities designed for your unique needs. Connect with fellow students,
            share experiences, and find the support you deserve in safe, moderated environments.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Communities</TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="specialized">
            <Shield className="w-4 h-4 mr-1" />
            Specialized
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md" style={{ borderRadius: '16px' }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${community.id === 'general' ? 'bg-blue-100 dark:bg-blue-900' : community.id === 'mental-wellness' ? 'bg-red-100 dark:bg-red-900' : community.id === 'learning-differences' ? 'bg-pink-100 dark:bg-pink-900' : community.id === 'visual-impaired' ? 'bg-purple-100 dark:bg-purple-900' : community.id === 'mobility-support' ? 'bg-orange-100 dark:bg-orange-900' : 'bg-green-100 dark:bg-green-900'}`}>
                        <community.icon className={`w-6 h-6 ${community.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {community.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {community.isSpecialized && (
                            <Badge variant="secondary" className="text-xs">
                              Specialized
                            </Badge>
                          )}
                          {community.trending && (
                            <Badge className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {community.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{formatNumber(community.memberCount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{community.onlineCount} online</span>
                      </div>
                    </div>
                  </div>

                  {community.accessibilitySupport && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Accessibility Support:</p>
                      <div className="flex flex-wrap gap-1">
                        {community.accessibilitySupport.slice(0, 2).map((support) => (
                          <Badge key={support} variant="outline" className="text-xs">
                            {support}
                          </Badge>
                        ))}
                        {community.accessibilitySupport.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{community.accessibilitySupport.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button asChild className="flex-1">
                      <Link href={`/community/${community.id}`}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Join Community
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No communities found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or browse all communities.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Featured Section */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-lg" style={{ borderRadius: '16px' }}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">New to Student Support Communities?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our communities are safe spaces designed to provide support, resources, and connections for students 
              with diverse needs. Each community has dedicated moderators and accessibility features.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="bg-emerald-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">Safe & Moderated</Badge>
              <Badge className="bg-blue-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">Anonymous Options</Badge>
              <Badge className="bg-purple-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">Accessibility First</Badge>
              <Badge className="bg-orange-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">Peer Support</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}