import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MessageCircle, 
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Clock,
  BarChart3,
  PieChart,
  AlertCircle
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WarningWordAlert {
  id: string;
  anonymousId: string;
  timestamp: Date;
  context: 'chat' | 'mood-entry' | 'journal' | 'assessment';
  warningWords: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  content: string; // Sanitized/masked content
  handled: boolean;
  handledBy?: string;
  handledAt?: Date;
  followUpRequired: boolean;
}

interface UserMetric {
  id: string;
  anonymousId: string;
  lastActivity: Date;
  sessionsCount: number;
  avgMoodScore: number;
  riskIndicators: string[];
  engagementLevel: 'low' | 'medium' | 'high';
  assessmentScores: {
    phq9?: number;
    gad7?: number;
    ghq?: number;
  };
  warningWordsCount: number;
  needsAttention: boolean;
}

interface SystemStats {
  totalUsers: number;
  activeUsers24h: number;
  totalSessions: number;
  avgSessionDuration: number;
  criticalAlerts: number;
  unhandledAlerts: number;
  systemUptime: string;
  responseTime: number;
}

const warningWordCategories = {
  suicide: ['suicide', 'kill myself', 'end it all', 'want to die', 'no point living', 'better off dead'],
  selfHarm: ['cut myself', 'hurt myself', 'self harm', 'punish myself', 'hate myself'],
  violence: ['hurt someone', 'kill them', 'violence', 'revenge', 'make them pay'],
  abuse: ['abuse', 'assault', 'violence at home', 'hurt by', 'unsafe', 'threatening'],
  substance: ['overdose', 'too many pills', 'drinking too much', 'drugs help', 'substance'],
  crisis: ['emergency', 'crisis', 'help me now', 'urgent', 'immediate help']
};

const mockWarningAlerts: WarningWordAlert[] = [
  {
    id: 'alert-1',
    anonymousId: 'user-anon-001',
    timestamp: new Date('2024-01-15T14:30:00'),
    context: 'chat',
    warningWords: ['suicide', 'end it all'],
    riskLevel: 'critical',
    content: 'User expressed thoughts about ████ and feeling like they want to ████████. Immediate intervention recommended.',
    handled: false,
    followUpRequired: true
  },
  {
    id: 'alert-2', 
    anonymousId: 'user-anon-002',
    timestamp: new Date('2024-01-15T12:15:00'),
    context: 'mood-entry',
    warningWords: ['hurt myself'],
    riskLevel: 'high',
    content: 'Mood entry mentioned ████████ as a coping mechanism when stressed.',
    handled: true,
    handledBy: 'Admin-001',
    handledAt: new Date('2024-01-15T12:45:00'),
    followUpRequired: false
  },
  {
    id: 'alert-3',
    anonymousId: 'user-anon-003', 
    timestamp: new Date('2024-01-15T10:20:00'),
    context: 'assessment',
    warningWords: ['drinking too much'],
    riskLevel: 'medium',
    content: 'Assessment response indicated potential ████████████ as stress relief.',
    handled: true,
    handledBy: 'Admin-002',
    handledAt: new Date('2024-01-15T11:00:00'),
    followUpRequired: true
  }
];

const mockUserMetrics: UserMetric[] = [
  {
    id: 'metric-1',
    anonymousId: 'user-anon-001',
    lastActivity: new Date('2024-01-15T14:30:00'),
    sessionsCount: 15,
    avgMoodScore: 2.1,
    riskIndicators: ['Low mood trend', 'Crisis keywords'],
    engagementLevel: 'high',
    assessmentScores: { phq9: 12, gad7: 8, ghq: 14 },
    warningWordsCount: 3,
    needsAttention: true
  },
  {
    id: 'metric-2',
    anonymousId: 'user-anon-002', 
    lastActivity: new Date('2024-01-15T12:15:00'),
    sessionsCount: 8,
    avgMoodScore: 3.2,
    riskIndicators: ['Self-harm mentions'],
    engagementLevel: 'medium',
    assessmentScores: { phq9: 8, gad7: 11, ghq: 9 },
    warningWordsCount: 1,
    needsAttention: true
  },
  {
    id: 'metric-3',
    anonymousId: 'user-anon-003',
    lastActivity: new Date('2024-01-15T10:20:00'), 
    sessionsCount: 22,
    avgMoodScore: 3.8,
    riskIndicators: ['Substance mentions'],
    engagementLevel: 'high',
    assessmentScores: { phq9: 6, gad7: 5, ghq: 7 },
    warningWordsCount: 1,
    needsAttention: false
  }
];

const mockSystemStats: SystemStats = {
  totalUsers: 1247,
  activeUsers24h: 89,
  totalSessions: 3421,
  avgSessionDuration: 18.5,
  criticalAlerts: 2,
  unhandledAlerts: 5,
  systemUptime: '99.8%',
  responseTime: 1.2
};

export function AdminPanel() {
  const [alerts, setAlerts] = useState<WarningWordAlert[]>(mockWarningAlerts);
  const [userMetrics, setUserMetrics] = useState<UserMetric[]>(mockUserMetrics);
  const [systemStats, setSystemStats] = useState<SystemStats>(mockSystemStats);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            handled: true, 
            handledBy: 'Current-Admin',
            handledAt: new Date()
          }
        : alert
    ));
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      case 'mood-entry': return <Activity className="w-4 h-4" />;
      case 'journal': return <Calendar className="w-4 h-4" />;
      case 'assessment': return <BarChart3 className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.anonymousId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.warningWords.some(word => word.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unhandled' && !alert.handled) ||
                         (filterStatus === 'handled' && alert.handled) ||
                         (filterStatus === 'critical' && alert.riskLevel === 'critical');
    
    return matchesSearch && matchesFilter;
  });

  const criticalAlerts = alerts.filter(alert => alert.riskLevel === 'critical' && !alert.handled);
  const usersNeedingAttention = userMetrics.filter(user => user.needsAttention);

  return (
    <div className="space-y-6" data-testid="admin-panel">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          Monitor user safety, system health, and crisis prevention analytics
        </p>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Critical Alerts Pending</AlertTitle>
          <AlertDescription className="text-red-700">
            {criticalAlerts.length} critical safety alert{criticalAlerts.length > 1 ? 's' : ''} require immediate attention.
            <Button variant="link" className="p-0 h-auto text-red-700 underline ml-2">
              View All Critical Alerts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers24h}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{systemStats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.unhandledAlerts} unhandled total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.responseTime}s avg response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          <TabsTrigger value="system">System Monitor</TabsTrigger>
        </TabsList>

        {/* Safety Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search alerts by user ID or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="unhandled">Unhandled</SelectItem>
                <SelectItem value="handled">Handled</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Alerts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Warning Word Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anonymous ID</TableHead>
                    <TableHead>Context</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Warning Words</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.anonymousId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getContextIcon(alert.context)}
                          <span className="capitalize">{alert.context.replace('-', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskLevelColor(alert.riskLevel)} variant="outline">
                          {alert.riskLevel.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {alert.warningWords.map((word, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {alert.timestamp.toLocaleDateString()} {alert.timestamp.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        {alert.handled ? (
                          <div className="space-y-1">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Handled
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              by {alert.handledBy}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="destructive">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!alert.handled && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAlert(alert.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Mark Handled
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Analytics Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Users Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  Users Requiring Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usersNeedingAttention.map((user) => (
                    <div key={user.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{user.anonymousId}</span>
                        <Badge className={getRiskLevelColor(user.avgMoodScore < 2.5 ? 'high' : 'medium')}>
                          Risk Level: {user.avgMoodScore < 2.5 ? 'High' : 'Medium'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Avg Mood:</span>
                          <div className="font-medium">{user.avgMoodScore.toFixed(1)}/5</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Warning Words:</span>
                          <div className="font-medium">{user.warningWordsCount}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.riskIndicators.map((indicator, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assessment Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Assessment Score Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>PHQ-9 (Depression)</span>
                      <span>Avg: 8.7</span>
                    </div>
                    <Progress value={58} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      23% showing moderate-severe symptoms
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>GAD-7 (Anxiety)</span>
                      <span>Avg: 8.0</span>
                    </div>
                    <Progress value={53} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      19% showing moderate-severe symptoms
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>GHQ (General Health)</span>
                      <span>Avg: 10.0</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      31% showing concerning levels
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Warning Word Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(warningWordCategories).map(([category, words]) => {
                    const count = alerts.filter(alert => 
                      alert.warningWords.some(word => 
                        words.some(w => w.toLowerCase().includes(word.toLowerCase()))
                      )
                    ).length;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="capitalize font-medium">{category}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{count} alerts</Badge>
                          <Progress value={(count / alerts.length) * 100} className="w-20 h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crisis Prevention Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <div className="text-sm text-muted-foreground">Alerts Resolved</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">3.2min</div>
                      <div className="text-sm text-muted-foreground">Avg Response Time</div>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">15 Users</div>
                    <div className="text-sm text-muted-foreground">Connected to Support Services</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Monitor Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Performance
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="font-medium mb-3">Server Health</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Database</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connection Pool</span>
                      <span className="text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Query Performance</span>
                      <span>1.2ms avg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Storage Used</span>
                      <span>2.3 GB</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Security</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Encryption</span>
                      <span className="text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Failed Logins</span>
                      <span>0 (24h)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Anonymization</span>
                      <span className="text-green-600">Working</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}