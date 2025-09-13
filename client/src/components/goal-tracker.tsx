import { useState } from "react";
import { Target, Plus, Check, X, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'academic' | 'personal';
  progress: number;
  targetDate: Date;
  isCompleted: boolean;
  subtasks: string[];
  completedSubtasks: number;
}

export function GoalTracker() {
  const [newGoal, setNewGoal] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // TODO: remove mock functionality
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Daily Meditation Practice',
      description: 'Meditate for 10 minutes every day',
      category: 'wellness',
      progress: 70,
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      subtasks: ['Morning meditation', 'Evening reflection', 'Track mood changes'],
      completedSubtasks: 2
    },
    {
      id: '2',
      title: 'Complete Data Structures Course',
      description: 'Finish all assignments and projects',
      category: 'academic',
      progress: 45,
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      subtasks: ['Watch lectures', 'Complete assignments', 'Study for final'],
      completedSubtasks: 1
    },
    {
      id: '3',
      title: 'Journal Weekly',
      description: 'Write in journal 3 times per week',
      category: 'wellness',
      progress: 100,
      targetDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isCompleted: true,
      subtasks: ['Monday entry', 'Wednesday entry', 'Friday entry'],
      completedSubtasks: 3
    }
  ]);

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal,
      description: '',
      category: 'personal',
      progress: 0,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      subtasks: [],
      completedSubtasks: 0
    };
    
    setGoals(prev => [goal, ...prev]);
    setNewGoal("");
    setShowAddForm(false);
    console.log('Added new goal:', goal);
  };

  const handleToggleGoal = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            isCompleted: !goal.isCompleted,
            progress: !goal.isCompleted ? 100 : goal.progress
          }
        : goal
    ));
    console.log(`Toggled goal completion: ${goalId}`);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    console.log(`Deleted goal: ${goalId}`);
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'wellness': return 'bg-green-100 text-green-800';
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntil = (date: Date) => {
    const diffTime = date.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);

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
              <Button onClick={handleAddGoal} data-testid="button-submit-goal">
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
                      checked={goal.isCompleted}
                      onCheckedChange={() => handleToggleGoal(goal.id)}
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
                  {goal.subtasks.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {goal.completedSubtasks}/{goal.subtasks.length} subtasks completed
                    </div>
                  )}
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
                    Completed on {formatDate(goal.targetDate)}
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