import React, { useState } from 'react';
import { ModBoxProvider, useModBox } from './context/ModBoxContext';
import { Header } from './components/common/Header';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ContainersManager } from './components/admin/ContainersManager';
import { SalesManager } from './components/admin/SalesManager';
import { CashFlowManager } from './components/admin/CashFlowManager';
import { CollaboratorsManager } from './components/admin/CollaboratorsManager';
import { ProductionPipeline } from './components/admin/ProductionPipeline';
import { AdminsManager } from './components/admin/AdminsManager';
import { ScheduleCalendar } from './components/admin/ScheduleCalendar';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { WelcomeScreen } from './components/common/WelcomeScreen';
import { LoginScreen } from './components/common/LoginScreen';
import { UpdateBanner } from './components/common/UpdateBanner';

const SESSION_STORAGE_KEY = 'modbox_auth_session_v1';

const getInitialSession = () => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.loggedIn) {
        return parsed;
      }
    }
  } catch {}
  return null;
};

const MainApp: React.FC = () => {
  const { role, setRole, setActiveCollaboratorId, setActiveAdminId } = useModBox();
  const initialSession = getInitialSession();
  const [loggedIn, setLoggedIn] = useState<boolean>(() => Boolean(initialSession?.loggedIn));
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const savedTab = initialSession?.currentTab;
    if (savedTab === 'finance') return 'cashflow';
    return savedTab || (initialSession?.role === 'colaborador' ? 'agenda' : 'dashboard');
  });
  const [loginMode, setLoginMode] = useState<'colaborador' | 'admin' | null>(null);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.currentTab = tab;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {}
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setLoginMode(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {}
  };

  if (!loggedIn) {
    if (loginMode) {
      return (
        <LoginScreen
          mode={loginMode}
          onBack={() => setLoginMode(null)}
          onSuccess={(r, userId) => {
            setRole(r);
            if (r === 'colaborador') setActiveCollaboratorId(userId ?? null);
            if (r === 'admin') setActiveAdminId(userId ?? null);
            const tab = r === 'admin' ? 'dashboard' : 'agenda';
            setCurrentTab(tab);
            setLoginMode(null);
            setLoggedIn(true);
            try {
              localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
                loggedIn: true,
                role: r,
                userId: userId ?? null,
                currentTab: tab
              }));
            } catch {}
          }}
        />
      );
    }
    return <WelcomeScreen onEnter={(r) => setLoginMode(r)} />;
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col selection:bg-gold-500 selection:text-black">
      {/* Top Header with Prominent Central Gold ModBox Logo */}
      <Header currentTab={currentTab} setCurrentTab={handleNavigate} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {role === 'admin' ? (
          <>
            {currentTab === 'dashboard' && (
              <AdminDashboard
                onNavigate={handleNavigate}
                onOpenNewSale={() => handleNavigate('sales')}
                onOpenNewContainer={() => handleNavigate('containers')}
              />
            )}
            {currentTab === 'agenda' && (
              <ScheduleCalendar 
                onNavigateToSale={() => handleNavigate('sales')}
                onOpenNewSale={() => handleNavigate('sales')}
              />
            )}
            {currentTab === 'containers' && <ContainersManager />}
            {currentTab === 'sales' && <SalesManager />}
            {currentTab === 'pipeline' && <ProductionPipeline />}
            {currentTab === 'cashflow' && <CashFlowManager />}
            {currentTab === 'collaborators' && <CollaboratorsManager />}
            {currentTab === 'admins' && <AdminsManager />}
          </>
        ) : (
          <>
            {currentTab === 'agenda' && <EmployeeDashboard />}
            {currentTab === 'pipeline' && <ProductionPipeline />}
            {currentTab === 'containers' && <ContainersManager readOnly />}
          </>
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-white/5 bg-dark-900 py-6 px-4 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
          <span className="text-gray-400 font-semibold tracking-wider uppercase text-[11px]">
            ModBox Contêineres Modernos e Coberturas Metálicas
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ModBoxProvider>
      <UpdateBanner />
      <MainApp />
    </ModBoxProvider>
  );
};

export default App;

