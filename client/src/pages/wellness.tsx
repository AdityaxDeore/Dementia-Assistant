import { CognitiveTracker } from "@/components/cognitive-tracker";
import { BackButton } from "@/components/ui/back-button";
import { Calendar, Clock, Heart, Brain, Headphones, Play, Volume2, Star, TrendingUp, Users, BookOpen, MessageCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function WellnessPage() {
  const handleStartMeditation = () => {
    console.log('Starting meditation session');
    // TODO: Implement meditation timer/guide
  };

  const handleBreathingExercise = () => {
    console.log('Starting breathing exercise');
    // TODO: Implement breathing exercise guide
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden" data-testid="page-wellness">
      {/* Animated Background - Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/8 to-blue-400/8 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/6 to-pink-400/6 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
        
        {/* Small floating particles */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-purple-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-32 w-2.5 h-2.5 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-20 w-2 h-2 bg-green-300 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-40 right-40 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
        
        {/* Medium floating elements */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-br from-pink-200/20 to-blue-200/20 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-12">
        <BackButton to="/dashboard" />
        
        {/* Clean Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg">
              <Heart className="w-10 h-10 text-pink-500" />
            </div>
            <h1 className="text-5xl font-light text-gray-800">
              Wellness Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your personal sanctuary for mental health and mindfulness
            </p>
          </div>
          
          {/* Floating stats badges */}
          <div className="flex justify-center gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">16 Sessions</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Expert Guides</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Cognitive Tracker */}
          <div className="lg:col-span-1">
            <CognitiveTracker />
          </div>

          {/* Audio Sessions - Clean Design */}
          <div className="lg:col-span-2 space-y-8">
            {/* Audio Sessions */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-light text-gray-800">Audio Sessions</h2>
                <p className="text-gray-600">Professional wellness sessions by certified instructors</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: "Sleep Stories",
                    description: "Gentle narratives for restful sleep",
                    duration: "20-45 min",
                    instructor: "Dr. Sarah Chen",
                    icon: Clock,
                    color: "text-indigo-600",
                    bgColor: "bg-indigo-50",
                    plays: "12.4K"
                  },
                  {
                    title: "Mindfulness",
                    description: "Manage academic stress mindfully",
                    duration: "5-25 min",
                    instructor: "Prof. Michael Davis",
                    icon: Heart,
                    color: "text-pink-600",
                    bgColor: "bg-pink-50",
                    plays: "9.8K"
                  },
                  {
                    title: "Focus Music",
                    description: "Soundscapes for productivity",
                    duration: "25-90 min",
                    instructor: "Various Artists",
                    icon: Volume2,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    plays: "23.4K"
                  },
                  {
                    title: "Breathing",
                    description: "Techniques to reduce anxiety",
                    duration: "5-20 min",
                    instructor: "Dr. James Wilson",
                    icon: Play,
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    plays: "14.5K"
                  }
                ].map((session, index) => {
                  const IconComponent = session.icon;
                  return (
                    <div key={index} className="group cursor-pointer">
                      <div className={`${session.bgColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-white shadow-sm ${session.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <span className="text-sm text-gray-500">{session.plays} plays</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">{session.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{session.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{session.duration}</span>
                          <span>{session.instructor}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center">
                <Button asChild className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/audio-sessions">
                    <Headphones className="w-4 h-4 mr-2" />
                    Explore All Sessions
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Actions - Simplified */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-light text-gray-800">Quick Actions</h2>
                <p className="text-gray-600">Start your wellness journey</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "Quick Meditation",
                    description: "5-minute mindfulness session",
                    icon: Brain,
                    color: "text-blue-600",
                    onClick: handleStartMeditation,
                    testId: "button-start-meditation"
                  },
                  {
                    title: "Breathing Exercise",
                    description: "Quick calm techniques",
                    icon: Heart,
                    color: "text-green-600",
                    onClick: handleBreathingExercise,
                    testId: "button-breathing-exercise"
                  },
                  {
                    title: "Journal Entry",
                    description: "Track your thoughts",
                    icon: BookOpen,
                    color: "text-purple-600",
                    onClick: () => console.log('Journal entry')
                  }
                ].map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <div key={index} className="group cursor-pointer" onClick={action.onClick}>
                      <div className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
                        <div className={`inline-flex p-4 rounded-full bg-gray-50 ${action.color} mb-4 group-hover:bg-gray-100 transition-colors`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {action.description}
                        </p>
                        {action.testId && (
                          <div data-testid={action.testId} className="hidden"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clean Progress Stats */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-light text-gray-800">This Week's Progress</h2>
                <p className="text-gray-600">Track your wellness journey</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    value: "47",
                    label: "Audio Minutes",
                    progress: 78,
                    color: "from-blue-500 to-purple-500"
                  },
                  {
                    value: "5",
                    label: "Check-ins",
                    progress: 71,
                    color: "from-emerald-500 to-green-500"
                  },
                  {
                    value: "3",
                    label: "Journal Entries",
                    progress: 43,
                    color: "from-violet-500 to-purple-500"
                  },
                  {
                    value: "7",
                    label: "Day Streak",
                    progress: 100,
                    color: "from-amber-500 to-orange-500"
                  }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="text-3xl font-light text-gray-800 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium mb-3">{stat.label}</div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-500`} style={{width: `${stat.progress}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}