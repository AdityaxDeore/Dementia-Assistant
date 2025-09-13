import { useState } from "react";
import { Target, Plus, Check, X, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: 'wellness' | 'academic' | 'personal';
  progress: number;
  isCompleted: number; // 0 or 1 (database format)
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function GoalTracker() {
  const [newGoal, setNewGoal] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch goals
  const { data: goalsData, isLoading } = useQuery({
    queryKey: ['/api/goals'],
    queryFn: async () => {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json();
    }
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: { title: string; category: string }) => {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });
      if (!response.ok) throw new Error('Failed to create goal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      setNewGoal("");
      setShowAddForm(false);
      toast({ title: "Goal created!", description: "Your new goal has been added." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create goal.", variant: "destructive" });
    }
  });

  // Toggle goal completion mutation
  const toggleGoalMutation = useMutation({
    mutationFn: async ({ goalId, isCompleted, progress }: { goalId: string; isCompleted: number; progress: number }) => {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted, progress })
      });
      if (!response.ok) throw new Error('Failed to update goal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
    }
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete goal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({ title: "Goal deleted", description: "Your goal has been removed." });
    }
  });

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    createGoalMutation.mutate({ title: newGoal, category: 'personal' });
  };

  const handleToggleGoal = (goal: Goal) => {
    const newIsCompleted = goal.isCompleted ? 0 : 1;
    const newProgress = newIsCompleted ? 100 : goal.progress;
    toggleGoalMutation.mutate({ 
      goalId: goal.id, 
      isCompleted: newIsCompleted, 
      progress: newProgress 
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoalMutation.mutate(goalId);
  };

  const goals = goalsData?.goals || [];

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'wellness': return 'bg-green-100 text-green-800';
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntil = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : 'Overdue';
  };

  const activeGoals = goals.filter((goal: Goal) => !goal.isCompleted);
  const completedGoals = goals.filter((goal: Goal) => goal.isCompleted);

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="goal-tracker">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading goals...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="goal-tracker">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Goal Tracker
            </CardTitle>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              data-testid="button-add-goal"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        {showAddForm && (
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                data-testid="input-new-goal"
              />
              <Button 
                onClick={handleAddGoal} 
                disabled={createGoalMutation.isPending}
                data-testid="button-submit-goal"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                data-testid="button-cancel-goal"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{activeGoals.length}</div>
              <div className="text-sm text-muted-foreground">Active Goals</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Progress</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.map((goal) => (
              <div key={goal.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={Boolean(goal.isCompleted)}
                      onCheckedChange={() => handleToggleGoal(goal)}
                      data-testid={`checkbox-goal-${goal.id}`}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {goal.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getCategoryColor(goal.category)}>
                          {goal.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(goal.targetDate)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {getDaysUntil(goal.targetDate)} days
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                    data-testid={`button-delete-goal-${goal.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Completed Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">{goal.title}</h4>
                  <p className="text-sm text-green-700">
                    {goal.description || 'Goal completed!'}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Done</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}