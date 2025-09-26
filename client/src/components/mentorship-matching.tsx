import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MapPin, 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  CheckCircle, 
  Clock,
  Star,
  Target,
  User
} from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  year: number;
  region: string;
  domains: string[];
  bio?: string;
  currentMentees: number;
  maxMentees: number;
}

interface Mentee {
  id: string;
  name: string;
  year: number;
  region: string;
  interests: string[];
  goals?: string;
}

interface Mentorship {
  id: string;
  mentor: Mentor;
  mentee: Mentee;
  status: "pending" | "active" | "completed" | "cancelled";
  startDate?: string;
  endDate?: string;
}

export function MentorshipMatching() {
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([]);
  const [myMentorships, setMyMentorships] = useState<Mentorship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // In a real implementation, these would be separate API calls
      const [mentorsRes, mentorshipsRes, requestsRes] = await Promise.all([
        fetch("/api/mentors/available"),
        fetch("/api/mentorships/my"),
        fetch("/api/mentorships/requests")
      ]);

      if (mentorsRes.ok) {
        const mentors = await mentorsRes.json();
        setAvailableMentors(mentors);
      }

      if (mentorshipsRes.ok) {
        const mentorships = await mentorshipsRes.json();
        setMyMentorships(mentorships);
      }

      if (requestsRes.ok) {
        const requests = await requestsRes.json();
        setPendingRequests(requests);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMentorshipRequest = async (mentorId: string) => {
    try {
      const response = await fetch("/api/mentorships/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send request");
      }

      toast({
        title: "Request Sent!",
        description: "Your mentorship request has been sent to the mentor.",
      });

      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send mentorship request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const respondToRequest = async (requestId: string, accept: boolean) => {
    try {
      const response = await fetch(`/api/mentorships/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });

      if (!response.ok) {
        throw new Error("Failed to respond to request");
      }

      toast({
        title: accept ? "Request Accepted!" : "Request Declined",
        description: accept 
          ? "You have accepted the mentorship request. The mentorship is now active."
          : "You have declined the mentorship request.",
      });

      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to respond to request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your mentorship connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
          <TabsTrigger value="my-connections">My Connections</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Available Mentors</h2>
            <p className="text-muted-foreground">
              Find mentors from your region who match your interests
            </p>
          </div>

          {availableMentors.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Available Mentors</h3>
                <p className="text-muted-foreground">
                  There are currently no mentors available from your region. Please check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {mentor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{mentor.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {mentor.year}th Year
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {mentor.currentMentees}/{mentor.maxMentees} mentees
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {mentor.region}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.domains.slice(0, 3).map((domain) => (
                          <Badge key={domain} variant="secondary" className="text-xs">
                            {domain}
                          </Badge>
                        ))}
                        {mentor.domains.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{mentor.domains.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {mentor.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {mentor.bio}
                      </p>
                    )}
                    
                    <Button 
                      onClick={() => sendMentorshipRequest(mentor.id)}
                      className="w-full"
                      disabled={mentor.currentMentees >= mentor.maxMentees}
                    >
                      {mentor.currentMentees >= mentor.maxMentees 
                        ? "Currently Full" 
                        : "Send Request"
                      }
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-connections" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">My Mentorship Connections</h2>
            <p className="text-muted-foreground">
              Your active and past mentorship relationships
            </p>
          </div>

          {myMentorships.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Connections</h3>
                <p className="text-muted-foreground">
                  You don't have any mentorship connections yet. Browse available mentors to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myMentorships.map((mentorship) => (
                <Card key={mentorship.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {mentorship.mentor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{mentorship.mentor.name}</CardTitle>
                          <CardDescription>
                            {mentorship.mentor.year}th Year • {mentorship.mentor.region}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant={mentorship.status === "active" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {mentorship.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {mentorship.mentor.domains.map((domain) => (
                        <Badge key={domain} variant="outline" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                    
                    {mentorship.startDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Started: {new Date(mentorship.startDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4 mr-1" />
                        View Tasks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Mentorship Requests</h2>
            <p className="text-muted-foreground">
              Pending requests from students seeking mentorship
            </p>
          </div>

          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">
                  You don't have any pending mentorship requests at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {request.mentee.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{request.mentee.name}</CardTitle>
                        <CardDescription>
                          {request.mentee.year}st Year • {request.mentee.region}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Interested in:</p>
                      <div className="flex flex-wrap gap-1">
                        {request.mentee.interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {request.mentee.goals && (
                      <div>
                        <p className="text-sm font-medium mb-1">Goals:</p>
                        <p className="text-sm text-muted-foreground">
                          {request.mentee.goals}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => respondToRequest(request.id, true)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        onClick={() => respondToRequest(request.id, false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}