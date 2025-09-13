import { Phone, AlertTriangle, Heart, Clock, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CrisisResource {
  id: string;
  name: string;
  description: string;
  phone: string;
  hours: string;
  type: 'national' | 'local' | 'text' | 'chat';
  available24h: boolean;
}

export function CrisisSupport() {
  // TODO: remove mock functionality - replace with real crisis resources
  const crisisResources: CrisisResource[] = [
    {
      id: '1',
      name: 'National Suicide Prevention Lifeline',
      description: 'Free and confidential emotional support for people in suicidal crisis or emotional distress.',
      phone: '988',
      hours: '24/7',
      type: 'national',
      available24h: true
    },
    {
      id: '2',
      name: 'Crisis Text Line',
      description: 'Text-based crisis support available anytime. Text HOME to 741741.',
      phone: '741741',
      hours: '24/7',
      type: 'text',
      available24h: true
    },
    {
      id: '3',
      name: 'Campus Counseling Center',
      description: 'On-campus mental health professionals for students.',
      phone: '(555) 123-4567',
      hours: 'Mon-Fri 8AM-5PM',
      type: 'local',
      available24h: false
    },
    {
      id: '4',
      name: 'Campus Security',
      description: 'Emergency support and immediate assistance on campus.',
      phone: '(555) 911-HELP',
      hours: '24/7',
      type: 'local',
      available24h: true
    }
  ];

  const handleCallCrisis = (resource: CrisisResource) => {
    console.log(`Initiating call to: ${resource.name} - ${resource.phone}`);
    // TODO: In real app, this would initiate actual call
  };

  const getResourceIcon = (type: CrisisResource['type']) => {
    switch (type) {
      case 'national': return <Phone className="w-5 h-5 text-red-600" />;
      case 'text': return <Phone className="w-5 h-5 text-blue-600" />;
      case 'chat': return <Phone className="w-5 h-5 text-green-600" />;
      case 'local': return <MapPin className="w-5 h-5 text-purple-600" />;
      default: return <Phone className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: CrisisResource['type']) => {
    switch (type) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'chat': return 'bg-green-100 text-green-800';
      case 'local': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6" data-testid="crisis-support">
      {/* Emergency Header */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-6 h-6" />
            Crisis Support & Emergency Resources
          </CardTitle>
          <p className="text-red-700 text-sm">
            If you're in immediate danger, please call emergency services (911) or go to your nearest emergency room.
          </p>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Emergency Call</h3>
                <p className="text-sm text-muted-foreground">Immediate crisis support</p>
              </div>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => handleCallCrisis(crisisResources[0])}
                data-testid="button-emergency-call"
              >
                Call 988 Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Text Support</h3>
                <p className="text-sm text-muted-foreground">Crisis text line</p>
              </div>
              <Button 
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => handleCallCrisis(crisisResources[1])}
                data-testid="button-text-support"
              >
                Text HOME to 741741
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Crisis Resources */}
      <Card>
        <CardHeader>
          <CardTitle>All Crisis Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {crisisResources.map((resource) => (
            <div
              key={resource.id}
              className="p-4 border rounded-lg space-y-3 hover-elevate"
              data-testid={`crisis-resource-${resource.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getResourceIcon(resource.type)}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{resource.name}</h3>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                      {resource.available24h && (
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          <Clock className="w-3 h-3 mr-1" />
                          24/7
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">📞 {resource.phone}</span>
                      <span className="text-muted-foreground">⏰ {resource.hours}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleCallCrisis(resource)}
                  className="ml-4"
                  data-testid={`button-call-${resource.id}`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Safety Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Crisis Safety Planning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Immediate Steps</h4>
              <p className="text-sm text-blue-800">
                Remove means of harm, stay with someone you trust, or go to a safe place.
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Coping Strategies</h4>
              <p className="text-sm text-green-800">
                Practice breathing exercises, listen to calming music, or engage in grounding techniques.
              </p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-1">Support Network</h4>
              <p className="text-sm text-purple-800">
                Reach out to trusted friends, family members, or mental health professionals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}