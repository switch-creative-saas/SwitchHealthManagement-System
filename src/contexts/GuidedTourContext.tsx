import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import type { PageType } from '@/types';
import type { UserRole } from '@/contexts/AuthContext';

type TourType = 'role' | 'micro' | 'feature';

export interface TourStep {
  id: string;
  page: PageType;
  title: string;
  description: string;
  selector?: string;
}

interface TourDefinition {
  id: string;
  type: TourType;
  role?: UserRole;
  steps: TourStep[];
}

interface TourProgress {
  completedTours: string[];
  skippedTours: string[];
  partial: Record<string, number>;
}

interface GuidedTourContextType {
  toursEnabled: boolean;
  setToursEnabled: (enabled: boolean) => void;
  startRoleOnboarding: (role?: UserRole) => void;
  startTourById: (tourId: string, step?: number) => void;
  triggerMicroTour: (tourId: string) => void;
  replayCurrentRoleTour: () => void;
  resetOnboarding: () => void;
  progress: TourProgress;
}

const GuidedTourContext = createContext<GuidedTourContextType | null>(null);

const roleTours: Record<UserRole, TourDefinition> = {
  'super-admin': {
    id: 'tour-admin-super',
    type: 'role',
    role: 'super-admin',
    steps: [
      { id: 'admin-1', page: 'dashboard', title: 'Dashboard Analytics', description: 'Start with top-level hospital analytics and operations.', selector: '[data-tour-id="sidebar-dashboard"]' },
      { id: 'admin-2', page: 'human-resources', title: 'Manage Staff', description: 'Review staff roles and HR operations.', selector: '[data-tour-id="sidebar-human-resources"]' },
      { id: 'admin-3', page: 'administration', title: 'Departments', description: 'Control departments, facilities, and operational structure.', selector: '[data-tour-id="sidebar-administration"]' },
      { id: 'admin-4', page: 'subscription', title: 'Subscription Plans', description: 'Manage SaaS plan and feature access controls.', selector: '[data-tour-id="sidebar-subscription"]' },
      { id: 'admin-5', page: 'settings', title: 'System Control', description: 'Configure security, data sync, and organization settings.', selector: '[data-tour-id="sidebar-settings"]' },
    ],
  },
  'hospital-admin': {
    id: 'tour-admin-hospital',
    type: 'role',
    role: 'hospital-admin',
    steps: [
      { id: 'hadmin-1', page: 'dashboard', title: 'Dashboard Overview', description: 'Monitor the health system KPIs and daily operations.', selector: '[data-tour-id="sidebar-dashboard"]' },
      { id: 'hadmin-2', page: 'human-resources', title: 'Staff Management', description: 'Manage staff assignments and role controls.', selector: '[data-tour-id="sidebar-human-resources"]' },
      { id: 'hadmin-3', page: 'administration', title: 'Department Control', description: 'Manage departments and linked modules.', selector: '[data-tour-id="sidebar-administration"]' },
      { id: 'hadmin-4', page: 'subscription', title: 'Plan & Billing', description: 'Track usage and plan limits for your facility.', selector: '[data-tour-id="sidebar-subscription"]' },
    ],
  },
  doctor: {
    id: 'tour-doctor',
    type: 'role',
    role: 'doctor',
    steps: [
      { id: 'doc-1', page: 'dashboard', title: 'Dashboard Overview', description: 'Review your workload and patient updates.', selector: '[data-tour-id="sidebar-dashboard"]' },
      { id: 'doc-2', page: 'appointments', title: 'Appointments', description: 'View and manage your patient schedule.', selector: '[data-tour-id="sidebar-appointments"]' },
      { id: 'doc-3', page: 'emr', title: 'EMR', description: 'Capture clinical notes and review patient history.', selector: '[data-tour-id="sidebar-emr"]' },
      { id: 'doc-4', page: 'laboratory', title: 'Lab Results', description: 'Review results and follow up clinically.', selector: '[data-tour-id="sidebar-laboratory"]' },
      { id: 'doc-5', page: 'telemedicine', title: 'Telemedicine', description: 'Start and manage virtual consultations.', selector: '[data-tour-id="sidebar-telemedicine"]' },
      { id: 'doc-6', page: 'ai-clinical-intelligence', title: 'Gulia AI', description: 'Use AI-powered clinical assistance.', selector: '[data-tour-id="sidebar-ai-clinical-intelligence"]' },
    ],
  },
  nurse: {
    id: 'tour-nurse',
    type: 'role',
    role: 'nurse',
    steps: [
      { id: 'nurse-1', page: 'patients', title: 'Patient Records', description: 'Open and review patient records.', selector: '[data-tour-id="sidebar-patients"]' },
      { id: 'nurse-2', page: 'emr', title: 'Vitals Entry', description: 'Record and track vital signs.', selector: '[data-tour-id="sidebar-emr"]' },
      { id: 'nurse-3', page: 'pharmacy', title: 'Medication Tracking', description: 'Coordinate medication administration.', selector: '[data-tour-id="sidebar-pharmacy"]' },
    ],
  },
  receptionist: {
    id: 'tour-receptionist',
    type: 'role',
    role: 'receptionist',
    steps: [
      { id: 'rec-1', page: 'dashboard', title: 'Dashboard Overview', description: 'Get quick intake and queue status.', selector: '[data-tour-id="sidebar-dashboard"]' },
      { id: 'rec-2', page: 'patients', title: 'Add Patient', description: 'Register new patients quickly.', selector: '[data-tour-id="patients-add"]' },
      { id: 'rec-3', page: 'appointments', title: 'Book Appointment', description: 'Schedule patient appointments.', selector: '[data-tour-id="appointments-new"]' },
      { id: 'rec-4', page: 'patients', title: 'Search Patients', description: 'Use global search for fast lookup.', selector: '[data-tour-id="global-search"]' },
    ],
  },
  pharmacist: {
    id: 'tour-pharmacist',
    type: 'role',
    role: 'pharmacist',
    steps: [
      { id: 'pharm-1', page: 'pharmacy', title: 'Inventory', description: 'Track stock and low-stock alerts.', selector: '[data-tour-id="sidebar-pharmacy"]' },
      { id: 'pharm-2', page: 'pharmacy', title: 'Dispense Medication', description: 'Process prescriptions and dispense safely.' },
      { id: 'pharm-3', page: 'pharmacy', title: 'Stock Alerts', description: 'Act on low stock and expiry warnings.' },
    ],
  },
  'lab-scientist': {
    id: 'tour-lab-scientist',
    type: 'role',
    role: 'lab-scientist',
    steps: [
      { id: 'lab-1', page: 'laboratory', title: 'Lab Orders', description: 'Review incoming lab orders.', selector: '[data-tour-id="sidebar-laboratory"]' },
      { id: 'lab-2', page: 'laboratory', title: 'Process Tests', description: 'Run and update test processing status.' },
      { id: 'lab-3', page: 'laboratory', title: 'Upload Results', description: 'Publish and sync results to EMR.', selector: '[data-tour-id="lab-bulk-upload"]' },
    ],
  },
  'lab-technician': {
    id: 'tour-lab-tech',
    type: 'role',
    role: 'lab-technician',
    steps: [
      { id: 'lt-1', page: 'laboratory', title: 'Lab Intake', description: 'Manage sample intake and processing queue.' },
      { id: 'lt-2', page: 'laboratory', title: 'Update Status', description: 'Keep order progress updated for clinicians.' },
      { id: 'lt-3', page: 'laboratory', title: 'Upload Results', description: 'Attach result data when allowed.' },
    ],
  },
  'billing-officer': {
    id: 'tour-billing',
    type: 'role',
    role: 'billing-officer',
    steps: [
      { id: 'bill-1', page: 'billing', title: 'Invoice Queue', description: 'Review billing operations dashboard.', selector: '[data-tour-id="sidebar-billing"]' },
      { id: 'bill-2', page: 'billing', title: 'New Invoice', description: 'Create and send invoices.', selector: '[data-tour-id="billing-new-invoice"]' },
      { id: 'bill-3', page: 'analytics', title: 'Financial Insights', description: 'Track collections and trends.', selector: '[data-tour-id="sidebar-analytics"]' },
    ],
  },
  'insurance-officer': {
    id: 'tour-insurance',
    type: 'role',
    role: 'insurance-officer',
    steps: [
      { id: 'ins-1', page: 'billing', title: 'Claims Review', description: 'Review and process claims.' },
      { id: 'ins-2', page: 'billing', title: 'Approval Workflow', description: 'Approve or reject claims with notes.' },
      { id: 'ins-3', page: 'analytics', title: 'Claims Analytics', description: 'Analyze claim trends and outcomes.' },
    ],
  },
  'it-officer': {
    id: 'tour-it',
    type: 'role',
    role: 'it-officer',
    steps: [
      { id: 'it-1', page: 'audit-logs', title: 'Security Logs', description: 'Monitor security and audit events.' },
      { id: 'it-2', page: 'settings', title: 'System Controls', description: 'Manage security and infrastructure settings.' },
      { id: 'it-3', page: 'help', title: 'Diagnostics', description: 'Run diagnostics and support workflows.' },
    ],
  },
  'support-agent': {
    id: 'tour-support-agent',
    type: 'role',
    role: 'support-agent',
    steps: [
      { id: 'sa-1', page: 'help', title: 'Support Dashboard', description: 'Manage support queue and requests.', selector: '[data-tour-id="help-dashboard"]' },
      { id: 'sa-2', page: 'help', title: 'Ticket Lifecycle', description: 'Move tickets through status workflow.' },
      { id: 'sa-3', page: 'help', title: 'Diagnostics', description: 'Use diagnostics to speed troubleshooting.' },
    ],
  },
};

const microTours: Record<string, TourDefinition> = {
  'micro-new-patient': {
    id: 'micro-new-patient',
    type: 'micro',
    steps: [
      { id: 'mnp-1', page: 'patients', title: 'New Patient Form', description: 'Fill demographic and contact details carefully.', selector: '[data-tour-id="patients-add"]' },
      { id: 'mnp-2', page: 'patients', title: 'Identity Setup', description: 'Assign a unique Switch ID and verify fields.' },
    ],
  },
  'micro-billing-first': {
    id: 'micro-billing-first',
    type: 'micro',
    steps: [
      { id: 'mb1', page: 'billing', title: 'Invoice Flow', description: 'Create invoice, add services, then send to patient.', selector: '[data-tour-id="billing-new-invoice"]' },
      { id: 'mb2', page: 'billing', title: 'Insurance & Payments', description: 'Track claims and reconcile payments.' },
    ],
  },
  'micro-lab-upload': {
    id: 'micro-lab-upload',
    type: 'micro',
    steps: [
      { id: 'mlu1', page: 'laboratory', title: 'Upload Results', description: 'Attach result file and validate metadata.', selector: '[data-tour-id="lab-bulk-upload"]' },
      { id: 'mlu2', page: 'laboratory', title: 'Publish Results', description: 'Review critical flags before publishing.' },
    ],
  },
};

const featureTours: Record<string, TourDefinition> = {
  'feature-help-support': {
    id: 'feature-help-support',
    type: 'feature',
    steps: [
      { id: 'fhs1', page: 'help', title: 'New Help & Support Hub', description: 'Access tickets, AI support, and diagnostics from one place.' },
    ],
  },
};

function progressKey(userName: string) {
  return `switch-tour-progress-${userName}`;
}

function enabledKey(userName: string) {
  return `switch-tour-enabled-${userName}`;
}

export function GuidedTourProvider({
  children,
  currentPage,
  currentRole,
  userName,
  onNavigate,
}: {
  children: ReactNode;
  currentPage: PageType;
  currentRole: UserRole;
  userName: string;
  onNavigate: (page: PageType) => void;
}) {
  const { addAudit } = useSubscription();
  const [toursEnabled, setToursEnabledState] = useState<boolean>(() => localStorage.getItem(enabledKey(userName)) !== '0');
  const [progress, setProgress] = useState<TourProgress>(() => {
    const saved = localStorage.getItem(progressKey(userName));
    if (saved) return JSON.parse(saved) as TourProgress;
    return { completedTours: [], skippedTours: [], partial: {} };
  });
  const [activeTour, setActiveTour] = useState<TourDefinition | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState<{ tourId: string; step: number } | null>(null);

  const allTours = useMemo(() => ({ ...roleTours, ...microTours, ...featureTours }), []);

  useEffect(() => {
    localStorage.setItem(progressKey(userName), JSON.stringify(progress));
  }, [progress, userName]);

  useEffect(() => {
    localStorage.setItem(enabledKey(userName), toursEnabled ? '1' : '0');
  }, [toursEnabled, userName]);

  useEffect(() => {
    const partialEntry = Object.entries(progress.partial)[0];
    if (toursEnabled && partialEntry && !activeTour) {
      setShowResumePrompt({ tourId: partialEntry[0], step: partialEntry[1] });
    }
  }, [progress.partial, toursEnabled, activeTour]);

  useEffect(() => {
    if (!toursEnabled || activeTour) return;
    const roleTour = roleTours[currentRole];
    if (!roleTour) return;
    if (progress.completedTours.includes(roleTour.id)) return;
    startTourById(roleTour.id, progress.partial[roleTour.id] ?? 0);
  }, [currentRole, toursEnabled]);

  useEffect(() => {
    const featureTour = featureTours['feature-help-support'];
    if (!toursEnabled || activeTour) return;
    if (currentPage !== 'help') return;
    if (progress.completedTours.includes(featureTour.id) || progress.skippedTours.includes(featureTour.id)) return;
    startTourById(featureTour.id, 0);
  }, [currentPage, toursEnabled, activeTour, progress.completedTours, progress.skippedTours]);

  useEffect(() => {
    const onTrigger = (event: Event) => {
      const detail = (event as CustomEvent<{ tourId: string }>).detail;
      if (!detail?.tourId) return;
      triggerMicroTour(detail.tourId);
    };
    window.addEventListener('switch-health:tour-trigger', onTrigger as EventListener);
    return () => window.removeEventListener('switch-health:tour-trigger', onTrigger as EventListener);
  }, [progress, toursEnabled]);

  useEffect(() => {
    if (!activeTour) return;
    const step = activeTour.steps[stepIndex];
    if (!step) return;
    if (step.page !== currentPage) {
      onNavigate(step.page);
      return;
    }
    if (!step.selector) {
      setTargetRect(null);
      return;
    }
    const target = document.querySelector(step.selector) as HTMLElement | null;
    if (!target) {
      setTargetRect(null);
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const rect = target.getBoundingClientRect();
    setTargetRect(rect);
  }, [activeTour, stepIndex, currentPage, onNavigate]);

  const setToursEnabled = (enabled: boolean) => {
    setToursEnabledState(enabled);
    if (!enabled) {
      setActiveTour(null);
      setShowResumePrompt(null);
    }
  };

  const markPartial = (tourId: string, nextStep: number) => {
    setProgress((prev) => ({ ...prev, partial: { ...prev.partial, [tourId]: nextStep } }));
  };

  const clearPartial = (tourId: string) => {
    setProgress((prev) => {
      const partial = { ...prev.partial };
      delete partial[tourId];
      return { ...prev, partial };
    });
  };

  const startTourById = (tourId: string, step = 0) => {
    const tour = Object.values(allTours).find((entry) => entry.id === tourId);
    if (!tour || !toursEnabled) return;
    setActiveTour(tour);
    setStepIndex(step);
    markPartial(tour.id, step);
  };

  const startRoleOnboarding = (role?: UserRole) => {
    const selectedRole = role ?? currentRole;
    const tour = roleTours[selectedRole];
    if (!tour) return;
    startTourById(tour.id);
  };

  const triggerMicroTour = (tourId: string) => {
    const tour = microTours[tourId];
    if (!tour || !toursEnabled) return;
    if (progress.completedTours.includes(tour.id)) return;
    if (progress.skippedTours.includes(tour.id)) return;
    startTourById(tour.id);
  };

  const replayCurrentRoleTour = () => {
    const tour = roleTours[currentRole];
    if (!tour) return;
    startTourById(tour.id, 0);
  };

  const resetOnboarding = () => {
    setProgress({ completedTours: [], skippedTours: [], partial: {} });
    toastMessage('Onboarding progress reset');
  };

  const finishTour = (completed: boolean) => {
    if (!activeTour) return;
    if (completed) {
      setProgress((prev) => ({
        ...prev,
        completedTours: Array.from(new Set([...prev.completedTours, activeTour.id])),
      }));
      addAudit(`Guided tour completed: ${activeTour.id}`);
    } else {
      setProgress((prev) => ({
        ...prev,
        skippedTours: Array.from(new Set([...prev.skippedTours, activeTour.id])),
      }));
      addAudit(`Guided tour skipped: ${activeTour.id}`);
    }
    clearPartial(activeTour.id);
    setActiveTour(null);
    setTargetRect(null);
  };

  const nextStep = () => {
    if (!activeTour) return;
    const isLast = stepIndex >= activeTour.steps.length - 1;
    if (isLast) {
      finishTour(true);
      return;
    }
    const next = stepIndex + 1;
    setStepIndex(next);
    markPartial(activeTour.id, next);
  };

  const previousStep = () => {
    if (!activeTour) return;
    const prev = Math.max(0, stepIndex - 1);
    setStepIndex(prev);
    markPartial(activeTour.id, prev);
  };

  const value = useMemo<GuidedTourContextType>(
    () => ({
      toursEnabled,
      setToursEnabled,
      startRoleOnboarding,
      startTourById,
      triggerMicroTour,
      replayCurrentRoleTour,
      resetOnboarding,
      progress,
    }),
    [toursEnabled, progress, currentRole],
  );

  const step = activeTour?.steps[stepIndex];
  const totalSteps = activeTour?.steps.length ?? 0;

  return (
    <GuidedTourContext.Provider value={value}>
      {children}

      {showResumePrompt && toursEnabled && !activeTour && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md rounded-2xl border border-royal-200 bg-white/90 backdrop-blur-md p-3 shadow-lg">
          <p className="text-sm text-gray-800 mb-2">Continue where you left off?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowResumePrompt(null)}>Not now</Button>
            <Button size="sm" onClick={() => { startTourById(showResumePrompt.tourId, showResumePrompt.step); setShowResumePrompt(null); }}>
              Continue tour
            </Button>
          </div>
        </div>
      )}

      {activeTour && step && (
        <>
          <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
          {targetRect && (
            <div
              className="fixed z-[60] rounded-2xl border-2 border-royal-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] pointer-events-none animate-pulse"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            />
          )}
          <div
            className="fixed z-[70] w-[92vw] max-w-sm rounded-2xl border border-white/60 glass-panel p-4 shadow-xl animate-page-fade-in"
            style={{
              top: targetRect ? Math.min(window.innerHeight - 260, targetRect.bottom + 12) : window.innerHeight / 2 - 100,
              left: targetRect ? Math.min(window.innerWidth - 360, Math.max(12, targetRect.left)) : window.innerWidth / 2 - 170,
            }}
          >
            <p className="text-xs text-royal-700 font-medium mb-1">{activeTour.type.toUpperCase()} TOUR</p>
            <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              Step {stepIndex + 1} of {totalSteps}
              <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-royal-500 transition-all" style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" onClick={previousStep} disabled={stepIndex === 0}>Back</Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => finishTour(false)}>Skip</Button>
                <Button size="sm" onClick={nextStep}>{stepIndex === totalSteps - 1 ? 'Finish' : 'Next'}</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </GuidedTourContext.Provider>
  );
}

function toastMessage(message: string) {
  window.dispatchEvent(new CustomEvent('switch-health:notify', { detail: { module: 'tour', type: 'tour-progress', message } }));
}

export function useGuidedTour() {
  const context = useContext(GuidedTourContext);
  if (!context) throw new Error('useGuidedTour must be used within GuidedTourProvider');
  return context;
}
