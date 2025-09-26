import { ResourceHub } from "@/components/resource-hub";
import { TherapistCommunity } from "@/components/therapist-community";
import { SocialCard } from "@/components/ui/social-card";
import { BackButton } from "@/components/ui/back-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  BookOpen, 
  Users, 
  Lightbulb,
  Star,
  MessageSquare,
  GraduationCap 
} from "lucide-react";

const communityPosts = [
  {
    id: 1,
    author: {
      name: "Dr. Sarah Johnson",
      username: "@drsarahj",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"
    },
    content: "Just published a new research paper on mindfulness-based therapy for anxiety disorders. The results show a 73% improvement rate in patients who practiced daily meditation. 🧠✨",
    timestamp: "2 hours ago",
    likes: 127,
    comments: 23,
    shares: 18,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=500&h=300&fit=crop",
    link: {
      url: "https://example.com/research-paper",
      title: "Mindfulness-Based Therapy Research Study",
      description: "A comprehensive study on the effectiveness of mindfulness techniques in treating anxiety disorders.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=200&h=150&fit=crop"
    }
  },
  {
    id: 2,
    author: {
      name: "Mental Health Alliance",
      username: "@mhalliance",
      avatar: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=40&h=40&fit=crop&crop=face"
    },
    content: "Remember: It's okay to not be okay. Your mental health journey is unique, and seeking help is a sign of strength, not weakness. 💙 #MentalHealthAwareness",
    timestamp: "4 hours ago",
    likes: 89,
    comments: 12,
    shares: 34
  },
  {
    id: 3,
    author: {
      name: "Alex Rodriguez",
      username: "@alexr_therapist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    content: "Sharing some practical breathing exercises that can help manage anxiety in real-time. These techniques have helped many of my clients during panic episodes. 🌬️",
    timestamp: "6 hours ago",
    likes: 156,
    comments: 31,
    shares: 67,
    link: {
      url: "https://example.com/breathing-exercises",
      title: "5 Breathing Techniques for Anxiety Management",
      description: "Simple yet effective breathing exercises you can do anywhere to calm your mind.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop"
    }
  }
];

export default function ResourcesPage() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/dashboard" />
        <h1 className="text-3xl font-bold mb-8 text-center">Mental Health Resources</h1>
        
        <Tabs defaultValue="hub" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="hub">Resource Hub</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="therapists">Therapist Network</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hub">
            <ResourceHub />
          </TabsContent>
          
          <TabsContent value="community">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold">Community Insights</h2>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Connect with mental health professionals, researchers, and advocates sharing valuable insights, 
                  research findings, and supportive content from around the world.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-6">
                {communityPosts.map((post) => (
                  <SocialCard key={post.id} {...post} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-100">
                  <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Join the Conversation</h3>
                  <p className="text-gray-600 mb-4">
                    Share your insights, experiences, and resources to help build a supportive community.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>Share Support</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Educational Content</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      <span>Research Insights</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Success Stories</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="therapists">
            <TherapistCommunity />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}