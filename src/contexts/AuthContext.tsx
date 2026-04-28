import { createContext, useContext, useState, type ReactNode } from 'react';

// ============================================
// RBAC TYPES (INLINE TO AVOID IMPORT ISSUES)
// ============================================

export type UserRole =
  | 'super-admin'
  | 'hospital-admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'lab-scientist'
  | 'lab-technician'
  | 'pharmacist'
  | 'billing-officer'
  | 'insurance-officer'
  | 'it-officer'
  | 'support-agent';

type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve';

interface Permission {
  module: string;
  actions: PermissionAction[];
}

interface RoleConfig {
  name: string;
  description: string;
  permissions: Permission[];
}

// ============================================
// ROLE CONFIGURATIONS
// ============================================

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  'super-admin': {
    name: 'Super Admin',
    description: 'Full system access',
    permissions: [
      { module: 'Dashboard', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Appointments', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Patients', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'EMR', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Laboratory', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Pharmacy', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Billing', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Analytics', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Human Resources', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Administration', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Settings', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
    ],
  },
  'hospital-admin': {
    name: 'Hospital Admin',
    description: 'Hospital management access',
    permissions: [
      { module: 'Dashboard', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Appointments', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Patients', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'EMR', actions: ['view'] },
      { module: 'Laboratory', actions: ['view', 'create', 'edit', 'delete', 'export', 'approve'] },
      { module: 'Pharmacy', actions: ['view', 'create', 'edit', 'export', 'approve'] },
      { module: 'Billing', actions: ['view', 'create', 'edit', 'export'] },
      { module: 'Analytics', actions: ['view', 'export'] },
      { module: 'Human Resources', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'Administration', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'Settings', actions: ['view', 'edit'] },
    ],
  },
  'doctor': {
    name: 'Doctor',
    description: 'Patient care & EMR access',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Appointments', actions: ['view', 'create', 'edit'] },
      { module: 'Patients', actions: ['view', 'create', 'edit'] },
      { module: 'EMR', actions: ['view', 'create', 'edit', 'export'] },
      { module: 'Laboratory', actions: ['view', 'create'] },
      { module: 'Pharmacy', actions: ['view'] },
      { module: 'Analytics', actions: ['view'] },
    ],
  },
  'nurse': {
    name: 'Nurse',
    description: 'Patient care & vitals',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Appointments', actions: ['view'] },
      { module: 'Patients', actions: ['view', 'edit'] },
      { module: 'EMR', actions: ['view', 'edit'] },
      { module: 'Laboratory', actions: ['view'] },
    ],
  },
  'receptionist': {
    name: 'Receptionist',
    description: 'Appointments & registration',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Appointments', actions: ['view', 'create', 'edit'] },
      { module: 'Patients', actions: ['view', 'create'] },
      { module: 'Laboratory', actions: ['view', 'create'] },
    ],
  },
  'lab-scientist': {
    name: 'Lab Scientist',
    description: 'Laboratory management',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Patients', actions: ['view'] },
      { module: 'Laboratory', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    ],
  },
  'lab-technician': {
    name: 'Lab Technician',
    description: 'Sample handling & raw data entry',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Patients', actions: ['view'] },
      { module: 'Laboratory', actions: ['view', 'edit'] },
    ],
  },
  'pharmacist': {
    name: 'Pharmacist',
    description: 'Pharmacy & inventory',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Patients', actions: ['view'] },
      { module: 'Pharmacy', actions: ['view', 'create', 'edit', 'export'] },
      { module: 'Billing', actions: ['view', 'create'] },
    ],
  },
  'billing-officer': {
    name: 'Billing Officer',
    description: 'Billing & insurance',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Patients', actions: ['view'] },
      { module: 'Billing', actions: ['view', 'create', 'edit', 'export'] },
      { module: 'Analytics', actions: ['view', 'export'] },
    ],
  },
  'insurance-officer': {
    name: 'Insurance Officer',
    description: 'Insurance claims & approvals',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Patients', actions: ['view'] },
      { module: 'Billing', actions: ['view', 'edit', 'approve', 'export'] },
      { module: 'Analytics', actions: ['view'] },
    ],
  },
  'it-officer': {
    name: 'IT Officer',
    description: 'System & security',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Human Resources', actions: ['view'] },
      { module: 'Administration', actions: ['view', 'edit'] },
      { module: 'Settings', actions: ['view', 'edit'] },
    ],
  },
  'support-agent': {
    name: 'Support Agent',
    description: 'Internal support operations',
    permissions: [
      { module: 'Dashboard', actions: ['view'] },
      { module: 'Settings', actions: ['view', 'create', 'edit'] },
      { module: 'Administration', actions: ['view'] },
      { module: 'Analytics', actions: ['view'] },
    ],
  },
};

const MODULE_MAP: Record<string, string> = {
  'dashboard': 'Dashboard',
  'patient-identity': 'Patients',
  'patients': 'Patients',
  'emr': 'EMR',
  'appointments': 'Appointments',
  'laboratory': 'Laboratory',
  'pharmacy': 'Pharmacy',
  'billing': 'Billing',
  'analytics': 'Analytics',
  'human-resources': 'Human Resources',
  'administration': 'Administration',
  'subscription': 'Settings',
  'audit-logs': 'Settings',
  'settings': 'Settings',
  'help': 'Settings',
};

// ============================================
// CONTEXT
// ============================================

export interface AuthContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  roleConfig: RoleConfig | undefined;
  canView: (module: string) => boolean;
  canCreate: (module: string) => boolean;
  canEdit: (module: string) => boolean;
  canDelete: (module: string) => boolean;
  canExport: (module: string) => boolean;
  canApprove: (module: string) => boolean;
  canAccessPage: (page: string) => boolean;
  hasPermission: (module: string, action: string) => boolean;
  isSuperAdmin: boolean;
  isDoctor: boolean;
  isReceptionist: boolean;
  isNurse: boolean;
  isLabScientist: boolean;
  isLabTechnician: boolean;
  isPharmacist: boolean;
  isBillingOfficer: boolean;
  isHospitalAdmin: boolean;
  userName: string;
  userEmail: string;
  userAvatar: string;
  setUserProfile: (profile: { name: string; email: string; avatar?: string }) => void;
  clearUserProfile: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem('switch-health-role');
    return (saved as UserRole) || 'super-admin';
  });

  const roleConfig = ROLE_CONFIGS[currentRole];
  const [userProfile, setUserProfileState] = useState<{ name: string; email: string; avatar?: string } | null>(() => {
    const raw = localStorage.getItem('switch-health-user-profile');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { name: string; email: string; avatar?: string };
    } catch {
      return null;
    }
  });

  const hasPermission = (module: string, action: string): boolean => {
    if (currentRole === 'super-admin') return true;
    const permission = roleConfig?.permissions.find(p => p.module === module);
    return permission?.actions.includes(action as PermissionAction) ?? false;
  };

  const canView = (module: string) => hasPermission(module, 'view');
  const canCreate = (module: string) => hasPermission(module, 'create');
  const canEdit = (module: string) => hasPermission(module, 'edit');
  const canDelete = (module: string) => hasPermission(module, 'delete');
  const canExport = (module: string) => hasPermission(module, 'export');
  const canApprove = (module: string) => hasPermission(module, 'approve');

  const canAccessPage = (page: string): boolean => {
    const module = MODULE_MAP[page];
    if (!module) return false;
    if (currentRole === 'super-admin') return true;
    return canView(module);
  };

  const roleDisplayInfo: Record<UserRole, { name: string; email: string; avatar: string }> = {
    'super-admin': { name: 'Super Admin', email: 'admin@switchhealth.ng', avatar: 'SA' },
    'hospital-admin': { name: 'Hospital Admin', email: 'hospital.admin@switchhealth.ng', avatar: 'HA' },
    'doctor': { name: 'Dr. Sarah Johnson', email: 's.johnson@switchhealth.ng', avatar: 'SJ' },
    'nurse': { name: 'Nurse Amina Bello', email: 'a.bello@switchhealth.ng', avatar: 'AB' },
    'receptionist': { name: 'Receptionist John', email: 'reception@switchhealth.ng', avatar: 'RJ' },
    'lab-scientist': { name: 'Lab Scientist Okonkwo', email: 'o.okonkwo@switchhealth.ng', avatar: 'LO' },
    'lab-technician': { name: 'Lab Tech Ibrahim Musa', email: 'i.musa@switchhealth.ng', avatar: 'LT' },
    'pharmacist': { name: 'Pharmacist Adeyemi', email: 'p.adeyemi@switchhealth.ng', avatar: 'PA' },
    'billing-officer': { name: 'Billing Officer Ngozi', email: 'n.obi@switchhealth.ng', avatar: 'BN' },
    'insurance-officer': { name: 'Insurance Officer Chika', email: 'insurance@switchhealth.ng', avatar: 'IO' },
    'it-officer': { name: 'IT Officer Michael', email: 'it@switchhealth.ng', avatar: 'IM' },
    'support-agent': { name: 'Support Agent Grace', email: 'support@switchhealth.ng', avatar: 'SG' },
  };

  const userInfo = roleDisplayInfo[currentRole];

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('switch-health-role', role);
  };

  const setUserProfile = (profile: { name: string; email: string; avatar?: string }) => {
    setUserProfileState(profile);
    localStorage.setItem('switch-health-user-profile', JSON.stringify(profile));
  };

  const clearUserProfile = () => {
    setUserProfileState(null);
    localStorage.removeItem('switch-health-user-profile');
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        setCurrentRole: handleSetRole,
        roleConfig,
        canView,
        canCreate,
        canEdit,
        canDelete,
        canExport,
        canApprove,
        canAccessPage,
        hasPermission,
        isSuperAdmin: currentRole === 'super-admin',
        isDoctor: currentRole === 'doctor',
        isReceptionist: currentRole === 'receptionist',
        isNurse: currentRole === 'nurse',
        isLabScientist: currentRole === 'lab-scientist',
        isLabTechnician: currentRole === 'lab-technician',
        isPharmacist: currentRole === 'pharmacist',
        isBillingOfficer: currentRole === 'billing-officer',
        isHospitalAdmin: currentRole === 'hospital-admin',
        userName: userProfile?.name ?? userInfo?.name ?? 'User',
        userEmail: userProfile?.email ?? userInfo?.email ?? 'user@switchhealth.ng',
        userAvatar: userProfile?.avatar ?? userInfo?.avatar ?? 'U',
        setUserProfile,
        clearUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
