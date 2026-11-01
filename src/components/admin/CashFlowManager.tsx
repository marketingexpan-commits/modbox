import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar, 
  Trash2, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { CashFlowEntry, CashFlowType, CashFlowCategory } from '../../types';
import { Modal } from '../common/Modal';

type PeriodOption = 'mes_atual' | 'mes_anterior' | 'ano_atual' | 'tudo';

const PERIOD_LABELS: Record<PeriodOption, string> = {
  mes_atual: 'Outubro / 2026',
  mes_anterior: 'Setembro / 2026',
  ano_atual: 'Ano 2026',
  tudo: 'Acumulado Geral'
};

export const CashFlowManager: React.FC = () => {
  const { cashFlow, addCashFlowEntry, deleteCashFlowEntry, stats, sales } = useModBox();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('mes_atual');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'receita' | 'despesa' | 'obras'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState<CashFlowType>('receita');
  const [category, setCategory] = useState<CashFlowCategory>('venda_conteiner');
  const [amount, setAmount] = useState<number>(5000);
  const [description, setDescription] = useState('');
  const [clientOrSupplier, setClientOrSupplier] = useState('');
  const [saleOrderId, setSaleOrderId] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSale = sales.find(s => s.id === saleOrderId);
    addCashFlowEntry({
      type,
      category,
      amount: Number(amount),
      description,
      clientOrSupplier: clientOrSupplier || (selectedSale ? selectedSale.client.name : undefined),
      saleOrderId: saleOrderId || undefined,
      date
    });
    setDescription('');
    setClientOrSupplier('');
    setSaleOrderId('');
    setAmount(1000);
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Filtra as entradas do fluxo de caixa de acordo com o período selecionado
  const periodCashFlow = useMemo(() => {
    if (selectedPeriod === 'mes_atual') {
      return cashFlow.filter(c => c.date.startsWith('2026-10'));
    }
    if (selectedPeriod === 'mes_anterior') {
      return cashFlow.filter(c => c.date.startsWith('2026-09'));
    }
    if (selectedPeriod === 'ano_atual') {
      return cashFlow.filter(c => c.date.startsWith('2026'));
    }
    return cashFlow; // 'tudo'
  }, [cashFlow, selectedPeriod]);

  // Estatísticas calculadas dinamicamente para o período escolhido
  const periodStats = useMemo(() => {
    const revenue = periodCashFlow
      .filter(item => item.type === 'receita')
      .reduce((sum, item) => sum + item.amount, 0);

    const costs = periodCashFlow
      .filter(item => item.type === 'despesa')
      .reduce((sum, item) => sum + item.amount, 0);

    const profit = revenue - costs;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      revenue,
      costs,
      profit,
      margin
    };
  }, [periodCashFlow]);

  // Group monthly data for comparison chart with real October values
  const monthlyData = useMemo(() => {
    const octRevenue = cashFlow.filter(c => c.date.startsWith('2026-10') && c.type === 'receita').reduce((s, c) => s + c.amount, 0);
    const octCosts = cashFlow.filter(c => c.date.startsWith('2026-10') && c.type === 'despesa').reduce((s, c) => s + c.amount, 0);

    return [
      { month: 'Agosto/26', receita: 65000, custo: 38000, lucro: 27000 },
      { month: 'Setembro/26', receita: 112000, custo: 68000, lucro: 44000 },
      { month: 'Outubro/26', receita: octRevenue, custo: octCosts, lucro: octRevenue - octCosts },
    ];
  }, [cashFlow]);

  // Group costs by category for the active period
  const costCategories = useMemo(() => {
    return periodCashFlow
      .filter(item => item.type === 'despesa')
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [periodCashFlow]);

  const categoryLabels: Record<string, string> = {
    venda_conteiner: 'Venda de Produtos (Modular / Cobertura / Estrutura)',
    locacao: 'Locação de Módulos',
    materia_prima: 'Aço Corten / Matéria-Prima',
    serralheria: 'Perfis e Serralheria',
    eletrica_hidraulica: 'Elétrica & Hidráulica',
    mao_de_obra_montagem: 'Mão de Obra de Montagem',
    transporte_munck: 'Frete e Caminhão Munck',
    administrativo: 'Administrativo & Impostos',
    outros: 'Outros Custos',
  };

  const filteredEntries = periodCashFlow.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.clientOrSupplier && item.clientOrSupplier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'todos' 
      ? true 
      : typeFilter === 'obras' 
        ? Boolean(item.saleOrderId) 
        : item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-4 sm:p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Gestão Financeira & Controladoria</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Gestão Financeira</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Acompanhe receitas de produtos vendidos, custos com insumos industriais e lucro líquido.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Lançar Movimentação</span>
        </button>
      </div>

      {/* Period Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-dark-850 p-3 sm:p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gold-500 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Período Financeiro:
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-gold-500/15 text-gold-400 border border-gold-500/30">
            {PERIOD_LABELS[selectedPeriod]}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedPeriod('mes_atual')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedPeriod === 'mes_atual' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Este Mês (Out/26)
          </button>
          <button
            onClick={() => setSelectedPeriod('mes_anterior')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedPeriod === 'mes_anterior' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Mês Anterior (Set/26)
          </button>
          <button
            onClick={() => setSelectedPeriod('ano_atual')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedPeriod === 'ano_atual' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Ano 2026
          </button>
          <button
            onClick={() => setSelectedPeriod('tudo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedPeriod === 'tudo' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Todo o Histórico
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Receita Total */}
        <div className="bg-dark-850 border border-gold-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div>
              <span className="font-semibold uppercase tracking-wider block">Receitas Totais</span>
              <span className="text-[10px] text-gold-400 font-mono font-semibold">({PERIOD_LABELS[selectedPeriod]})</span>
            </div>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
            {formatCurrency(periodStats.revenue)}
          </div>
          <span className="text-xs text-emerald-400 mt-1 block font-medium">
            Entradas de vendas e parcelas
          </span>
        </div>

        {/* Custos Operacionais */}
        <div className="bg-dark-850 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div>
              <span className="font-semibold uppercase tracking-wider block">Custos & Despesas</span>
              <span className="text-[10px] text-rose-400 font-mono font-semibold">({PERIOD_LABELS[selectedPeriod]})</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
            {formatCurrency(periodStats.costs)}
          </div>
          <span className="text-xs text-gray-400 mt-1 block font-medium">
            Matéria-prima, montagem e fretes
          </span>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-dark-850 border border-gold-500/40 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-gold-400">
            <div>
              <span className="font-bold uppercase tracking-wider block">Resultado Líquido</span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">({PERIOD_LABELS[selectedPeriod]})</span>
            </div>
            <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gold-400 font-mono mt-2">
            {formatCurrency(periodStats.profit)}
          </div>
          <span className="text-xs text-gold-300 mt-1 block font-semibold">
            Margem Bruta de {periodStats.margin.toFixed(1)}% sobre faturamento
          </span>
        </div>
      </div>

      {/* Interactive Financial Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Comparison Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-dark-850 border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Evolução Mensal: Receitas vs Custos vs Lucro</h3>
                <p className="text-xs text-gray-400">Desempenho financeiro dos últimos meses</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gold-500"></span>
                <span className="text-gray-300">Receita</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500"></span>
                <span className="text-gray-300">Custo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="text-gray-300">Lucro</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 space-y-6">
            {monthlyData.map((data, idx) => {
              const maxVal = Math.max(...monthlyData.map(d => d.receita)) * 1.15;
              const recPct = (data.receita / maxVal) * 100;
              const cusPct = (data.custo / maxVal) * 100;
              const lucPct = (data.lucro / maxVal) * 100;

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white">{data.month}</span>
                    <span className="font-mono text-gold-400">Lucro: {formatCurrency(data.lucro)}</span>
                  </div>

                  <div className="space-y-1 bg-dark-900 p-2.5 rounded-xl border border-white/5">
                    {/* Receita bar */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-16 text-gray-400">Receita:</span>
                      <div className="flex-1 bg-dark-800 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gold-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${recPct}%` }}
                        />
                      </div>
                      <span className="w-24 text-right font-mono text-gold-300 font-bold">
                        {formatCurrency(data.receita)}
                      </span>
                    </div>

                    {/* Custo bar */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-16 text-gray-400">Custo:</span>
                      <div className="flex-1 bg-dark-800 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${cusPct}%` }}
                        />
                      </div>
                      <span className="w-24 text-right font-mono text-rose-300 font-bold">
                        {formatCurrency(data.custo)}
                      </span>
                    </div>

                    {/* Lucro bar */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-16 text-gray-400">Lucro:</span>
                      <div className="flex-1 bg-dark-800 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${lucPct}%` }}
                        />
                      </div>
                      <span className="w-24 text-right font-mono text-emerald-300 font-bold">
                        {formatCurrency(data.lucro)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost Distribution by Category (1 col) */}
        <div className="bg-dark-850 border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Custos por Categoria</h3>
              <p className="text-xs text-gray-400">Distribuição dos insumos produtivos</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(costCategories).map(([catKey, val]) => {
              const totalCostVal = stats.totalCosts || 1;
              const pct = ((val / totalCostVal) * 100).toFixed(1);
              const label = categoryLabels[catKey] || catKey;

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 truncate max-w-[170px]" title={label}>
                      {label}
                    </span>
                    <span className="font-mono text-white font-bold">{formatCurrency(val)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-gold-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-dark-850 border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Extrato de Movimentações Financeiras</h3>
            <p className="text-xs text-gray-400">Lançamentos de vendas, compras de matéria-prima e pagamentos</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar movimentação..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-dark-950 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setTypeFilter('todos')}
                className={`px-2.5 py-1 rounded-lg ${typeFilter === 'todos' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setTypeFilter('receita')}
                className={`px-2.5 py-1 rounded-lg ${typeFilter === 'receita' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Receitas
              </button>
              <button
                onClick={() => setTypeFilter('despesa')}
                className={`px-2.5 py-1 rounded-lg ${typeFilter === 'despesa' ? 'bg-rose-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Despesas
              </button>
              <button
                onClick={() => setTypeFilter('obras')}
                className={`px-2.5 py-1 rounded-lg ${typeFilter === 'obras' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Custos de Obras ({cashFlow.filter(c => Boolean(c.saleOrderId)).length})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Data</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Descrição</th>
                <th className="py-3 px-3">Cliente / Fornecedor</th>
                <th className="py-3 px-3 text-right">Valor</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-dark-800 transition-colors">
                  <td className="py-3 px-3 font-mono text-gray-300">
                    {new Date(entry.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      entry.type === 'receita'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    {categoryLabels[entry.category] || entry.category}
                  </td>
                  <td className="py-3 px-3 text-white font-medium max-w-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {entry.saleOrderId && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gold-500/15 text-gold-400 border border-gold-500/30 whitespace-nowrap">
                          Obra
                        </span>
                      )}
                      <span className="truncate">{entry.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-400">
                    {entry.clientOrSupplier || '—'}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono font-bold text-sm ${
                    entry.type === 'receita' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {entry.type === 'receita' ? '+' : '-'} {formatCurrency(entry.amount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm('Excluir este lançamento financeiro?')) {
                          deleteCashFlowEntry(entry.id);
                        }
                      }}
                      className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançar Caixa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Lançamento Financeiro"
        subtitle="Registre uma nova receita ou despesa de produção"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Tipo de Movimentação *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('receita')}
                className={`py-2 rounded-xl font-bold transition-all ${
                  type === 'receita' ? 'bg-emerald-500 text-black shadow-sm' : 'bg-dark-950 text-gray-400 border border-white/5'
                }`}
              >
                + Entrada / Receita
              </button>
              <button
                type="button"
                onClick={() => setType('despesa')}
                className={`py-2 rounded-xl font-bold transition-all ${
                  type === 'despesa' ? 'bg-rose-500 text-white shadow-sm' : 'bg-dark-950 text-gray-400 border border-white/5'
                }`}
              >
                - Saída / Despesa
              </button>
            </div>
          </div>

          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Categoria *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CashFlowCategory)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 cursor-pointer text-xs"
            >
              {type === 'receita' ? (
                <>
                  <option value="venda_conteiner">Venda de Produto (Modular / Cobertura / Estrutura)</option>
                  <option value="locacao">Locação de Módulos</option>
                  <option value="outros">Outras Receitas</option>
                </>
              ) : (
                <>
                  <option value="materia_prima">Aço Corten / Matéria-Prima</option>
                  <option value="serralheria">Serralheria & Perfis Metálicos</option>
                  <option value="eletrica_hidraulica">Elétrica & Hidráulica</option>
                  <option value="mao_de_obra_montagem">Mão de Obra de Montagem</option>
                  <option value="transporte_munck">Frete e Caminhão Munck</option>
                  <option value="administrativo">Administrativo & Impostos</option>
                  <option value="outros">Outros Custos</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="text-gold-400 block mb-1 font-semibold">Valor (R$) *</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full bg-dark-950 border border-gold-500/40 rounded-xl px-3 py-2 text-gold-300 font-mono font-bold text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Descrição do Lançamento *</label>
            <input
              type="text"
              required
              placeholder="Ex: Aquisição de perfis galvanizados 50x50"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xs"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Vincular a uma Obra / Pedido (Opcional)</label>
            <select
              value={saleOrderId}
              onChange={e => {
                setSaleOrderId(e.target.value);
                const s = sales.find(sl => sl.id === e.target.value);
                if (s && !clientOrSupplier) {
                  setClientOrSupplier(s.client.name);
                }
              }}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 cursor-pointer text-xs"
            >
              <option value="">Nenhuma Obra (Despesa / Receita Geral da Empresa)</option>
              {sales.map(s => (
                <option key={s.id} value={s.id}>
                  {s.orderNumber} — {s.client.name} ({s.containerName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Cliente / Fornecedor</label>
            <input
              type="text"
              placeholder="Ex: AçoForte Distribuidora"
              value={clientOrSupplier}
              onChange={e => setClientOrSupplier(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xs"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Data da Movimentação *</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-black font-bold px-5 py-2 rounded-xl transition-all"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>Confirmar Lançamento</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
