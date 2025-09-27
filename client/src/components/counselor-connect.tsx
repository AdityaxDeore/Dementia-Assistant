import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MessageCircle, 
  Shield, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Video, 
  MapPin,
  GraduationCap,
  Heart,
  CheckCircle,
  Star
} from "lucide-react";

interface Counselor {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  experience: number;
  rating: number;
  availability: string;
  location: string;
  photoUrl?: string;
  languages: string[];
  isOnline: boolean;
}

interface AppointmentRequest {
  counselorId: string;
  preferredDate: string;
  preferredTime: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  contactMethod: 'in-person' | 'video' | 'phone';
  studentName: string;
  studentEmail: string;
  studentPhone: string;
}

export function CounselorConnect() {
  const [currentView, setCurrentView] = useState<'browse' | 'book' | 'success'>('browse');
  const [selectedCounselorId, setSelectedCounselorId] = useState<string | null>(null);
  const [appointmentRequest, setAppointmentRequest] = useState<Partial<AppointmentRequest>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock counselor data - In real implementation, this would come from your college's database
  const counselors: Counselor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Licensed Clinical Psychologist',
      specializations: ['Anxiety', 'Depression', 'Academic Stress', 'Trauma'],
      experience: 8,
      rating: 4.9,
      availability: 'Today: 2:00 PM - 4:00 PM',
      location: 'Student Counseling Center - Room 205',
      languages: ['English', 'Spanish'],
      isOnline: true
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'Licensed Mental Health Counselor',
      specializations: ['ADHD', 'Study Skills', 'Social Anxiety', 'Career Counseling'],
      experience: 12,
      rating: 4.8,
      availability: 'Tomorrow: 10:00 AM - 12:00 PM',
      location: 'Wellness Center - Building B',
      languages: ['English', 'Mandarin'],
      isOnline: false
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      title: 'Licensed Clinical Social Worker',
      specializations: ['Relationship Issues', 'Family Therapy', 'Grief Counseling'],
      experience: 6,
      rating: 4.7,
      availability: 'Today: 11:00 AM - 1:00 PM',
      location: 'Health Services - 3rd Floor',
      languages: ['English', 'Spanish', 'Portuguese'],
      isOnline: true
    },
    {
      id: '4',
      name: 'Dr. James Thompson',
      title: 'Psychiatric Nurse Practitioner',
      specializations: ['Medication Management', 'Bipolar Disorder', 'Anxiety Disorders'],
      experience: 15,
      rating: 4.9,
      availability: 'Next Week: Multiple slots available',
      location: 'Medical Center - Psychiatry Wing',
      languages: ['English'],
      isOnline: false
    }
  ];

  const selectedCounselor = counselors.find(c => c.id === selectedCounselorId);

  const handleBookAppointment = (counselorId: string) => {
    setSelectedCounselorId(counselorId);
    setCurrentView('book');
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentView('success');
    }, 2000);
  };

  if (currentView === 'success') {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-400/10 to-emerald-400/10">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Appointment Request Submitted!</h2>
                <p className="text-green-700 mb-4">
                  Your appointment request has been sent to {selectedCounselor?.name}. 
                  You will receive a confirmation email within 24 hours.
                </p>
                <div className="p-4 bg-white/80 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700">
                    <strong>Reference ID:</strong> CR-{Date.now().toString().slice(-6)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Expected Response:</strong> Within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => setCurrentView('browse')}
                  variant="outline"
                >
                  Book Another Appointment
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'book' && selectedCounselor) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Book Appointment with {selectedCounselor.name}
            </CardTitle>
            <p className="text-muted-foreground">
              Fill out the form below to request an appointment
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Counselor Summary */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedCounselor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCounselor.title}</p>
                  <p className="text-sm text-blue-600">{selectedCounselor.availability}</p>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name</Label>
                  <Input
                    id="student-name"
                    placeholder="Your full name"
                    value={appointmentRequest.studentName || ''}
                    onChange={(e) => setAppointmentRequest(prev => ({
                      ...prev,
                      studentName: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="your.email@college.edu"
                    value={appointmentRequest.studentEmail || ''}
                    onChange={(e) => setAppointmentRequest(prev => ({
                      ...prev,
                      studentEmail: e.target.value
                    }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-phone">Phone Number (Optional)</Label>
                <Input
                  id="student-phone"
                  placeholder="(555) 123-4567"
                  value={appointmentRequest.studentPhone || ''}
                  onChange={(e) => setAppointmentRequest(prev => ({
                    ...prev,
                    studentPhone: e.target.value
                  }))}
                />
              </div>
            </div>

            {/* Appointment Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold">Appointment Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred-date">Preferred Date</Label>
                  <Input
                    id="preferred-date"
                    type="date"
                    value={appointmentRequest.preferredDate || ''}
                    onChange={(e) => setAppointmentRequest(prev => ({
                      ...prev,
                      preferredDate: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred-time">Preferred Time</Label>
                  <Input
                    id="preferred-time"
                    type="time"
                    value={appointmentRequest.preferredTime || ''}
                    onChange={(e) => setAppointmentRequest(prev => ({
                      ...prev,
                      preferredTime: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Contact Method */}
            <div className="space-y-4">
              <h3 className="font-semibold">Preferred Meeting Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'in-person', label: 'In-Person', icon: MapPin },
                  { value: 'video', label: 'Video Call', icon: Video },
                  { value: 'phone', label: 'Phone Call', icon: Phone }
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={appointmentRequest.contactMethod === value ? 'default' : 'outline'}
                    onClick={() => setAppointmentRequest(prev => ({
                      ...prev,
                      contactMethod: value as any
                    }))}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div className="space-y-4">
              <h3 className="font-semibold">Urgency Level</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
                  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
                  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
                  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
                ].map(({ value, label, color }) => (
                  <Button
                    key={value}
                    variant={appointmentRequest.urgency === value ? 'default' : 'outline'}
                    onClick={() => setAppointmentRequest(prev => ({
                      ...prev,
                      urgency: value as any
                    }))}
                    className="h-auto p-3"
                  >
                    <span className={`text-sm px-2 py-1 rounded ${color}`}>{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Reason for Appointment */}
            <div className="space-y-2">
              <Label htmlFor="reason">Brief Description (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Briefly describe what you'd like to discuss or any specific concerns..."
                value={appointmentRequest.reason || ''}
                onChange={(e) => setAppointmentRequest(prev => ({
                  ...prev,
                  reason: e.target.value
                }))}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                This information helps the counselor prepare for your session
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentView('browse')}
                className="flex-1"
              >
                Back to Counselors
              </Button>
              <Button
                onClick={handleSubmitRequest}
                disabled={isSubmitting || !appointmentRequest.studentName || !appointmentRequest.studentEmail}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-400/10 to-indigo-400/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Professional & Confidential</span>
              </div>
              <p className="text-sm text-blue-700">
                All counselors are licensed professionals bound by strict confidentiality guidelines. 
                Your conversations are private and secure.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg bg-white/80">
                <div className="text-lg font-semibold text-green-600">4</div>
                <div className="text-xs text-muted-foreground">Available Counselors</div>
              </div>
              <div className="text-center p-3 border rounded-lg bg-white/80">
                <div className="text-lg font-semibold text-blue-600">24-48h</div>
                <div className="text-xs text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center p-3 border rounded-lg bg-white/80">
                <div className="text-lg font-semibold text-purple-600">Free</div>
                <div className="text-xs text-muted-foreground">For Students</div>
              </div>
              <div className="text-center p-3 border rounded-lg bg-white/80">
                <div className="text-lg font-semibold text-orange-600">3</div>
                <div className="text-xs text-muted-foreground">Meeting Options</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Counselors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            Available College Counselors
          </CardTitle>
          <p className="text-muted-foreground">
            Choose from our team of licensed mental health professionals
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {counselors.map((counselor) => (
              <div key={counselor.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{counselor.name}</h3>
                        {counselor.isOnline && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Available Today
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{counselor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{counselor.title}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {counselor.specializations.slice(0, 3).map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {counselor.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{counselor.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{counselor.availability}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{counselor.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          <span>{counselor.experience} years experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => handleBookAppointment(counselor.id)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      Book Appointment
                    </Button>
                    <Badge variant="outline" className="text-xs text-center">
                      Languages: {counselor.languages.join(', ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Crisis Support</h3>
              <p className="text-sm text-red-700">
                If you're experiencing a mental health emergency, call Campus Security: (555) 911-HELP
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Emergency Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}