import MoodTracker from "@/components/mood-tracker";
import { WellnessDashboard } from "@/components/wellness-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { MessageCircle, Users, BookOpen, Palette, PenTool, Headphones } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const quickActions = [
    { 
      title: "AI Buddy", 
      icon: MessageCircle, 
      href: "/ai-buddy", 
      color: "text-white", 
      bg: "from-sky-400 to-blue-500",
      description: "Smart companion"
    },
    { 
      title: "Diary", 
      icon: PenTool, 
      href: "/diary", 
      color: "text-white", 
      bg: "from-emerald-400 to-green-500",
      description: "Private thoughts"
    },
    { 
      title: "Peer Support", 
      icon: Users, 
      href: "/peer-support", 
      color: "text-white", 
      bg: "from-violet-400 to-purple-500",
      description: "Connect & share"
    },
    { 
      title: "Audio", 
      icon: Headphones, 
      href: "/audio-sessions", 
      color: "text-white", 
      bg: "from-amber-400 to-orange-500",
      description: "Guided sessions"
    },
    { 
      title: "Resources", 
      icon: BookOpen, 
      href: "/resources", 
      color: "text-white", 
      bg: "from-indigo-400 to-blue-500",
      description: "Learn & grow"
    },
    { 
      title: "Create", 
      icon: Palette, 
      href: "/creative", 
      color: "text-white", 
      bg: "from-rose-400 to-pink-500",
      description: "Express yourself"
    },
  ];

  return (
    <div className="space-y-6 pb-safe" data-testid="page-dashboard">
      <BackButton to="/" />
      
      {/* Welcome Header - Modern minimal design */}
      <div className="text-center space-y-3 py-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
          Welcome to Clarity
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Your wellness companion
        </p>
      </div>

      {/* Mood Tracker - Enhanced */}
      <div className="w-full">
        <MoodTracker variant="compact" />
      </div>

      {/* Quick Actions Grid - Modern cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-center">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={action.title} 
              className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInBounce 0.8s ease-out forwards',
                borderRadius: '16px' // Following UI Corner Radius Standard
              }}
            >
              <CardContent className="p-0 relative">
                <Link href={action.href}>
                  <div className={`relative p-6 bg-gradient-to-br ${action.bg} text-center space-y-4 cursor-pointer overflow-hidden transition-all duration-500 group-hover:scale-[1.01]`}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-700" />
                    
                    {/* Icon container */}
                    <div className="relative z-10 mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <action.icon className={`w-8 h-8 ${action.color} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-1">
                      <p className="font-bold text-base text-white group-hover:scale-105 transition-transform duration-300">{action.title}</p>
                      <p className="text-xs text-white/80 font-medium">{action.description}</p>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Wellness Dashboard */}
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