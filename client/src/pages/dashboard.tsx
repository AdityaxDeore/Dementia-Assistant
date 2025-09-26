import { WellnessDashboard } from "@/components/wellness-dashboard";
import { MoodTracker } from "@/components/mood-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
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
    <div className="space-y-4 pb-safe" data-testid="page-dashboard">
      <BackButton to="/" />
      {/* Welcome Header - Optimized for mobile */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Clarity
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Your personal mental health and wellbeing companion. Take a moment to check in with yourself.
        </p>
      </div>

      {/* Mood Tracker - Top Section */}
      <div className="w-full">
        <MoodTracker />
      </div>

      {/* Quick Actions Grid - Optimized for mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={action.title} 
            className="hover-elevate transition-all duration-300 hover:scale-105 hover:shadow-xl group border-0 shadow-md"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <CardContent className="p-3 sm:p-6">
              <Link href={action.href}>
                <div className="text-center space-y-2 cursor-pointer">
                  <div className="relative">
                    <action.icon className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto ${action.color} transition-all duration-300 group-hover:scale-125 group-hover:rotate-6`} />
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold group-hover:text-primary transition-colors leading-tight">{action.title}</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wellness Dashboard - Compact for mobile */}
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
        
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
      `}</style>
    </div>
  );
}