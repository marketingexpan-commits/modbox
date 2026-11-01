import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Users, 
  HardHat, 
  CheckCircle2, 
  Navigation, 
  MessageSquare, 
  ArrowRight, 
  Send
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { SaleOrder } from '../../types';
import { PRODUCTION_STAGES_CONFIG } from '../../data/mockData';

export const EmployeeDashboard: React.FC = () => {
  const { 
    sales, 
    collaborators, 
    activeCollaboratorId, 
    setActiveCollaboratorId,
    updateSaleStatus, 
    toggleChecklistItem, 
    addNoteToSale,
    containers
  } = useModBox();

  const [filterMode, setFilterMode] = useState<'minhas' | 'todas'>('minhas');
  const [noteInput, setNoteInput] = useState('');

  const activeCollab = collaborators.find(c => c.id === activeCollaboratorId);

  // Filter sales
  const relevantSales = sales
    .filter(sale => {
      if (sale.status === 'orcamento') return false;
      if (filterMode === 'minhas' && activeCollaboratorId) {
        return sale.assignedCollaboratorIds.includes(activeCollaboratorId);
      }
      return true;
    })
    .sort((a, b) => new Date(a.schedule.scheduledDate).getTime() - new Date(b.schedule.scheduledDate).getTime());

  const handleAdvanceStatus = (sale: SaleOrder) => {
    const currentIndex = PRODUCTION_STAGES_CONFIG.findIndex(s => s.id === sale.status);
    if (currentIndex < PRODUCTION_STAGES_CONFIG.length - 1) {
      const nextStage = PRODUCTION_STAGES_CONFIG[currentIndex + 1].id;
      updateSaleStatus(sale.id, nextStage);
    }
  };

  const handleAddNote = (saleId: string) => {
    if (!noteInput.trim()) return;
    const author = activeCollab ? `${activeCollab.name.split(' ')[0]} (Campo)` : 'Colaborador';
    addNoteToSale(saleId, noteInput.trim(), author);
    setNoteInput('');
  };

  const openGoogleMaps = (sale: SaleOrder) => {
    const query = encodeURIComponent(
      `${sale.installationAddress.street}, ${sale.installationAddress.number}, ${sale.installationAddress.city} - ${sale.installationAddress.state}`
    );
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const openWaze = (sale: SaleOrder) => {
    const query = encodeURIComponent(
      `${sale.installationAddress.street}, ${sale.installationAddress.number}, ${sale.installationAddress.city} - ${sale.installationAddress.state}`
    );
    window.open(`https://waze.com/ul?q=${query}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Employee Persona Header */}
      <div className="bg-dark-850 border border-gold-500/30 rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-500 font-extrabold text-2xl">
              <HardHat className="w-7 h-7 text-gold-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gold-500 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Painel Operacional de Campo
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {activeCollab ? activeCollab.name : 'Equipe Técnica de Montagem'}
              </h1>
              <p className="text-xs text-gray-300 mt-0.5 font-medium">
                Função: <span className="text-gold-500 font-bold">{activeCollab?.role || 'Montagem Geral'}</span>
                {activeCollab && ` • ${activeCollab.completedInstallations} montagens realizadas`}
              </p>
            </div>
          </div>

          {/* Quick Select persona switcher for testing / field worker login */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-dark-950 px-3 py-1.5 rounded-xl border border-gold-500/30 flex items-center gap-2 text-xs">
              <span className="text-gray-400">Operador:</span>
              <span className="text-gold-500 font-bold">{activeCollab ? activeCollab.name : '—'}</span>
            </div>

            {/* Filter: Minhas vs Todas */}
            <div className="bg-dark-950 p-1 rounded-xl border border-white/10 flex items-center text-xs">
              <button
                onClick={() => setFilterMode('minhas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterMode === 'minhas'
                    ? 'bg-gold-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Minhas Montagens
              </button>
              <button
                onClick={() => setFilterMode('todas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterMode === 'todas'
                    ? 'bg-gold-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Todas as Obras ({sales.filter(s => s.status !== 'orcamento').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule / Agenda Cards List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-500" />
            <span>Agenda & Cronograma de Instalações</span>
          </h2>
          <span className="text-xs text-gray-400">
            {relevantSales.length} {relevantSales.length === 1 ? 'instalação programada' : 'instalações programadas'}
          </span>
        </div>

        {relevantSales.map(sale => {
          const assignedCols = collaborators.filter(c => sale.assignedCollaboratorIds.includes(c.id));
          const stageConfig = PRODUCTION_STAGES_CONFIG.find(st => st.id === sale.status);
          const containerModel = containers.find(c => c.id === sale.containerModelId);
          const isToday = sale.schedule.scheduledDate === new Date().toISOString().split('T')[0];
          const isCompleted = sale.status === 'concluido';

          return (
            <div
              key={sale.id}
              className={`bg-dark-850 border rounded-2xl p-5 sm:p-6 transition-all space-y-5 shadow-md ${
                isCompleted 
                  ? 'border-emerald-500/20 bg-dark-900/60'
                  : isToday || sale.status === 'montagem_local'
                  ? 'border-gold-500 bg-dark-850'
                  : 'border-white/10 hover:border-gold-500/30'
              }`}
            >
              {/* Row 1: Order, Date & Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-extrabold text-gold-500 px-3 py-1 rounded-xl bg-gold-500/10 border border-gold-500/30">
                    {sale.orderNumber}
                  </span>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    {sale.containerName}
                  </h3>
                  {isToday && (
                    <span className="bg-gold-500 text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
                      ● PROGRAMADO PARA HOJE
                    </span>
                  )}
                </div>

                {/* Status and Advance button */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Status do Processo</span>
                    <span className="text-xs font-bold text-gold-500 bg-gold-500/10 px-2.5 py-0.5 rounded-lg border border-gold-500/30">
                      {stageConfig?.label || sale.status}
                    </span>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => handleAdvanceStatus(sale)}
                      className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-black font-extrabold px-3.5 py-1.5 rounded-xl text-xs transition-all"
                    >
                      <span>Avançar Etapa</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Crucial Field Info: Day, Hour, Client & Map */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Agenda Box */}
                <div className="bg-dark-900 p-4 rounded-xl border border-gold-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span>Data e Horário Marcado</span>
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    {new Date(sale.schedule.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                  </div>
                  <div className="text-sm font-bold text-gold-500 font-mono">
                    Horário: {sale.schedule.scheduledTime} hrs (Duração estimada: ~{sale.schedule.estimatedDurationHours}h)
                  </div>
                </div>

                {/* Local & GPS Navigation */}
                <div className="bg-dark-900 p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-gold-500" />
                    <span>Endereço de Montagem</span>
                  </div>
                  <div className="text-xs font-semibold text-white leading-relaxed">
                    {sale.installationAddress.street}, {sale.installationAddress.number}
                    {sale.installationAddress.complement && ` (${sale.installationAddress.complement})`}<br />
                    {sale.installationAddress.neighborhood} - {sale.installationAddress.city}/{sale.installationAddress.state}
                  </div>
                  {sale.installationAddress.landmark && (
                    <div className="text-[11px] text-gold-500 font-medium">
                      Ref: {sale.installationAddress.landmark}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => openGoogleMaps(sale)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-dark-800 hover:bg-dark-750 text-white font-semibold py-1.5 px-2 rounded-lg text-[11px] border border-white/10 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-400" />
                      <span>Google Maps</span>
                    </button>
                    <button
                      onClick={() => openWaze(sale)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-dark-800 hover:bg-dark-750 text-white font-semibold py-1.5 px-2 rounded-lg text-[11px] border border-white/10 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Waze</span>
                    </button>
                  </div>
                </div>

                {/* Cliente & Direct Contact */}
                <div className="bg-dark-900 p-4 rounded-xl border border-white/5 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-wider">
                      <Users className="w-4 h-4 text-gold-500" />
                      <span>Contato do Cliente</span>
                    </div>
                    <div className="font-bold text-sm text-white mt-1">{sale.client.name}</div>
                    <div className="text-xs text-gray-400">{sale.client.contactPerson || 'Responsável no local'}</div>
                  </div>

                  <a
                    href={`https://wa.me/55${sale.client.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(sale.client.name)}!%20Sou%20da%20equipe%20de%20montagem%20ModBox%20a%20caminho%20da%20sua%20instala%C3%A7%C3%A3o.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ligar / Chamar no WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Row 3: Container Specs & Coworkers Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Container technical details */}
                <div className="bg-dark-900 p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gold-500 block">
                    Especificações Técnicas do Produto
                  </span>
                  {containerModel ? (
                    <div className="space-y-1 text-gray-300">
                      <div>
                        Medidas:{' '}
                        <span className="font-mono text-white font-bold">
                          {containerModel.dimensions.length}m (C) × {containerModel.dimensions.width}m (L) × {containerModel.dimensions.height}m (A)
                        </span>{' '}
                        • Área: <span className="font-mono text-gold-500 font-bold">{containerModel.areaM2} m²</span>
                      </div>
                      <div>Piso/Forro: <span className="text-gray-200">{containerModel.specs.lining || containerModel.specs.floor || 'Padrão'}</span></div>
                      <div>Portas/Janelas: <span className="text-gray-200">{containerModel.specs.doors}</span></div>
                    </div>
                  ) : (
                    <div className="text-gray-400">{sale.containerName}</div>
                  )}

                  {sale.customizations.length > 0 && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] text-gold-500 uppercase font-bold block">Personalizações do Cliente:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sale.customizations.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-dark-950 text-gray-300 text-[11px] border border-white/5">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Coworkers crew */}
                <div className="bg-dark-900 p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gold-500 block">
                    Equipe Escalada para Esta Montagem ({assignedCols.length} colaboradores)
                  </span>
                  <div className="space-y-2">
                    {assignedCols.map(col => (
                      <div key={col.id} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 font-bold text-[10px] flex items-center justify-center">
                            {col.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-white font-medium block">{col.name}</span>
                            <span className="text-[10px] text-gray-400">{col.role}</span>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/55${col.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-500 hover:text-gold-400 flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{col.phone}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Interactive Assembly Checklist */}
              <div className="bg-dark-900 p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-gold-500" />
                    <span>Checklist Técnico de Instalação no Local</span>
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Marque as etapas conforme a execução no local
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {[
                    { key: 'nivelamento_sapatas', label: '1. Nivelamento a laser sapatas' },
                    { key: 'descarregamento_munck', label: '2. Içamento & Munck' },
                    { key: 'fixacao_estrutural', label: '3. Ancoragem Parabolt' },
                    { key: 'conexao_eletrica_geral', label: '4. Conexão Elétrica & LED' },
                    { key: 'ligacao_hidraulica_esgoto', label: '5. Conexão Hidráulica' },
                    { key: 'vedacao_silicone_pu', label: '6. Vedação PU Industrial' },
                    { key: 'limpeza_e_higienizacao', label: '7. Limpeza Técnica Final' },
                    { key: 'termo_entrega_assinado', label: '8. Assinatura do Cliente' },
                  ].map(item => {
                    const isChecked = sale.checklist?.[item.key] || false;
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggleChecklistItem(sale.id, item.key)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isChecked 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold' 
                            : 'bg-dark-950 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate pr-1 text-[11px]">{item.label}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-gray-600'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Field Notes by Collaborators */}
              <div className="bg-dark-900 p-4 rounded-xl border border-white/5 space-y-3">
                <span className="text-xs font-bold text-gold-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-gold-500" />
                  <span>Diário da Obra & Registro de Campo</span>
                </span>

                {/* Input for new note */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar nota sobre a montagem (ex: módulo posicionado, cliente solicitou ajuste)..."
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNote(sale.id);
                      }
                    }}
                    className="flex-1 bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <button
                    onClick={() => handleAddNote(sale.id)}
                    className="bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Salvar</span>
                  </button>
                </div>

                {/* Note list */}
                {sale.notes && sale.notes.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {sale.notes.map(note => (
                      <div key={note.id} className="bg-dark-950 p-2 rounded-xl border border-white/5 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span className="font-bold text-gold-500">{note.author}</span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-gray-200 mt-0.5">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {relevantSales.length === 0 && (
          <div className="bg-dark-850 border border-dashed border-white/10 rounded-2xl p-12 text-center space-y-3">
            <HardHat className="w-12 h-12 text-gold-500/50 mx-auto" />
            <h3 className="text-lg font-bold text-white">Nenhuma montagem agendada no momento</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {filterMode === 'minhas' 
                ? 'Você não está escalado para nenhuma montagem ativa. Alterne para "Todas as Obras" para visualizar o cronograma geral.'
                : 'Não há pedidos ou módulos na fila de montagem no momento.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
