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
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Printer
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { CashFlowEntry, CashFlowType, CashFlowCategory } from '../../types';
import { Modal } from '../common/Modal';

type PeriodMode = 'mes' | 'ano' | 'tudo';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const CashFlowManager: React.FC = () => {
  const { cashFlow, addCashFlowEntry, deleteCashFlowEntry, stats, sales } = useModBox();

  const [searchTerm, setSearchTerm] = useState('');
  const [periodMode, setPeriodMode] = useState<PeriodMode>('mes');
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const [typeFilter, setTypeFilter] = useState<'todos' | 'receita' | 'despesa' | 'obras'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Group monthly data for comparison chart based on selected month/year
  const monthlyData = useMemo(() => {
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return [-2, -1, 0].map(offset => {
      const d = new Date(selectedYear, selectedMonth + offset, 1);
      const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = capitalize(d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')) + '/' + String(d.getFullYear()).slice(-2);

      const receita = cashFlow
        .filter(c => c.date.startsWith(prefix) && c.type === 'receita')
        .reduce((s, c) => s + c.amount, 0);
      const custo = cashFlow
        .filter(c => c.date.startsWith(prefix) && c.type === 'despesa')
        .reduce((s, c) => s + c.amount, 0);

      return {
        month: monthLabel,
        receita,
        custo,
        lucro: receita - custo
      };
    });
  }, [cashFlow, selectedYear, selectedMonth]);

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

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita pop-ups no navegador para gerar o PDF de impressão.');
      return;
    }

    const totalReceitas = filteredEntries
      .filter(e => e.type === 'receita')
      .reduce((acc, e) => acc + e.amount, 0);
    const totalDespesas = filteredEntries
      .filter(e => e.type === 'despesa')
      .reduce((acc, e) => acc + e.amount, 0);
    const saldoLiquido = totalReceitas - totalDespesas;

    const filterLabelMap: Record<'todos' | 'receita' | 'despesa' | 'obras', string> = {
      todos: 'Todas as Movimentações',
      receita: 'Apenas Receitas',
      despesa: 'Apenas Despesas',
      obras: 'Apenas Custos Vinculados a Obras'
    };

    const emittedAt = new Date().toLocaleString('pt-BR');
    const logoUrl = `${window.location.origin}/modbox_logo_dourado.png`;

    const rowsHtml = filteredEntries.length > 0
      ? filteredEntries.map(entry => {
          const formattedDate = new Date(entry.date + 'T00:00:00').toLocaleDateString('pt-BR');
          const isReceita = entry.type === 'receita';
          const linkedSale = entry.saleOrderId ? sales.find(s => s.id === entry.saleOrderId) : undefined;
          const catLabel = categoryLabels[entry.category] || entry.category;

          return `
            <tr>
              <td class="col-date">${formattedDate}</td>
              <td class="col-type">
                <span class="badge ${isReceita ? 'badge-receita' : 'badge-despesa'}">
                  ${isReceita ? 'RECEITA' : 'DESPESA'}
                </span>
              </td>
              <td class="col-cat">${catLabel}</td>
              <td class="col-desc">
                <div class="desc-text">${entry.description}</div>
                ${entry.saleOrderId ? `<div class="obra-tag">Obra vinculada${linkedSale ? `: ${linkedSale.orderNumber} — ${linkedSale.client.name}` : ''}</div>` : ''}
              </td>
              <td class="col-client">${entry.clientOrSupplier || '—'}</td>
              <td class="col-amount ${isReceita ? 'amount-receita' : 'amount-despesa'}">
                ${isReceita ? '+' : '-'} ${formatCurrency(entry.amount)}
              </td>
            </tr>
          `;
        }).join('')
      : `
        <tr>
          <td colspan="6" style="text-align: center; padding: 28px; color: #6b7280; font-style: italic;">
            Nenhuma movimentação financeira encontrada para os filtros selecionados.
          </td>
        </tr>
      `;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Extrato Financeiro ModBox — ${activePeriodLabel}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #111827;
            background: #ffffff;
            font-size: 11px;
            line-height: 1.45;
          }
          /* Cabeçalho com Logotipo ModBox */
          .report-header {
            background-color: #0d0d11;
            color: #ffffff;
            padding: 18px 24px;
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .brand-box {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .brand-logo {
            height: 48px;
            width: auto;
            object-fit: contain;
          }
          .header-meta {
            text-align: right;
          }
          .header-title {
            font-size: 11px;
            font-weight: 600;
            color: #e5e7eb;
            text-transform: uppercase;
            letter-spacing: 1.2px;
          }
          .header-period {
            font-size: 11px;
            font-weight: 700;
            color: #eab308;
            margin-top: 3px;
          }
          .header-emitted {
            font-size: 9px;
            color: #9ca3af;
            margin-top: 2px;
          }

          /* Linha Amarela Logo Abaixo do Cabeçalho */
          .yellow-divider {
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, #eab308 0%, #facc15 50%, #ca8a04 100%);
            background-color: #eab308;
            margin-bottom: 18px;
          }

          /* Detalhamento Abaixo da Linha Amarela */
          .summary-bar {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 18px;
          }
          .summary-card {
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            border-radius: 8px;
            padding: 10px 12px;
          }
          .summary-card.highlight {
            border-color: #eab308;
            background: #fefce8;
          }
          .summary-label {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            color: #6b7280;
            letter-spacing: 0.5px;
          }
          .summary-value {
            font-size: 14px;
            font-weight: 800;
            margin-top: 4px;
            font-family: Consolas, Monaco, monospace;
          }
          .val-receita { color: #059669; }
          .val-despesa { color: #e11d48; }
          .val-saldo-pos { color: #047857; }
          .val-saldo-neg { color: #be123c; }

          .section-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #111827;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .section-subtitle {
            font-size: 10px;
            font-weight: 600;
            color: #6b7280;
            text-transform: none;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
          }
          thead tr {
            background-color: #111827;
            color: #ffffff;
          }
          th {
            text-align: left;
            padding: 8px 8px;
            font-size: 9.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          th.col-amount {
            text-align: right;
          }
          tbody tr {
            border-bottom: 1px solid #e5e7eb;
            page-break-inside: avoid;
          }
          tbody tr:nth-child(even) {
            background-color: #f9fafb;
          }
          td {
            padding: 8px 8px;
            vertical-align: top;
            font-size: 10.5px;
          }
          .col-date {
            white-space: nowrap;
            font-family: Consolas, Monaco, monospace;
            color: #374151;
            width: 76px;
          }
          .col-type {
            width: 68px;
          }
          .col-cat {
            width: 130px;
            color: #374151;
            font-weight: 600;
          }
          .col-desc {
            color: #111827;
          }
          .desc-text {
            font-weight: 600;
            word-break: break-word;
            white-space: normal;
          }
          .obra-tag {
            display: inline-block;
            margin-top: 3px;
            padding: 1px 6px;
            border-radius: 4px;
            background: #fef9c3;
            border: 1px solid #facc15;
            color: #854d0e;
            font-size: 9px;
            font-weight: 700;
          }
          .col-client {
            width: 120px;
            color: #4b5563;
          }
          .col-amount {
            white-space: nowrap;
            text-align: right;
            font-family: Consolas, Monaco, monospace;
            font-weight: 800;
            width: 105px;
          }
          .amount-receita { color: #059669; }
          .amount-despesa { color: #e11d48; }

          .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8.5px;
            font-weight: 800;
            letter-spacing: 0.4px;
          }
          .badge-receita {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
          }
          .badge-despesa {
            background-color: #ffe4e6;
            color: #9f1239;
            border: 1px solid #fda4af;
          }

          tfoot tr {
            background-color: #f3f4f6;
            border-top: 2px solid #111827;
            font-weight: 800;
          }
          tfoot td {
            padding: 10px 8px;
            font-size: 11px;
          }

          .report-footer {
            margin-top: 24px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <!-- Cabeçalho com Logotipo da ModBox -->
        <header class="report-header">
          <div class="brand-box">
            <img id="modbox-logo" src="${logoUrl}" alt="ModBox Logo" class="brand-logo" />
          </div>
          <div class="header-meta">
            <div class="header-title">Detalhamento de Movimentação Financeira</div>
            <div class="header-period">Período: ${activePeriodLabel}</div>
            <div class="header-emitted">Emitido em: ${emittedAt}</div>
          </div>
        </header>

        <!-- Linha Amarela Logo Abaixo -->
        <div class="yellow-divider"></div>

        <!-- Resumo do Período / Filtro -->
        <section class="summary-bar">
          <div class="summary-card">
            <div class="summary-label">Total de Receitas</div>
            <div class="summary-value val-receita">${formatCurrency(totalReceitas)}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total de Custos / Despesas</div>
            <div class="summary-value val-despesa">${formatCurrency(totalDespesas)}</div>
          </div>
          <div class="summary-card highlight">
            <div class="summary-label">Resultado Líquido</div>
            <div class="summary-value ${saldoLiquido >= 0 ? 'val-saldo-pos' : 'val-saldo-neg'}">
              ${formatCurrency(saldoLiquido)}
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Lançamentos Listados</div>
            <div class="summary-value" style="color: #111827;">${filteredEntries.length} registro(s)</div>
          </div>
        </section>

        <!-- Tabela com o Detalhamento Completo -->
        <section>
          <div class="section-title">
            <span>Extrato Detalhado de Movimentações</span>
            <span class="section-subtitle">Filtro: ${filterLabelMap[typeFilter]}${searchTerm ? ` • Busca: "${searchTerm}"` : ''}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th class="col-date">Data</th>
                <th class="col-type">Tipo</th>
                <th class="col-cat">Categoria</th>
                <th class="col-desc">Descrição Detalhada</th>
                <th class="col-client">Cliente / Fornecedor</th>
                <th class="col-amount">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" style="text-align: right; text-transform: uppercase;">Saldo Final das Movimentações Listadas:</td>
                <td class="col-amount ${saldoLiquido >= 0 ? 'amount-receita' : 'amount-despesa'}">
                  ${formatCurrency(saldoLiquido)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        <footer class="report-footer">
          <span>MODBOX CONTÊINERES MODERNOS E COBERTURAS METÁLICAS</span>
          <span>Relatório Financeiro • ${activePeriodLabel}</span>
        </footer>

        <script>
          (function() {
            var img = document.getElementById('modbox-logo');
            var printed = false;
            function triggerPrint() {
              if (printed) return;
              printed = true;
              setTimeout(function() {
                window.focus();
                window.print();
              }, 150);
            }
            if (img && !img.complete) {
              img.onload = triggerPrint;
              img.onerror = triggerPrint;
              setTimeout(triggerPrint, 1000);
            } else {
              triggerPrint();
            }
          })();
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-4 sm:p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão Financeira</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Receitas, custos e lucro.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Lançar Movimentação</span>
        </button>
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
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${periodMode === 'mes' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
              }`}
          >
            Por Mês ({MONTH_NAMES[selectedMonth].slice(0, 3)}/{String(selectedYear).slice(-2)})
          </button>
          <button
            onClick={() => setPeriodMode('ano')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${periodMode === 'ano' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
              }`}
          >
            Ano {selectedYear}
          </button>
          <button
            onClick={() => setPeriodMode('tudo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${periodMode === 'tudo' ? 'bg-gold-500 text-black font-bold shadow-sm' : 'bg-dark-900 text-gray-400 hover:text-white border border-white/5'
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
              <span className="text-[10px] text-gold-400 font-mono font-semibold">({activePeriodLabel})</span>
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
              <span className="text-[10px] text-rose-400 font-mono font-semibold">({activePeriodLabel})</span>
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
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">({activePeriodLabel})</span>
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

            {/* Botão Imprimir PDF do Extrato */}
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-black font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer shadow-sm"
              title="Imprimir ou Salvar PDF com o detalhamento da movimentação financeira"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir PDF</span>
            </button>
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
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${entry.type === 'receita'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    {categoryLabels[entry.category] || entry.category}
                  </td>
                  <td className="py-3 px-3 text-white font-medium max-w-md">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {entry.saleOrderId && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gold-500/15 text-gold-400 border border-gold-500/30 whitespace-nowrap">
                          Obra
                        </span>
                      )}
                      <span className="break-words">{entry.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-400">
                    {entry.clientOrSupplier || '—'}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono font-bold text-sm ${entry.type === 'receita' ? 'text-emerald-400' : 'text-rose-400'
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
                className={`py-2 rounded-xl font-bold transition-all ${type === 'receita' ? 'bg-emerald-500 text-black shadow-sm' : 'bg-dark-950 text-gray-400 border border-white/5'
                  }`}
              >
                + Entrada / Receita
              </button>
              <button
                type="button"
                onClick={() => setType('despesa')}
                className={`py-2 rounded-xl font-bold transition-all ${type === 'despesa' ? 'bg-rose-500 text-white shadow-sm' : 'bg-dark-950 text-gray-400 border border-white/5'
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
