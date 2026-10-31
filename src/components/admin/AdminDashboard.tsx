import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Box, 
  Calendar, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Truck,
  Plus,
  MapPin
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { PRODUCTION_STAGES_CONFIG } from '../../data/mockData';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenNewSale: () => void;
  onOpenNewContainer: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenNewSale,
  onOpenNewContainer,
}) => {
  const { stats, sales, cashFlow, collaborators } = useModBox();

  const upcomingMontagens = sales
    .filter(s => s.status !== 'concluido' && s.status !== 'orcamento')
    .sort((a, b) => new Date(a.schedule.scheduledDate).getTime() - new Date(b.schedule.scheduledDate).getTime())
    .slice(0, 4);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-dark-850 border border-gold-500/30 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-500 font-bold text-xs tracking-wider uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              Painel Executivo de Gestão
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Visão Geral da ModBox
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Acompanhamento integrado de produção, montagens em campo, colaboradores e gestão de caixa em tempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenNewSale}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nova Venda</span>
            </button>
            <button
              onClick={onOpenNewContainer}
              className="flex items-center gap-2 bg-dark-800 hover:bg-dark-750 text-gold-500 border border-gold-500/40 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all"
            >
              <Box className="w-4 h-4" />
              <span>Cadastrar Contêiner</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Total */}
        <div className="bg-dark-850 border border-gold-500/30 rounded-2xl p-5 hover:border-gold-500 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Receita Realizada</span>
            <div className="p-2.5 rounded-xl bg-gold-500/15 text-gold-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {formatCurrency(stats.totalRevenue)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>Fluxo de entrada positivo</span>
          </div>
        </div>

        {/* Custos Operacionais */}
        <div className="bg-dark-850 border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Custos & Produção</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {formatCurrency(stats.totalCosts)}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Aço corten, isolamento, montagem e fretes
          </div>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-dark-850 border border-gold-500/40 rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-wider">Lucro Líquido</span>
            <div className="p-2.5 rounded-xl bg-gold-500/15 text-gold-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-gold-500 font-mono">
              {formatCurrency(stats.netProfit)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-300 font-medium">
            <span className="bg-gold-500/20 text-gold-500 px-2 py-0.5 rounded text-[11px] font-bold border border-gold-500/30">
              {stats.profitMargin.toFixed(1)}% Margem
            </span>
            <span>sobre faturamento</span>
          </div>
        </div>

        {/* Contêineres em Andamento */}
        <div className="bg-dark-850 border border-white/5 rounded-2xl p-5 hover:border-gold-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Obras & Produção</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Box className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.activeProductionCount}
            </span>
            <span className="text-xs text-gray-400">em andamento</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{stats.scheduledMontagensCount} montagens agendadas</span>
            <span className="text-emerald-400 font-medium">{stats.completedCount} entregues</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Upcoming Field Assemblies vs Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Próximas Montagens em Campo */}
        <div className="lg:col-span-2 bg-dark-850 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gold-500/15 text-gold-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Próximas Instalações & Montagens em Campo</h3>
                <p className="text-xs text-gray-400">Agendamentos com hora, dia e equipe de colaboradores</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs text-gold-500 hover:text-gold-400 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingMontagens.map(sale => {
              const assignedCols = collaborators.filter(c => sale.assignedCollaboratorIds.includes(c.id));
              const isUrgent = sale.schedule.scheduledDate === new Date().toISOString().split('T')[0] || sale.status === 'montagem_local';

              return (
                <div
                  key={sale.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUrgent 
                      ? 'bg-dark-800 border-gold-500' 
                      : 'bg-dark-900 border-white/5 hover:border-gold-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-gold-500 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30">
                          {sale.orderNumber}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {sale.containerName}
                        </span>
                        {isUrgent && (
                          <span className="bg-gold-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Em Instalação Hoje / Prioridade
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 font-medium">
                        Cliente: <span className="text-white">{sale.client.name}</span>
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{sale.installationAddress.street}, {sale.installationAddress.number} - {sale.installationAddress.city}/{sale.installationAddress.state}</span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      <div className="text-right">
                        <div className="text-xs text-gold-500 font-bold flex items-center gap-1 sm:justify-end">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(sale.schedule.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')} às {sale.schedule.scheduledTime}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          Equipe: {assignedCols.map(c => c.name.split(' ')[0]).join(', ') || 'A definir'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Mini Pipeline Stage Count & Quick RH Status */}
        <div className="space-y-6">
          {/* Status Pipeline Count */}
          <div className="bg-dark-850 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-500" />
                <span>Status da Linha de Fabricação</span>
              </h3>
              <button
                onClick={() => onNavigate('pipeline')}
                className="text-xs text-gold-500 hover:underline font-bold"
              >
                Ver Kanban
              </button>
            </div>

            <div className="space-y-2">
              {PRODUCTION_STAGES_CONFIG.slice(1, 8).map(stage => {
                const count = sales.filter(s => s.status === stage.id).length;
                return (
                  <div key={stage.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-dark-800 transition-colors">
                    <span className="text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                      {stage.label}
                    </span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      count > 0 ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-gray-500'
                    }`}>
                      {count} {count === 1 ? 'unidade' : 'unidades'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Collaborator Summary */}
          <div className="bg-dark-850 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-gold-500" />
                <span>Equipe de Campo Ativa</span>
              </h3>
              <button
                onClick={() => onNavigate('collaborators')}
                className="text-xs text-gold-500 hover:underline font-bold"
              >
                Gerenciar RH
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {collaborators.slice(0, 4).map(col => (
                <div key={col.id} className="flex items-center justify-between text-xs py-1">
                  <div>
                    <span className="font-medium text-white block">{col.name}</span>
                    <span className="text-[10px] text-gray-400">{col.role}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    col.status === 'em_montagem'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {col.status === 'em_montagem' ? 'Em Obra' : 'Disponível'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
