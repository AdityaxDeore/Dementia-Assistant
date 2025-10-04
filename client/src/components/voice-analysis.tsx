import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Play, Square, Brain, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceAnalysisResult {
  cognitiveScore: number;
  fluencyScore: number;
  pauseAnalysis: {
    averagePauseLength: number;
    pauseFrequency: number;
    unusualPauses: number;
  };
  speechMetrics: {
    wordsPerMinute: number;
    articulation: number;
    coherence: number;
  };
  concerns: string[];
  recommendations: string[];
  timestamp: string;
}

interface VoiceAnalysisProps {
  onAnalysisComplete?: (result: VoiceAnalysisResult) => void;
  dailyCheckup?: boolean;
}

export function VoiceAnalysis({ onAnalysisComplete, dailyCheckup = false }: VoiceAnalysisProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<VoiceAnalysisResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Daily check-up prompts
  const checkupPrompts = [
    "Tell me about your morning routine today.",
    "What did you have for breakfast?",
    "Can you describe what you see outside your window?",
    "Tell me about your family members.",
    "What are your plans for today?",
    "Describe your favorite memory from this week."
  ];

  const [currentPrompt, setCurrentPrompt] = useState(
    dailyCheckup ? checkupPrompts[Math.floor(Math.random() * checkupPrompts.length)] : ""
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        analyzeAudio(audioBlob);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: dailyCheckup ? "Please respond to the prompt above" : "Start speaking for cognitive analysis",
      });

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [dailyCheckup, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const analyzeAudio = useCallback(async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate audio analysis - In production, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis results - Replace with actual speech analysis
      const mockResult: VoiceAnalysisResult = {
        cognitiveScore: Math.floor(Math.random() * 30) + 70, // 70-100
        fluencyScore: Math.floor(Math.random() * 25) + 75,   // 75-100
        pauseAnalysis: {
          averagePauseLength: Math.random() * 2 + 0.5, // 0.5-2.5 seconds
          pauseFrequency: Math.floor(Math.random() * 5) + 2, // 2-7 per minute
          unusualPauses: Math.floor(Math.random() * 3), // 0-3
        },
        speechMetrics: {
          wordsPerMinute: Math.floor(Math.random() * 40) + 120, // 120-160 WPM
          articulation: Math.floor(Math.random() * 20) + 80,    // 80-100
          coherence: Math.floor(Math.random() * 25) + 75,       // 75-100
        },
        concerns: [],
        recommendations: [],
        timestamp: new Date().toISOString(),
      };

      // Add concerns based on scores
      if (mockResult.cognitiveScore < 80) {
        mockResult.concerns.push("Slight decrease in cognitive clarity");
        mockResult.recommendations.push("Consider brain training exercises");
      }
      
      if (mockResult.pauseAnalysis.unusualPauses > 1) {
        mockResult.concerns.push("Increased hesitation in speech");
        mockResult.recommendations.push("Practice daily conversation");
      }

      if (mockResult.speechMetrics.wordsPerMinute < 130) {
        mockResult.concerns.push("Slower speech rate than baseline");
        mockResult.recommendations.push("Reading aloud exercises recommended");
      }

      if (mockResult.concerns.length === 0) {
        mockResult.recommendations.push("Excellent cognitive performance! Keep up the good work.");
      }

      setAnalysis(mockResult);
      onAnalysisComplete?.(mockResult);

      toast({
        title: "Analysis complete",
        description: `Cognitive score: ${mockResult.cognitiveScore}/100`,
      });

    } catch (error) {
      console.error('Error analyzing audio:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'default' as const, bg: 'bg-green-500', text: 'Excellent' };
    if (score >= 80) return { variant: 'secondary' as const, bg: 'bg-blue-500', text: 'Good' };
    if (score >= 70) return { variant: 'outline' as const, bg: 'bg-yellow-500', text: 'Fair' };
    return { variant: 'destructive' as const, bg: 'bg-red-500', text: 'Needs Attention' };
  };

  return (
    <div className="space-y-6">
      {/* Recording Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/20">
              <Brain className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <span className="text-blue-500">Voice Cognitive Analysis</span>
              <p className="text-xs text-muted-foreground font-normal">
                {dailyCheckup ? 'Daily cognitive check-up' : 'Assess cognitive health through speech'}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Checkup Prompt */}
          {dailyCheckup && currentPrompt && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Today's Prompt:</h4>
              <p className="text-blue-700 dark:text-blue-300">{currentPrompt}</p>
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex gap-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={isAnalyzing}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-mono font-bold">{formatTime(recordingTime)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Recording in progress...</p>
              </div>
            )}

            {/* Analysis Status */}
            {isAnalyzing && (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5 animate-pulse text-blue-500" />
                  <span>Analyzing speech patterns...</span>
                </div>
                <Progress value={66} className="w-64" />
              </div>
            )}
          </div>

          {/* Audio Playback */}
          {audioUrl && !isAnalyzing && (
            <div className="flex justify-center">
              <audio controls src={audioUrl} className="w-full max-w-md">
                Your browser does not support audio playback.
              </audio>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className={`text-3xl font-bold ${getScoreColor(analysis.cognitiveScore)}`}>
                  {analysis.cognitiveScore}
                </div>
                <div className="text-sm text-muted-foreground">Cognitive Score</div>
                <Badge {...getScoreBadge(analysis.cognitiveScore)} className="mt-2">
                  {getScoreBadge(analysis.cognitiveScore).text}
                </Badge>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className={`text-3xl font-bold ${getScoreColor(analysis.fluencyScore)}`}>
                  {analysis.fluencyScore}
                </div>
                <div className="text-sm text-muted-foreground">Fluency Score</div>
                <Badge {...getScoreBadge(analysis.fluencyScore)} className="mt-2">
                  {getScoreBadge(analysis.fluencyScore).text}
                </Badge>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="space-y-4">
              <h4 className="font-semibold">Speech Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-medium">Words per minute</div>
                  <div className="text-2xl font-bold text-blue-600">{analysis.speechMetrics.wordsPerMinute}</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-medium">Articulation</div>
                  <div className="text-2xl font-bold text-green-600">{analysis.speechMetrics.articulation}%</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-medium">Coherence</div>
                  <div className="text-2xl font-bold text-purple-600">{analysis.speechMetrics.coherence}%</div>
                </div>
              </div>
            </div>

            {/* Pause Analysis */}
            <div className="space-y-4">
              <h4 className="font-semibold">Pause Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-medium">Average pause</div>
                  <div className="text-2xl font-bold">{analysis.pauseAnalysis.averagePauseLength.toFixed(1)}s</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-medium">Pause frequency</div>
                  <div className="text-2xl font-bold">{analysis.pauseAnalysis.pauseFrequency}/min</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-medium">Unusual pauses</div>
                  <div className="text-2xl font-bold">{analysis.pauseAnalysis.unusualPauses}</div>
                </div>
              </div>
            </div>

            {/* Concerns & Recommendations */}
            {analysis.concerns.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Areas of Attention
                </h4>
                <div className="space-y-2">
                  {analysis.concerns.map((concern, index) => (
                    <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">{concern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-green-800 dark:text-green-200">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* New Prompt Button for Daily Checkup */}
            {dailyCheckup && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setCurrentPrompt(checkupPrompts[Math.floor(Math.random() * checkupPrompts.length)])}
                  variant="outline"
                >
                  Try Another Prompt
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default VoiceAnalysis;