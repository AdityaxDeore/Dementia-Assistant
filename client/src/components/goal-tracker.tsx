import { useState, useEffect } from "react";
import { Target, Plus, Check, X, Calendar, Trophy, Zap, TrendingUp, Award, Trash2, Play, Star, Clock, BarChart3, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
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
    "The only impossible journey is the one you never begin.",
    "Success is the sum of small efforts repeated daily.",
    "Your future self will thank you for the goals you pursue today."
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
      wellness: { icon: Target, color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' },
      academic: { icon: Trophy, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
      personal: { icon: Star, color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
      fitness: { icon: Zap, color: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200' },
      career: { icon: Award, color: 'gray', bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200' }
    };
    return configs[category] || configs.personal;
  };

  const getPriorityConfig = (priority: Goal['priority']) => {
    const configs = {
      high: { icon: Zap, color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
      medium: { icon: Clock, color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
      low: { icon: Circle, color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
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
    <div className="space-y-6" data-testid="goal-tracker">
      {/* Compact Header with Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Goal Tracker</h1>
                  <p className="text-sm text-gray-600">Track your wellness journey</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-add-goal"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
                <div className="text-xs text-blue-600 font-medium">Active</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
                <div className="text-xs text-green-600 font-medium">Complete</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
                <div className="text-xs text-purple-600 font-medium">Success</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Overall Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Progress</span>
                  <span className="font-semibold text-gray-900">{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="h-3" />
                <p className="text-sm text-gray-600 italic">
                  {motivationalQuote}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="career">Career</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing {filteredGoals.length} of {goals.length} goals</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card className="border-0 shadow-lg border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
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
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal({...newGoal, priority: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleAddGoal} className="bg-blue-600 hover:bg-blue-700" data-testid="button-submit-goal">
                <Check className="w-4 h-4 mr-2" />Create Goal
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-600" />
              Active Goals ({activeGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGoals.map((goal) => {
                const categoryConfig = getCategoryConfig(goal.category);
                const priorityConfig = getPriorityConfig(goal.priority);
                const CategoryIcon = categoryConfig.icon;
                const PriorityIcon = priorityConfig.icon;
                
                return (
                  <div key={goal.id} className={`group relative p-6 rounded-xl border-2 ${categoryConfig.borderColor} ${categoryConfig.bgColor} hover:shadow-lg transition-all`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${categoryConfig.bgColor} rounded-full flex items-center justify-center`}>
                          <CategoryIcon className={`w-5 h-5 ${categoryConfig.textColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <Badge variant="outline" className={`text-xs ${priorityConfig.borderColor}`}>
                            <PriorityIcon className="w-3 h-3 mr-1" /> {goal.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {goal.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <div className="flex items-center gap-2">
                          {goal.streak && (
                            <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
                              <Zap className="w-3 h-3 mr-1" />{goal.streak}d
                            </Badge>
                          )}
                          <span className="font-bold text-gray-900">{goal.progress}%</span>
                        </div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(goal.targetDate)}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full mt-4 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
                      onClick={() => toggleGoalMutation.mutate({ goalId: goal.id })}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />Mark Complete
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
        <Card className="border-0 shadow-lg bg-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Trophy className="w-5 h-5" />
              Completed Goals ({completedGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.map((goal) => {
                const categoryConfig = getCategoryConfig(goal.category);
                const CategoryIcon = categoryConfig.icon;
                
                return (
                  <div key={goal.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-green-900">{goal.title}</h4>
                        <CategoryIcon className="w-4 h-4 text-green-600" />
                      </div>
                      {goal.streak && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> {goal.streak} day streak achieved
                        </p>
                      )}
                    </div>
                    <Badge className="bg-green-500 text-white border-0">
                      <Star className="w-3 h-3 mr-1" /> Done
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {activeGoals.length === 0 && completedGoals.length === 0 && (
        <Card className="text-center p-12 border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Goals Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start your wellness journey by creating your first goal. Set achievable targets and track your progress.
          </p>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />Create Your First Goal
          </Button>
        </Card>
      )}
    </div>
  );
}