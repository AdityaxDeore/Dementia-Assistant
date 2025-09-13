import { WellnessDashboard } from "@/components/wellness-dashboard";
import { MoodTracker } from "@/components/mood-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, BookOpen, Palette } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const quickActions = [
    { title: "Talk to AI Buddy", icon: MessageCircle, href: "/ai-buddy", color: "text-blue-600" },
    { title: "Join Peer Support", icon: Users, href: "/peer-support", color: "text-green-600" },
    { title: "Browse Resources", icon: BookOpen, href: "/resources", color: "text-purple-600" },
    { title: "Create Art", icon: Palette, href: "/creative", color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to MindWell</h1>
        <p className="text-muted-foreground">
          Your personal mental health and wellbeing companion. Take a moment to check in with yourself.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover-elevate">
            <CardContent className="p-4">
              <Link href={action.href}>
                <div className="text-center space-y-2 cursor-pointer">
                  <action.icon className={`w-8 h-8 mx-auto ${action.color}`} />
                  <p className="text-sm font-medium">{action.title}</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mood Tracker - Left Column */}
        <div className="space-y-4">
          <MoodTracker />
        </div>

        {/* Wellness Dashboard - Right Columns */}
        <div className="lg:col-span-2">
          <WellnessDashboard />
        </div>
      </div>
    </div>
  );
}