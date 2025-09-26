import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, Star, BookOpen, Target, MapPin } from "lucide-react";
import { MentorRegistration } from "@/components/mentor-registration";
import { MenteeRegistration } from "@/components/mentee-registration";
import { MentorshipMatching } from "@/components/mentorship-matching";

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto max-w-6xl space-y-4 sm:space-y-8">
      <BackButton to="/dashboard" />
      <div className="text-center space-y-2 sm:space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          <span className="text-indigo-600">Savangadi</span> <span className="text-slate-800">Program</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
          Connecting minds, building futures through meaningful mentorship
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
          <TabsTrigger value="overview" className="px-2 sm:px-4">Overview</TabsTrigger>
          <TabsTrigger value="register-mentor" className="px-2 sm:px-4">Become Mentor</TabsTrigger>
          <TabsTrigger value="register-mentee" className="px-2 sm:px-4">Find Mentor</TabsTrigger>
          <TabsTrigger value="matching" className="px-2 sm:px-4">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card className="border-2 border-indigo-100 hover:border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="text-center pb-3 sm:pb-6">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-2 sm:mb-4 shadow-lg">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl text-slate-900 font-bold">Become a Mentor</CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600">
                  Share your knowledge and experience with junior students from your region
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Help 2-3 students per semester</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Connect with students from your region</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Share expertise in your domain</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setActiveTab("register-mentor")} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base py-3 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Register as Mentor
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="text-center pb-3 sm:pb-6">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mb-2 sm:mb-4 shadow-lg">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl text-slate-900 font-bold">Find a Mentor</CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600">
                  Get guidance from senior students who understand your background and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Get personalized guidance and tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Connect with mentors from your region</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Learn skills in your areas of interest</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setActiveTab("register-mentee")} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm sm:text-base py-3 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm sm:text-base">1</span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Register</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Sign up as a mentor or mentee with your region and interests
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm sm:text-base">2</span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Match</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Get matched with compatible mentors/mentees from your region
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm sm:text-base">3</span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">Connect</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Start your mentorship journey with tasks and regular check-ins
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Available Domains</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Areas where mentors can provide guidance and mentees can seek help
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {[
                  "Academic Excellence",
                  "Programming & Development",
                  "Research & Projects",
                  "Communication Skills",
                  "Leadership & Management",
                  "Career Planning",
                  "Internship Guidance",
                  "Competitive Programming",
                  "Technical Writing",
                  "Public Speaking",
                  "Time Management",
                  "Stress Management"
                ].map((domain) => (
                  <Badge key={domain} variant="secondary" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register-mentor">
          <MentorRegistration />
        </TabsContent>

        <TabsContent value="register-mentee">
          <MenteeRegistration />
        </TabsContent>

        <TabsContent value="matching">
          <MentorshipMatching />
        </TabsContent>
      </Tabs>
    </div>
  );
}