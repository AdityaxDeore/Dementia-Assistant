import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  Users, 
  MapPin, 
  Clock,
  Heart,
  Brain,
  CheckCircle,
  X,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

interface SOSEvent {
  id: string;
  type: 'manual' | 'ai-detected' | 'family-initiated';
  timestamp: string;
  location?: { lat: number; lng: number; address: string };
  description: string;
  status: 'active' | 'resolved' | 'false-alarm';
  responseTime?: number;
}

interface AdvancedSOSProps {
  onEmergencyTriggered?: (event: SOSEvent) => void;
  aiMonitoringEnabled?: boolean;
}

export function AdvancedSOS({ onEmergencyTriggered, aiMonitoringEnabled = true }: AdvancedSOSProps) {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Daughter',
      phone: '+91-9876543210',
      isPrimary: true,
    },
    {
      id: '2',
      name: 'Dr. Smith',
      relationship: 'Doctor',
      phone: '+91-9876543211',
      isPrimary: false,
    },
  ]);
  const [recentEvents, setRecentEvents] = useState<SOSEvent[]>([]);
  const [sosDescription, setSOSDescription] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding - in production, use a real geocoding service
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            address: '123 Main Street, City, State'
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Simulate AI monitoring
    if (aiMonitoringEnabled) {
      const interval = setInterval(() => {
        // Simulate AI detection (very low probability for demo)
        if (Math.random() < 0.001) { // 0.1% chance every check
          handleAIDetectedCrisis();
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [aiMonitoringEnabled]);

  const handleSOSActivation = async (type: 'manual' | 'ai-detected' = 'manual') => {
    setIsSOSActive(true);
    setIsConnecting(true);

    const newEvent: SOSEvent = {
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      location: currentLocation || undefined,
      description: type === 'manual' ? sosDescription : 'AI detected potential crisis situation',
      status: 'active',
    };

    try {
      // Simulate connecting to emergency services
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add to recent events
      setRecentEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      
      // Trigger callbacks
      onEmergencyTriggered?.(newEvent);

      // Simulate contacting Tele-MANAS and family
      await contactEmergencyServices(newEvent);
      await notifyEmergencyContacts(newEvent);

      toast({
        title: "SOS Activated",
        description: "Emergency services and family have been notified.",
      });

      setIsConnecting(false);
      
      // Auto-resolve after 5 minutes for demo
      setTimeout(() => {
        setIsSOSActive(false);
        setRecentEvents(prev => 
          prev.map(event => 
            event.id === newEvent.id 
              ? { ...event, status: 'resolved' as const, responseTime: 5 }
              : event
          )
        );
      }, 300000); // 5 minutes

    } catch (error) {
      console.error('Error activating SOS:', error);
      toast({
        title: "SOS Error",
        description: "Failed to activate emergency services. Please try again.",
        variant: "destructive",
      });
      setIsSOSActive(false);
      setIsConnecting(false);
    }
  };

  const handleAIDetectedCrisis = () => {
    toast({
      title: "Potential Crisis Detected",
      description: "AI monitoring has detected unusual patterns. Activating emergency protocols.",
      variant: "destructive",
    });
    handleSOSActivation('ai-detected');
  };

  const contactEmergencyServices = async (event: SOSEvent) => {
    // Simulate contacting Tele-MANAS (National Mental Health Helpline)
    // In production, this would make actual API calls
    console.log('Contacting Tele-MANAS:', {
      helpline: '14416',
      event,
      location: event.location,
    });

    // Simulate contacting Dementia India Alliance
    console.log('Contacting Dementia India Alliance:', {
      phone: '+91-80-2563-2838',
      event,
    });
  };

  const notifyEmergencyContacts = async (event: SOSEvent) => {
    const primaryContact = emergencyContacts.find(contact => contact.isPrimary);
    
    if (primaryContact) {
      // Simulate SMS/call to primary contact
      console.log('Notifying primary contact:', {
        contact: primaryContact,
        message: `Emergency alert: ${event.description}. Location: ${event.location?.address || 'Unknown'}. Please respond immediately.`,
        event,
      });
    }

    // Notify all emergency contacts
    emergencyContacts.forEach(contact => {
      console.log('Sending notification to:', contact.name, contact.phone);
    });
  };

  const cancelSOS = () => {
    if (isSOSActive) {
      setIsSOSActive(false);
      setIsConnecting(false);
      
      // Update the latest event status
      setRecentEvents(prev => 
        prev.map((event, index) => 
          index === 0 && event.status === 'active'
            ? { ...event, status: 'false-alarm' as const }
            : event
        )
      );
      
      toast({
        title: "SOS Cancelled",
        description: "Emergency alert has been cancelled.",
      });
    }
  };

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: 'New Contact',
      relationship: 'Family',
      phone: '',
      isPrimary: false,
    };
    setEmergencyContacts(prev => [...prev, newContact]);
  };

  const updateEmergencyContact = (id: string, updates: Partial<EmergencyContact>) => {
    setEmergencyContacts(prev => 
      prev.map(contact => 
        contact.id === id ? { ...contact, ...updates } : contact
      )
    );
  };

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'resolved': return 'bg-green-500';
      case 'false-alarm': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (showSettings) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-500" />
                Emergency Settings
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(false)}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Emergency Contacts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Emergency Contacts</h3>
                <Button onClick={addEmergencyContact} variant="outline" size="sm">
                  Add Contact
                </Button>
              </div>
              
              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={contact.name}
                        onChange={(e) => updateEmergencyContact(contact.id, { name: e.target.value })}
                        placeholder="Name"
                      />
                      <Input
                        value={contact.relationship}
                        onChange={(e) => updateEmergencyContact(contact.id, { relationship: e.target.value })}
                        placeholder="Relationship"
                      />
                      <Input
                        value={contact.phone}
                        onChange={(e) => updateEmergencyContact(contact.id, { phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`primary-${contact.id}`}
                          checked={contact.isPrimary}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Unset all other primary contacts
                              setEmergencyContacts(prev => 
                                prev.map(c => ({ ...c, isPrimary: c.id === contact.id }))
                              );
                            } else {
                              updateEmergencyContact(contact.id, { isPrimary: false });
                            }
                          }}
                          className="rounded"
                        />
                        <label htmlFor={`primary-${contact.id}`} className="text-sm">Primary contact</label>
                        {contact.isPrimary && (
                          <Badge variant="default" className="bg-blue-500">Primary</Badge>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => removeEmergencyContact(contact.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Monitoring Toggle */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">AI Crisis Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically detect potential crisis situations through behavioral patterns
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={aiMonitoringEnabled ? "default" : "secondary"}>
                    {aiMonitoringEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main SOS Card */}
      <Card className={`border-0 shadow-lg ${isSOSActive ? 'ring-4 ring-red-500 ring-opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isSOSActive ? 'bg-red-100 dark:bg-red-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              <Shield className={`w-5 h-5 ${isSOSActive ? 'text-red-600' : 'text-red-500'}`} />
            </div>
            <div>
              <span className={isSOSActive ? 'text-red-600' : 'text-red-500'}>Emergency SOS</span>
              <p className="text-xs text-muted-foreground font-normal">
                {isSOSActive ? 'Emergency services have been contacted' : 'Get immediate help when you need it'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="ml-auto"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isSOSActive ? (
            <>
              {/* Current Status */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-200">System Ready</div>
                    <div className="text-sm text-green-600 dark:text-green-300">
                      Emergency services and contacts are configured
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Status */}
              {currentLocation && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-blue-800 dark:text-blue-200">Location Available</div>
                      <div className="text-sm text-blue-600 dark:text-blue-300">
                        {currentLocation.address}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Monitoring Status */}
              {aiMonitoringEnabled && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-purple-800 dark:text-purple-200">AI Monitoring Active</div>
                      <div className="text-sm text-purple-600 dark:text-purple-300">
                        Continuously monitoring for signs of distress
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe the situation (optional)</label>
                <Textarea
                  value={sosDescription}
                  onChange={(e) => setSOSDescription(e.target.value)}
                  placeholder="Tell us what's happening..."
                  className="border-gray-200"
                  rows={3}
                />
              </div>

              {/* SOS Button */}
              <div className="text-center">
                <Button
                  onClick={() => handleSOSActivation('manual')}
                  className="bg-red-500 hover:bg-red-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isConnecting}
                >
                  <AlertTriangle className="w-8 h-8 mr-3" />
                  {isConnecting ? 'CONNECTING...' : 'EMERGENCY SOS'}
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  This will immediately contact emergency services and your family
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Active Emergency Status */}
              <div className="text-center space-y-4">
                <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">EMERGENCY ACTIVE</h3>
                  <p className="text-red-700 dark:text-red-300">
                    {isConnecting ? 'Connecting to emergency services...' : 'Help is on the way'}
                  </p>
                  
                  {!isConnecting && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                        <Phone className="w-4 h-4" />
                        <span>Tele-MANAS contacted</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                        <Users className="w-4 h-4" />
                        <span>Family notified</span>
                      </div>
                      {currentLocation && (
                        <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                          <MapPin className="w-4 h-4" />
                          <span>Location shared</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isConnecting && (
                  <Button
                    onClick={cancelSOS}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Cancel Emergency Alert
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contacts Quick View */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-500" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                </div>
                <div className="flex items-center gap-2">
                  {contact.isPrimary && (
                    <Badge variant="default" className="bg-blue-500 text-xs">Primary</Badge>
                  )}
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Emergency Events */}
      {recentEvents.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(event.status)} text-white text-xs`}>
                        {event.status.replace('-', ' ')}
                      </Badge>
                      <span className="text-sm font-medium">
                        {event.type === 'manual' ? 'Manual SOS' : 
                         event.type === 'ai-detected' ? 'AI Detected' : 'Family Initiated'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {event.responseTime && (
                    <p className="text-xs text-green-600 mt-1">
                      Resolved in {event.responseTime} minutes
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdvancedSOS;