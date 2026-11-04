import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  HardHat, 
  Shield, 
  FileText,
  DollarSign,
  Coins,
  Camera,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { Collaborator, CollaboratorStatus, PaymentModel, CashFlowEntry } from '../../types';
import { Modal } from '../common/Modal';
import { CollaboratorAvatar } from '../common/CollaboratorAvatar';
import { CameraCaptureModal } from '../common/CameraCaptureModal';
import { processProfilePhoto } from '../../services/profilePhoto';

const formatCurrency = (val: number) =>
  (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatAdmissionDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

export const CollaboratorsManager: React.FC = () => {
  const { 
    collaborators, 
    addCollaborator, 
    updateCollaborator, 
    deleteCollaborator, 
    sales,
    cashFlow,
    addCashFlowEntry,
    deleteCashFlowEntry,
    addProjectExpense,
    deleteProjectExpense
  } = useModBox();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);
  const [viewingCollabId, setViewingCollabId] = useState<string | null>(null);

  // Foto 3x4 do colaborador
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Celular/tablet: usa a câmera nativa do aparelho. Notebook/desktop: abre a webcam no sistema.
  const isTouchDevice =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const processPhotoFile = async (file: File) => {
    setPhotoLoading(true);
    try {
      setPhotoUrl(await processProfilePhoto(file));
    } catch (err: any) {
      alert(err?.message || 'Não foi possível carregar a foto. Tente novamente.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await processPhotoFile(file);
  };

  // Modal Lançar Valor Extra / Pagamento
  const [extraPaymentCollab, setExtraPaymentCollab] = useState<Collaborator | null>(null);
  const [extraPaymentType, setExtraPaymentType] = useState<'extra' | 'salario' | 'diaria'>('extra');
  const [extraDaysCount, setExtraDaysCount] = useState<number>(1);
  const [extraAmount, setExtraAmount] = useState<string>('');
  const [extraReason, setExtraReason] = useState<string>('');
  const [extraDate, setExtraDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [extraWorkedDate, setExtraWorkedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [extraWorkedDatesList, setExtraWorkedDatesList] = useState<string[]>([]);
  const [extraSaleId, setExtraSaleId] = useState<string>('');

  // Form State
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [rg, setRg] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Montador de Campo');
  const [skillsStr, setSkillsStr] = useState('Nivelamento, Fixação, Içamento');
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<CollaboratorStatus>('disponivel');
  const [paymentModel, setPaymentModel] = useState<PaymentModel>('diaria');
  const [dailyRate, setDailyRate] = useState<number>(280);
  const [monthlySalary, setMonthlySalary] = useState<number>(3000);
  const [extraRate, setExtraRate] = useState<number>(150);

  // Address
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [zipCode, setZipCode] = useState('');
  const [landmark, setLandmark] = useState('');

  const openNewModal = () => {
    setEditingCollab(null);
    setPhotoUrl('');
    setName('');
    setCpf('');
    setPinInput('');
    setRg('');
    setBirthDate('1992-05-10');
    setPhone('');
    setEmail('');
    setRole('Montador Especialista de Estruturas');
    setSkillsStr('Solda, Içamento Munck, Nivelamento');
    setAdmissionDate(new Date().toISOString().split('T')[0]);
    setStatus('disponivel');
    setPaymentModel('diaria');
    setDailyRate(280);
    setMonthlySalary(3000);
    setExtraRate(150);
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('São Paulo');
    setState('SP');
    setZipCode('');
    setLandmark('');
    setIsModalOpen(true);
  };

  const openEditModal = (col: Collaborator) => {
    setEditingCollab(col);
    setPhotoUrl(col.photoUrl || '');
    setName(col.name);
    setCpf(col.cpf);
    setPinInput('');
    setRg(col.rg);
    setBirthDate(col.birthDate || '');
    setPhone(col.phone);
    setEmail(col.email);
    setRole(col.role);
    setSkillsStr(col.skills.join(', '));
    setAdmissionDate(col.admissionDate);
    setStatus(col.status);
    setPaymentModel(col.paymentModel || 'diaria');
    setDailyRate(col.dailyRate || 280);
    setMonthlySalary(col.monthlySalary || 3000);
    setExtraRate(col.extraRate !== undefined ? col.extraRate : 150);
    setStreet(col.address.street);
    setNumber(col.address.number);
    setComplement(col.address.complement || '');
    setNeighborhood(col.address.neighborhood);
    setCity(col.address.city);
    setState(col.address.state);
    setZipCode(col.address.zipCode);
    setLandmark(col.address.landmark || '');
    setIsModalOpen(true);
  };

  const openExtraPaymentModal = (col: Collaborator, defaultType?: 'extra' | 'salario' | 'diaria') => {
    setExtraPaymentCollab(col);
    const isMensal = col.paymentModel === 'mensal';
    const type = defaultType || (isMensal ? 'extra' : 'diaria');
    const todayStr = new Date().toISOString().split('T')[0];
    setExtraPaymentType(type);
    setExtraDaysCount(1);
    setExtraDate(todayStr);
    setExtraWorkedDate(todayStr);
    setExtraWorkedDatesList([todayStr]);
    setExtraSaleId('');

    if (type === 'extra') {
      const rate = col.extraRate || col.dailyRate || 150;
      setExtraAmount(String(rate));
      setExtraReason('Dia extra / Viagem para outra cidade');
    } else if (type === 'salario') {
      setExtraAmount(String(col.monthlySalary || 3000));
      setExtraReason('Pagamento de Salário Mensal');
    } else {
      setExtraAmount(String(col.dailyRate || 280));
      setExtraReason('Diária de Campo / Bonificação');
    }
  };

  const handlePaymentTypeChange = (type: 'extra' | 'salario' | 'diaria') => {
    if (!extraPaymentCollab) return;
    const todayStr = new Date().toISOString().split('T')[0];
    setExtraPaymentType(type);
    setExtraDaysCount(1);
    setExtraWorkedDatesList([todayStr]);
    if (type === 'extra') {
      const rate = extraPaymentCollab.extraRate || extraPaymentCollab.dailyRate || 150;
      setExtraAmount(String(rate));
      setExtraReason('Dia extra / Viagem para outra cidade');
    } else if (type === 'salario') {
      setExtraAmount(String(extraPaymentCollab.monthlySalary || 3000));
      setExtraReason('Pagamento de Salário Mensal');
    } else {
      setExtraAmount(String(extraPaymentCollab.dailyRate || 280));
      setExtraReason('Diária de Campo / Bonificação');
    }
  };

  const handleExtraDaysChange = (days: number) => {
    const validDays = Math.max(1, days || 1);
    setExtraDaysCount(validDays);
    if (!extraPaymentCollab) return;
    if (extraPaymentType === 'extra') {
      const unitRate = extraPaymentCollab.extraRate || extraPaymentCollab.dailyRate || 150;
      setExtraAmount(String(unitRate * validDays));
    } else if (extraPaymentType === 'diaria') {
      const unitRate = extraPaymentCollab.dailyRate || 280;
      setExtraAmount(String(unitRate * validDays));
    }
  };

  const handleUpdateWorkedDateAtIndex = (index: number, newDate: string) => {
    const updated = [...extraWorkedDatesList];
    updated[index] = newDate;
    setExtraWorkedDatesList(updated);
  };

  const handleAddWorkedDate = () => {
    const lastDateStr = extraWorkedDatesList[extraWorkedDatesList.length - 1] || new Date().toISOString().split('T')[0];
    const nextDay = new Date(`${lastDateStr}T12:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDateStr = nextDay.toISOString().split('T')[0];
    const updated = [...extraWorkedDatesList, nextDateStr];
    setExtraWorkedDatesList(updated);
    handleExtraDaysChange(updated.length);
  };

  const handleRemoveWorkedDateAtIndex = (indexToRemove: number) => {
    if (extraWorkedDatesList.length <= 1) return;
    const updated = extraWorkedDatesList.filter((_, idx) => idx !== indexToRemove);
    setExtraWorkedDatesList(updated);
    handleExtraDaysChange(updated.length);
  };

  const handleLaunchExtraPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraPaymentCollab) return;
    const numericAmount = parseFloat(extraAmount);
    if (!numericAmount || numericAmount <= 0) {
      alert('Informe um valor válido maior que zero.');
      return;
    }

    const workedDatesToRecord =
      extraPaymentType === 'salario'
        ? []
        : extraWorkedDatesList.length > 0
        ? extraWorkedDatesList
        : extraWorkedDate
        ? [extraWorkedDate]
        : [];

    const formattedWorkedDates = workedDatesToRecord.map(d => formatAdmissionDate(d)).join(', ');
    const workedDatesSuffix = formattedWorkedDates
      ? ` • ${workedDatesToRecord.length > 1 ? 'Dias' : 'Dia'}: ${formattedWorkedDates}`
      : '';

    const typeLabel =
      extraPaymentType === 'extra'
        ? `Valor Extra (${extraDaysCount}x${workedDatesSuffix})`
        : extraPaymentType === 'salario'
        ? 'Salário Mensal'
        : `Diária (${extraDaysCount}x${workedDatesSuffix})`;

    const description = `${typeLabel} — ${extraPaymentCollab.name}${extraReason.trim() ? ` (${extraReason.trim()})` : ''}`;

    if (extraSaleId) {
      addProjectExpense(extraSaleId, {
        description,
        amount: numericAmount,
        category: 'mao_de_obra_montagem',
        date: extraDate,
        notes: `${extraReason.trim() || typeLabel}. Colaborador: ${extraPaymentCollab.name} (${extraPaymentCollab.role}).`,
        collaboratorId: extraPaymentCollab.id,
        daysCount: extraPaymentType === 'salario' ? 1 : extraDaysCount
      });
    } else {
      addCashFlowEntry({
        type: 'despesa',
        category: 'mao_de_obra_montagem',
        description,
        amount: numericAmount,
        date: extraDate,
        clientOrSupplier: extraPaymentCollab.name
      });
    }

    setExtraPaymentCollab(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) {
      alert('Informe um CPF válido com 11 dígitos.');
      return;
    }
    const duplicate = collaborators.some(
      c => c.cpf.replace(/\D/g, '') === digits && c.id !== editingCollab?.id
    );
    if (duplicate) {
      alert('Já existe um colaborador cadastrado com este CPF.');
      return;
    }
    if (!editingCollab && pinInput.length !== 6) {
      alert('Defina um PIN provisório de 6 dígitos para o primeiro acesso.');
      return;
    }
    if (editingCollab && pinInput && pinInput.length !== 6) {
      alert('O novo PIN deve ter 6 dígitos (ou deixe em branco para manter o atual).');
      return;
    }

    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    const collabData: Omit<Collaborator, 'id'> = {
      name,
      cpf,
      rg,
      birthDate,
      phone,
      email,
      role,
      skills,
      admissionDate,
      status,
      paymentModel,
      dailyRate: paymentModel === 'diaria' ? Number(dailyRate) : Number(extraRate || dailyRate || 0),
      monthlySalary: paymentModel === 'mensal' ? Number(monthlySalary) : undefined,
      extraRate: paymentModel === 'mensal' ? Number(extraRate) : undefined,
      completedInstallations: editingCollab ? editingCollab.completedInstallations : 0,
      photoUrl,
      address: {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        landmark
      },
      ...(pinInput ? { pin: pinInput, mustChangePin: true } : {})
    };

    if (editingCollab) {
      updateCollaborator(editingCollab.id, collabData);
    } else {
      addCollaborator(collabData);
    }
    setIsModalOpen(false);
  };

  const filteredCollaborators = collaborators.filter(col => {
    const matchesSearch = col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          col.cpf.includes(searchTerm) ||
                          col.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          col.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || col.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-4 sm:p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white">Colaboradores</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Cadastro, especialidades e pagamentos da equipe.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Novo Colaborador</span>
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF, cargo ou cidade..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-dark-850 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'todos' ? 'bg-gold-500 text-black font-bold' : 'bg-dark-850 text-gray-400 hover:text-white'
            }`}
          >
            Todos ({collaborators.length})
          </button>
          <button
            onClick={() => setStatusFilter('em_montagem')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'em_montagem' ? 'bg-amber-500 text-black font-bold' : 'bg-dark-850 text-gray-400 hover:text-white'
            }`}
          >
            Em Montagem de Campo ({collaborators.filter(c => c.status === 'em_montagem').length})
          </button>
          <button
            onClick={() => setStatusFilter('disponivel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'disponivel' ? 'bg-emerald-500 text-black font-bold' : 'bg-dark-850 text-gray-400 hover:text-white'
            }`}
          >
            Disponíveis ({collaborators.filter(c => c.status === 'disponivel').length})
          </button>
        </div>
      </div>

      {/* Collaborators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCollaborators.map(collab => {
          // Find containers assigned to this collaborator
          const assignedSales = sales.filter(s => s.assignedCollaboratorIds.includes(collab.id) && s.status !== 'concluido');

          return (
            <div
              key={collab.id}
              onClick={() => setViewingCollabId(collab.id)}
              className="bg-dark-850 border border-white/10 rounded-2xl p-4 hover:border-gold-500/40 transition-all cursor-pointer space-y-3"
              title="Clique para ver a ficha completa"
            >
              {/* Foto, nome, cargo e status */}
              <div className="flex items-start gap-3">
                <CollaboratorAvatar
                  name={collab.name}
                  photoUrl={collab.photoUrl}
                  sizeClass="w-14 h-[4.667rem]"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base leading-tight break-words">{collab.name}</h3>
                      <p className="text-xs text-gold-400 font-medium mt-0.5 leading-snug">{collab.role}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      collab.status === 'em_montagem'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : collab.status === 'disponivel'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {collab.status === 'em_montagem' ? 'Em Obra' : collab.status === 'disponivel' ? 'Disponível' : collab.status}
                    </span>
                  </div>

                  {/* Remuneração resumida e ocupação */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                    {collab.paymentModel === 'mensal' ? (
                      <span className="text-gray-300">
                        <span className="font-bold uppercase text-gold-400">Mensalista</span>
                        {' · '}
                        <span className="font-mono font-bold text-emerald-400">{formatCurrency(collab.monthlySalary || 0)}</span>
                        <span className="text-gray-500">/mês</span>
                        {(collab.extraRate || 0) > 0 && (
                          <span className="text-amber-300"> · Extra +{formatCurrency(collab.extraRate || 0)}</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-300">
                        <span className="font-bold uppercase text-emerald-300">Diarista</span>
                        {' · '}
                        <span className="font-mono font-bold text-emerald-400">{formatCurrency(collab.dailyRate || 280)}</span>
                        <span className="text-gray-500">/dia</span>
                      </span>
                    )}

                    {assignedSales.length > 0 ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        {assignedSales.length} {assignedSales.length === 1 ? 'obra' : 'obras'}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Livre
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contato e ações rápidas */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5">
                <a
                  href={`https://wa.me/55${collab.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-gold-400 hover:underline flex items-center gap-1.5 text-xs font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{collab.phone}</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      openExtraPaymentModal(collab);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Lançar valor extra (viagem / dia extra), diária ou salário no financeiro"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{collab.paymentModel === 'mensal' ? 'Extra / Salário' : 'Diária / Extra'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      openEditModal(collab);
                    }}
                    title="Editar Colaborador"
                    className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-dark-750 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Webcam (notebook / desktop) para foto do colaborador */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={processPhotoFile}
      />

      {/* Ficha completa do colaborador (parte interna) */}
      {(() => {
        const viewing = collaborators.find(c => c.id === viewingCollabId);
        if (!viewing) return null;

        const viewingSales = sales.filter(s => s.assignedCollaboratorIds.includes(viewing.id) && s.status !== 'concluido');
        const viewingHistory = cashFlow
          .filter(
            entry =>
              entry.type === 'despesa' &&
              (entry.clientOrSupplier === viewing.name ||
                entry.description.toLowerCase().includes(viewing.name.toLowerCase()))
          )
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5);

        return (
          <Modal
            isOpen={true}
            onClose={() => setViewingCollabId(null)}
            title={viewing.name}
            subtitle={viewing.role}
            maxWidth="2xl"
          >
            <div className="space-y-4 text-xs">
              {/* Foto, status e remuneração */}
              <div className="flex items-start gap-4">
                <CollaboratorAvatar
                  name={viewing.name}
                  photoUrl={viewing.photoUrl}
                  sizeClass="w-24 h-32"
                  textClass="text-3xl"
                />
                <div className="space-y-2 min-w-0">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    viewing.status === 'em_montagem'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : viewing.status === 'disponivel'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {viewing.status === 'em_montagem' ? 'Em Obra' : viewing.status === 'disponivel' ? 'Disponível' : viewing.status}
                  </span>

                  <div className="text-gray-300">
                    {viewing.paymentModel === 'mensal' ? (
                      <>
                        <span className="font-bold uppercase text-gold-400">Mensalista</span>
                        {' · '}
                        <span className="font-mono font-bold text-emerald-400">{formatCurrency(viewing.monthlySalary || 0)}</span>
                        <span className="text-gray-500">/mês</span>
                        {(viewing.extraRate || 0) > 0 && (
                          <span className="text-amber-300"> · Extra +{formatCurrency(viewing.extraRate || 0)}</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="font-bold uppercase text-emerald-300">Diarista</span>
                        {' · '}
                        <span className="font-mono font-bold text-emerald-400">{formatCurrency(viewing.dailyRate || 280)}</span>
                        <span className="text-gray-500">/dia</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-300">
                    <Award className="w-4 h-4 text-gold-400" />
                    <span>
                      <strong className="text-white font-mono">{viewing.completedInstallations}</strong> montagens concluídas
                    </span>
                  </div>

                  <div className="text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>Admissão: {formatAdmissionDate(viewing.admissionDate)}</span>
                  </div>

                  <div className="text-[11px]">
                    {viewingSales.length > 0 ? (
                      <span className="text-amber-400 font-semibold">
                        {viewingSales.length} {viewingSales.length === 1 ? 'obra em andamento' : 'obras em andamento'}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium">Livre no momento</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Documentos e contato */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">CPF</span>
                  <span className="font-mono text-white mt-0.5 block">{viewing.cpf}</span>
                </div>
                <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">RG</span>
                  <span className="font-mono text-white mt-0.5 block">{viewing.rg}</span>
                </div>
                <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Telefone / WhatsApp</span>
                  <a
                    href={`https://wa.me/55${viewing.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-400 hover:underline flex items-center gap-1 mt-0.5 font-medium"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{viewing.phone}</span>
                  </a>
                </div>
                <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">E-mail</span>
                  <span className="text-gray-300 break-all mt-0.5 block">{viewing.email || '—'}</span>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-dark-900 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-gold-400/80 block mb-1">Endereço Residencial</span>
                <div className="text-gray-200 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                  <span>
                    {viewing.address.street}, {viewing.address.number}
                    {viewing.address.complement && ` (${viewing.address.complement})`}<br />
                    {viewing.address.neighborhood} - {viewing.address.city}/{viewing.address.state} • CEP {viewing.address.zipCode}
                  </span>
                </div>
                {viewing.address.landmark && (
                  <div className="text-[11px] text-gray-400 mt-1 pl-5">Ref: {viewing.address.landmark}</div>
                )}
              </div>

              {/* Habilidades */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Especialidades & Habilidades</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewing.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-dark-950 text-gray-300 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Últimos pagamentos */}
              {viewingHistory.length > 0 && (
                <div className="bg-dark-900/70 p-3 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Últimos pagamentos lançados</span>
                  {viewingHistory.map(item => (
                    <div
                      key={item.id}
                      title={item.description}
                      className="flex items-center justify-between gap-2 text-[11px] bg-dark-950 px-2.5 py-1.5 rounded-lg border border-white/5"
                    >
                      <div className="truncate text-gray-300 flex-1 min-w-0">
                        <span className="text-gray-500 font-mono mr-1.5">[{formatAdmissionDate(item.date)}]</span>
                        <span>{item.description}</span>
                      </div>
                      <span className="font-mono font-bold text-amber-400 shrink-0">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Ações */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Excluir cadastro do colaborador ${viewing.name}?`)) {
                      deleteCollaborator(viewing.id);
                      setViewingCollabId(null);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setViewingCollabId(null);
                      openExtraPaymentModal(viewing);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 font-bold transition-all cursor-pointer"
                  >
                    <Coins className="w-4 h-4" />
                    <span>{viewing.paymentModel === 'mensal' ? 'Extra / Salário' : 'Diária / Extra'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewingCollabId(null);
                      openEditModal(viewing);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Modal Cadastrar / Editar Colaborador */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollab ? 'Editar Dados do Colaborador' : 'Cadastrar Novo Colaborador'}
        subtitle="Informe os dados pessoais, endereço residencial e cargo do profissional"
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Dados Pessoais */}
          <div>
            <h4 className="font-bold text-gold-400 uppercase tracking-wider mb-2">
              1. Dados Pessoais & Documentação
            </h4>

            {/* Foto 3x4 do colaborador */}
            <div className="flex items-center gap-4 mb-4 bg-dark-900/60 p-3 rounded-xl border border-white/5">
              <div className="relative shrink-0">
                <CollaboratorAvatar
                  name={name || '?'}
                  photoUrl={photoUrl}
                  sizeClass="w-24 h-32"
                  textClass="text-3xl"
                />
                {photoLoading && (
                  <div className="absolute inset-0 rounded-xl bg-black/70 flex items-center justify-center text-[10px] text-gold-400 font-bold">
                    Processando...
                  </div>
                )}
              </div>

              <div className="space-y-2 min-w-0">
                <div>
                  <span className="text-gray-300 font-semibold block">Foto do Colaborador (3x4)</span>
                  <span className="text-[10px] text-gray-500 block">
                    Tire a foto com a câmera do celular ou escolha uma da galeria. Ela é ajustada automaticamente para 3x4.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isTouchDevice ? (
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-black font-bold cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Tirar foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={handlePhotoSelected}
                      />
                    </label>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-black font-bold cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Tirar foto</span>
                    </button>
                  )}

                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-gold-400 border border-gold-500/30 font-bold cursor-pointer transition-colors">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Galeria</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelected}
                    />
                  </label>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-gray-300 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Carlos da Silva"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">CPF *</label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">
                  {editingCollab ? 'Redefinir PIN (opcional)' : 'PIN provisório *'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={editingCollab ? 'Deixe em branco para manter' : '6 dígitos'}
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono tracking-widest focus:outline-none focus:border-gold-500"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Login do colaborador = CPF. No primeiro acesso ele será obrigado a trocar este PIN.
                </p>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">RG *</label>
                <input
                  type="text"
                  required
                  placeholder="00.000.000-0 SSP/SP"
                  value={rg}
                  onChange={e => setRg(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 98888-7777"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-gray-300 block mb-1">E-mail Corporativo ou Pessoal *</label>
                <input
                  type="email"
                  required
                  placeholder="colaborador@modbox.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Endereço Residencial */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="font-bold text-gold-400 uppercase tracking-wider mb-2">
              2. Endereço Residencial
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-gray-300 block mb-1">Rua / Avenida *</label>
                <input
                  type="text"
                  required
                  placeholder="Rua das Indústrias"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Número *</label>
                <input
                  type="text"
                  required
                  placeholder="123"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Complemento</label>
                <input
                  type="text"
                  placeholder="Apto 12, Bloco B"
                  value={complement}
                  onChange={e => setComplement(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  placeholder="Bairro Industrial"
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  placeholder="São Paulo"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">CEP *</label>
                <input
                  type="text"
                  required
                  placeholder="00000-000"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-300 block mb-1">Ponto de Referência</label>
                <input
                  type="text"
                  placeholder="Próximo à estação..."
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Dados Profissionais */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="font-bold text-gold-400 uppercase tracking-wider mb-3">
              3. Dados Profissionais, Função & Remuneração
            </h4>

            {/* Seletor de Modelo de Remuneração: Diarista vs Mensalista */}
            <div className="mb-3">
              <label className="text-gray-300 block mb-1.5 font-medium">Modelo de Remuneração *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentModel('diaria')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    paymentModel === 'diaria'
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-white'
                      : 'bg-dark-950 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                      <span>Por Diária (Diarista)</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Recebe valor fixo por dia trabalhado em montagem ou obra.
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    paymentModel === 'diaria' ? 'border-emerald-400 bg-emerald-500 text-black' : 'border-gray-600'
                  }`}>
                    {paymentModel === 'diaria' && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentModel('mensal')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    paymentModel === 'mensal'
                      ? 'bg-gold-500/15 border-gold-500/60 text-white'
                      : 'bg-dark-950 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-gold-400 flex items-center gap-1.5">
                      <span>Mensalista (Salário Mensal + Valor Extra)</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Ganha salário fixo mensal + adicional em dias extras ou viagens.
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    paymentModel === 'mensal' ? 'border-gold-400 bg-gold-500 text-black' : 'border-gray-600'
                  }`}>
                    {paymentModel === 'mensal' && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-gray-300 block mb-1">Cargo / Função *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Serralheiro Mestre"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              {paymentModel === 'diaria' ? (
                <div>
                  <label className="text-gray-300 block mb-1">Valor da Diária (R$) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-emerald-400 font-mono text-xs font-bold">R$</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      required
                      placeholder="280"
                      value={dailyRate}
                      onChange={e => setDailyRate(Number(e.target.value))}
                      className="w-full bg-dark-950 border border-emerald-500/30 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-gold-300 font-semibold block mb-1">Salário Mensal (R$) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gold-400 font-mono text-xs font-bold">R$</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        required
                        placeholder="3000"
                        value={monthlySalary}
                        onChange={e => setMonthlySalary(Number(e.target.value))}
                        className="w-full bg-dark-950 border border-gold-500/40 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-amber-300 font-semibold block mb-1" title="Valor pago por dia extra trabalhado ou viagem para outra cidade">
                      Valor Extra / Viagem (R$)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-amber-400 font-mono text-xs font-bold">R$</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        placeholder="150"
                        value={extraRate}
                        onChange={e => setExtraRate(Number(e.target.value))}
                        className="w-full bg-dark-950 border border-amber-500/30 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-gray-300 block mb-1">Data de Admissão *</label>
                <input
                  type="date"
                  required
                  value={admissionDate}
                  onChange={e => setAdmissionDate(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className={paymentModel === 'mensal' ? 'sm:col-span-2 lg:col-span-4' : ''}>
                <label className="text-gray-300 block mb-1">Status Operacional *</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as CollaboratorStatus)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  <option value="disponivel">Disponível</option>
                  <option value="em_montagem">Em Montagem (Obra Ativa)</option>
                  <option value="ferias">Férias</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="text-gray-300 block mb-1">Especialidades (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: Içamento com munck, Nivelamento a laser, Solda MIG/TIG, Elétrica industrial"
                  value={skillsStr}
                  onChange={e => setSkillsStr(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
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
              className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>{editingCollab ? 'Salvar Alterações' : 'Concluir Cadastro'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Lançar Valor Extra / Pagamento do Colaborador */}
      <Modal
        isOpen={!!extraPaymentCollab}
        onClose={() => setExtraPaymentCollab(null)}
        title={extraPaymentCollab ? `Lançar Pagamento / Valor Extra — ${extraPaymentCollab.name}` : 'Lançar Pagamento'}
        subtitle={
          extraPaymentCollab?.paymentModel === 'mensal'
            ? `Mensalista • Salário Fixo: ${formatCurrency(extraPaymentCollab.monthlySalary || 0)} • Extra Padrão: ${formatCurrency(extraPaymentCollab.extraRate || 0)}`
            : `Diarista • Valor da Diária: ${formatCurrency(extraPaymentCollab?.dailyRate || 280)}`
        }
        maxWidth="lg"
      >
        {extraPaymentCollab && (
          <form onSubmit={handleLaunchExtraPayment} className="space-y-4 text-xs">
            {/* Tipo de pagamento */}
            <div>
              <label className="text-gray-300 font-semibold block mb-1.5">Tipo de Lançamento *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('extra')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    extraPaymentType === 'extra'
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-dark-950 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-amber-400">Valor Extra / Viagem</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Dia extra ou outra cidade</div>
                </button>

                {extraPaymentCollab.paymentModel === 'mensal' && (
                  <button
                    type="button"
                    onClick={() => handlePaymentTypeChange('salario')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      extraPaymentType === 'salario'
                        ? 'bg-gold-500/20 border-gold-500 text-white'
                        : 'bg-dark-950 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-gold-400">Salário Mensal</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {formatCurrency(extraPaymentCollab.monthlySalary || 0)}
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('diaria')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    extraPaymentType === 'diaria'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-dark-950 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-emerald-400">Diária Avulsa</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Diária de campo / Bônus</div>
                </button>
              </div>
            </div>

            {extraPaymentType !== 'salario' && (
              <div className="bg-dark-900/90 p-3.5 rounded-xl border border-amber-500/20 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label className="text-amber-300 font-semibold block">
                      Dia(s) em que fez o {extraPaymentType === 'extra' ? 'Extra / Viagem' : 'Trabalho'} *
                    </label>
                    <span className="text-[10px] text-gray-400">
                      {extraWorkedDatesList.length} {extraWorkedDatesList.length === 1 ? 'dia selecionado' : 'dias selecionados'} — o valor total é calculado automaticamente pela quantidade de datas.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddWorkedDate}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Adicionar outro dia</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {extraWorkedDatesList.map((dateVal, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-dark-950 border border-white/10 rounded-xl px-2.5 py-1.5"
                    >
                      <span className="text-[10px] font-bold text-amber-400 uppercase whitespace-nowrap">
                        {idx + 1}º Dia:
                      </span>
                      <input
                        type="date"
                        required
                        value={dateVal}
                        onChange={e => handleUpdateWorkedDateAtIndex(idx, e.target.value)}
                        className="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none"
                      />
                      {extraWorkedDatesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveWorkedDateAtIndex(idx)}
                          className="p-1 text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remover este dia"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-amber-300 font-semibold block mb-1">
                  Valor Total a Pagar (R$) {extraPaymentType !== 'salario' && `(${extraWorkedDatesList.length}x)`} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-amber-400 font-mono text-xs font-bold">R$</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={extraAmount}
                    onChange={e => setExtraAmount(e.target.value)}
                    className="w-full bg-dark-950 border border-amber-500/40 rounded-xl pl-9 pr-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Data do Pagamento *</label>
                <input
                  type="date"
                  required
                  value={extraDate}
                  onChange={e => setExtraDate(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 block mb-1">Motivo / Observação (Ex: Viagem outra cidade, Feriado, Dia extra)</label>
              <input
                type="text"
                placeholder="Ex: Viagem de 2 dias para montagem em outra cidade"
                value={extraReason}
                onChange={e => setExtraReason(e.target.value)}
                className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-gray-300 block mb-1">Vincular a uma Obra Específica (Opcional)</label>
              <select
                value={extraSaleId}
                onChange={e => setExtraSaleId(e.target.value)}
                className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="">Não vincular — Lançar direto no Fluxo de Caixa Geral</option>
                {sales.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.orderNumber} — {s.client.name} ({s.installationAddress.city}/{s.installationAddress.state})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-500 mt-1">
                Se vinculado a uma obra, o valor entra tanto nos Custos da Obra quanto como Saída no Financeiro.
              </p>
            </div>

            {/* Histórico recente de lançamentos deste colaborador */}
            {(() => {
              const collabHistory = cashFlow.filter(
                entry =>
                  entry.type === 'despesa' &&
                  (entry.clientOrSupplier === extraPaymentCollab.name ||
                    entry.description.toLowerCase().includes(extraPaymentCollab.name.toLowerCase()))
              );

              if (collabHistory.length === 0) return null;

              const handleRemoveHistoryItem = (item: CashFlowEntry) => {
                if (!window.confirm(`Remover este lançamento de ${formatCurrency(item.amount)} (${item.description})?`)) {
                  return;
                }
                if (item.saleOrderId) {
                  const targetSale = sales.find(s => s.id === item.saleOrderId);
                  const linkedExp = targetSale?.expenses?.find(e => e.cashFlowEntryId === item.id);
                  if (linkedExp) {
                    deleteProjectExpense(item.saleOrderId, linkedExp.id);
                    return;
                  }
                }
                deleteCashFlowEntry(item.id);
              };

              return (
                <div className="bg-dark-900/70 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Últimos Pagamentos / Extras Lançados para {extraPaymentCollab.name}:
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {collabHistory.map(item => (
                      <div
                        key={item.id}
                        title={item.description}
                        className="flex items-center justify-between gap-2 text-[11px] bg-dark-950 px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="truncate text-gray-300 flex-1 min-w-0">
                          <span className="text-gray-500 font-mono mr-1.5">[{formatAdmissionDate(item.date)}]</span>
                          <span>{item.description}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-amber-400">
                            {formatCurrency(item.amount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHistoryItem(item)}
                            title="Remover este lançamento"
                            className="p-1 rounded-md text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setExtraPaymentCollab(null)}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
                <span>Confirmar e Lançar no Caixa</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
