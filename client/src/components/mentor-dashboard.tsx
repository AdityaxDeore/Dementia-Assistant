import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Calendar, 
  CheckCircle, 
  Clock,
  Target,
  TrendingUp
} from "lucide-react";

interface MenteeProgress {
  id: string;
  name: string;
  year: number;
  region: string;
  interests: string[];
  joinDate: string;
  tasksCompleted: number;
  totalTasks: number;
  lastActivity: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  menteeId: string;
  menteeName: string;
}

export function MentorDashboard() {
  const [myMentees, setMyMentees] = useState<MenteeProgress[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      const [menteesRes, tasksRes] = await Promise.all([
        fetch("/api/mentors/my-mentees"),
        fetch("/api/mentors/tasks")
      ]);

      if (menteesRes.ok) {
        const mentees = await menteesRes.json();
        setMyMentees(mentees);
      }

      if (tasksRes.ok) {
        const tasks = await tasksRes.json();
        setAllTasks(tasks);
      }
    } catch (error) {
      console.error("Failed to fetch mentor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your mentor dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingTasks = allTasks.filter(task => task.status === "pending");
  const completedTasks = allTasks.filter(task => task.status === "completed");

  return (
    <div className="container mx-auto max-w-6xl space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mentor Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your mentees' progress and manage their learning journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Mentees</p>
                <p className="text-2xl font-bold">{myMentees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
                <p className="text-2xl font-bold">{completedTasks.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{allTasks.length}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mentees" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mentees">My Mentees</TabsTrigger>
          <TabsTrigger value="tasks">Tasks & Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="mentees" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Mentees</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Accept New Mentee
            </Button>
          </div>

          {myMentees.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Mentees</h3>
                <p className="text-muted-foreground">
                  You don't have any active mentees yet. Students will send you requests based on your expertise.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myMentees.map((mentee) => (
                <Card key={mentee.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {mentee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{mentee.name}</CardTitle>
                          <CardDescription>
                            {mentee.year}st Year • {mentee.region}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentee.interests.slice(0, 3).map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {mentee.interests.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{mentee.interests.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Task Progress</p>
                        <span className="text-sm text-muted-foreground">
                          {mentee.tasksCompleted}/{mentee.totalTasks}
                        </span>
                      </div>
                      <Progress 
                        value={mentee.totalTasks > 0 ? (mentee.tasksCompleted / mentee.totalTasks) * 100 : 0}
                        className="h-2"
                      />
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Last activity: {mentee.lastActivity}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Target className="h-4 w-4 mr-1" />
                        Assign Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tasks & Progress</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Task
            </Button>
          </div>

          {allTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tasks Created</h3>
                <p className="text-muted-foreground">
                  Start creating tasks for your mentees to help guide their learning journey.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {allTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(task.status)}`}
                          >
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          Assigned to: <span className="font-medium">{task.menteeName}</span>
                        </p>
                        
                        {task.description && (
                          <p className="text-sm mb-2">{task.description}</p>
                        )}
                        
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        {task.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
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