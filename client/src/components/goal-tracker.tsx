import { useState, useEffect } from "react";
import { Target, Plus, Check, X, Calendar, Trophy, Zap, TrendingUp, Award, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: 'wellness' | 'academic' | 'personal' | 'fitness' | 'career';
  progress: number;
  isCompleted: number;
  targetDate: string | null;
  priority: 'low' | 'medium' | 'high';
  streak?: number;
}

export function GoalTracker() {
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal" as const,
    priority: "medium" as const,
    targetDate: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | Goal['category']>('all');
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const quotes = [
    "The only impossible journey is the one you never begin. 🌟",
    "Success is the sum of small efforts repeated daily. 💪",
    "Your future self will thank you for the goals you pursue today. 🎆"
  ];

  useEffect(() => {
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const { data: goalsData, isLoading } = useQuery({
    queryKey: ['/api/goals'],
    queryFn: async () => ({
      goals: [
        {
          id: '1',
          title: 'Master React Development',
          description: 'Complete advanced React course and build 3 portfolio projects',
          category: 'academic' as const,
          progress: 65,
          isCompleted: 0,
          targetDate: '2024-12-15',
          priority: 'high' as const,
          streak: 7
        },
        {
          id: '2',
          title: 'Daily Mindfulness Practice',
          description: 'Meditate for 15 minutes every morning',
          category: 'wellness' as const,
          progress: 85,
          isCompleted: 0,
          targetDate: '2024-10-30',
          priority: 'medium' as const,
          streak: 12
        },
        {
          id: '3',
          title: 'Complete First Marathon',
          description: 'Train and finish marathon under 4 hours',
          category: 'fitness' as const,
          progress: 100,
          isCompleted: 1,
          targetDate: '2024-09-15',
          priority: 'high' as const,
          streak: 45
        }
      ]
    })
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: any) => ({ success: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      setNewGoal({ title: "", description: "", category: "personal", priority: "medium", targetDate: "" });
      setShowAddForm(false);
      toast({ title: "Goal created! 🎉", description: "Your new goal has been added." });
    }
  });

  const toggleGoalMutation = useMutation({
    mutationFn: async ({ goalId }: { goalId: string }) => ({ success: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/goals'] })
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => ({ success: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({ title: "Goal deleted 🗑️", description: "Goal removed successfully." });
    }
  });

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) {
      toast({ title: "Title required", description: "Please enter a goal title.", variant: "destructive" });
      return;
    }
    createGoalMutation.mutate(newGoal);
  };

  const goals = goalsData?.goals || [];
  const filteredGoals = filterCategory === 'all' ? goals : goals.filter(goal => goal.category === filterCategory);
  
  const getCategoryConfig = (category: Goal['category']) => {
    const configs = {
      wellness: { icon: '🧘‍♀️', color: 'emerald' },
      academic: { icon: '📚', color: 'blue' },
      personal: { icon: '✨', color: 'purple' },
      fitness: { icon: '💪', color: 'orange' },
      career: { icon: '💼', color: 'gray' }
    };
    return configs[category] || configs.personal;
  };

  const getPriorityConfig = (priority: Goal['priority']) => {
    const configs = {
      high: { icon: '🔥', color: 'red' },
      medium: { icon: '⚡', color: 'yellow' },
      low: { icon: '🌱', color: 'green' }
    };
    return configs[priority];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const activeGoals = filteredGoals.filter(goal => !goal.isCompleted);
  const completedGoals = filteredGoals.filter(goal => goal.isCompleted);
  const totalProgress = goals.length > 0 ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) : 0;
  const completionRate = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="goal-tracker">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600">Loading your goals...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="goal-tracker">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center space-y-6">
          <div className="space-y-4">
            <div className="inline-flex p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">Smart Goal Tracker</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">{motivationalQuote}</p>
          </div>
          
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{activeGoals.length}</div>
              <div className="text-sm text-white/80">Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{completedGoals.length}</div>
              <div className="text-sm text-white/80">Done</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{completionRate}%</div>
              <div className="text-sm text-white/80">Success</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center gap-4">
            <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="wellness">🧘‍♀️ Wellness</SelectItem>
                <SelectItem value="academic">📚 Academic</SelectItem>
                <SelectItem value="personal">✨ Personal</SelectItem>
                <SelectItem value="fitness">💪 Fitness</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              data-testid="button-add-goal"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card className="border-0 shadow-lg border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              Create New Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                data-testid="input-new-goal"
              />
              <Input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
              />
            </div>
            <Textarea
              placeholder="Description..."
              value={newGoal.description}
              onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              className="h-20"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select value={newGoal.category} onValueChange={(value: any) => setNewGoal({...newGoal, category: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wellness">🧘‍♀️ Wellness</SelectItem>
                  <SelectItem value="academic">📚 Academic</SelectItem>
                  <SelectItem value="personal">✨ Personal</SelectItem>
                  <SelectItem value="fitness">💪 Fitness</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal({...newGoal, priority: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔥 High</SelectItem>
                  <SelectItem value="medium">⚡ Medium</SelectItem>
                  <SelectItem value="low">🌱 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleAddGoal} className="bg-green-500 hover:bg-green-600" data-testid="button-submit-goal">
                <Check className="w-4 h-4 mr-2" />Create
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center p-4 bg-blue-50">
          <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
          <div className="text-sm text-blue-600">Active</div>
        </Card>
        <Card className="text-center p-4 bg-green-50">
          <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
          <div className="text-sm text-green-600">Done</div>
        </Card>
        <Card className="text-center p-4 bg-purple-50">
          <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{totalProgress}%</div>
          <div className="text-sm text-purple-600">Progress</div>
        </Card>
        <Card className="text-center p-4 bg-amber-50">
          <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-600">{completionRate}%</div>
          <div className="text-sm text-amber-600">Success</div>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-green-500" />
              Active Goals ({activeGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGoals.map((goal) => {
                const categoryConfig = getCategoryConfig(goal.category);
                const priorityConfig = getPriorityConfig(goal.priority);
                
                return (
                  <div key={goal.id} className="group relative p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryConfig.icon}</span>
                        <div>
                          <h3 className="font-semibold">{goal.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {priorityConfig.icon} {goal.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {goal.description && (
                      <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <div className="flex items-center gap-2">
                          {goal.streak && (
                            <Badge variant="outline" className="text-xs">
                              🔥 {goal.streak}d
                            </Badge>
                          )}
                          <span className="font-bold">{goal.progress}%</span>
                        </div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                      <span><Calendar className="w-4 h-4 inline mr-1" />{formatDate(goal.targetDate)}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full mt-4 hover:bg-green-500 hover:text-white transition-colors"
                      onClick={() => toggleGoalMutation.mutate({ goalId: goal.id })}
                    >
                      <Check className="w-4 h-4 mr-2" />Complete
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card className="border-0 shadow-lg bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Trophy className="w-5 h-5" />
              Completed Goals ({completedGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedGoals.map((goal) => {
              const categoryConfig = getCategoryConfig(goal.category);
              
              return (
                <div key={goal.id} className="flex items-center gap-4 p-4 bg-white/60 rounded-lg mb-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-green-900">{goal.title}</h4>
                      <span>{categoryConfig.icon}</span>
                    </div>
                    {goal.streak && (
                      <p className="text-xs text-green-600">🏆 {goal.streak} day streak achieved</p>
                    )}
                  </div>
                  <Badge className="bg-green-500 text-white">✨ Done</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {activeGoals.length === 0 && completedGoals.length === 0 && (
        <Card className="text-center p-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Goals Yet</h3>
          <p className="text-gray-500 mb-6">Start your journey by creating your first goal!</p>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />Create First Goal
          </Button>
        </Card>
      )}
    </div>
  );
}