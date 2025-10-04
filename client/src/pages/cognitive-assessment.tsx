import React, { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VoiceAnalysis from '@/components/voice-analysis';
import { CognitiveTracker } from '@/components/cognitive-tracker';
import { Brain, Mic, PenTool, Calendar, TrendingUp, History } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AssessmentHistory {
  id: string;
  date: string;
  type: 'voice' | 'cognitive' | 'comprehensive';
  cognitiveScore: number;
  fluencyScore?: number;
  status: 'completed' | 'in-progress';
}

export default function CognitiveAssessmentPage() {
  const [activeAssessment, setActiveAssessment] = useState<'voice' | 'cognitive' | 'comprehensive' | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([]);

  // Fetch assessment history
  const { data: historyData } = useQuery({
    queryKey: ['/api/cognitive/assessment-history'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: '1',
          date: '2025-10-04',
          type: 'voice' as const,
          cognitiveScore: 87,
          fluencyScore: 92,
          status: 'completed' as const,
        },
        {
          id: '2',
          date: '2025-10-03',
          type: 'cognitive' as const,
          cognitiveScore: 84,
          status: 'completed' as const,
        },
        {
          id: '3',
          date: '2025-10-02',
          type: 'comprehensive' as const,
          cognitiveScore: 89,
          fluencyScore: 88,
          status: 'completed' as const,
        },
      ] as AssessmentHistory[];
    },
  });

  const handleVoiceAnalysisComplete = (result: any) => {
    const newEntry: AssessmentHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'voice',
      cognitiveScore: result.cognitiveScore,
      fluencyScore: result.fluencyScore,
      status: 'completed',
    };
    setAssessmentHistory(prev => [newEntry, ...prev]);
  };

  const getAssessmentTypeColor = (type: string) => {
    switch (type) {
      case 'voice': return 'bg-blue-500';
      case 'cognitive': return 'bg-green-500';
      case 'comprehensive': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageScore = historyData?.length 
    ? Math.round(historyData.reduce((sum, item) => sum + item.cognitiveScore, 0) / historyData.length)
    : 0;

  if (activeAssessment === 'voice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setActiveAssessment(null)}
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
            <h1 className="text-3xl font-bold">Voice-Based Cognitive Analysis</h1>
          </div>
          
          <VoiceAnalysis 
            onAnalysisComplete={handleVoiceAnalysisComplete}
            dailyCheckup={true}
          />
        </div>
      </div>
    );
  }

  if (activeAssessment === 'cognitive') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setActiveAssessment(null)}
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
            <h1 className="text-3xl font-bold">Cognitive State Assessment</h1>
          </div>
          
          <CognitiveTracker variant="full" />
        </div>
      </div>
    );
  }

  if (activeAssessment === 'comprehensive') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setActiveAssessment(null)}
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
            <h1 className="text-3xl font-bold">Comprehensive Assessment</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Voice Analysis</h2>
              <VoiceAnalysis 
                onAnalysisComplete={handleVoiceAnalysisComplete}
                dailyCheckup={true}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Cognitive State</h2>
              <CognitiveTracker variant="full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold">Cognitive Assessment Center</h1>
            <p className="text-muted-foreground">Monitor and track cognitive health through various assessment methods</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
              <Badge variant="secondary" className="mt-2">
                Last 7 days
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {historyData?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Assessments</div>
              <Badge variant="outline" className="mt-2">
                All time
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {historyData?.filter(h => h.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">This Week</div>
              <Badge variant="default" className="mt-2 bg-green-500">
                Active
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                3
              </div>
              <div className="text-sm text-muted-foreground">Streak Days</div>
              <Badge variant="secondary" className="mt-2">
                Keep going!
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Voice-Based Analysis */}
          <Card 
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setActiveAssessment('voice')}
          >
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900/20 mx-auto w-fit group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Voice Analysis</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Analyze speech patterns, fluency, and cognitive indicators through voice recording
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">Daily Check-up</Badge>
                  <Badge variant="outline">Speech Patterns</Badge>
                  <div className="text-xs text-muted-foreground mt-2">
                    Duration: 5-10 minutes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cognitive State Assessment */}
          <Card 
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setActiveAssessment('cognitive')}
          >
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/20 mx-auto w-fit group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Cognitive State</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track mental clarity, focus, and cognitive wellness through interactive assessment
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">Self-Assessment</Badge>
                  <Badge variant="outline">Mental Clarity</Badge>
                  <div className="text-xs text-muted-foreground mt-2">
                    Duration: 2-3 minutes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Assessment */}
          <Card 
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setActiveAssessment('comprehensive')}
          >
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-purple-100 dark:bg-purple-900/20 mx-auto w-fit group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Comprehensive</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Complete assessment combining voice analysis and cognitive state evaluation
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">Full Assessment</Badge>
                  <Badge variant="outline">Detailed Report</Badge>
                  <div className="text-xs text-muted-foreground mt-2">
                    Duration: 10-15 minutes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment History */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <History className="w-5 h-5 text-gray-500" />
              Recent Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyData && historyData.length > 0 ? (
              <div className="space-y-3">
                {historyData.slice(0, 5).map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className={`${getAssessmentTypeColor(assessment.type)} text-white`}>
                        {assessment.type}
                      </Badge>
                      <div>
                        <div className="font-medium">{assessment.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {assessment.type === 'voice' ? 'Voice-based analysis' : 
                           assessment.type === 'cognitive' ? 'Cognitive state assessment' : 
                           'Comprehensive evaluation'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getScoreColor(assessment.cognitiveScore)}`}>
                        {assessment.cognitiveScore}
                      </div>
                      {assessment.fluencyScore && (
                        <div className="text-sm text-muted-foreground">
                          Fluency: {assessment.fluencyScore}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No assessments yet. Start with your first cognitive assessment!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}