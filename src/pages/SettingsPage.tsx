import { useEffect, useState } from 'react';
import { 
  User, 
  Building2, 
  Shield,
  Bell,
  Database,
  Wifi,
  ChevronRight,
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { applyTheme, getSavedTheme, type ThemeMode } from '@/lib/theme';

import { RoleSwitcher } from '@/components/role/RoleSwitcher';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'facility', label: 'Facility', icon: Building2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Sun },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Sync', icon: Database },
  { id: 'role', label: 'Role Simulation', icon: Shield },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(() => getSavedTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
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
                <ChevronRight className={cn(
                  "w-4 h-4 ml-auto transition-transform",
                  activeTab === tab.id ? "rotate-90" : ""
                )} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center text-white text-2xl font-bold">
                  SJ
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dr. Sarah Johnson</h3>
                  <p className="text-sm text-gray-500">General Medicine</p>
                  <p className="text-sm text-gray-400">sarah.johnson@switchhealth.ng</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    defaultValue="Sarah"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue="Johnson"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue="sarah.johnson@switchhealth.ng"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    defaultValue="+234 801 234 5678"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <input 
                    type="text" 
                    defaultValue="General Medicine"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="bg-gradient-to-r from-royal-500 to-royal-700 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Facility Settings */}
          {activeTab === 'facility' && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Facility Information</h2>
              
              <div className="p-4 rounded-xl bg-royal-50 border border-royal-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-royal-500 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-royal-900">Switch Health - Lagos Central</h3>
                    <p className="text-sm text-royal-600">Facility ID: SH-NG-LAG-001</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name</label>
                  <input 
                    type="text" 
                    defaultValue="Switch Health - Lagos Central"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input 
                    type="text" 
                    defaultValue="HPF-LG-2024-001"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input 
                    type="text" 
                    defaultValue="123 Healthcare Avenue, Victoria Island, Lagos"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    defaultValue="+234 1 234 5678"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue="lagos@switchhealth.ng"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Data & Sync */}
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

              <div className="mt-5 text-xs text-gray-500">
                Theme setting is saved per user session and applied globally.
              </div>
            </div>
          )}

          {/* Data & Sync */}
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
                    <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
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
                    <Switch checked={autoSync} onCheckedChange={setAutoSync} />
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
                    <span className="font-medium text-gray-900">Enterprise (Active)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Support</span>
                    <span className="font-medium text-royal-600">support@switchhealth.ng</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Role Simulation */}
          {activeTab === 'role' && (
            <RoleSwitcher />
          )}
        </div>
      </div>
    </div>
  );
}
