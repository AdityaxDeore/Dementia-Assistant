import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Target,
  Brain,
  Heart
} from "lucide-react";

interface TraumaPattern {
  trigger: string;
  frequency: number;
  severity: number;
  trend: "improving" | "stable" | "concerning";
}

interface RecoveryInsight {
  title: string;
  description: string;
  type: "positive" | "neutral" | "warning";
  icon: React.ReactNode;
}

export function TraumaAnalytics() {
  const [patterns, setPatterns] = useState<TraumaPattern[]>([]);
  const [insights, setInsights] = useState<RecoveryInsight[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [overallTrend, setOverallTrend] = useState<"improving" | "stable" | "concerning">("improving");

  useEffect(() => {
    // Mock analytics data
    const mockPatterns: TraumaPattern[] = [
      { trigger: "Academic pressure", frequency: 8, severity: 3.2, trend: "improving" },
      { trigger: "Social situations", frequency: 5, severity: 2.8, trend: "stable" },
      { trigger: "Past memories", frequency: 3, severity: 4.1, trend: "concerning" },
      { trigger: "Family issues", frequency: 2, severity: 2.5, trend: "improving" }
    ];

    const mockInsights: RecoveryInsight[] = [
      {
        title: "Progress in Academic Stress",
        description: "Your responses to academic pressure have improved 35% this month. The coping strategies are working!",
        type: "positive",
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        title: "Consistent Self-Care Pattern",
        description: "You've maintained regular diary entries for 2 weeks. This consistency supports emotional processing.",
        type: "positive", 
        icon: <CheckCircle className="w-4 h-4" />
      },
      {
        title: "Monitor Past Memory Triggers",
        description: "Past memory triggers have increased in intensity. Consider discussing this pattern with your therapist.",
        type: "warning",
        icon: <AlertTriangle className="w-4 h-4" />
      }
    ];

    setPatterns(mockPatterns);
    setInsights(mockInsights);
    setWeeklyProgress(73);
    setOverallTrend("improving");
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "concerning": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <BarChart3 className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving": return "bg-green-100 text-green-800";
      case "concerning": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive": return "border-green-200 bg-green-50";
      case "warning": return "border-orange-200 bg-orange-50";
      default: return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Recovery Progress Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{weeklyProgress}%</div>
              <p className="text-sm text-muted-foreground">Weekly Progress</p>
              <Progress value={weeklyProgress} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                {getTrendIcon(overallTrend)}
                <Badge className={getTrendColor(overallTrend)}>
                  {overallTrend}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Overall Trend</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{patterns.length}</div>
              <p className="text-sm text-muted-foreground">Identified Patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trigger Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Trigger Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{pattern.trigger}</span>
                    {getTrendIcon(pattern.trend)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Frequency: {pattern.frequency} times/month</span>
                    <span>Avg. Severity: {pattern.severity}/5</span>
                  </div>
                </div>
                <Badge className={getTrendColor(pattern.trend)}>
                  {pattern.trend}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Recovery Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type)}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📅 Schedule Therapy Session</h4>
              <p className="text-sm text-blue-700 mb-3">
                Based on your recent patterns, discussing past memory triggers with a professional could be beneficial.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Find Therapist
              </Button>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">🧘‍♀️ Continue Coping Strategies</h4>
              <p className="text-sm text-green-700 mb-3">
                Your academic stress management is improving. Keep using your current coping techniques.
              </p>
              <Button size="sm" variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                View Techniques
              </Button>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">📝 Maintain Journaling</h4>
              <p className="text-sm text-purple-700 mb-3">
                Your consistent diary entries are supporting emotional processing and self-awareness.
              </p>
              <Button size="sm" variant="outline" className="border-purple-600 text-purple-700 hover:bg-purple-100">
                Continue Writing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}