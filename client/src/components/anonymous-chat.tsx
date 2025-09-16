import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Shield } from "lucide-react";

export function AnonymousChat() {
  const [isStarted, setIsStarted] = useState(false);

  if (isStarted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              Anonymous Chat Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <strong>Therapist:</strong> Hello! I'm here to provide you with confidential support. 
                  How are you feeling today?
                </p>
              </div>
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Anonymous chat feature coming soon!</p>
                <p className="text-xs">This will include real-time messaging with licensed therapists.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsStarted(false)}
                className="w-full"
              >
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            Anonymous Therapy Chat
          </CardTitle>
          <p className="text-muted-foreground">
            Connect with licensed therapists for confidential, real-time support
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Your Privacy is Protected</span>
              </div>
              <p className="text-sm text-green-700">
                All conversations are confidential and can be completely anonymous. 
                Therapists are licensed professionals bound by ethical guidelines.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-lg font-semibold text-blue-600">2</div>
                <div className="text-sm text-muted-foreground">Therapists Online</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-lg font-semibold text-green-600">&lt; 5 min</div>
                <div className="text-sm text-muted-foreground">Avg Wait Time</div>
              </div>
            </div>

            <Button 
              onClick={() => setIsStarted(true)}
              className="w-full"
              size="lg"
            >
              Start Anonymous Chat
            </Button>

            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                Feature Preview - Full Implementation Coming Soon
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Support Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Anxiety & Worry',
              'Depression & Low Mood', 
              'Academic Stress',
              'Relationships',
              'Trauma & Difficult Experiences',
              'Self-esteem & Confidence'
            ].map((category) => (
              <div key={category} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-sm font-medium">{category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}