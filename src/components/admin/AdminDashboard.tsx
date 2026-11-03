import React, { useState, useMemo } from 'react';
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
  MapPin,
  Filter,
  Coins,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { PRODUCTION_STAGES_CONFIG } from '../../data/mockData';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenNewSale: () => void;
  onOpenNewContainer: () => void;
}

type PeriodMode = 'mes' | 'ano' | 'tudo';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenNewSale,
  onOpenNewContainer,
}) => {
  const { stats, sales, cashFlow, collaborators } = useModBox();
  const [periodMode, setPeriodMode] = useState<PeriodMode>('mes');
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());

  const handlePrevPeriod = () => {
    if (periodMode === 'ano') {
      setSelectedYear(prev => prev - 1);
    } else {
      setPeriodMode('mes');
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(prev => prev - 1);
      } else {
        setSelectedMonth(prev => prev - 1);
      }
    }
  };

  const handleNextPeriod = () => {
    if (periodMode === 'ano') {
      setSelectedYear(prev => prev + 1);
    } else {
      setPeriodMode('mes');
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(prev => prev + 1);
      } else {
        setSelectedMonth(prev => prev + 1);
      }
    }
  };

  const handleGoToCurrentMonth = () => {
    const now = new Date();
    setPeriodMode('mes');
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
  };

  const activePeriodLabel = useMemo(() => {
    if (periodMode === 'mes') {
      return `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
    }
    if (periodMode === 'ano') {
      return `Ano ${selectedYear}`;
    }
    return 'Todo o Histórico';
  }, [periodMode, selectedMonth, selectedYear]);

  // Filtra as entradas do fluxo de caixa de acordo com o período selecionado
  const filteredCashFlow = useMemo(() => {
    if (periodMode === 'mes') {
      const monthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      return cashFlow.filter(c => c.date.startsWith(monthPrefix));
    }
    if (periodMode === 'ano') {
      const yearPrefix = `${selectedYear}`;
      return cashFlow.filter(c => c.date.startsWith(yearPrefix));
    }
    return cashFlow; // 'tudo'
  }, [cashFlow, periodMode, selectedMonth, selectedYear]);

  // Estatísticas calculadas dinamicamente para o período escolhido
  const periodStats = useMemo(() => {
    const revenue = filteredCashFlow
      .filter(item => item.type === 'receita')
      .reduce((sum, item) => sum + item.amount, 0);

    const projectCostsList = filteredCashFlow.filter(item => item.type === 'despesa' && !!item.saleOrderId);
    const generalExpensesList = filteredCashFlow.filter(item => item.type === 'despesa' && !item.saleOrderId);

    const projectCosts = projectCostsList.reduce((sum, item) => sum + item.amount, 0);
    const generalExpenses = generalExpensesList.reduce((sum, item) => sum + item.amount, 0);
    const costs = projectCosts + generalExpenses;

    const profit = revenue - costs;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      revenue,
      projectCosts,
      projectCostsCount: projectCostsList.length,
      generalExpenses,
      generalExpensesCount: generalExpensesList.length,
      costs,
      profit,
      margin,
      entriesCount: filteredCashFlow.length
    };
  }, [filteredCashFlow]);

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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Painel de Gestão
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Resumo da operação e do caixa em tempo real.
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
              <span>Cadastrar Produtos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Period Selector Bar (Navegador de Mês e Ano estilo Agenda) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-dark-850 p-3 sm:p-4 rounded-2xl border border-white/5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 mr-1">
            <Calendar className="w-4 h-4 text-gold-500 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Período Financeiro:
            </span>
          </div>

          {/* Seletor com Setas < Mês/Ano > */}
          <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={handlePrevPeriod}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors cursor-pointer"
              title={periodMode === 'ano' ? 'Ano Anterior' : 'Mês Anterior'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 text-xs sm:text-sm font-bold text-gold-400 min-w-[140px] text-center font-mono">
              {activePeriodLabel}
            </div>
            <button
              onClick={handleNextPeriod}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors cursor-pointer"
              title={periodMode === 'ano' ? 'Próximo Ano' : 'Próximo Mês'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleGoToCurrentMonth}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-dark-800 hover:bg-dark-750 text-gold-400 border border-gold-500/20 transition-all cursor-pointer"
          >
            Mês Atual
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setPeriodMode('mes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              periodMode === 'mes' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Por Mês ({MONTH_NAMES[selectedMonth].slice(0, 3)}/{String(selectedYear).slice(-2)})
          </button>
          <button
            onClick={() => setPeriodMode('ano')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              periodMode === 'ano' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Ano {selectedYear}
          </button>
          <button
            onClick={() => setPeriodMode('tudo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              periodMode === 'tudo' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Todo o Histórico
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Receita Total */}
        <div className="bg-dark-850 border border-gold-500/30 rounded-2xl p-4 sm:p-5 hover:border-gold-500 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Receita Realizada</span>
              <span className="text-[10px] text-gold-400 font-mono font-semibold">({activePeriodLabel})</span>
            </div>
            <div className="p-2 rounded-xl bg-gold-500/15 text-gold-500">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {formatCurrency(periodStats.revenue)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Fluxo de entrada positivo</span>
          </div>
        </div>

        {/* Custos de Obras & Produção */}
        <div className="bg-dark-850 border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-white/15 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Custos de Obras</span>
              <span className="text-[10px] text-rose-400 font-mono font-semibold">({activePeriodLabel})</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {formatCurrency(periodStats.projectCosts)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            Vinculados a obras ({periodStats.projectCostsCount} {periodStats.projectCostsCount === 1 ? 'item' : 'itens'})
          </div>
        </div>

        {/* Gastos Extras & Despesas Gerais (Sem Obra Específica) */}
        <div className="bg-dark-850 border border-amber-500/25 rounded-2xl p-4 sm:p-5 hover:border-amber-500/50 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">Extras & Outros Gastos</span>
              <span className="text-[10px] text-amber-300/80 font-mono font-semibold">({activePeriodLabel})</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
              {formatCurrency(periodStats.generalExpenses)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            Extras, salários e fixos ({periodStats.generalExpensesCount} {periodStats.generalExpensesCount === 1 ? 'lançamento' : 'lançamentos'})
          </div>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-dark-850 border border-gold-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gold-500 uppercase tracking-wider block">Lucro Líquido</span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">({activePeriodLabel})</span>
            </div>
            <div className="p-2 rounded-xl bg-gold-500/15 text-gold-500">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-gold-500 font-mono">
              {formatCurrency(periodStats.profit)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-300 font-medium">
            <span className="bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded text-[10px] font-bold border border-gold-500/30">
              {periodStats.margin.toFixed(1)}% Margem
            </span>
            <span>sobre faturamento</span>
          </div>
        </div>

        {/* Obras & Produção em Andamento */}
        <div className="bg-dark-850 border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-gold-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Obras & Produção</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Box className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {stats.activeProductionCount}
            </span>
            <span className="text-xs text-gray-400">em andamento</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
            <span>{stats.scheduledMontagensCount} agendadas</span>
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
              onClick={() => onNavigate('agenda')}
              className="text-xs text-gold-500 hover:text-gold-400 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Abrir Agenda</span>
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
              {PRODUCTION_STAGES_CONFIG.slice(1, 7).map(stage => {
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

