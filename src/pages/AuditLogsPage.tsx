import { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Clock, 
  Monitor, 
  Smartphone, 
  Tablet,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Key,
  Eye,
  RefreshCw,
  LogOut,
  FileText,
  History,
  Fingerprint,
  Mail,
  SmartphoneIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Mock audit log data
const mockAuditLogs = [
  {
    id: '1',
    timestamp: '2026-02-23T14:32:15Z',
    user: { name: 'Dr. Sarah Johnson', email: 's.johnson@switchhealth.ng', role: 'Doctor' },
    action: 'VIEW',
    resource: 'Patient Record',
    resourceId: 'PT-2026-001',
    module: 'EMR',
    ipAddress: '192.168.1.45',
    device: 'Desktop - Chrome',
    location: 'Lagos, Nigeria',
    status: 'success',
    riskLevel: 'low'
  },
  {
    id: '2',
    timestamp: '2026-02-23T14:28:42Z',
    user: { name: 'Nurse Amina Bello', email: 'a.bello@switchhealth.ng', role: 'Nurse' },
    action: 'UPDATE',
    resource: 'Vital Signs',
    resourceId: 'VS-2026-089',
    module: 'EMR',
    ipAddress: '192.168.1.52',
    device: 'Tablet - Safari',
    location: 'Lagos, Nigeria',
    status: 'success',
    riskLevel: 'low'
  },
  {
    id: '3',
    timestamp: '2026-02-23T14:15:20Z',
    user: { name: 'Admin User', email: 'admin@switchhealth.ng', role: 'Hospital Admin' },
    action: 'CREATE',
    resource: 'User Account',
    resourceId: 'USR-2026-045',
    module: 'Administration',
    ipAddress: '102.89.47.123',
    device: 'Desktop - Firefox',
    location: 'Abuja, Nigeria',
    status: 'success',
    riskLevel: 'medium'
  },
  {
    id: '4',
    timestamp: '2026-02-23T13:58:11Z',
    user: { name: 'Unknown', email: 'unknown', role: 'N/A' },
    action: 'LOGIN',
    resource: 'System',
    resourceId: 'N/A',
    module: 'Authentication',
    ipAddress: '45.123.67.89',
    device: 'Mobile - Chrome',
    location: 'Kano, Nigeria',
    status: 'failed',
    riskLevel: 'high'
  },
  {
    id: '5',
    timestamp: '2026-02-23T13:45:33Z',
    user: { name: 'Dr. Michael Chen', email: 'm.chen@switchhealth.ng', role: 'Doctor' },
    action: 'EXPORT',
    resource: 'Patient Records',
    resourceId: 'BATCH-2026-012',
    module: 'EMR',
    ipAddress: '192.168.1.38',
    device: 'Desktop - Chrome',
    location: 'Lagos, Nigeria',
    status: 'success',
    riskLevel: 'medium'
  },
  {
    id: '6',
    timestamp: '2026-02-23T13:30:00Z',
    user: { name: 'Lab Scientist Okonkwo', email: 'o.okonkwo@switchhealth.ng', role: 'Lab Scientist' },
    action: 'DELETE',
    resource: 'Test Result',
    resourceId: 'LAB-2026-234',
    module: 'Laboratory',
    ipAddress: '192.168.1.61',
    device: 'Desktop - Edge',
    location: 'Lagos, Nigeria',
    status: 'success',
    riskLevel: 'high'
  },
  {
    id: '7',
    timestamp: '2026-02-23T12:15:45Z',
    user: { name: 'Pharmacist Adeyemi', email: 'p.adeyemi@switchhealth.ng', role: 'Pharmacist' },
    action: 'APPROVE',
    resource: 'Prescription',
    resourceId: 'RX-2026-567',
    module: 'Pharmacy',
    ipAddress: '192.168.1.55',
    device: 'Desktop - Chrome',
    location: 'Lagos, Nigeria',
    status: 'success',
    riskLevel: 'low'
  },
  {
    id: '8',
    timestamp: '2026-02-23T11:58:22Z',
    user: { name: 'Billing Officer Ngozi', email: 'n.obi@switchhealth.ng', role: 'Billing Officer' },
    action: 'VIEW',
    resource: 'Invoice',
    resourceId: 'INV-2026-789',
    module: 'Billing',
    ipAddress: '192.168.1.48',
    device: 'Desktop - Chrome',
    location: 'Lagos, Nigeria',
    status: 'success',
    riskLevel: 'low'
  }
];

// Mock active sessions
const mockActiveSessions = [
  {
    id: 'sess-001',
    user: { name: 'Dr. Sarah Johnson', email: 's.johnson@switchhealth.ng', avatar: 'SJ' },
    deviceType: 'desktop',
    deviceName: 'Windows PC - Chrome',
    browser: 'Chrome 122.0',
    os: 'Windows 11',
    ipAddress: '192.168.1.45',
    location: 'Lagos, Nigeria',
    startedAt: '2026-02-23T08:30:00Z',
    lastActive: '2026-02-23T14:32:15Z',
    isCurrentSession: true
  },
  {
    id: 'sess-002',
    user: { name: 'Nurse Amina Bello', email: 'a.bello@switchhealth.ng', avatar: 'AB' },
    deviceType: 'tablet',
    deviceName: 'iPad - Safari',
    browser: 'Safari 17.1',
    os: 'iOS 17.3',
    ipAddress: '192.168.1.52',
    location: 'Lagos, Nigeria',
    startedAt: '2026-02-23T09:15:00Z',
    lastActive: '2026-02-23T14:28:42Z',
    isCurrentSession: false
  },
  {
    id: 'sess-003',
    user: { name: 'Admin User', email: 'admin@switchhealth.ng', avatar: 'AU' },
    deviceType: 'mobile',
    deviceName: 'iPhone 15 Pro',
    browser: 'Chrome 122.0',
    os: 'iOS 17.3',
    ipAddress: '102.89.47.123',
    location: 'Abuja, Nigeria',
    startedAt: '2026-02-23T10:00:00Z',
    lastActive: '2026-02-23T13:45:00Z',
    isCurrentSession: false
  },
  {
    id: 'sess-004',
    user: { name: 'Dr. Michael Chen', email: 'm.chen@switchhealth.ng', avatar: 'MC' },
    deviceType: 'desktop',
    deviceName: 'MacBook Pro - Chrome',
    browser: 'Chrome 122.0',
    os: 'macOS 14.3',
    ipAddress: '192.168.1.38',
    location: 'Lagos, Nigeria',
    startedAt: '2026-02-23T07:45:00Z',
    lastActive: '2026-02-23T14:15:00Z',
    isCurrentSession: false
  }
];

// Security settings
const securitySettings = {
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
    preventReuse: 5
  },
  sessionPolicy: {
    timeoutMinutes: 30,
    maxConcurrentSessions: 3,
    enforceDeviceBinding: false,
    requireReauthForSensitive: true
  },
  mfaPolicy: {
    enabled: true,
    requiredForRoles: ['Super Admin', 'Hospital Admin', 'IT Officer'],
    methods: ['authenticator', 'sms', 'email']
  },
  auditPolicy: {
    retentionDays: 365,
    logFailedLogins: true,
    logDataExports: true,
    realTimeAlerts: true
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'VIEW': return <Eye className="w-4 h-4" />;
    case 'CREATE': return <CheckCircle className="w-4 h-4" />;
    case 'UPDATE': return <RefreshCw className="w-4 h-4" />;
    case 'DELETE': return <XCircle className="w-4 h-4" />;
    case 'EXPORT': return <Download className="w-4 h-4" />;
    case 'APPROVE': return <CheckCircle className="w-4 h-4" />;
    case 'LOGIN': return <Lock className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'VIEW': return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'CREATE': return 'bg-green-500/10 text-green-600 border-green-200';
    case 'UPDATE': return 'bg-amber-500/10 text-amber-600 border-amber-200';
    case 'DELETE': return 'bg-red-500/10 text-red-600 border-red-200';
    case 'EXPORT': return 'bg-purple-500/10 text-purple-600 border-purple-200';
    case 'APPROVE': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
    case 'LOGIN': return 'bg-slate-500/10 text-slate-600 border-slate-200';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
  }
};

const getRiskBadge = (level: string) => {
  switch (level) {
    case 'low': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Low</Badge>;
    case 'medium': return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">Medium</Badge>;
    case 'high': return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">High</Badge>;
    default: return <Badge variant="outline">Unknown</Badge>;
  }
};

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType) {
    case 'desktop': return <Monitor className="w-5 h-5" />;
    case 'mobile': return <Smartphone className="w-5 h-5" />;
    case 'tablet': return <Tablet className="w-5 h-5" />;
    default: return <Monitor className="w-5 h-5" />;
  }
};

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  };
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('logs');
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<typeof mockActiveSessions[0] | null>(null);
  const [settings] = useState(securitySettings);

  const filteredLogs = mockAuditLogs.filter(log => 
    log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTerminateSession = (session: typeof mockActiveSessions[0]) => {
    setSelectedSession(session);
    setShowTerminateDialog(true);
  };

  const confirmTerminate = () => {
    // In real implementation, this would call the API
    setShowTerminateDialog(false);
    setSelectedSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1E1B8F]">Security & Audit</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor system activity, manage sessions, and configure security policies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-white/50 backdrop-blur-sm border border-white/60 p-1">
          <TabsTrigger value="logs" className="gap-2 data-[state=active]:bg-[#1E1B8F] data-[state=active]:text-white">
            <History className="w-4 h-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2 data-[state=active]:bg-[#1E1B8F] data-[state=active]:text-white">
            <Monitor className="w-4 h-4" />
            Active Sessions
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-[#1E1B8F] data-[state=active]:text-white">
            <Shield className="w-4 h-4" />
            Security Settings
          </TabsTrigger>
        </TabsList>

        {/* Audit Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1E1B8F]">1,247</p>
                  <p className="text-xs text-gray-500">Successful Actions</p>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1E1B8F]">23</p>
                  <p className="text-xs text-gray-500">Failed Attempts</p>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1E1B8F]">8</p>
                  <p className="text-xs text-gray-500">High Risk Events</p>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1E1B8F]">4</p>
                  <p className="text-xs text-gray-500">Active Sessions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by user, action, resource, or module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-white/60"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm rounded-xl overflow-hidden hover:bg-white/80 transition-all duration-300">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/20">
                    <TableHead className="text-[#1E1B8F] font-medium">Timestamp</TableHead>
                    <TableHead className="text-[#1E1B8F] font-medium">User</TableHead>
                    <TableHead className="text-[#1E1B8F] font-medium">Action</TableHead>
                    <TableHead className="text-[#1E1B8F] font-medium">Resource</TableHead>
                    <TableHead className="text-[#1E1B8F] font-medium">Module</TableHead>
                    <TableHead className="text-[#1E1B8F] font-medium">Device</TableHead>
                    <TableHead className="text-[#1E1B8F] font-medium">Risk</TableHead>
                    <TableHead className="text-[#1E1B8F] font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const { date, time } = formatDateTime(log.timestamp);
                    return (
                      <TableRow key={log.id} className="hover:bg-white/40 border-white/20">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{date}</span>
                            <span className="text-xs text-gray-500">{time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E1B8F] to-[#D4AF37] flex items-center justify-center text-white text-xs font-medium">
                              {log.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">{log.user.name}</span>
                              <span className="text-xs text-gray-500">{log.user.role}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`gap-1 ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">{log.resource}</span>
                            <span className="text-xs text-gray-500">{log.resourceId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{log.module}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(log.device.split(' - ')[0].toLowerCase())}
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-900">{log.device}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {log.location}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRiskBadge(log.riskLevel)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={log.status === 'success' 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' 
                              : 'bg-red-500/10 text-red-600 border-red-200'
                            }
                          >
                            {log.status === 'success' ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Active Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockActiveSessions.map((session) => {
              const started = formatDateTime(session.startedAt);
              const lastActive = formatDateTime(session.lastActive);
              return (
                <div key={session.id} className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E1B8F] to-[#D4AF37] flex items-center justify-center text-white font-medium">
                        {session.user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-[#1E1B8F]">{session.user.name}</h3>
                          {session.isCurrentSession && (
                            <Badge className="bg-[#1E1B8F] text-white text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            {getDeviceIcon(session.deviceType)}
                            {session.deviceName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {session.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Started: {started.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Last active: {lastActive.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!session.isCurrentSession && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleTerminateSession(session)}
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Terminate
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Policy */}
            <Card className="bg-white/50 backdrop-blur-sm border-white/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1E1B8F]/10 flex items-center justify-center">
                    <Key className="w-4 h-4 text-[#1E1B8F]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#1E1B8F]">Password Policy</CardTitle>
                    <CardDescription>Configure password requirements</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="minLength" className="text-sm">Minimum Length ({settings.passwordPolicy.minLength} chars)</Label>
                  <Switch id="minLength" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase" className="text-sm">Require Uppercase</Label>
                  <Switch id="uppercase" defaultChecked={settings.passwordPolicy.requireUppercase} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers" className="text-sm">Require Numbers</Label>
                  <Switch id="numbers" defaultChecked={settings.passwordPolicy.requireNumbers} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="special" className="text-sm">Require Special Characters</Label>
                  <Switch id="special" defaultChecked={settings.passwordPolicy.requireSpecialChars} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="expiry" className="text-sm">Password Expiry ({settings.passwordPolicy.expiryDays} days)</Label>
                  <Switch id="expiry" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Session Policy */}
            <Card className="bg-white/50 backdrop-blur-sm border-white/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#1E1B8F]">Session Policy</CardTitle>
                    <CardDescription>Manage session timeouts and limits</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="timeout" className="text-sm">Auto Timeout ({formatDuration(settings.sessionPolicy.timeoutMinutes)})</Label>
                  <Switch id="timeout" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maxSessions" className="text-sm">Max Concurrent Sessions ({settings.sessionPolicy.maxConcurrentSessions})</Label>
                  <Switch id="maxSessions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="deviceBinding" className="text-sm">Device Binding</Label>
                  <Switch id="deviceBinding" defaultChecked={settings.sessionPolicy.enforceDeviceBinding} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="reauth" className="text-sm">Re-auth for Sensitive Actions</Label>
                  <Switch id="reauth" defaultChecked={settings.sessionPolicy.requireReauthForSensitive} />
                </div>
              </CardContent>
            </Card>

            {/* MFA Policy */}
            <Card className="bg-white/50 backdrop-blur-sm border-white/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#1E1B8F]">Multi-Factor Authentication</CardTitle>
                    <CardDescription>Configure 2FA requirements</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mfaEnabled" className="text-sm">Enable MFA</Label>
                  <Switch id="mfaEnabled" defaultChecked={settings.mfaPolicy.enabled} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Required for Roles:</Label>
                  <div className="flex flex-wrap gap-2">
                    {settings.mfaPolicy.requiredForRoles.map((role) => (
                      <Badge key={role} variant="outline" className="bg-[#1E1B8F]/10 text-[#1E1B8F] border-[#1E1B8F]/20">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Allowed Methods:</Label>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <SmartphoneIcon className="w-3 h-3" />
                      Authenticator
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Mail className="w-3 h-3" />
                      SMS
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Policy */}
            <Card className="bg-white/50 backdrop-blur-sm border-white/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <History className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#1E1B8F]">Audit & Logging</CardTitle>
                    <CardDescription>Configure audit trail settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="retention" className="text-sm">Log Retention ({settings.auditPolicy.retentionDays} days)</Label>
                  <Switch id="retention" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="logFailed" className="text-sm">Log Failed Login Attempts</Label>
                  <Switch id="logFailed" defaultChecked={settings.auditPolicy.logFailedLogins} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="logExports" className="text-sm">Log Data Exports</Label>
                  <Switch id="logExports" defaultChecked={settings.auditPolicy.logDataExports} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="realtimeAlerts" className="text-sm">Real-time Security Alerts</Label>
                  <Switch id="realtimeAlerts" defaultChecked={settings.auditPolicy.realTimeAlerts} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="gap-2 bg-[#1E1B8F] hover:bg-[#1E1B8F]/90">
              <CheckCircle className="w-4 h-4" />
              Save Security Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Terminate Session Dialog */}
      <Dialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <DialogContent className="bg-white/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E1B8F] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Terminate Session
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate this session? The user will be logged out immediately.
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p><strong>User:</strong> {selectedSession.user.name}</p>
              <p><strong>Device:</strong> {selectedSession.deviceName}</p>
              <p><strong>Location:</strong> {selectedSession.location}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTerminateDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmTerminate}>
              <LogOut className="w-4 h-4 mr-2" />
              Terminate Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
