import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Users, 
  Printer, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  Edit3, 
  Trash2,
  ExternalLink,
  ChevronRight,
  Receipt,
  Coins,
  AlertCircle
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { SaleOrder, ProductionStatus, CashFlowCategory, ProjectExpense } from '../../types';
import { Modal } from '../common/Modal';
import { PRODUCTION_STAGES_CONFIG } from '../../data/mockData';

const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  materia_prima: 'Matéria-Prima / Aço Corten',
  serralheria: 'Serralheria & Ferragens',
  eletrica_hidraulica: 'Elétrica & Hidráulica',
  mao_de_obra_montagem: 'Mão de Obra / Diária Extra',
  transporte_munck: 'Frete & Caminhão Munck',
  administrativo: 'Administrativo & Licenças',
  outros: 'Outros Custos / Suprimentos',
  venda_conteiner: 'Venda de Contêiner',
  locacao: 'Locação'
};

export const SalesManager: React.FC = () => {
  const { 
    sales, 
    containers, 
    collaborators, 
    addSale, 
    updateSale, 
    updateSaleStatus, 
    deleteSale,
    addProjectExpense,
    deleteProjectExpense
  } = useModBox();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSaleForOS, setSelectedSaleForOS] = useState<SaleOrder | null>(null);

  // Form State
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);

  // Client Data
  const [clientName, setClientName] = useState('');
  const [clientDoc, setClientDoc] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Address
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [zipCode, setZipCode] = useState('');
  const [landmark, setLandmark] = useState('');

  // Container & Customizations
  const [selectedContainerId, setSelectedContainerId] = useState<string>(containers[0]?.id || '');
  const [customNotes, setCustomNotes] = useState('');

  // Financials
  const [totalAmount, setTotalAmount] = useState<number>(45000);
  const [downPayment, setDownPayment] = useState<number>(22500);
  const [productionCost, setProductionCost] = useState<number>(28000);
  const [paymentMethod, setPaymentMethod] = useState('PIX (50% entrada + 50% na montagem)');
  const [paymentStatus, setPaymentStatus] = useState<'pago' | 'parcial' | 'pendente'>('parcial');

  // Centro de Custos da Obra
  const [selectedSaleForCostsId, setSelectedSaleForCostsId] = useState<string | null>(null);
  const selectedSaleForCosts = sales.find(s => s.id === selectedSaleForCostsId) || null;

  // Form de Lançamento de Custos na Obra
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<CashFlowCategory>('materia_prima');
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expenseNotes, setExpenseNotes] = useState('');

  // Schedule & Collaborators
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>('08:30');
  const [selectedCollabIds, setSelectedCollabIds] = useState<string[]>(['col-01', 'col-02']);

  const handleContainerChange = (cntId: string) => {
    setSelectedContainerId(cntId);
    const cnt = containers.find(c => c.id === cntId);
    if (cnt) {
      setTotalAmount(cnt.suggestedPrice);
      setDownPayment(Math.round(cnt.suggestedPrice * 0.5));
      setProductionCost(cnt.baseCost);
    }
  };

  const openNewSaleModal = () => {
    setEditingSaleId(null);
    setClientName('');
    setClientDoc('');
    setClientPhone('');
    setClientEmail('');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('');
    setState('SP');
    setZipCode('');
    setLandmark('');
    const defaultCnt = containers[0];
    if (defaultCnt) {
      setSelectedContainerId(defaultCnt.id);
      setTotalAmount(defaultCnt.suggestedPrice);
      setDownPayment(Math.round(defaultCnt.suggestedPrice * 0.5));
      setProductionCost(defaultCnt.baseCost);
    }
    setCustomNotes('');
    setPaymentMethod('PIX (50% entrada + 50% na entrega)');
    setPaymentStatus('parcial');
    setScheduledDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    setScheduledTime('08:30');
    setSelectedCollabIds(['col-01', 'col-02']);
    setIsModalOpen(true);
  };

  const openEditSaleModal = (sale: SaleOrder) => {
    setEditingSaleId(sale.id);
    setClientName(sale.client.name);
    setClientDoc(sale.client.document);
    setClientPhone(sale.client.phone);
    setClientEmail(sale.client.email);
    setStreet(sale.installationAddress.street);
    setNumber(sale.installationAddress.number);
    setComplement(sale.installationAddress.complement || '');
    setNeighborhood(sale.installationAddress.neighborhood);
    setCity(sale.installationAddress.city);
    setState(sale.installationAddress.state);
    setZipCode(sale.installationAddress.zipCode);
    setLandmark(sale.installationAddress.landmark || '');
    setSelectedContainerId(sale.containerModelId);
    setCustomNotes(sale.customizations.join(', '));
    setTotalAmount(sale.financials.totalAmount);
    setDownPayment(sale.financials.downPayment);
    setProductionCost(sale.financials.productionCost);
    setPaymentMethod(sale.financials.paymentMethod);
    setPaymentStatus(sale.financials.paymentStatus);
    setScheduledDate(sale.schedule.scheduledDate);
    setScheduledTime(sale.schedule.scheduledTime);
    setSelectedCollabIds(sale.assignedCollaboratorIds);
    setIsModalOpen(true);
  };

  const toggleCollaboratorSelection = (colId: string) => {
    if (selectedCollabIds.includes(colId)) {
      setSelectedCollabIds(selectedCollabIds.filter(id => id !== colId));
    } else {
      setSelectedCollabIds([...selectedCollabIds, colId]);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaleForCostsId || !expenseDesc.trim() || !expenseAmount) return;

    addProjectExpense(selectedSaleForCostsId, {
      description: expenseDesc.trim(),
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      date: expenseDate,
      notes: expenseNotes.trim() || undefined
    });

    setExpenseDesc('');
    setExpenseAmount('');
    setExpenseNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const container = containers.find(c => c.id === selectedContainerId);
    const containerName = container ? container.name : 'Contêiner ModBox';
    const balanceDue = Math.max(0, totalAmount - downPayment);
    const grossProfit = totalAmount - productionCost;

    const salePayload = {
      client: {
        name: clientName,
        document: clientDoc,
        phone: clientPhone,
        email: clientEmail
      },
      installationAddress: {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        landmark
      },
      containerModelId: selectedContainerId,
      containerName,
      customizations: customNotes ? customNotes.split(',').map(s => s.trim()) : [],
      financials: {
        totalAmount: Number(totalAmount),
        downPayment: Number(downPayment),
        balanceDue,
        paymentMethod,
        paymentStatus,
        productionCost: Number(productionCost),
        grossProfit
      },
      schedule: {
        scheduledDate,
        scheduledTime,
        estimatedDurationHours: 6
      },
      assignedCollaboratorIds: selectedCollabIds,
      status: 'projeto_aprovado' as ProductionStatus,
      checklist: {
        'nivelamento_sapatas': false,
        'descarregamento_munck': false,
        'fixacao_estrutural': false,
        'conexao_eletrica_geral': false,
        'ligacao_hidraulica_esgoto': false,
        'vedacao_silicone_pu': false,
        'limpeza_e_higienizacao': false,
        'termo_entrega_assinado': false
      },
      notes: []
    };

    if (editingSaleId) {
      const existing = sales.find(s => s.id === editingSaleId);
      updateSale(editingSaleId, {
        ...salePayload,
        status: existing?.status || salePayload.status,
        checklist: existing?.checklist || salePayload.checklist,
        notes: existing?.notes || salePayload.notes,
        expenses: existing?.expenses || []
      });
    } else {
      addSale(salePayload);
    }
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.containerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.installationAddress.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-4 sm:p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Gestão Comercial & Ordens de Venda</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Vendas e Cronograma de Montagens</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Acompanhe o cliente, o contêiner contratado, a equipe técnica escalada e os valores recebidos.
          </p>
        </div>

        <button
          onClick={openNewSaleModal}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Nova Venda</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, pedido MBX ou cidade..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-dark-850 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'todos' ? 'bg-gold-500 text-black font-bold' : 'bg-dark-850 text-gray-400 hover:text-white'
            }`}
          >
            Todas as Vendas ({sales.length})
          </button>
          <button
            onClick={() => setStatusFilter('montagem_local')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'montagem_local' ? 'bg-amber-500 text-black font-bold' : 'bg-dark-850 text-gray-400 hover:text-white'
            }`}
          >
            Em Montagem ({sales.filter(s => s.status === 'montagem_local').length})
          </button>
          <button
            onClick={() => setStatusFilter('concluido')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'concluido' ? 'bg-emerald-500 text-black font-bold' : 'bg-dark-850 text-gray-400 hover:text-white'
            }`}
          >
            Entregues ({sales.filter(s => s.status === 'concluido').length})
          </button>
        </div>
      </div>

      {/* Sales Orders List Cards */}
      <div className="space-y-4">
        {filteredSales.map(sale => {
          const assignedCols = collaborators.filter(c => sale.assignedCollaboratorIds.includes(c.id));
          const stageConfig = PRODUCTION_STAGES_CONFIG.find(st => st.id === sale.status);

          return (
            <div
              key={sale.id}
              className="bg-dark-850 border border-white/5 hover:border-gold-500/30 rounded-2xl p-5 transition-all space-y-4"
            >
              {/* Header row: Order #, Status pill, and Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-extrabold text-gold-400 px-3 py-1 rounded-xl bg-gold-500/10 border border-gold-500/30">
                    {sale.orderNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Status atual:</span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-gold-500/15 text-gold-300 border border-gold-500/30">
                      {stageConfig?.label || sale.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Pedido criado em {new Date(sale.createdAt + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setSelectedSaleForOS(sale)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-gold-400 border border-gold-500/20 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir OS</span>
                  </button>
                  <button
                    onClick={() => openEditSaleModal(sale)}
                    className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-dark-750 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Excluir a venda ${sale.orderNumber}?`)) {
                        deleteSale(sale.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-dark-750 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main content grid: Client info + Container specs + Assembly info + Financials */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* 1. Cliente */}
                <div className="bg-dark-900 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400/80 block">
                    Cliente & Contato
                  </span>
                  <div className="font-bold text-sm text-white">{sale.client.name}</div>
                  <div className="text-gray-400 font-mono text-[11px]">Doc: {sale.client.document}</div>
                  <div className="text-gray-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gold-500" />
                    <span>{sale.client.phone}</span>
                  </div>
                  <div className="text-gray-400 truncate">{sale.client.email}</div>
                </div>

                {/* 2. Contêiner Contratado */}
                <div className="bg-dark-900 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400/80 block">
                    Produto & Personalizações
                  </span>
                  <div className="font-bold text-sm text-white">{sale.containerName}</div>
                  {sale.customizations.length > 0 ? (
                    <div className="space-y-1 mt-1">
                      {sale.customizations.map((cust, idx) => (
                        <div key={idx} className="text-gray-300 flex items-center gap-1 text-[11px]">
                          <span className="text-gold-500 font-bold">•</span>
                          <span>{cust}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-[11px]">Sem opcionais adicionais</span>
                  )}
                </div>

                {/* 3. Agendamento & Local da Montagem */}
                <div className="bg-dark-900 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400/80 block">
                    Agenda & Local de Montagem
                  </span>
                  <div className="font-bold text-sm text-gold-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(sale.schedule.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')} às {sale.schedule.scheduledTime}</span>
                  </div>
                  <div className="text-gray-300 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                    <span className="leading-tight">
                      {sale.installationAddress.street}, {sale.installationAddress.number}
                      {sale.installationAddress.complement && ` - ${sale.installationAddress.complement}`}<br />
                      {sale.installationAddress.neighborhood} - {sale.installationAddress.city}/{sale.installationAddress.state}
                    </span>
                  </div>
                  <div className="text-gray-400 text-[11px] pt-1 border-t border-white/5">
                    Equipe escalada: <span className="text-white font-medium">{assignedCols.map(c => c.name.split(' ')[0]).join(', ') || 'A definir'}</span>
                  </div>
                </div>

                {/* 4. Valores e Fluxo de Pagamento */}
                <div className="bg-dark-900 p-3.5 rounded-xl border border-gold-500/20 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">
                      Valores da Venda
                    </span>
                    <div className="text-base font-extrabold text-gold-400 font-mono mt-1">
                      {formatCurrency(sale.financials.totalAmount)}
                    </div>
                    <div className="text-[11px] text-gray-300 mt-1">
                      Entrada: <span className="font-mono text-emerald-400">{formatCurrency(sale.financials.downPayment)}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Saldo restante: <span className="font-mono text-amber-300">{formatCurrency(sale.financials.balanceDue)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sale.financials.paymentStatus === 'pago' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {sale.financials.paymentStatus}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Margem: {formatCurrency(sale.financials.grossProfit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Centro de Custos da Obra (Orçado vs Realizado) */}
              {(() => {
                const expenses = sale.expenses || [];
                const actualCost = expenses.reduce((sum, e) => sum + e.amount, 0);
                const budgetedCost = sale.financials.productionCost;
                const budgetVariance = budgetedCost - actualCost;
                const isOverBudget = actualCost > budgetedCost;
                const realProfit = sale.financials.totalAmount - actualCost;
                const realMargin = sale.financials.totalAmount > 0 ? (realProfit / sale.financials.totalAmount) * 100 : 0;

                return (
                  <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-dark-900/80 p-3.5 rounded-xl border border-gold-500/15">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-gold-400 font-bold uppercase tracking-wider text-[11px]">
                        <Coins className="w-4 h-4 text-gold-400" />
                        <span>Centro de Custos da Obra:</span>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-gray-400">
                          Orçado: <strong className="text-white font-mono">{formatCurrency(budgetedCost)}</strong>
                        </span>
                        <span className="text-gray-400">
                          Gastos Reais: <strong className="text-amber-400 font-mono">{formatCurrency(actualCost)}</strong>
                          <span className="text-[10px] text-gray-400 ml-1">({expenses.length} lançamentos)</span>
                        </span>
                        <span className="text-gray-400">
                          Lucro Real: <strong className={`font-mono font-bold ${realProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(realProfit)} ({realMargin.toFixed(1)}%)
                          </strong>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOverBudget 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {isOverBudget 
                            ? `Estourou (-${formatCurrency(Math.abs(budgetVariance))})` 
                            : `Dentro do orçamento (+${formatCurrency(budgetVariance)})`
                          }
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSaleForCostsId(sale.id)}
                      className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-black transition-all whitespace-nowrap shadow-sm shrink-0"
                    >
                      <Receipt className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Custos da Obra ({expenses.length})</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Modal Nova / Editar Venda */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSaleId ? 'Editar Pedido de Venda' : 'Cadastrar Nova Venda de Contêiner'}
        subtitle="Vincule as especificações do cliente, endereço de montagem e equipe operacional"
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cliente */}
          <div>
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              1. Dados do Cliente
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Nome / Razão Social *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva / Imobiliária Alpha"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">CPF ou CNPJ *</label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  value={clientDoc}
                  onChange={e => setClientDoc(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 99999-9999"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  placeholder="cliente@email.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Endereço de Montagem */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              2. Endereço Completo de Instalação / Montagem do Contêiner
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-300 block mb-1">Rua / Avenida *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Av. Paulista"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Número *</label>
                <input
                  type="text"
                  required
                  placeholder="1000"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  placeholder="Bela Vista"
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  placeholder="São Paulo"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">CEP *</label>
                <input
                  type="text"
                  required
                  placeholder="01311-000"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs text-gray-300 block mb-1">Ponto de Referência / Condições de Acesso Munck</label>
                <input
                  type="text"
                  placeholder="Ex: Portão de carga lateral, fiação aérea alta liberada para guindaste"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Contêiner e Customizações */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              3. Modelo de Contêiner & Opcionais
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Selecione o Modelo *</label>
                <select
                  value={selectedContainerId}
                  onChange={e => handleContainerChange(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  {containers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.dimensions.length}m × {c.dimensions.width}m - {c.areaM2}m²)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Personalizações Extras (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: Ar condicionado 12k BTUs, Vidro blindex fumê, Deck superior"
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Financeiro */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              4. Condições Financeiras & Orçamento Inicial
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gold-400 font-semibold block mb-1">Valor da Venda (R$) *</label>
                <input
                  type="number"
                  required
                  value={totalAmount}
                  onChange={e => setTotalAmount(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-gold-500/40 rounded-xl px-3 py-2 text-sm text-gold-300 font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-amber-400 font-semibold block mb-1">Custo Orçado / Teto (R$) *</label>
                <input
                  type="number"
                  required
                  value={productionCost}
                  onChange={e => setProductionCost(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-amber-500/40 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-emerald-400 font-semibold block mb-1">Valor de Entrada (R$) *</label>
                <input
                  type="number"
                  required
                  value={downPayment}
                  onChange={e => setDownPayment(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Forma de Pagamento *</label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Agenda & Equipe de Montagem */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              5. Agenda e Equipe de Montagem Escalada
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Data Prevista da Montagem *</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Horário Previsto *</label>
                <input
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-2">
                Selecione os Colaboradores Designados para a Instalação:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {collaborators.map(c => {
                  const isSelected = selectedCollabIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleCollaboratorSelection(c.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isSelected 
                          ? 'bg-gold-500/15 border-gold-500/50 text-white' 
                          : 'bg-dark-950 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block">{c.name}</span>
                        <span className="text-[10px] text-gold-400/80">{c.role}</span>
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-gold-500 border-gold-500 text-black' : 'border-gray-600'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>{editingSaleId ? 'Atualizar Pedido' : 'Concluir Cadastro de Venda'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Ordem de Serviço (OS) Pronta para Impressão */}
      <Modal
        isOpen={!!selectedSaleForOS}
        onClose={() => setSelectedSaleForOS(null)}
        title="Ordem de Serviço (OS) Técnica"
        subtitle="Documento técnico oficial para logística e montagem em campo"
        maxWidth="3xl"
      >
        {selectedSaleForOS && (
          <div className="space-y-6 text-xs text-gray-200">
            {/* Printable Document Box */}
            <div id="printable-os" className="bg-dark-950 p-4 sm:p-6 rounded-2xl border border-gold-500/30 space-y-5">
              {/* OS Header with Logo */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold-500/20 pb-4 text-center sm:text-left">
                <img
                  src="/modbox_logo_dourado.png"
                  alt="ModBox"
                  className="h-14 object-contain"
                />
                <div className="text-right">
                  <div className="font-mono text-base font-extrabold text-gold-400">
                    ORDEM DE SERVIÇO: {selectedSaleForOS.orderNumber}
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    Emissão: {new Date().toLocaleDateString('pt-BR')} | ModBox Engenharia
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-900 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gold-400 block mb-1">Dados do Cliente</span>
                  <div className="font-bold text-white text-sm">{selectedSaleForOS.client.name}</div>
                  <div className="text-gray-400">CPF/CNPJ: {selectedSaleForOS.client.document}</div>
                  <div className="text-gray-400">Telefone: {selectedSaleForOS.client.phone}</div>
                </div>

                <div className="bg-dark-900 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gold-400 block mb-1">Local da Montagem</span>
                  <div className="font-bold text-white text-sm">
                    {selectedSaleForOS.installationAddress.street}, {selectedSaleForOS.installationAddress.number}
                  </div>
                  <div className="text-gray-400">
                    {selectedSaleForOS.installationAddress.neighborhood} - {selectedSaleForOS.installationAddress.city}/{selectedSaleForOS.installationAddress.state}
                  </div>
                  {selectedSaleForOS.installationAddress.landmark && (
                    <div className="text-gold-300 text-[11px] mt-1">Ref: {selectedSaleForOS.installationAddress.landmark}</div>
                  )}
                </div>
              </div>

              {/* Contêiner Details */}
              <div className="bg-dark-900 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-gold-400 block mb-1">Produto & Especificações</span>
                <div className="font-bold text-white text-sm">{selectedSaleForOS.containerName}</div>
                {selectedSaleForOS.customizations.length > 0 && (
                  <div className="text-gray-300 mt-1">
                    Opcionais: {selectedSaleForOS.customizations.join(' • ')}
                  </div>
                )}
              </div>

              {/* Checklist & Signatures */}
              <div className="border-t border-white/5 pt-4">
                <span className="text-[10px] uppercase font-bold text-gold-400 block mb-2">Checklist Técnico de Campo</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>[ ] Nivelamento com laser das sapatas</div>
                  <div>[ ] Içamento e descarregamento via munck</div>
                  <div>[ ] Fixação estrutural parabolt</div>
                  <div>[ ] Teste de carga elétrica e disjuntores</div>
                  <div>[ ] Teste de estanqueidade e hidráulica</div>
                  <div>[ ] Vedação de silicone PU naval</div>
                </div>
              </div>

              {/* Signature lines */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-[11px] text-gray-400">
                <div className="border-t border-gray-600 pt-2">
                  Assinatura do Líder de Montagem ModBox
                </div>
                <div className="border-t border-gray-600 pt-2">
                  Assinatura do Cliente / Recebimento
                </div>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                <Printer className="w-4 h-4 stroke-[3]" />
                <span>Imprimir / Gerar PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Centro de Custos por Obra (Orçado vs Realizado) */}
      <Modal
        isOpen={!!selectedSaleForCosts}
        onClose={() => setSelectedSaleForCostsId(null)}
        title={selectedSaleForCosts ? `Centro de Custos da Obra — ${selectedSaleForCosts.client.name}` : ''}
        subtitle={selectedSaleForCosts ? `Lançamento de custos reais, controle de materiais e margem de lucro (${selectedSaleForCosts.orderNumber})` : ''}
        maxWidth="4xl"
      >
        {selectedSaleForCosts && (() => {
          const expenses = selectedSaleForCosts.expenses || [];
          const actualCosts = expenses.reduce((sum, exp) => sum + exp.amount, 0);
          const budgetedCost = selectedSaleForCosts.financials.productionCost;
          const totalAmount = selectedSaleForCosts.financials.totalAmount;
          const realProfit = totalAmount - actualCosts;
          const realMargin = totalAmount > 0 ? (realProfit / totalAmount) * 100 : 0;
          const budgetedProfit = totalAmount - budgetedCost;
          const budgetedMargin = totalAmount > 0 ? (budgetedProfit / totalAmount) * 100 : 0;
          const variance = budgetedCost - actualCosts;
          const isOverBudget = actualCosts > budgetedCost;

          return (
            <div className="space-y-6">
              {/* Resumo Financeiro da Obra em Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-dark-900 p-3.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Valor da Venda (Contrato)
                  </span>
                  <div className="text-lg font-extrabold text-gold-400 font-mono mt-0.5">
                    {formatCurrency(totalAmount)}
                  </div>
                  <span className="text-[10px] text-gray-400">Receita total da obra</span>
                </div>

                <div className="bg-dark-900 p-3.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Custo Orçado Inicial
                  </span>
                  <div className="text-lg font-extrabold text-white font-mono mt-0.5">
                    {formatCurrency(budgetedCost)}
                  </div>
                  <span className="text-[10px] text-gray-400">Margem orçada: {budgetedMargin.toFixed(1)}%</span>
                </div>

                <div className={`bg-dark-900 p-3.5 rounded-xl border ${isOverBudget ? 'border-rose-500/40' : 'border-amber-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      Gastos Reais Lançados
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                      {expenses.length} itens
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-amber-400 font-mono mt-0.5">
                    {formatCurrency(actualCosts)}
                  </div>
                  <span className={`text-[10px] font-semibold ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isOverBudget 
                      ? `Estourou teto em ${formatCurrency(Math.abs(variance))}`
                      : `Sobra orçada: ${formatCurrency(variance)}`
                    }
                  </span>
                </div>

                <div className="bg-dark-900 p-3.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                    Lucro Realizado da Obra
                  </span>
                  <div className={`text-lg font-extrabold font-mono mt-0.5 ${realProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(realProfit)}
                  </div>
                  <span className="text-[10px] text-emerald-400/90 font-semibold">
                    Margem real: {realMargin.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Formulário: Lançar Custo / Material Nesta Obra */}
              <div className="bg-dark-900/90 p-4 rounded-2xl border border-gold-500/20 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-500"></div>
                  <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                    Lançar Custo / Material Desta Obra
                  </h4>
                </div>
                <form onSubmit={handleAddExpense} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-gray-300 block mb-1">
                        Descrição do Material ou Despesa *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 10 parafusos autobrocantes, R$50 ferro..."
                        value={expenseDesc}
                        onChange={e => setExpenseDesc(e.target.value)}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-300 block mb-1">
                        Valor Gasto (R$) *
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        min="0.01"
                        placeholder="0,00"
                        value={expenseAmount}
                        onChange={e => setExpenseAmount(e.target.value)}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-300 block mb-1">
                        Categoria do Custo *
                      </label>
                      <select
                        value={expenseCategory}
                        onChange={e => setExpenseCategory(e.target.value as CashFlowCategory)}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      >
                        <option value="materia_prima">Matéria-Prima / Aço Corten</option>
                        <option value="serralheria">Serralheria & Ferragens</option>
                        <option value="eletrica_hidraulica">Elétrica & Hidráulica</option>
                        <option value="mao_de_obra_montagem">Mão de Obra / Diária Extra</option>
                        <option value="transporte_munck">Transporte / Munck</option>
                        <option value="administrativo">Administrativo / Licenças</option>
                        <option value="outros">Outros Suprimentos</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-300 block mb-1">Data da Despesa</label>
                      <input
                        type="date"
                        required
                        value={expenseDate}
                        onChange={e => setExpenseDate(e.target.value)}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-gray-300 block mb-1">
                        Fornecedor / Loja / Observação (Opcional)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ex: Casa do Parafuso, Serralheria Central, NF-e 4521..."
                          value={expenseNotes}
                          onChange={e => setExpenseNotes(e.target.value)}
                          className="flex-1 bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Lançar Custo na Obra</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Histórico dos Custos Lançados na Obra */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Histórico de Gastos desta Obra ({expenses.length})
                  </h4>
                  <span className="text-xs text-gray-400">
                    Total Realizado: <strong className="text-gold-400 font-mono">{formatCurrency(actualCosts)}</strong>
                  </span>
                </div>

                {expenses.length === 0 ? (
                  <div className="text-center py-8 bg-dark-900 rounded-xl border border-white/5 text-gray-500 text-xs">
                    Nenhum custo lançado para esta obra ainda. Use o formulário acima para cadastrar os materiais e despesas compradas para esta obra.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/5">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-dark-950 text-gray-400 text-[10px] uppercase font-bold border-b border-white/5">
                        <tr>
                          <th className="py-2.5 px-3">Data</th>
                          <th className="py-2.5 px-3">Descrição do Material/Gasto</th>
                          <th className="py-2.5 px-3">Categoria</th>
                          <th className="py-2.5 px-3">Fornecedor / Observação</th>
                          <th className="py-2.5 px-3 text-right">Valor Gasto</th>
                          <th className="py-2.5 px-3 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-dark-900">
                        {expenses.map(exp => (
                          <tr key={exp.id} className="hover:bg-dark-850/50 transition-colors">
                            <td className="py-2 px-3 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                              {new Date(exp.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-2 px-3 font-semibold text-white">
                              {exp.description}
                            </td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-dark-750 text-gold-300 border border-gold-500/20">
                                {EXPENSE_CATEGORY_LABELS[exp.category] || exp.category}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-400 text-[11px]">
                              {exp.notes || '—'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-amber-400 whitespace-nowrap">
                              {formatCurrency(exp.amount)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                onClick={() => {
                                  if (window.confirm(`Excluir o gasto "${exp.description}" de ${formatCurrency(exp.amount)}?`)) {
                                    deleteProjectExpense(selectedSaleForCosts.id, exp.id);
                                  }
                                }}
                                title="Excluir custo da obra"
                                className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-dark-950 border-t border-white/10 font-bold">
                        <tr>
                          <td colSpan={4} className="py-2.5 px-3 text-right text-gray-300 text-xs">
                            Soma dos Custos Desta Obra:
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-amber-400 text-sm">
                            {formatCurrency(actualCosts)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Informação sobre Integração Automática */}
              <div className="p-3 bg-dark-950 rounded-xl border border-gold-500/20 text-[11px] text-gray-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  💡 <strong>Abatimento Automático:</strong> Os custos lançados aqui são abatidos imediatamente do lucro desta obra e integrados em tempo real ao <strong>Fluxo de Caixa geral</strong>.
                </span>
                <button
                  onClick={() => setSelectedSaleForCostsId(null)}
                  className="px-4 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-white font-semibold text-xs border border-white/10 transition-all self-end sm:self-auto shrink-0"
                >
                  Concluir
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};
