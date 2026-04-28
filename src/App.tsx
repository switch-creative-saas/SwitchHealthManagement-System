import { useEffect, useState } from 'react';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { GuliaAIPanel } from '@/components/ai/GuliaAIPanel';
import { AIFloatingButton } from '@/components/ai/AIFloatingButton';
import { DashboardPage } from '@/pages/DashboardPage';
import { PatientIdentityPage } from '@/pages/PatientIdentityPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { EMRPage } from '@/pages/EMRPage';
import { TelemedicinePage } from '@/pages/TelemedicinePage';
import { AIClinicalIntelligencePage } from '@/pages/AIClinicalIntelligencePage';
import { SwitchNetworkPage } from '@/pages/SwitchNetworkPage';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import { LaboratoryPage } from '@/pages/LaboratoryPage';
import { PharmacyPage } from '@/pages/PharmacyPage';
import { BillingPage } from '@/pages/BillingPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { HumanResourcesPage } from '@/pages/HumanResourcesPage';
import { AdministrationPage } from '@/pages/AdministrationPage';
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Toaster } from '@/components/ui/sonner';
import type { PageType } from '@/types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [guliaPanelOpen, setGuliaPanelOpen] = useState(false);
  const [emrSwitchId, setEmrSwitchId] = useState<string | null>(null);

  const parseRoute = () => {
    const path = window.location.pathname;
    if (path.startsWith('/emr/')) {
      const id = decodeURIComponent(path.replace('/emr/', ''));
      setCurrentPage('emr');
      setEmrSwitchId(id || null);
      return;
    }
    if (path === '/emr') {
      setCurrentPage('emr');
      setEmrSwitchId(null);
      return;
    }
    if (path === '/patients') {
      setCurrentPage('patients');
      setEmrSwitchId(null);
      return;
    }
    setCurrentPage('dashboard');
    setEmrSwitchId(null);
  };

  useEffect(() => {
    parseRoute();
    const onPopState = () => parseRoute();
    const onAppNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ path?: string; page?: PageType; switchId?: string }>).detail;
      if (!detail) return;
      if (detail.switchId) {
        openEmrForPatient(detail.switchId);
        return;
      }
      if (detail.page) {
        navigateToPage(detail.page);
        return;
      }
      if (detail.path) {
        window.history.pushState({}, '', detail.path);
        parseRoute();
      }
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('app:navigate', onAppNavigate as EventListener);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('app:navigate', onAppNavigate as EventListener);
    };
  }, []);

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    if (page === 'patients') {
      window.history.pushState({}, '', '/patients');
      return;
    }
    if (page === 'emr') {
      const path = emrSwitchId ? `/emr/${encodeURIComponent(emrSwitchId)}` : '/emr';
      window.history.pushState({}, '', path);
      return;
    }
    window.history.pushState({}, '', '/');
  };

  const openEmrForPatient = (switchId: string) => {
    setCurrentPage('emr');
    setEmrSwitchId(switchId);
    window.history.pushState({}, '', `/emr/${encodeURIComponent(switchId)}`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'patient-identity':
        return <PatientIdentityPage />;
      case 'patients':
        return <PatientsPage onOpenPatientEmr={openEmrForPatient} />;
      case 'emr':
        return <EMRPage patientSwitchId={emrSwitchId ?? undefined} onBackToPatients={() => window.history.length > 1 ? window.history.back() : navigateToPage('patients')} />;
      case 'telemedicine':
        return <TelemedicinePage />;
      case 'ai-clinical-intelligence':
        return <AIClinicalIntelligencePage />;
      case 'switch-network':
        return <SwitchNetworkPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'laboratory':
        return <LaboratoryPage />;
      case 'pharmacy':
        return <PharmacyPage />;
      case 'billing':
        return <BillingPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'human-resources':
        return <HumanResourcesPage />;
      case 'administration':
        return <AdministrationPage />;
      case 'subscription':
        return <SubscriptionPage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'patient-identity':
        return 'Digital Health Identity';
      case 'patients':
        return 'Patient Management';
      case 'emr':
        return 'Electronic Medical Records';
      case 'telemedicine':
        return 'Telemedicine';
      case 'ai-clinical-intelligence':
        return 'AI Clinical Intelligence';
      case 'switch-network':
        return 'Switch Network';
      case 'appointments':
        return 'Appointments';
      case 'laboratory':
        return 'Laboratory';
      case 'pharmacy':
        return 'Pharmacy';
      case 'billing':
        return 'Billing & Insurance';
      case 'analytics':
        return 'Analytics';
      case 'human-resources':
        return 'Human Resources';
      case 'administration':
        return 'Administration';
      case 'subscription':
        return 'Subscription & Billing';
      case 'audit-logs':
        return 'Security & Audit';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <ResponsiveProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <div className="app-shell flex h-screen overflow-hidden">
            <Sidebar 
              currentPage={currentPage} 
              onPageChange={(page) => navigateToPage(page as PageType)}
            />
            
            <div className="flex-1 flex flex-col min-w-0 relative">
              <Header 
                title={getPageTitle()} 
                onAIClick={() => setGuliaPanelOpen(!guliaPanelOpen)}
                onPageChange={(page) => navigateToPage(page as PageType)}
              />
              
              <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition">
                <div className="max-w-7xl mx-auto">
                  {renderPage()}
                </div>
              </main>
            </div>

            <GuliaAIPanel 
              isOpen={guliaPanelOpen} 
              onClose={() => setGuliaPanelOpen(false)} 
            />
            
            <AIFloatingButton onClick={() => setGuliaPanelOpen(!guliaPanelOpen)} />
            <Toaster position="top-right" />
          </div>
        </SubscriptionProvider>
      </AuthProvider>
    </ResponsiveProvider>
  );
}

export default App;
