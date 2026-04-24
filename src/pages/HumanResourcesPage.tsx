import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Shield,
  Mail,
  Phone,
  Building2,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Edit3,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Role, Staff, PermissionModule, PermissionAction } from '@/types/rbac';
import { DEFAULT_ROLE_TEMPLATES } from '@/types/rbac';

const modules: { id: PermissionModule; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'appointments', label: 'Appointments', icon: Clock },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'emr', label: 'EMR', icon: Shield },
  { id: 'laboratory', label: 'Laboratory', icon: Shield },
  { id: 'pharmacy', label: 'Pharmacy', icon: Shield },
  { id: 'billing', label: 'Billing', icon: Shield },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: Shield },
  { id: 'inventory', label: 'Inventory', icon: Shield },
  { id: 'administration', label: 'Administration', icon: Building2 },
  { id: 'hr', label: 'Human Resources', icon: Users },
  { id: 'settings', label: 'Settings', icon: Shield },
  { id: 'audit_logs', label: 'Audit Logs', icon: Shield },
];

const actions: { id: PermissionAction; label: string }[] = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'export', label: 'Export' },
  { id: 'approve', label: 'Approve' },
];

// Mock data
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access across all hospitals and modules',
    isDefault: true,
    isSystem: true,
    permissions: DEFAULT_ROLE_TEMPLATES.super_admin.permissions,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    createdBy: 'system',
    staffCount: 2,
  },
  {
    id: '2',
    name: 'Hospital Admin',
    description: 'Full access to assigned hospital and departments',
    isDefault: true,
    isSystem: false,
    permissions: DEFAULT_ROLE_TEMPLATES.hospital_admin.permissions,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    createdBy: 'system',
    staffCount: 3,
  },
  {
    id: '3',
    name: 'Doctor',
    description: 'Access to EMR, lab results, and prescriptions',
    isDefault: true,
    isSystem: false,
    permissions: DEFAULT_ROLE_TEMPLATES.doctor.permissions,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    createdBy: 'system',
    staffCount: 12,
  },
  {
    id: '4',
    name: 'Nurse',
    description: 'Patient care, vitals, and medication administration',
    isDefault: true,
    isSystem: false,
    permissions: DEFAULT_ROLE_TEMPLATES.nurse.permissions,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    createdBy: 'system',
    staffCount: 24,
  },
  {
    id: '5',
    name: 'Receptionist',
    description: 'Appointment booking and patient registration',
    isDefault: true,
    isSystem: false,
    permissions: DEFAULT_ROLE_TEMPLATES.receptionist.permissions,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    createdBy: 'system',
    staffCount: 8,
  },
  {
    id: '6',
    name: 'Lab Scientist',
    description: 'Laboratory tests and results management',
    isDefault: true,
    isSystem: false,
    permissions: DEFAULT_ROLE_TEMPLATES.lab_scientist.permissions,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    createdBy: 'system',
    staffCount: 6,
  },
  {
    id: '7',
    name: 'Pharmacist',
    description: 'Pharmacy and inventory management',
    isDefault: true,
    isSystem: false,
    permissions: DEFAULT_ROLE_TEMPLATES.pharmacist.permissions,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    createdBy: 'system',
    staffCount: 4,
  },
  {
    id: '8',
    name: 'Billing Officer',
    description: 'Billing and insurance claims processing',
    isDefault: true,
    isSystem: false,
    permissions: DEFAULT_ROLE_TEMPLATES.billing_officer.permissions,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    createdBy: 'system',
    staffCount: 5,
  },
];

const mockStaff: Staff[] = [
  {
    id: '1',
    userId: 'u1',
    hospitalId: 'h1',
    departmentId: 'd1',
    roleId: '1',
    firstName: 'Michael',
    lastName: 'Okonkwo',
    email: 'michael.okonkwo@switchhealth.ng',
    phone: '+234 801 234 5678',
    employeeId: 'EMP-001',
    status: 'active',
    isEmailVerified: true,
    twoFactorEnabled: true,
    joinedAt: '2026-01-15',
    lastLoginAt: '2026-02-23T08:30:00Z',
    createdAt: '2026-01-15',
    updatedAt: '2026-02-23',
  },
  {
    id: '2',
    userId: 'u2',
    hospitalId: 'h1',
    departmentId: 'd2',
    roleId: '3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@switchhealth.ng',
    phone: '+234 802 345 6789',
    employeeId: 'EMP-002',
    licenseNumber: 'MD-NG-45231',
    specialization: 'General Medicine',
    status: 'active',
    isEmailVerified: true,
    twoFactorEnabled: false,
    joinedAt: '2026-01-20',
    lastLoginAt: '2026-02-23T09:15:00Z',
    createdAt: '2026-01-20',
    updatedAt: '2026-02-23',
  },
  {
    id: '3',
    userId: 'u3',
    hospitalId: 'h1',
    departmentId: 'd3',
    roleId: '6',
    firstName: 'Amina',
    lastName: 'Abdullahi',
    email: 'amina.abdullahi@switchhealth.ng',
    phone: '+234 803 456 7890',
    employeeId: 'EMP-003',
    status: 'active',
    isEmailVerified: true,
    twoFactorEnabled: true,
    joinedAt: '2026-02-01',
    lastLoginAt: '2026-02-22T16:45:00Z',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-22',
  },
  {
    id: '4',
    userId: 'u4',
    hospitalId: 'h1',
    departmentId: 'd4',
    roleId: '5',
    firstName: 'David',
    lastName: 'Adeyemi',
    email: 'david.adeyemi@switchhealth.ng',
    phone: '+234 804 567 8901',
    employeeId: 'EMP-004',
    status: 'pending',
    isEmailVerified: false,
    twoFactorEnabled: false,
    joinedAt: '2026-02-20',
    inviteStatus: 'pending',
    inviteSentAt: '2026-02-20T10:00:00Z',
    inviteExpiresAt: '2026-02-22T10:00:00Z',
    invitedBy: 'Michael Okonkwo',
    createdAt: '2026-02-20',
    updatedAt: '2026-02-20',
  },
];

export function HumanResourcesPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'roles'>('staff');
  const [_showRoleModal, setShowRoleModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [_editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const handleSendInvite = () => {
    setShowInviteModal(true);
  };

  const filteredStaff = mockStaff.filter(s => 
    s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resources</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage staff, roles, and access permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleCreateRole}
          >
            <Shield className="w-4 h-4" />
            Manage Roles
          </Button>
          <Button 
            className="bg-gradient-to-r from-royal-500 to-royal-700 text-white gap-2"
            onClick={handleSendInvite}
          >
            <UserPlus className="w-4 h-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="premium-card p-5">
          <p className="text-3xl font-bold text-gray-900">64</p>
          <p className="text-xs text-gray-500 mt-1">Total Staff</p>
        </div>
        <div className="premium-card p-5">
          <p className="text-3xl font-bold text-green-600">58</p>
          <p className="text-xs text-gray-500 mt-1">Active</p>
        </div>
        <div className="premium-card p-5">
          <p className="text-3xl font-bold text-amber-600">4</p>
          <p className="text-xs text-gray-500 mt-1">Pending Invite</p>
        </div>
        <div className="premium-card p-5">
          <p className="text-3xl font-bold text-red-600">2</p>
          <p className="text-xs text-gray-500 mt-1">Inactive</p>
        </div>
        <div className="premium-card p-5">
          <p className="text-3xl font-bold text-royal-600">8</p>
          <p className="text-xs text-gray-500 mt-1">Roles</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('staff')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === 'staff'
              ? "bg-white text-royal-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Users className="w-4 h-4" />
          Staff Directory
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === 'roles'
              ? "bg-white text-royal-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Shield className="w-4 h-4" />
          Roles & Permissions
        </button>
      </div>

      {/* Staff Directory */}
      {activeTab === 'staff' && (
        <>
          {/* Search & Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search staff by name, email, or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 rounded-xl"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Staff Table */}
          <div className="premium-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Staff Member</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">2FA</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => {
                  const role = mockRoles.find(r => r.id === staff.roleId);
                  return (
                    <tr key={staff.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center text-white font-semibold">
                            {staff.firstName[0]}{staff.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{staff.firstName} {staff.lastName}</p>
                            <p className="text-xs text-gray-500">{staff.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 text-xs font-medium">
                          {role?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">General Medicine</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {staff.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {staff.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit",
                          staff.status === 'active' ? "bg-green-100 text-green-700" :
                          staff.status === 'pending' ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100 text-gray-600"
                        )}>
                          {staff.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> :
                           staff.status === 'pending' ? <Clock className="w-3 h-3" /> :
                           <XCircle className="w-3 h-3" />}
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-xs font-medium",
                          staff.twoFactorEnabled ? "text-green-600" : "text-gray-400"
                        )}>
                          {staff.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Roles & Permissions */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="premium-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Roles</h3>
                <Button size="sm" variant="outline" onClick={handleCreateRole}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {mockRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-200",
                      selectedRole?.id === role.id
                        ? "bg-royal-50 border-2 border-royal-200"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{role.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{role.staffCount} staff members</p>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        selectedRole?.id === role.id && "rotate-90"
                      )} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role Details */}
          <div className="lg:col-span-2">
            {selectedRole ? (
              <div className="premium-card p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedRole.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedRole.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditRole(selectedRole)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {!selectedRole.isSystem && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Module Permissions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {modules.map((module) => {
                      const permission = selectedRole.permissions.find(p => p.module === module.id);
                      return (
                        <div key={module.id} className="p-4 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-2 mb-3">
                            <module.icon className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{module.label}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {actions.map((action) => {
                              const hasPermission = permission?.actions.includes(action.id);
                              return (
                                <span
                                  key={action.id}
                                  className={cn(
                                    "px-2 py-1 rounded-lg text-xs font-medium",
                                    hasPermission
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-200 text-gray-400"
                                  )}
                                >
                                  {action.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="premium-card p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Role</h3>
                <p className="text-gray-500">Click on a role to view and manage its permissions</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-page-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Invite Staff Member</h2>
                <p className="text-sm text-gray-500">Send invitation to join Switch Health</p>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <Input placeholder="Enter first name" className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <Input placeholder="Enter last name" className="rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <Input type="email" placeholder="name@company.com" className="rounded-xl" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input placeholder="+234 800 000 0000" className="rounded-xl" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20">
                  <option>Select department</option>
                  <option>General Medicine</option>
                  <option>Pediatrics</option>
                  <option>Surgery</option>
                  <option>Laboratory</option>
                  <option>Pharmacy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-royal-500/20">
                  <option>Select role</option>
                  {mockRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Invitation expires in 48 hours</p>
                    <p className="text-xs text-amber-600 mt-1">
                      The recipient will receive an email with a secure link to complete their registration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-royal-500 to-royal-700 text-white"
                  onClick={() => {
                    toast.success('Invitation sent successfully!');
                    setShowInviteModal(false);
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
