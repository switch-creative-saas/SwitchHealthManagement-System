import { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit3,
  Trash2,
  XCircle,
  ChevronRight,
  Briefcase,
  Activity,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { Department, Hospital } from '@/types/rbac';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const mockHospital: Hospital = {
  id: 'h1',
  name: 'Switch Health - Lagos Central',
  code: 'SH-LAG-001',
  email: 'lagos@switchhealth.ng',
  phone: '+234 1 234 5678',
  address: '123 Healthcare Avenue, Victoria Island',
  city: 'Lagos',
  state: 'Lagos State',
  country: 'Nigeria',
  registrationNumber: 'HPF-LG-2024-001',
  taxId: 'TIN-123456789',
  licenseNumber: 'MLSCN-LAG-2024-001',
  licenseExpiry: '2027-12-31',
  timezone: 'Africa/Lagos',
  currency: 'NGN',
  language: 'en',
  isActive: true,
  isVerified: true,
  createdAt: '2024-01-01',
  updatedAt: '2026-02-23',
};

const mockDepartments: Department[] = [
  {
    id: 'd1',
    hospitalId: 'h1',
    name: 'General Medicine',
    code: 'GM',
    description: 'Primary healthcare and general consultations',
    headId: 'u2',
    headName: 'Dr. Sarah Johnson',
    workingHours: [
      { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 30 },
      { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 30 },
      { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 30 },
      { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 30 },
      { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 30 },
      { dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '14:00', slotDuration: 30 },
      { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00', slotDuration: 30 },
    ],
    allowedModules: ['appointments', 'patients', 'emr', 'pharmacy', 'billing'],
    staffCount: 15,
    patientCount: 2456,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2026-02-23',
  },
  {
    id: 'd2',
    hospitalId: 'h1',
    name: 'Pediatrics',
    code: 'PED',
    description: 'Child healthcare and vaccinations',
    headId: 'u5',
    headName: 'Dr. Chioma Okonkwo',
    workingHours: [
      { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 6, isOpen: false, openTime: '00:00', closeTime: '00:00', slotDuration: 30 },
      { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00', slotDuration: 30 },
    ],
    allowedModules: ['appointments', 'patients', 'emr', 'pharmacy'],
    staffCount: 8,
    patientCount: 1234,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2026-02-23',
  },
  {
    id: 'd3',
    hospitalId: 'h1',
    name: 'Laboratory',
    code: 'LAB',
    description: 'Diagnostic testing and lab services',
    headId: 'u3',
    headName: 'Amina Abdullahi',
    workingHours: [
      { dayOfWeek: 1, isOpen: true, openTime: '07:00', closeTime: '19:00', slotDuration: 15 },
      { dayOfWeek: 2, isOpen: true, openTime: '07:00', closeTime: '19:00', slotDuration: 15 },
      { dayOfWeek: 3, isOpen: true, openTime: '07:00', closeTime: '19:00', slotDuration: 15 },
      { dayOfWeek: 4, isOpen: true, openTime: '07:00', closeTime: '19:00', slotDuration: 15 },
      { dayOfWeek: 5, isOpen: true, openTime: '07:00', closeTime: '19:00', slotDuration: 15 },
      { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '16:00', slotDuration: 15 },
      { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00', slotDuration: 15 },
    ],
    allowedModules: ['laboratory', 'patients', 'emr'],
    staffCount: 6,
    patientCount: 0,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2026-02-23',
  },
  {
    id: 'd4',
    hospitalId: 'h1',
    name: 'Pharmacy',
    code: 'PHARM',
    description: 'Medication dispensing and inventory',
    headId: 'u6',
    headName: 'Pharm. Emmanuel Adeyemi',
    workingHours: [
      { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '20:00', slotDuration: 15 },
      { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '20:00', slotDuration: 15 },
      { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '20:00', slotDuration: 15 },
      { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '20:00', slotDuration: 15 },
      { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '20:00', slotDuration: 15 },
      { dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 15 },
      { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00', slotDuration: 15 },
    ],
    allowedModules: ['pharmacy', 'inventory', 'patients'],
    staffCount: 4,
    patientCount: 0,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2026-02-23',
  },
  {
    id: 'd5',
    hospitalId: 'h1',
    name: 'Surgery',
    code: 'SURG',
    description: 'Surgical procedures and operations',
    headId: 'u7',
    headName: 'Dr. Michael Chen',
    workingHours: [
      { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 60 },
      { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 60 },
      { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 60 },
      { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 60 },
      { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00', slotDuration: 60 },
      { dayOfWeek: 6, isOpen: false, openTime: '00:00', closeTime: '00:00', slotDuration: 60 },
      { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00', slotDuration: 60 },
    ],
    allowedModules: ['appointments', 'patients', 'emr', 'pharmacy', 'billing'],
    staffCount: 10,
    patientCount: 567,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2026-02-23',
  },
];

export function AdministrationPage() {
  const [activeTab, setActiveTab] = useState<'departments' | 'facility'>('departments');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [_showFacilityModal, setShowFacilityModal] = useState(false);

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage departments, facility settings, and operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowFacilityModal(true)}
          >
            <Settings className="w-4 h-4" />
            Facility Settings
          </Button>
          <Button 
            className="bg-gradient-to-r from-royal-500 to-royal-700 text-white gap-2"
            onClick={() => setShowDepartmentModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('departments')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === 'departments'
              ? "bg-white text-royal-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Building2 className="w-4 h-4" />
          Departments
        </button>
        <button
          onClick={() => setActiveTab('facility')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === 'facility'
              ? "bg-white text-royal-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Settings className="w-4 h-4" />
          Facility Details
        </button>
      </div>

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Departments List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="premium-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Departments</h3>
                <span className="px-2 py-1 rounded-full bg-royal-100 text-royal-700 text-xs font-medium">
                  {mockDepartments.length}
                </span>
              </div>
              <div className="space-y-2">
                {mockDepartments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-200",
                      selectedDepartment?.id === dept.id
                        ? "bg-royal-50 border-2 border-royal-200"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{dept.code}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs">
                          {dept.staffCount} staff
                        </span>
                        <ChevronRight className={cn(
                          "w-5 h-5 text-gray-400 transition-transform",
                          selectedDepartment?.id === dept.id && "rotate-90"
                        )} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Department Details */}
          <div className="lg:col-span-2">
            {selectedDepartment ? (
              <div className="space-y-6">
                {/* Department Header */}
                <div className="premium-card p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{selectedDepartment.name}</h2>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          selectedDepartment.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {selectedDepartment.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{selectedDepartment.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Staff</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedDepartment.staffCount}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Patients</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedDepartment.patientCount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Head</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{selectedDepartment.headName}</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="premium-card p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Working Hours</h3>
                  <div className="space-y-3">
                    {selectedDepartment.workingHours.map((wh) => (
                      <div key={wh.dayOfWeek} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Switch checked={wh.isOpen} />
                          <span className="font-medium text-gray-700 w-24">{days[wh.dayOfWeek]}</span>
                        </div>
                        {wh.isOpen ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{wh.openTime} - {wh.closeTime}</span>
                            <span className="text-gray-400">({wh.slotDuration}min slots)</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allowed Modules */}
                <div className="premium-card p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Module Access</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDepartment.allowedModules.map((module) => (
                      <span 
                        key={module}
                        className="px-3 py-1.5 rounded-lg bg-royal-100 text-royal-700 text-sm font-medium capitalize"
                      >
                        {module.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="premium-card p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Department</h3>
                <p className="text-gray-500">Click on a department to view and manage its details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Facility Tab */}
      {activeTab === 'facility' && (
        <div className="premium-card p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{mockHospital.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Facility ID: {mockHospital.code}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Verified
                  </span>
                  <span className="px-2 py-1 rounded-full bg-royal-100 text-royal-700 text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowFacilityModal(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{mockHospital.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{mockHospital.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{mockHospital.address}</p>
                      <p className="text-sm text-gray-500">{mockHospital.city}, {mockHospital.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Timezone</p>
                      <p className="font-medium text-gray-900">{mockHospital.timezone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Registration Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-500">Registration Number</span>
                    <span className="font-medium text-gray-900">{mockHospital.registrationNumber}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-500">Tax ID</span>
                    <span className="font-medium text-gray-900">{mockHospital.taxId}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-500">License Number</span>
                    <span className="font-medium text-gray-900">{mockHospital.licenseNumber}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-500">License Expiry</span>
                    <span className="font-medium text-gray-900">{mockHospital.licenseExpiry}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDepartmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-page-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Department</h2>
                <p className="text-sm text-gray-500">Create a new department</p>
              </div>
              <button 
                onClick={() => setShowDepartmentModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                <Input placeholder="e.g., Radiology" className="rounded-xl" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Code</label>
                <Input placeholder="e.g., RAD" className="rounded-xl" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  placeholder="Brief description of the department"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Head</label>
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20">
                  <option>Select department head</option>
                  <option>Dr. Sarah Johnson</option>
                  <option>Dr. Michael Chen</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDepartmentModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-royal-500 to-royal-700 text-white"
                  onClick={() => {
                    toast.success('Department created successfully!');
                    setShowDepartmentModal(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Department
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
