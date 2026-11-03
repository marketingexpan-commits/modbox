import React, { useState } from 'react';
import { 
  Truck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  Calendar, 
  Box, 
  FileText, 
  Plus, 
  ChevronRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { SaleOrder, ProductionStatus } from '../../types';
import { PRODUCTION_STAGES_CONFIG } from '../../data/mockData';
import { Modal } from '../common/Modal';

export const ProductionPipeline: React.FC = () => {
  const { sales, updateSaleStatus, collaborators, toggleChecklistItem, addNoteToSale } = useModBox();

  const [selectedSaleForDetails, setSelectedSaleForDetails] = useState<SaleOrder | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const handleAdvanceStatus = (sale: SaleOrder) => {
    const currentIndex = PRODUCTION_STAGES_CONFIG.findIndex(s => s.id === sale.status);
    if (currentIndex < PRODUCTION_STAGES_CONFIG.length - 1) {
      const nextStage = PRODUCTION_STAGES_CONFIG[currentIndex + 1].id;
      updateSaleStatus(sale.id, nextStage);
    }
  };

  const handleRevertStatus = (sale: SaleOrder) => {
    const currentIndex = PRODUCTION_STAGES_CONFIG.findIndex(s => s.id === sale.status);
    if (currentIndex > 0) {
      const prevStage = PRODUCTION_STAGES_CONFIG[currentIndex - 1].id;
      updateSaleStatus(sale.id, prevStage);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaleForDetails || !newNoteText.trim()) return;
    addNoteToSale(selectedSaleForDetails.id, newNoteText.trim(), 'Gestão ModBox');
    setNewNoteText('');
  };

  // Re-fetch selected sale from context state to keep modal live
  const activeModalSale = selectedSaleForDetails 
    ? sales.find(s => s.id === selectedSaleForDetails.id) || selectedSaleForDetails 
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-4 sm:p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white">Status da Produção & Montagem</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Andamento de cada produto, da fabricação à entrega.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'kanban' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Quadro Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'list' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Lista de Produção
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1400px]">
            {PRODUCTION_STAGES_CONFIG.map(stage => {
              const stageSales = sales.filter(s => s.status === stage.id);

              return (
                <div
                  key={stage.id}
                  className="flex-1 bg-dark-900 border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[500px]"
                >
                  {/* Column Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 text-xs font-mono font-bold flex items-center justify-center border border-gold-500/30">
                          {stage.stepNumber}
                        </span>
                        <h4 className="font-bold text-white text-xs">{stage.label}</h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-gold-400 px-2 py-0.5 rounded bg-dark-800">
                        {stageSales.length}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-500 mb-3 line-clamp-1">
                      {stage.description}
                    </p>

                    {/* Cards in this stage */}
                    <div className="space-y-3">
                      {stageSales.map(sale => {
                        const assignedCols = collaborators.filter(c => sale.assignedCollaboratorIds.includes(c.id));
                        const progressPct = Math.round((stage.stepNumber / PRODUCTION_STAGES_CONFIG.length) * 100);

                        return (
                          <div
                            key={sale.id}
                            className="bg-dark-850 border border-white/5 hover:border-gold-500/40 rounded-xl p-3.5 space-y-3 transition-all shadow-md group cursor-pointer"
                            onClick={() => setSelectedSaleForDetails(sale)}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-mono text-[11px] font-bold text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
                                {sale.orderNumber}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {progressPct}%
                              </span>
                            </div>

                            <div>
                              <h5 className="font-bold text-white text-xs line-clamp-1 group-hover:text-gold-300 transition-colors">
                                {sale.containerName}
                              </h5>
                              <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                                Cliente: {sale.client.name}
                              </p>
                              <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1 truncate">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span>{sale.installationAddress.city}/{sale.installationAddress.state}</span>
                              </p>
                            </div>

                            {/* Scheduled date */}
                            <div className="flex items-center gap-1 text-[11px] text-gold-400/90 font-medium bg-dark-900 p-1.5 rounded-lg border border-white/5">
                              <Calendar className="w-3 h-3 text-gold-500" />
                              <span>Instalação: {new Date(sale.schedule.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                            </div>

                            {/* Collaborator Avatars */}
                            <div className="flex items-center justify-between pt-1 border-t border-white/5">
                              <div className="flex -space-x-1.5 overflow-hidden">
                                {assignedCols.map(c => (
                                  <div
                                    key={c.id}
                                    title={`${c.name} (${c.role})`}
                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-dark-850 bg-gold-500/20 text-gold-400 text-[10px] font-bold text-center leading-5"
                                  >
                                    {c.name.charAt(0)}
                                  </div>
                                ))}
                              </div>

                              {/* Advance Button */}
                              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => handleRevertStatus(sale)}
                                  title="Voltar etapa"
                                  className="p-1 text-gray-500 hover:text-white rounded hover:bg-dark-750"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleAdvanceStatus(sale)}
                                  title="Avançar etapa"
                                  className="p-1 text-gold-400 hover:text-white rounded hover:bg-dark-750 font-bold"
                                >
                                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {stageSales.length === 0 && (
                        <div className="border border-dashed border-white/5 rounded-xl p-4 text-center text-[11px] text-gray-500">
                          Nenhum produto nesta fase
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          {sales.map(sale => {
            const stage = PRODUCTION_STAGES_CONFIG.find(s => s.id === sale.status);
            const progressPct = Math.round(((stage?.stepNumber || 1) / PRODUCTION_STAGES_CONFIG.length) * 100);
            const assignedCols = collaborators.filter(c => sale.assignedCollaboratorIds.includes(c.id));

            return (
              <div
                key={sale.id}
                onClick={() => setSelectedSaleForDetails(sale)}
                className="bg-dark-850 border border-white/5 hover:border-gold-500/30 rounded-2xl p-4 cursor-pointer transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
                        {sale.orderNumber}
                      </span>
                      <h4 className="font-bold text-white text-sm">{sale.containerName}</h4>
                      <span className="text-xs text-gray-400">• Cliente: {sale.client.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Local de montagem: {sale.installationAddress.street}, {sale.installationAddress.number} - {sale.installationAddress.city}/{sale.installationAddress.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-gold-400 uppercase tracking-wide block">
                        {stage?.label}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        Etapa {stage?.stepNumber} de {PRODUCTION_STAGES_CONFIG.length} ({progressPct}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleRevertStatus(sale)}
                        title="Voltar etapa"
                        className="p-1.5 bg-dark-800 text-gray-400 hover:text-white rounded-lg border border-white/5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAdvanceStatus(sale)}
                        title="Avançar etapa"
                        className="p-1.5 bg-gold-500 text-black hover:bg-gold-400 font-bold rounded-lg"
                      >
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-gold-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detalhes da Obra / Produto & Diário */}
      <Modal
        isOpen={!!activeModalSale}
        onClose={() => setSelectedSaleForDetails(null)}
        title={activeModalSale ? `Acompanhamento: ${activeModalSale.orderNumber}` : ''}
        subtitle={activeModalSale ? `${activeModalSale.containerName} - Cliente: ${activeModalSale.client.name}` : ''}
        maxWidth="3xl"
      >
        {activeModalSale && (
          <div className="space-y-6 text-xs text-gray-200">
            {/* Stage Progress Stepper */}
            <div className="bg-dark-950 p-4 rounded-xl border border-gold-500/20">
              <span className="text-[10px] uppercase font-bold text-gold-400 block mb-2">
                Linha do Tempo Industrial
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center">
                {PRODUCTION_STAGES_CONFIG.map(st => {
                  const currentStIdx = PRODUCTION_STAGES_CONFIG.findIndex(s => s.id === activeModalSale.status);
                  const isDone = st.stepNumber <= currentStIdx + 1;
                  const isCurrent = st.id === activeModalSale.status;

                  return (
                    <div
                      key={st.id}
                      className={`p-1.5 rounded-lg border text-[10px] ${
                        isCurrent
                          ? 'bg-gold-500 text-black font-extrabold border-gold-500'
                          : isDone
                          ? 'bg-gold-500/15 text-gold-300 border-gold-500/30'
                          : 'bg-dark-900 text-gray-500 border-white/5'
                      }`}
                    >
                      <div className="font-mono">{st.stepNumber}</div>
                      <div className="truncate font-medium">{st.label.split(' ')[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address & Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-dark-900 p-3.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-gold-400 block mb-1">
                  Local da Montagem
                </span>
                <p className="font-semibold text-white">
                  {activeModalSale.installationAddress.street}, {activeModalSale.installationAddress.number}
                </p>
                <p className="text-gray-400">
                  {activeModalSale.installationAddress.neighborhood} - {activeModalSale.installationAddress.city}/{activeModalSale.installationAddress.state}
                </p>
                <div className="mt-2 text-gold-300 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" />
                  <span>{new Date(activeModalSale.schedule.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')} às {activeModalSale.schedule.scheduledTime}</span>
                </div>
              </div>

              <div className="bg-dark-900 p-3.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-gold-400 block mb-1">
                  Colaboradores Escalados
                </span>
                <div className="space-y-1.5 mt-2">
                  {collaborators
                    .filter(c => activeModalSale.assignedCollaboratorIds.includes(c.id))
                    .map(col => (
                      <div key={col.id} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white">{col.name}</span>
                        <span className="text-[10px] text-gold-400">{col.role}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Checklist de Campo */}
            <div className="bg-dark-900 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold text-gold-400 block mb-3">
                Checklist Operacional de Montagem & Qualidade
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'nivelamento_sapatas', label: '1. Nivelamento a laser das sapatas de concreto' },
                  { key: 'descarregamento_munck', label: '2. Içamento e posicionamento com munck' },
                  { key: 'fixacao_estrutural', label: '3. Ancoragem mecânica com chumbadores parabolt' },
                  { key: 'conexao_eletrica_geral', label: '4. Conexão de entrada e testes de disjuntores' },
                  { key: 'ligacao_hidraulica_esgoto', label: '5. Teste de pressão d\'água e vazão de esgoto' },
                  { key: 'vedacao_silicone_pu', label: '6. Vedação perimetral com silicone PU industrial' },
                  { key: 'limpeza_e_higienizacao', label: '7. Limpeza técnica de entrega pós-obra' },
                  { key: 'termo_entrega_assinado', label: '8. Assinatura do termo de entrega pelo cliente' },
                ].map(item => {
                  const isChecked = activeModalSale.checklist?.[item.key] || false;
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleChecklistItem(activeModalSale.id, item.key)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' 
                          : 'bg-dark-950 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="font-medium text-xs">{item.label}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-gray-600'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Field Notes Logger */}
            <div className="bg-dark-900 p-4 rounded-xl border border-white/5 space-y-3">
              <span className="text-[10px] uppercase font-bold text-gold-400 block">
                Diário de Ocorrências & Observações de Campo
              </span>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva uma observação de campo..."
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  className="flex-1 bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                />
                <button
                  type="submit"
                  className="bg-gold-500 text-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-gold-400 transition-colors"
                >
                  Registrar
                </button>
              </form>

              {/* Existing Notes */}
              <div className="space-y-2 mt-3 max-h-48 overflow-y-auto">
                {activeModalSale.notes && activeModalSale.notes.length > 0 ? (
                  activeModalSale.notes.map(note => (
                    <div key={note.id} className="bg-dark-950 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span className="font-bold text-gold-400">{note.author}</span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-gray-200 text-xs leading-relaxed">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs italic">Nenhuma anotação registrada ainda.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
