import CognitiveTracker from "@/components/cognitive-tracker";
import { CareDashboard } from "@/components/care-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { MessageCircle, Users, BookOpen, Palette, PenTool, Headphones } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const quickActions = [
    { 
      title: "Cognitive Support", 
      icon: MessageCircle, 
      href: "/ai-buddy", 
      color: "text-white", 
      bg: "bg-blue-500",
      description: "AI companion"
    },
    { 
      title: "Memory Journal", 
      icon: PenTool, 
      href: "/diary", 
      color: "text-white", 
      bg: "bg-green-500",
      description: "Record memories"
    },
    { 
      title: "Caregiver Network", 
      icon: Users, 
      href: "/peer-support", 
      color: "text-white", 
      bg: "bg-purple-500",
      description: "Support community"
    },
    { 
      title: "Memory Activities", 
      icon: Headphones, 
      href: "/audio-sessions", 
      color: "text-white", 
      bg: "bg-orange-500",
      description: "Cognitive exercises"
    },
    { 
      title: "Care Resources", 
      icon: BookOpen, 
      href: "/resources", 
      color: "text-white", 
      bg: "bg-indigo-500",
      description: "Helpful guides"
    },
    { 
      title: "Create", 
      icon: Palette, 
      href: "/creative", 
      color: "text-white", 
      bg: "bg-pink-500",
      description: "Express yourself"
    },
  ];

  return (
    <div className="space-y-6 pb-safe" data-testid="page-dashboard">
      <BackButton to="/" />
      
      {/* Welcome Header - Modern minimal design */}
      <div className="text-center space-y-3 py-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
          Welcome to Dementia Assistant
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Your wellness companion
        </p>
      </div>

      {/* Cognitive Tracker - Enhanced */}
      <div className="w-full">
        <CognitiveTracker variant="compact" />
      </div>

      {/* Quick Actions Grid - Modern cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-center">Quick Actions</h2>
        <div className="grid grid-cols-2 xxs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xxs:gap-2 sm:gap-4 lg:gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={action.title} 
              className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInBounce 0.8s ease-out forwards',
                borderRadius: '16px' // Following UI Corner Radius Standard
              }}
            >
              <CardContent className="p-0 relative" style={{ borderRadius: '16px' }}>
                <Link href={action.href}>
                  <div 
                    className={`relative p-4 xxs:p-3 sm:p-6 ${action.bg} text-center space-y-3 xxs:space-y-2 sm:space-y-4 cursor-pointer overflow-hidden transition-all duration-300 hover:brightness-110`}
                    style={{ borderRadius: '16px' }}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-700" />
                    
                    {/* Icon container */}
                    <div className="relative z-10 mx-auto w-12 h-12 xxs:w-10 xxs:h-10 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <action.icon className={`w-6 h-6 xxs:w-5 xxs:h-5 sm:w-8 sm:h-8 ${action.color} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-1">
                      <p className="font-bold text-sm xxs:text-xs sm:text-base text-white transition-transform duration-300">{action.title}</p>
                      <p className="text-xs xxs:text-2xs sm:text-xs text-white/80 font-medium">{action.description}</p>
                    </div>
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