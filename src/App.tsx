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
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { WelcomeScreen } from './components/common/WelcomeScreen';
import { LoginScreen } from './components/common/LoginScreen';

const MainApp: React.FC = () => {
  const { role, setRole, setActiveCollaboratorId, setActiveAdminId } = useModBox();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMode, setLoginMode] = useState<'colaborador' | 'admin' | null>(null);

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
            setCurrentTab(r === 'admin' ? 'dashboard' : 'agenda');
            setLoginMode(null);
            setLoggedIn(true);
          }}
        />
      );
    }
    return <WelcomeScreen onEnter={(r) => setLoginMode(r)} />;
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col selection:bg-gold-500 selection:text-black">
      {/* Top Header with Prominent Central Gold ModBox Logo */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={() => setLoggedIn(false)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {role === 'admin' ? (
          <>
            {currentTab === 'dashboard' && (
              <AdminDashboard
                onNavigate={setCurrentTab}
                onOpenNewSale={() => setCurrentTab('sales')}
                onOpenNewContainer={() => setCurrentTab('containers')}
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
      <MainApp />
    </ModBoxProvider>
  );
};

export default App;

