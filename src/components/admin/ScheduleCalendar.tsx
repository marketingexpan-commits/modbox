import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Hammer, 
  HardHat, 
  Search, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  Phone,
  Briefcase
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { SaleOrder, Collaborator } from '../../types';

interface ScheduleCalendarProps {
  onNavigateToSale?: (saleId: string) => void;
  onOpenNewSale?: () => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ 
  onNavigateToSale,
  onOpenNewSale 
}) => {
  const { sales, collaborators } = useModBox();

  // Calendar navigation state (defaults to October 2026 to match mock dataset)
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Check if there are sales in 2026-10 or use current date
    const octSale = sales.find(s => s.schedule.scheduledDate.startsWith('2026-10'));
    if (octSale) {
      return new Date(2026, 9, 1); // Month 9 is October (0-indexed)
    }
    return new Date();
  });

  const [selectedDayString, setSelectedDayString] = useState<string>(() => {
    // Default to the first active scheduled date in sales or today
    const firstSale = sales.find(s => s.status !== 'concluido' && s.schedule?.scheduledDate);
    return firstSale?.schedule.scheduledDate || '2026-10-28';
  });

  const [collaboratorFilter, setCollaboratorFilter] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date(2026, 9, 28)); // ModBox demonstration anchor date
    setSelectedDayString('2026-10-28');
  };

  // Helper to test if a given YYYY-MM-DD falls within a sale's start and end date
  const isDateInSaleRange = (dateStr: string, sale: SaleOrder): boolean => {
    const start = sale.schedule.scheduledDate;
    if (!start) return false;
    
    const durationDays = sale.schedule.estimatedDurationDays || 1;
    let end = sale.schedule.endDate;
    if (!end) {
      const d = new Date(start + 'T00:00:00');
      d.setDate(d.getDate() + (durationDays - 1));
      end = d.toISOString().split('T')[0];
    }

    return dateStr >= start && dateStr <= end;
  };

  // Get all active sales that take place on a given date string
  const getSalesForDate = (dateStr: string): SaleOrder[] => {
    return sales.filter(s => {
      if (s.status === 'concluido') return false; // Show active / pending / in-progress
      const matchesDate = isDateInSaleRange(dateStr, s);
      if (!matchesDate) return false;
      if (collaboratorFilter === 'todos') return true;
      return s.assignedCollaboratorIds.includes(collaboratorFilter);
    });
  };

  // Build the calendar days grid
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      sales: SaleOrder[];
      assignedCollabCount: number;
      isAvailable: boolean;
    }> = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const daySales = getSalesForDate(dateStr);
      const uniqueCollabs = new Set<string>();
      daySales.forEach(s => s.assignedCollaboratorIds.forEach(id => uniqueCollabs.add(id)));

      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        sales: daySales,
        assignedCollabCount: uniqueCollabs.size,
        isAvailable: uniqueCollabs.size === 0
      });
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const daySales = getSalesForDate(dateStr);
      const uniqueCollabs = new Set<string>();
      daySales.forEach(s => s.assignedCollaboratorIds.forEach(id => uniqueCollabs.add(id)));

      days.push({
        dateStr,
        dayNum: day,
        isCurrentMonth: true,
        sales: daySales,
        assignedCollabCount: uniqueCollabs.size,
        isAvailable: uniqueCollabs.size === 0
      });
    }

    // Next month padding days to complete 35 or 42 cells grid
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const daySales = getSalesForDate(dateStr);
      const uniqueCollabs = new Set<string>();
      daySales.forEach(s => s.assignedCollaboratorIds.forEach(id => uniqueCollabs.add(id)));

      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: false,
        sales: daySales,
        assignedCollabCount: uniqueCollabs.size,
        isAvailable: uniqueCollabs.size === 0
      });
    }

    return days;
  }, [currentYear, currentMonth, sales, collaboratorFilter]);

  // KPIs for the active month
  const monthStats = useMemo(() => {
    const currentMonthDays = calendarDays.filter(d => d.isCurrentMonth);
    const daysWithSales = currentMonthDays.filter(d => d.sales.length > 0).length;
    const daysFullyFree = currentMonthDays.filter(d => d.assignedCollabCount === 0).length;
    
    // Find next fully available date starting from today
    const todayStr = '2026-10-28';
    const nextFree = calendarDays.find(d => d.dateStr >= todayStr && d.assignedCollabCount === 0);

    // Collaborators currently in field
    const selectedSales = sales.filter(s => isDateInSaleRange(selectedDayString, s));
    const busyCollabIds = new Set<string>();
    selectedSales.forEach(s => s.assignedCollaboratorIds.forEach(id => busyCollabIds.add(id)));

    return {
      daysWithSales,
      daysFullyFree,
      nextFreeDate: nextFree?.dateStr || 'Em breve',
      busyCollabsCount: busyCollabIds.size
    };
  }, [calendarDays, selectedDayString, sales]);

  // Selected Day Details
  const selectedDaySales = useMemo(() => {
    return sales.filter(s => isDateInSaleRange(selectedDayString, s));
  }, [selectedDayString, sales]);

  // Busy collaborators on selected day
  const selectedDayBusyCollabMap = useMemo(() => {
    const map = new Map<string, { collab: Collaborator; sale: SaleOrder }>();
    selectedDaySales.forEach(sale => {
      sale.assignedCollaboratorIds.forEach(collabId => {
        const collab = collaborators.find(c => c.id === collabId);
        if (collab) {
          map.set(collabId, { collab, sale });
        }
      });
    });
    return map;
  }, [selectedDaySales, collaborators]);

  const freeCollaboratorsOnSelectedDay = useMemo(() => {
    return collaborators.filter(c => !selectedDayBusyCollabMap.has(c.id));
  }, [collaborators, selectedDayBusyCollabMap]);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-dark-850 p-4 sm:p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Gestão Operacional & Comercial</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Agenda & Disponibilidade de Equipes</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Consulte os dias ocupados por obras, a alocação de soldadores e montadores e identifique datas livres para fechar novas vendas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenNewSale && (
            <button
              onClick={onOpenNewSale}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Agendar Nova Obra</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-dark-850 p-4 rounded-xl border border-white/5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Dias com Obras no Mês
          </span>
          <div className="text-xl font-extrabold text-amber-400 font-mono mt-1">
            {monthStats.daysWithSales} dias
          </div>
          <span className="text-[11px] text-gray-400">Com equipes em campo</span>
        </div>

        <div className="bg-dark-850 p-4 rounded-xl border border-emerald-500/20">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">
            Dias 100% Livres no Mês
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
            {monthStats.daysFullyFree} dias
          </div>
          <span className="text-[11px] text-gray-400">Disponíveis para fechar vendas</span>
        </div>

        <div className="bg-dark-850 p-4 rounded-xl border border-white/5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Ocupação em {new Date(selectedDayString + 'T00:00:00').toLocaleDateString('pt-BR')}
          </span>
          <div className="text-xl font-extrabold text-white font-mono mt-1">
            {selectedDayBusyCollabMap.size} de {collaborators.length}
          </div>
          <span className="text-[11px] text-gray-400">
            {freeCollaboratorsOnSelectedDay.length} profissionais disponíveis
          </span>
        </div>

        <div className="bg-dark-850 p-4 rounded-xl border border-gold-500/20">
          <span className="text-[10px] uppercase font-bold text-gold-400 block">
            Próxima Data Recomendada
          </span>
          <div className="text-base font-extrabold text-gold-400 font-mono mt-1">
            {monthStats.nextFreeDate !== 'Em breve' 
              ? new Date(monthStats.nextFreeDate + 'T00:00:00').toLocaleDateString('pt-BR')
              : 'Sob consulta'
            }
          </div>
          <span className="text-[11px] text-gray-400">Equipes 100% livres</span>
        </div>
      </div>

      {/* Navigation & Filter Bar */}
      <div className="bg-dark-850 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 text-sm font-bold text-white min-w-[150px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
              title="Próximo Mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleGoToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-dark-800 hover:bg-dark-750 text-gold-400 border border-gold-500/20 transition-all"
          >
            Mês Atual
          </button>
        </div>

        {/* View Mode & Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'calendar' ? 'bg-gold-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Grade do Calendário
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'timeline' ? 'bg-gold-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Visão por Colaborador
            </button>
          </div>

          {/* Filter by collaborator */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={collaboratorFilter}
              onChange={e => setCollaboratorFilter(e.target.value)}
              className="bg-dark-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer"
            >
              <option value="todos">Todos os Colaboradores</option>
              {collaborators.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name.split(' ')[0]} ({c.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main View Mode Switch */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid (2 Cols) */}
          <div className="lg:col-span-2 bg-dark-850 p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3">
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-gray-400 pb-2 border-b border-white/5 flex-wrap">
              <span className="font-semibold text-white">Legenda:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>100% Livre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Ocupação Parcial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Equipe Lotada</span>
              </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] uppercase tracking-wider text-gray-400 py-1">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            {/* Calendar Days Cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((day, idx) => {
                const isSelected = day.dateStr === selectedDayString;
                const totalCollabs = collaborators.length;
                const isFull = day.assignedCollabCount >= totalCollabs && totalCollabs > 0;
                const isPartial = day.assignedCollabCount > 0 && !isFull;
                const isFree = day.assignedCollabCount === 0;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayString(day.dateStr)}
                    className={`min-h-[85px] sm:min-h-[96px] p-2 rounded-xl text-left flex flex-col justify-between transition-all border relative overflow-hidden ${
                      isSelected
                        ? 'bg-gold-500/10 border-gold-500 shadow-lg shadow-gold-500/10 ring-1 ring-gold-500'
                        : day.isCurrentMonth
                          ? 'bg-dark-900 hover:bg-dark-800 border-white/5'
                          : 'bg-dark-950/40 text-gray-600 border-transparent hover:border-white/5'
                    }`}
                  >
                    {/* Top: Day Number + Status Dot */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-bold font-mono ${
                        isSelected 
                          ? 'text-gold-400 font-extrabold text-sm' 
                          : day.isCurrentMonth 
                            ? 'text-white' 
                            : 'text-gray-600'
                      }`}>
                        {day.dayNum}
                      </span>

                      {/* Dot Indicator */}
                      {day.isCurrentMonth && (
                        <span className={`w-2 h-2 rounded-full ${
                          isFree 
                            ? 'bg-emerald-500/60' 
                            : isFull 
                              ? 'bg-rose-500' 
                              : 'bg-amber-400'
                        }`} />
                      )}
                    </div>

                    {/* Middle: Work labels */}
                    <div className="space-y-1 w-full my-1">
                      {day.sales.slice(0, 2).map(s => (
                        <div
                          key={s.id}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-dark-750 text-gold-300 border border-gold-500/20 truncate"
                          title={`${s.orderNumber} - ${s.client.name}`}
                        >
                          {s.client.name.split(' ')[0]}
                        </div>
                      ))}
                      {day.sales.length > 2 && (
                        <span className="text-[9px] text-gray-400 block text-right font-semibold">
                          +{day.sales.length - 2} mais
                        </span>
                      )}
                    </div>

                    {/* Bottom: Availability badge */}
                    <div className="w-full text-right">
                      {isFree ? (
                        <span className="text-[9px] text-emerald-400 font-semibold">Livre</span>
                      ) : (
                        <span className="text-[9px] text-amber-300 font-semibold">
                          {day.assignedCollabCount} em obra
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Detail Side Panel (1 Col) */}
          <div className="bg-dark-850 p-5 rounded-2xl border border-gold-500/20 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Selected Day Header */}
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block">
                  Data Selecionada
                </span>
                <h3 className="text-lg font-extrabold text-white capitalize mt-0.5">
                  {new Date(selectedDayString + 'T00:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    selectedDayBusyCollabMap.size === 0 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedDayBusyCollabMap.size === 0 
                      ? '✓ Dia 100% Livre para Vendas' 
                      : `Ocupado (${selectedDayBusyCollabMap.size} colaboradores)`}
                  </span>
                </div>
              </div>

              {/* Obras on this date */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Obras em Andamento ({selectedDaySales.length})</span>
                </h4>

                {selectedDaySales.length === 0 ? (
                  <div className="bg-dark-900 p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-gray-400 space-y-1">
                    <p className="font-semibold text-emerald-400">Nenhuma obra agendada para este dia!</p>
                    <p className="text-[11px] text-gray-500">
                      Excelente data para fechar um novo cliente e já agendar a entrega.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDaySales.map(sale => {
                      const assignedCols = collaborators.filter(c => sale.assignedCollaboratorIds.includes(c.id));
                      const duration = sale.schedule.estimatedDurationDays || 1;

                      return (
                        <div
                          key={sale.id}
                          className="bg-dark-900 p-3.5 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-extrabold text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30">
                              {sale.orderNumber}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">
                              ⏱️ {duration} {duration === 1 ? 'dia' : 'dias'} de obra
                            </span>
                          </div>

                          <div>
                            <div className="font-bold text-white text-sm">{sale.client.name}</div>
                            <div className="text-gray-400 text-xs">{sale.containerName}</div>
                          </div>

                          {/* Equipe em campo nesta obra */}
                          <div className="pt-2 border-t border-white/5 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">
                              Equipe Escalada nesta Obra:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {assignedCols.map(col => (
                                <span
                                  key={col.id}
                                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-dark-750 text-white border border-white/10 flex items-center gap-1"
                                >
                                  <HardHat className="w-3 h-3 text-gold-400" />
                                  <span>{col.name.split(' ')[0]}</span>
                                  <span className="text-[10px] text-gray-400">({col.role.split(' ')[0]})</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="text-[11px] text-gray-400 flex items-center gap-1 pt-1">
                            <MapPin className="w-3 h-3 text-gold-500 shrink-0" />
                            <span className="truncate">{sale.installationAddress.city}/{sale.installationAddress.state}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Colaboradores Disponíveis no Dia */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  Profissionais Livres neste Dia ({freeCollaboratorsOnSelectedDay.length}):
                </span>
                {freeCollaboratorsOnSelectedDay.length === 0 ? (
                  <p className="text-xs text-rose-400">Todos os colaboradores estão ocupados nesta data.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {freeCollaboratorsOnSelectedDay.map(c => (
                      <span
                        key={c.id}
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{c.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-emerald-400/70">({c.role.split(' ')[0]})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action footer */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-[11px] text-gray-500">
                💡 <strong>Dica Comercial:</strong> Ao negociar com novos clientes, verifique se soldadores e líderes estão livres para não encavalar montagens.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Timeline / Matrix View by Collaborator */
        <div className="bg-dark-850 p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">Disponibilidade Individual da Equipe</h3>
              <p className="text-xs text-gray-400">
                Veja onde cada profissional está alocado e qual é o próximo dia livre de cada um.
              </p>
            </div>
            <span className="text-xs font-mono text-gold-400">
              Total: {collaborators.length} Colaboradores
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborators.map(collab => {
              // Find sales assigned to this collaborator
              const collabSales = sales.filter(s => s.status !== 'concluido' && s.assignedCollaboratorIds.includes(collab.id));
              
              // Check if busy on selected date
              const isBusyToday = collabSales.some(s => isDateInSaleRange(selectedDayString, s));
              const currentActiveSale = collabSales.find(s => isDateInSaleRange(selectedDayString, s));

              return (
                <div
                  key={collab.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isBusyToday
                      ? 'bg-dark-900 border-amber-500/30'
                      : 'bg-dark-900 border-emerald-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{collab.name}</h4>
                      <p className="text-xs text-gold-400 font-semibold">{collab.role}</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Habilidades: {collab.skills.slice(0, 3).join(', ')}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      isBusyToday
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isBusyToday ? 'Em Obra' : 'Disponível'}
                    </span>
                  </div>

                  {/* Active or Upcoming Assignment */}
                  <div className="mt-3 pt-3 border-t border-white/5 text-xs space-y-1">
                    {currentActiveSale ? (
                      <div className="bg-dark-950 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] uppercase font-bold text-amber-400 block">
                          Alocado nesta data:
                        </span>
                        <div className="font-bold text-white text-xs mt-0.5">
                          {currentActiveSale.orderNumber} — {currentActiveSale.client.name}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {currentActiveSale.containerName} ({currentActiveSale.installationAddress.city}/{currentActiveSale.installationAddress.state})
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          Período: {new Date(currentActiveSale.schedule.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')} até {new Date((currentActiveSale.schedule.endDate || currentActiveSale.schedule.scheduledDate) + 'T00:00:00').toLocaleDateString('pt-BR')} ({currentActiveSale.schedule.estimatedDurationDays || 1} dias)
                        </div>
                      </div>
                    ) : (
                      <div className="text-emerald-400 font-semibold flex items-center gap-1.5 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>100% Livre para novas montagens nesta data</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

