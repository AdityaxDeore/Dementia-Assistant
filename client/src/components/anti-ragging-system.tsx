import { useState } from "react";
import { AlertTriangle, Shield, Users, MessageCircle, Phone, FileText, Camera, Send, CheckCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface RaggingReport {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  location: string;
  dateTime: Date;
  isAnonymous: boolean;
  reporterContact?: string;
  status: "pending" | "investigating" | "resolved" | "closed";
  aiConsultationScore: number;
  supportOffered: string[];
}

interface AIConsultation {
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedActions: string[];
  urgencyScore: number;
  supportSuggestions: string[];
  followUpRequired: boolean;
}

export function AntiRaggingSystem() {
  const [activeTab, setActiveTab] = useState("report");
  const [reportForm, setReportForm] = useState({
    type: "",
    severity: "",
    description: "",
    location: "",
    isAnonymous: true,
    reporterContact: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiConsultation, setAiConsultation] = useState<AIConsultation | null>(null);

  // Mock previous reports for demonstration
  const [reports] = useState<RaggingReport[]>([
    {
      id: "1",
      type: "Verbal Harassment",
      severity: "high",
      description: "Senior students making inappropriate comments and threats",
      location: "Main Campus Cafeteria",
      dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isAnonymous: true,
      status: "investigating",
      aiConsultationScore: 8.5,
      supportOffered: ["Counseling Support", "Security Alert", "Peer Support Group"]
    },
    {
      id: "2",
      type: "Physical Intimidation",
      severity: "critical",
      description: "Group of seniors blocking pathway and making threats",
      location: "Hostel Block A",
      dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isAnonymous: false,
      reporterContact: "student@example.com",
      status: "resolved",
      aiConsultationScore: 9.2,
      supportOffered: ["Emergency Response", "Counseling Support", "Security Escort", "Disciplinary Action"]
    }
  ]);

  const performAIConsultation = (description: string, severity: string): AIConsultation => {
    // Simulate AI analysis based on description and severity
    const riskKeywords = ["threat", "violence", "harm", "force", "intimidation", "scared", "afraid"];
    const urgentKeywords = ["emergency", "immediate", "now", "help", "urgent", "danger"];
    
    const descriptionLower = description.toLowerCase();
    const hasRiskKeywords = riskKeywords.some(keyword => descriptionLower.includes(keyword));
    const hasUrgentKeywords = urgentKeywords.some(keyword => descriptionLower.includes(keyword));
    
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    let urgencyScore = 3;
    
    if (severity === "critical" || hasUrgentKeywords) {
      riskLevel = "critical";
      urgencyScore = 10;
    } else if (severity === "high" || hasRiskKeywords) {
      riskLevel = "high";
      urgencyScore = 8;
    } else if (severity === "medium") {
      riskLevel = "medium";
      urgencyScore = 6;
    }

    const recommendedActions = [];
    const supportSuggestions = [];

    if (riskLevel === "critical") {
      recommendedActions.push("Immediate security response", "Emergency counseling", "Campus safety alert");
      supportSuggestions.push("24/7 crisis helpline", "Emergency escort service", "Immediate counseling session");
    } else if (riskLevel === "high") {
      recommendedActions.push("Security investigation", "Counseling support", "Administrative review");
      supportSuggestions.push("Professional counseling", "Peer support group", "Security check-ins");
    } else {
      recommendedActions.push("Administrative review", "Mediation session", "Follow-up monitoring");
      supportSuggestions.push("Peer support", "Counseling session", "Campus resources");
    }

    return {
      riskLevel,
      recommendedActions,
      urgencyScore,
      supportSuggestions,
      followUpRequired: riskLevel !== "low"
    };
  };

  const handleSubmitReport = async () => {
    if (!reportForm.description.trim() || !reportForm.type || !reportForm.severity) {
      return;
    }

    setIsSubmitting(true);

    // Simulate AI consultation
    const consultation = performAIConsultation(reportForm.description, reportForm.severity);
    setAiConsultation(consultation);

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form
    setReportForm({
      type: "",
      severity: "",
      description: "",
      location: "",
      isAnonymous: true,
      reporterContact: ""
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "text-green-600 bg-green-50";
      case "investigating": return "text-blue-600 bg-blue-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (submitted && aiConsultation) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-6 h-6" />
              Report Submitted Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Your report has been received and analyzed. Here's what happens next:
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">AI Risk Assessment</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getSeverityColor(aiConsultation.riskLevel)}>
                    {aiConsultation.riskLevel.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Urgency Score: {aiConsultation.urgencyScore}/10
                  </span>
                </div>
                <Progress value={aiConsultation.urgencyScore * 10} className="mt-2" />
              </div>

              <div>
                <Label className="text-sm font-medium">Immediate Actions Taken</Label>
                <div className="grid gap-2 mt-2">
                  {aiConsultation.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Support Available to You</Label>
                <div className="grid gap-2 mt-2">
                  {aiConsultation.supportSuggestions.map((support, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-600" />
                      {support}
                    </div>
                  ))}
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-2">Emergency Contacts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-red-600" />
                      <span>Campus Security: 24/7 - 1800-HELP-NOW</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                      <span>Crisis Counselor: Available Now - Chat Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>Anti-Ragging Committee: committee@university.edu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setSubmitted(false)} className="flex-1">
                Submit Another Report
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("support")}>
                Get Support Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="w-8 h-8 text-red-600" />
          Anti-Ragging Reporting System
        </h1>
        <p className="text-muted-foreground">
          Report ragging incidents safely and anonymously. Our AI-powered system provides immediate risk assessment and connects you with appropriate support.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="report">Report Incident</TabsTrigger>
          <TabsTrigger value="support">Get Support</TabsTrigger>
          <TabsTrigger value="status">Check Status</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report a Ragging Incident
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                All reports are taken seriously. You can report anonymously, and our AI system will assess the risk level immediately.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="incident-type">Type of Incident *</Label>
                  <Select value={reportForm.type} onValueChange={(value) => setReportForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Verbal Harassment">Verbal Harassment</SelectItem>
                      <SelectItem value="Physical Intimidation">Physical Intimidation</SelectItem>
                      <SelectItem value="Psychological Bullying">Psychological Bullying</SelectItem>
                      <SelectItem value="Sexual Harassment">Sexual Harassment</SelectItem>
                      <SelectItem value="Cyber Bullying">Cyber Bullying</SelectItem>
                      <SelectItem value="Academic Harassment">Academic Harassment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="severity">Severity Level *</Label>
                  <Select value={reportForm.severity} onValueChange={(value) => setReportForm(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor incident</SelectItem>
                      <SelectItem value="medium">Medium - Concerning behavior</SelectItem>
                      <SelectItem value="high">High - Serious threat or harm</SelectItem>
                      <SelectItem value="critical">Critical - Immediate danger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location of Incident</Label>
                <Input
                  id="location"
                  value={reportForm.location}
                  onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Main Campus, Hostel Block A, Library"
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please provide as much detail as possible about the incident. Include what happened, who was involved, when it occurred, and any witnesses."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The more details you provide, the better our AI system can assess the situation and provide appropriate support.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={reportForm.isAnonymous}
                  onChange={(e) => setReportForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  aria-describedby="anonymous-help"
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Report anonymously (recommended for your safety)
                </Label>
              </div>

              {!reportForm.isAnonymous && (
                <div>
                  <Label htmlFor="contact">Your Contact Information (Optional)</Label>
                  <Input
                    id="contact"
                    type="email"
                    value={reportForm.reporterContact}
                    onChange={(e) => setReportForm(prev => ({ ...prev, reporterContact: e.target.value }))}
                    placeholder="your.email@university.edu"
                  />
                </div>
              )}

              <Alert>
                <Eye className="w-4 h-4" />
                <AlertDescription>
                  <strong>Your Privacy:</strong> Anonymous reports are completely secure. Non-anonymous reports help us follow up with you directly, but you can still request privacy protection.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleSubmitReport}
                disabled={isSubmitting || !reportForm.description.trim() || !reportForm.type || !reportForm.severity}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing Report & AI Analysis...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Campus Security (24/7)
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Emergency Chat Support
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  If you're in immediate danger, call campus security or local emergency services immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Counseling & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Book Counseling Session
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Peer Support Group
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Professional counselors and peer support groups are available to help you process and cope.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Report Status Dashboard</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track the progress of reported incidents (anonymized for privacy)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity.toUpperCase()}
                        </Badge>
                        <span className="font-medium text-sm">{report.type}</span>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{report.location}</span>
                      <span>{report.dateTime.toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {report.supportOffered.map((support) => (
                        <Badge key={support} variant="secondary" className="text-xs">
                          {support}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Know Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li>• Right to study in a safe environment</li>
                  <li>• Right to report incidents without fear of retaliation</li>
                  <li>• Right to anonymous reporting</li>
                  <li>• Right to counseling and support services</li>
                  <li>• Right to be informed about investigation progress</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prevention Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li>• Travel in groups, especially in isolated areas</li>
                  <li>• Report suspicious behavior immediately</li>
                  <li>• Know emergency contact numbers</li>
                  <li>• Document incidents with photos/videos if safe</li>
                  <li>• Stay connected with family and friends</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}