import React from 'react';
import {
  Clock,
  UserCheck,
  LogOut,
  LayoutDashboard,
  Package,
  ClipboardList,
  Factory,
  Wallet,
  Users,
  CalendarDays,
  Ruler,
  ShieldCheck
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onLogout }) => {
  const {
    role,
    collaborators,
    activeCollaboratorId,
    setActiveCollaboratorId,
    admins,
    activeAdminId
  } = useModBox();

  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative bg-dark-900 border-b border-gold-500/30 border-t-2 border-t-gold-500 pt-3 sm:pt-4 pb-3 px-3 sm:px-6 shadow-lg z-40">
      {/* Top Utility Bar: Role Switcher & Status */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 pb-3 mb-2 border-b border-white/5 text-xs w-full">
        {/* Left: System Status & Time */}
        <div className="flex items-center gap-4 text-gray-400">
          <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-gold-500" />
            <span className="capitalize">{currentTime}</span>
          </div>
        </div>

        {/* Right: Utilities */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full md:w-auto">

          {/* Usuário logado */}
          {role === 'colaborador' && (
            <div className="flex items-center gap-1.5 bg-dark-850 px-3 py-1.5 rounded-xl border border-gold-500/30">
              <UserCheck className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-white text-xs font-semibold truncate max-w-[180px]">
                {collaborators.find(c => c.id === activeCollaboratorId)?.name ?? 'Colaborador'}
              </span>
            </div>
          )}

          {role === 'admin' && (
            <div className="flex items-center gap-1.5 bg-dark-850 px-3 py-1.5 rounded-xl border border-gold-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-white text-xs font-semibold truncate max-w-[180px]">
                {admins.find(a => a.id === activeAdminId)?.name ?? 'Administrador'}
              </span>
            </div>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              title="Sair"
              aria-label="Sair"
              className="p-2 sm:p-1.5 text-gray-400 hover:text-gold-500 hover:bg-dark-850 rounded-lg border border-transparent hover:border-gold-500/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* CENTRAL LOGO SECTION (CRISP, SHARP, SOLID GOLD, ZERO BLUR) */}
      <div className="flex flex-col items-center justify-center my-2 sm:my-3 text-center">
        <div
          className="cursor-pointer"
          onClick={() => setCurrentTab(role === 'admin' ? 'dashboard' : 'agenda')}
        >
          <img
            src="/modbox_logo_dourado.png"
            alt="ModBox Contêineres Modernos e Coberturas Metálicas"
            className="h-12 sm:h-20 md:h-24 max-w-full w-auto object-contain block mx-auto"
            style={{ imageRendering: 'auto' }}
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-7xl w-full mx-auto mt-3 sm:mt-4">
        {role === 'admin' ? (
          <nav className="flex items-center lg:justify-start gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
            {[
              { id: 'dashboard', label: 'Geral', icon: LayoutDashboard },
              { id: 'agenda', label: 'Agenda & Obras', icon: CalendarDays },
              { id: 'sales', label: 'Vendas & Pedidos', icon: ClipboardList },
              { id: 'pipeline', label: 'Status & Produção', icon: Factory },
              { id: 'containers', label: 'Catálogo', icon: Package },
              { id: 'cashflow', label: 'Financeiro', icon: Wallet },
              { id: 'collaborators', label: 'Colaboradores', icon: Users },
              { id: 'admins', label: 'Gestores', icon: ShieldCheck },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 snap-start ${currentTab === tab.id
                    ? 'bg-gold-500 text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-dark-850'
                  }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        ) : (
          <nav className="flex items-center lg:justify-start gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
            {[
              { id: 'agenda', label: 'Agenda de Montagens', icon: CalendarDays },
              { id: 'pipeline', label: 'Status dos Processos', icon: Factory },
              { id: 'containers', label: 'Catálogo', icon: Ruler },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 snap-start ${currentTab === tab.id
                    ? 'bg-gold-500 text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-dark-850'
                  }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};


