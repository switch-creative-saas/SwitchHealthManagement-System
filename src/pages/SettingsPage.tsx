import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Database,
  Download,
  Eye,
  KeyRound,
  Loader2,
  Lock,
  Monitor,
  Moon,
  Save,
  Search,
  Shield,
  Smartphone,
  Sun,
  Upload,
  User,
  Wifi,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { applyTheme, getSavedTheme, type ThemeMode } from '@/lib/theme';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useGuidedTour } from '@/contexts/GuidedTourContext';

import { RoleSwitcher } from '@/components/role/RoleSwitcher';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'facility', label: 'Facility', icon: Building2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Sun },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Sync', icon: Database },
  { id: 'role', label: 'Role Simulation', icon: Shield },
] as const;
type SettingsTab = (typeof tabs)[number]['id'];

const quickActions: { label: string; tab: SettingsTab; description: string }[] = [
  { label: 'Change password', tab: 'security', description: 'Update account credentials' },
  { label: 'Enable 2FA', tab: 'security', description: 'Improve authentication security' },
  { label: 'Update working hours', tab: 'facility', description: 'Facility operational schedule' },
  { label: 'Test notification', tab: 'notifications', description: 'Send preview notifications' },
  { label: 'Manual sync', tab: 'data', description: 'Run immediate cloud synchronization' },
  { label: 'Role simulation', tab: 'role', description: 'Preview UI as another role' },
];

const roleOptions: { label: string; value: UserRole }[] = [
  { label: 'Doctor', value: 'doctor' },
  { label: 'Nurse', value: 'nurse' },
  { label: 'Receptionist', value: 'receptionist' },
  { label: 'Pharmacist', value: 'pharmacist' },
  { label: 'Lab Scientist', value: 'lab-scientist' },
];

export function SettingsPage() {
  const { currentRole, setCurrentRole, userName, userEmail, hasPermission } = useAuth();
  const { subscription, hasAccess, DEV_OVERRIDE, addAudit } = useSubscription();
  const { toursEnabled, setToursEnabled, resetOnboarding, replayCurrentRoleTour, startRoleOnboarding } = useGuidedTour();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [savingSection, setSavingSection] = useState<SettingsTab | null>(null);
  const [dirty, setDirty] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(() => getSavedTheme());
  const [fontScale, setFontScale] = useState(100);
  const [compactMode, setCompactMode] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState<UserRole>(currentRole);
  const [profileForm, setProfileForm] = useState({
    name: userName,
    email: userEmail,
    phone: '+234 801 234 5678',
    specialty: 'General Medicine',
    photoInitials: 'SJ',
    twoFactor: false,
  });
  const [facilityForm, setFacilityForm] = useState({
    hospitalName: 'Switch Health - Lagos Central',
    address: '123 Healthcare Avenue, Victoria Island, Lagos',
    contactEmail: 'lagos@switchhealth.ng',
    contactPhone: '+234 1 234 5678',
    timezone: 'Africa/Lagos',
    logo: '',
    workingHours: 'Mon-Sat, 08:00 - 18:00',
  });
  const [securityForm, setSecurityForm] = useState({
    twoFactor: false,
    sessionTimeout: 30,
    ipRestrictions: false,
    rolePreview: true,
  });
  const [notificationForm, setNotificationForm] = useState({
    email: true,
    inApp: true,
    sms: false,
    appointments: true,
    labResults: true,
    billingAlerts: true,
    systemUpdates: true,
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [sessions, setSessions] = useState([
    { id: 's1', device: 'Windows PC - Chrome', lastSeen: '2 min ago', current: true },
    { id: 's2', device: 'iPhone - Safari', lastSeen: '1h ago', current: false },
    { id: 's3', device: 'iPad - Safari', lastSeen: '5h ago', current: false },
  ]);
  const [securityLogs] = useState([
    'Successful login from Lagos workstation',
    'Failed login attempt blocked (invalid password)',
    'Role changed: Nurse to Doctor',
    'Patient record export viewed by billing officer',
  ]);
  const [departments] = useState(['General Medicine', 'Laboratory', 'Pharmacy', 'Surgery']);
  const [apiIntegrations, setApiIntegrations] = useState({
    labSystem: false,
    insuranceSystem: false,
    govHealthSystem: false,
  });

  const isAdmin = currentRole === 'super-admin' || currentRole === 'hospital-admin';
  const canManageFacility = isAdmin;
  const facilityGate = subscription.plan;
  const canUseIpRestrictions = subscription.plan === 'enterprise' || DEV_OVERRIDE;
  const canUseAppearanceSync = subscription.plan !== 'free' || DEV_OVERRIDE;
  const canUseAdvancedFacility = subscription.plan !== 'free' || DEV_OVERRIDE;
  const canUseBranchConfig = subscription.plan === 'enterprise' || DEV_OVERRIDE;

  const filteredActions = useMemo(
    () =>
      query.trim()
        ? quickActions.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()))
        : [],
    [query],
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  const markDirty = () => setDirty(true);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const simulateSave = async (section: SettingsTab) => {
    setSavingSection(section);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setDirty(false);
      addAudit(`Settings updated: ${section}`);
      toast.success(`${tabs.find((t) => t.id === section)?.label} saved successfully`);
    } catch {
      toast.error('Save failed. Please retry.');
    } finally {
      setLoading(false);
      setSavingSection(null);
    }
  };

  const saveProfile = async () => {
    if (!profileForm.name.trim()) return toast.error('Name is required');
    if (!validateEmail(profileForm.email)) return toast.error('Invalid email format');
    await simulateSave('profile');
  };

  const saveFacility = async () => {
    if (!canManageFacility) return toast.error('Only Admin/Super Admin can update facility settings');
    if (!facilityForm.hospitalName.trim()) return toast.error('Hospital name is required');
    if (!validateEmail(facilityForm.contactEmail)) return toast.error('Invalid contact email');
    await simulateSave('facility');
  };

  const saveSecurity = async () => {
    if (!securityForm.twoFactor && currentRole === 'super-admin') return toast.error('Super Admin must keep 2FA enabled');
    await simulateSave('security');
  };

  const saveAppearance = async () => {
    if (!canUseAppearanceSync) return toast.error('Appearance sync across devices requires Pro plan');
    localStorage.setItem(`switch-health-font-${currentRole}`, String(fontScale));
    localStorage.setItem(`switch-health-compact-${currentRole}`, compactMode ? '1' : '0');
    await simulateSave('appearance');
  };

  const saveNotifications = async () => {
    await simulateSave('notifications');
  };

  const saveDataSync = async () => {
    if (!isAdmin) return toast.error('Admin only');
    await simulateSave('data');
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) return toast.error('Fill all password fields');
    if (passwordForm.next.length < 8) return toast.error('New password must be at least 8 chars');
    if (passwordForm.next !== passwordForm.confirm) return toast.error('Password confirmation mismatch');
    await simulateSave('security');
    setShowPasswordDialog(false);
    setPasswordForm({ current: '', next: '', confirm: '' });
    toast.success('Password updated');
  };

  const runManualSync = async () => {
    if (!isAdmin) return toast.error('Admin only');
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success('Manual sync completed');
      addAudit('Manual data sync run');
    } finally {
      setLoading(false);
    }
  };

  const terminateOtherSessions = () => {
    setSessions((prev) => prev.filter((session) => session.current));
    toast.success('Logged out from other devices');
    addAudit('All other sessions terminated');
  };

  const triggerRoleSimulation = (role: UserRole) => {
    setSimulatedRole(role);
    setCurrentRole(role);
    startRoleOnboarding(role);
    toast.success(`Viewing system as ${role.replace('-', ' ')}`);
  };

  const applyQuickAction = (tab: SettingsTab) => {
    setActiveTab(tab);
    setQuery('');
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Home / Settings / {tabs.find((t) => t.id === activeTab)?.label}</div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">RBAC-controlled, SaaS-aware operational settings for Switch Health.</p>
        </div>
        <div className="w-full lg:w-[380px]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Search settings or quick action..." />
          </div>
          {filteredActions.length > 0 && (
            <div className="mt-2 premium-card p-2 space-y-1">
              {filteredActions.slice(0, 5).map((item) => (
                <button key={item.label} className="w-full text-left p-2 rounded-lg hover:bg-gray-50" onClick={() => applyQuickAction(item.tab)}>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="premium-card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-royal-50 text-royal-700"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.id === 'facility' && !canManageFacility && <Lock className="w-3.5 h-3.5 text-gray-400 ml-auto" />}
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  activeTab === tab.id ? "rotate-90" : ""
                )} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center text-white text-2xl font-bold">
                  {profileForm.photoInitials}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{profileForm.name}</h3>
                  <p className="text-sm text-gray-500">{profileForm.specialty}</p>
                  <p className="text-sm text-gray-400">{profileForm.email}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => { markDirty(); toast.success('Profile photo selected (demo)'); }}>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Name</Label>
                  <Input value={profileForm.name} onChange={(e) => { setProfileForm((s) => ({ ...s, name: e.target.value })); markDirty(); }} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={profileForm.email} onChange={(e) => { setProfileForm((s) => ({ ...s, email: e.target.value })); markDirty(); }} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={profileForm.phone} onChange={(e) => { setProfileForm((s) => ({ ...s, phone: e.target.value })); markDirty(); }} />
                </div>
                <div>
                  <Label>Specialty</Label>
                  <Input value={profileForm.specialty} onChange={(e) => { setProfileForm((s) => ({ ...s, specialty: e.target.value })); markDirty(); }} />
                </div>
                <div className="md:col-span-2 rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Protect your account with additional verification.</p>
                    </div>
                    <Switch checked={profileForm.twoFactor} onCheckedChange={(checked) => { setProfileForm((s) => ({ ...s, twoFactor: checked })); markDirty(); }} />
                  </div>
                  <div className="mt-3 text-xs text-gray-500">Last login activity: Today, 08:14 AM</div>
                  <div className="mt-3 space-y-2">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
                        <span>{session.device} • {session.lastSeen}</span>
                        {session.current ? <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Current</span> : <Smartphone className="w-4 h-4 text-gray-400" />}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3" onClick={terminateOtherSessions}>Logout from Other Devices</Button>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={saveProfile} disabled={loading}>
                  {savingSection === 'profile' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'facility' && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Facility Information</h2>
              <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-800">
                Subscription plan: <strong>{facilityGate.toUpperCase()}</strong> | Free: basic info, Pro: branding + hours, Enterprise: multi-branch.
              </div>
              {!canManageFacility && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">Facility settings are Admin/Super Admin only.</div>
              )}
              <div className="p-4 rounded-xl bg-royal-50 border border-royal-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-royal-500 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-royal-900">{facilityForm.hospitalName}</h3>
                    <p className="text-sm text-royal-600">Facility ID: SH-NG-LAG-001</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Hospital Name</Label>
                  <Input value={facilityForm.hospitalName} onChange={(e) => { setFacilityForm((s) => ({ ...s, hospitalName: e.target.value })); markDirty(); }} disabled={!canManageFacility} />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Input value={facilityForm.timezone} onChange={(e) => { setFacilityForm((s) => ({ ...s, timezone: e.target.value })); markDirty(); }} disabled={!canManageFacility} />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Textarea value={facilityForm.address} onChange={(e) => { setFacilityForm((s) => ({ ...s, address: e.target.value })); markDirty(); }} disabled={!canManageFacility} />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input value={facilityForm.contactPhone} onChange={(e) => { setFacilityForm((s) => ({ ...s, contactPhone: e.target.value })); markDirty(); }} disabled={!canManageFacility} />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input type="email" value={facilityForm.contactEmail} onChange={(e) => { setFacilityForm((s) => ({ ...s, contactEmail: e.target.value })); markDirty(); }} disabled={!canManageFacility} />
                </div>
                <div>
                  <Label>Logo Upload</Label>
                  <Button variant="outline" className="w-full justify-start" disabled={!canManageFacility || !canUseAdvancedFacility} onClick={() => { setFacilityForm((s) => ({ ...s, logo: 'logo-uploaded.png' })); markDirty(); }}>
                    <Upload className="w-4 h-4 mr-2" />
                    {facilityForm.logo || 'Upload logo'}
                  </Button>
                </div>
                <div>
                  <Label>Working Hours</Label>
                  <Input value={facilityForm.workingHours} onChange={(e) => { setFacilityForm((s) => ({ ...s, workingHours: e.target.value })); markDirty(); }} disabled={!canManageFacility || !canUseAdvancedFacility} />
                </div>
                <div className="md:col-span-2">
                  <Label>Department Linkage (Administration Sync)</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {departments.map((department) => (
                      <span key={department} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{department}</span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label>Multi-Branch Support</Label>
                  <div className={cn('mt-2 rounded-xl p-3 border text-sm', canUseBranchConfig ? 'bg-green-50 border-green-100 text-green-800' : 'bg-amber-50 border-amber-100 text-amber-800')}>
                    {canUseBranchConfig ? 'Enabled for Enterprise plan.' : 'Upgrade to Enterprise for multi-location configuration.'} {hasAccess('multi_hospital') ? 'Tenant network sync available.' : 'Tenant network sync locked.'}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={saveFacility} disabled={loading || !canManageFacility}>
                  {savingSection === 'facility' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Facility
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="premium-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Authentication, session control, and audit visibility.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Enable 2FA</p>
                      <p className="text-xs text-gray-500">Required for admin and sensitive operations.</p>
                    </div>
                    <Switch checked={securityForm.twoFactor} onCheckedChange={(checked) => { setSecurityForm((s) => ({ ...s, twoFactor: checked })); markDirty(); }} />
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" value={securityForm.sessionTimeout} onChange={(e) => { setSecurityForm((s) => ({ ...s, sessionTimeout: Number(e.target.value) })); markDirty(); }} />
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">IP Restrictions (Enterprise)</p>
                      <p className="text-xs text-gray-500">Restrict login to approved networks.</p>
                    </div>
                    <Switch checked={securityForm.ipRestrictions} onCheckedChange={(checked) => { setSecurityForm((s) => ({ ...s, ipRestrictions: checked })); markDirty(); }} disabled={!canUseIpRestrictions} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Audit Logs Viewer</h3>
                <div className="space-y-2">
                  {securityLogs.map((log) => (
                    <div key={log} className="p-3 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700">{log}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50 text-sm text-gray-700">
                Role-based access preview: {hasPermission('Settings', 'edit') ? 'Admin scope' : 'User scope'} + Plan scope ({subscription.plan.toUpperCase()}).
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50 text-sm text-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Guided Tours</p>
                    <p className="text-xs text-gray-500">Enable onboarding and contextual walkthroughs.</p>
                  </div>
                  <Switch checked={toursEnabled} onCheckedChange={setToursEnabled} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={replayCurrentRoleTour}>Replay Current Role Tour</Button>
                  <Button variant="outline" size="sm" onClick={resetOnboarding}>Reset Onboarding</Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={saveSecurity} disabled={loading}>
                  {savingSection === 'security' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Security
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Appearance</h2>
              <p className="text-sm text-gray-500 mb-6">Choose Light, Dark (deep blue), or follow your system.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'light' as const, label: 'Light', icon: Sun, description: 'Bright neutral interface' },
                  { id: 'dark' as const, label: 'Dark', icon: Moon, description: 'Deep blue clinical dark mode' },
                  { id: 'system' as const, label: 'System', icon: Monitor, description: 'Match OS preference' },
                ].map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setTheme(option.id);
                        markDirty();
                        toast.success(`Theme set to ${option.label}`);
                      }}
                      className={cn(
                        'text-left p-4 rounded-2xl border transition-all duration-200 bg-white/70',
                        isActive
                          ? 'border-royal-400 ring-2 ring-royal-200 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-royal-600" />
                        <span className="font-medium text-gray-900">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{option.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div>
                  <Label>Font Size Scaling ({fontScale}%)</Label>
                  <Input type="range" min={90} max={120} step={5} value={fontScale} onChange={(e) => { setFontScale(Number(e.target.value)); markDirty(); }} />
                </div>
                <div className="rounded-xl border border-gray-100 p-4 bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Compact Mode</p>
                    <p className="text-xs text-gray-500">Reduce spacing for dense workflows.</p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={(checked) => { setCompactMode(checked); markDirty(); }} />
                </div>
              </div>
              <div className="mt-5 text-xs text-gray-500">
                Dark mode uses deep navy surfaces and persists per user. Cross-device sync requires Pro+.
              </div>
              <div className="flex justify-end mt-5">
                <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={saveAppearance} disabled={loading}>
                  {savingSection === 'appearance' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Appearance
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="premium-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'email', label: 'Email Notifications' },
                  { key: 'inApp', label: 'In-App Notifications' },
                  { key: 'sms', label: 'SMS Notifications (Future Ready)' },
                  { key: 'appointments', label: 'Appointments Alerts' },
                  { key: 'labResults', label: 'Lab Result Alerts' },
                  { key: 'billingAlerts', label: 'Billing Alerts' },
                  { key: 'systemUpdates', label: 'System Updates' },
                ].map((item) => (
                  <div key={item.key} className="rounded-xl bg-gray-50 border border-gray-100 p-4 flex items-center justify-between">
                    <span className="text-sm text-gray-800">{item.label}</span>
                    <Switch
                      checked={notificationForm[item.key as keyof typeof notificationForm]}
                      onCheckedChange={(checked) => { setNotificationForm((s) => ({ ...s, [item.key]: checked })); markDirty(); }}
                    />
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">Notification Preview</p>
                <p className="text-sm text-gray-600 mt-1">Appointment reminder: Patient check-in due in 30 minutes.</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success('Test notification sent')}>
                  <Bell className="w-4 h-4 mr-2" />
                  Send Test Notification
                </Button>
              </div>
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={saveNotifications} disabled={loading}>
                  {savingSection === 'notifications' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Notifications
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="premium-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Offline & Sync Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Offline Mode</h3>
                        <p className="text-sm text-gray-500">Enable offline data access</p>
                      </div>
                    </div>
                    <Switch checked={offlineMode} onCheckedChange={(checked) => { setOfflineMode(checked); markDirty(); }} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Database className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Auto Sync</h3>
                        <p className="text-sm text-gray-500">Automatically sync when online</p>
                      </div>
                    </div>
                    <Switch checked={autoSync} onCheckedChange={(checked) => { setAutoSync(checked); markDirty(); }} />
                  </div>
                  <div className="grid md:grid-cols-3 gap-2">
                    <Button variant="outline" onClick={runManualSync} disabled={loading || !isAdmin}>
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wifi className="w-4 h-4 mr-2" />}
                      Manual Sync
                    </Button>
                    <Button variant="outline" disabled={!isAdmin} onClick={() => toast.success('Backup snapshot created')}>
                      <Download className="w-4 h-4 mr-2" />
                      Backup
                    </Button>
                    <Button variant="outline" disabled={!isAdmin} onClick={() => toast.success('Restore point validated')}>
                      <Upload className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="font-medium text-gray-900 mb-2">Integration APIs</p>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      {[
                        { key: 'labSystem', label: 'Lab Systems' },
                        { key: 'insuranceSystem', label: 'Insurance Systems' },
                        { key: 'govHealthSystem', label: 'Government Health Systems' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between rounded-lg bg-white border border-gray-100 px-3 py-2">
                          <span>{item.label}</span>
                          <Switch checked={apiIntegrations[item.key as keyof typeof apiIntegrations]} onCheckedChange={(checked) => { setApiIntegrations((s) => ({ ...s, [item.key]: checked })); markDirty(); }} disabled={!isAdmin} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled={!isAdmin} onClick={() => toast.success('Exported as CSV')}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
                    <Button variant="outline" disabled={!isAdmin} onClick={() => toast.success('Exported as PDF')}><Download className="w-4 h-4 mr-2" />Export PDF</Button>
                  </div>

                  <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">All data synced</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-600">Last sync</span>
                        <span className="text-green-800">2 minutes ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Cached records</span>
                        <span className="text-green-800">2,847 patients</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Storage used</span>
                        <span className="text-green-800">124 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={saveDataSync} disabled={loading || !isAdmin}>
                    {savingSection === 'data' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Data & Sync
                  </Button>
                </div>
              </div>

              <div className="premium-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">System Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Version</span>
                    <span className="font-medium text-gray-900">Switch Health v2.0.0</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Build</span>
                    <span className="font-medium text-gray-900">2026.02.23-release</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">License</span>
                    <span className="font-medium text-gray-900">{subscription.plan.toUpperCase()} (Active)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Support</span>
                    <span className="font-medium text-royal-600">support@switchhealth.ng</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Future Hooks</span>
                    <span className="font-medium text-gray-900">NHID / Insurance / Network Sync / Gulia Personalization</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'role' && (
            <div className="space-y-4">
              <div className="premium-card p-6">
                <h2 className="text-lg font-semibold text-gray-900">Role Simulation</h2>
                <p className="text-sm text-gray-500 mt-1">Admin-only view-as-role for RBAC QA and investor demos (read-only mode).</p>
                {!isAdmin ? (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">Only Admin or Super Admin can run role simulation.</div>
                ) : (
                  <div className="mt-4 grid md:grid-cols-2 gap-2">
                    {roleOptions.map((role) => (
                      <Button
                        key={role.value}
                        variant={simulatedRole === role.value ? 'default' : 'outline'}
                        className={cn(simulatedRole === role.value && 'bg-gradient-to-r from-royal-500 to-royal-700 text-white')}
                        onClick={() => triggerRoleSimulation(role.value)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View as {role.label}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-3 text-sm text-amber-800">
                  Simulation is read-only. No real data modification is allowed in this mode.
                </div>
              </div>
              <RoleSwitcher />
            </div>
          )}
        </div>
      </div>

      {dirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl rounded-2xl border border-royal-200 bg-white/90 backdrop-blur-md p-3 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-700">You have unsaved changes in <strong>{tabs.find((t) => t.id === activeTab)?.label}</strong>.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setDirty(false)}>Discard</Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-royal-500 to-royal-700 text-white"
                onClick={() => {
                  const actions: Record<SettingsTab, () => Promise<void>> = {
                    profile: async () => { await saveProfile(); },
                    facility: async () => { await saveFacility(); },
                    security: async () => { await saveSecurity(); },
                    appearance: async () => { await saveAppearance(); },
                    notifications: async () => { await saveNotifications(); },
                    data: async () => { await saveDataSync(); },
                    role: async () => Promise.resolve(),
                  };
                  void actions[activeTab]();
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Now
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="glass-panel border-white/60 max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Security policy: minimum 8 characters.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Current Password</Label><Input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((s) => ({ ...s, current: e.target.value }))} /></div>
            <div><Label>New Password</Label><Input type="password" value={passwordForm.next} onChange={(e) => setPasswordForm((s) => ({ ...s, next: e.target.value }))} /></div>
            <div><Label>Confirm New Password</Label><Input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((s) => ({ ...s, confirm: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white" onClick={handlePasswordChange}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
