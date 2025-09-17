import { WellnessDashboard } from "@/components/wellness-dashboard";
import { MoodTracker } from "@/components/mood-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, BookOpen, Palette, PenTool, Headphones } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const quickActions = [
    { title: "Talk to AI Buddy", icon: MessageCircle, href: "/ai-buddy", color: "text-blue-600" },
    { title: "Personal Diary", icon: PenTool, href: "/diary", color: "text-green-600" },
    { title: "Join Peer Support", icon: Users, href: "/peer-support", color: "text-purple-600" },
    { title: "Audio Sessions", icon: Headphones, href: "/audio-sessions", color: "text-orange-600" },
    { title: "Browse Resources", icon: BookOpen, href: "/resources", color: "text-indigo-600" },
    { title: "Create Art", icon: Palette, href: "/creative", color: "text-pink-600" },
  ];

  return (
    <div className="space-y-8" data-testid="page-dashboard">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Clarity
        </h1>
        <p className="text-muted-foreground text-lg">
          Your personal mental health and wellbeing companion. Take a moment to check in with yourself.
        </p>
      </div>

      {/* Mood Tracker - Top Section */}
      <div className="w-full">
        <MoodTracker />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={action.title} 
            className="hover-elevate transition-all duration-300 hover:scale-105 hover:shadow-xl group border-0 shadow-md"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <CardContent className="p-6">
              <Link href={action.href}>
                <div className="text-center space-y-3 cursor-pointer">
                  <div className="relative">
                    <action.icon className={`w-10 h-10 mx-auto ${action.color} transition-all duration-300 group-hover:scale-125 group-hover:rotate-6`} />
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{action.title}</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wellness Dashboard - Full Width */}
      <div className="w-full">
        <WellnessDashboard />
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}