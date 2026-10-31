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
  FileText 
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { Collaborator, CollaboratorStatus } from '../../types';
import { Modal } from '../common/Modal';

const formatCurrency = (val: number) =>
  (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatAdmissionDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

export const CollaboratorsManager: React.FC = () => {
  const { collaborators, addCollaborator, updateCollaborator, deleteCollaborator, sales } = useModBox();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);

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
  const [dailyRate, setDailyRate] = useState<number>(280);

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
    setDailyRate(280);
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
    setDailyRate(col.dailyRate || 280);
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
      dailyRate: Number(dailyRate),
      completedInstallations: editingCollab ? editingCollab.completedInstallations : 0,
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
          <h2 className="text-2xl font-bold text-white">Cadastro e Gestão de Colaboradores</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Gerencie os dados cadastrais (CPF, RG, endereço, contato) e especialidades dos montadores e técnicos.
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
              className="bg-dark-850 border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-gold-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Name, Role & Status + Action Buttons */}
                <div className="border-b border-white/5 pb-3 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 font-bold text-lg shrink-0">
                        {collab.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-base leading-tight break-words">{collab.name}</h3>
                        <p className="text-xs text-gold-400 font-medium mt-0.5 leading-snug">{collab.role}</p>
                      </div>
                    </div>

                    {/* Grupo de Status & Ações */}
                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        collab.status === 'em_montagem'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : collab.status === 'disponivel'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {collab.status === 'em_montagem' ? 'Em Obra' : collab.status === 'disponivel' ? 'Disponível' : collab.status}
                      </span>

                      <button
                        onClick={() => openEditModal(collab)}
                        title="Editar Colaborador"
                        className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-dark-750 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Excluir cadastro do colaborador ${collab.name}?`)) {
                            deleteCollaborator(collab.id);
                          }
                        }}
                        title="Excluir Colaborador"
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-dark-750 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Faixa de Destaque: Custo da Diária & Ocupação Operacional */}
                  <div className="flex items-center justify-between gap-2 bg-dark-900/80 px-3 py-2 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Diária de Campo:</span>
                      <span className="text-xs font-mono font-extrabold text-emerald-400">
                        {formatCurrency(collab.dailyRate || 280)}
                      </span>
                      <span className="text-[10px] text-gray-500">/ dia</span>
                    </div>

                    <div className="text-[11px]">
                      {assignedSales.length > 0 ? (
                        <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                          Alocado em {assignedSales.length} {assignedSales.length === 1 ? 'obra' : 'obras'}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Livre para escalas
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal & Documentation Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">CPF</span>
                    <span className="font-mono text-white mt-0.5 block">{collab.cpf}</span>
                  </div>
                  <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">RG</span>
                    <span className="font-mono text-white mt-0.5 block">{collab.rg}</span>
                  </div>
                  <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Telefone / WhatsApp</span>
                    <a
                      href={`https://wa.me/55${collab.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-400 hover:underline flex items-center gap-1 mt-0.5 font-medium"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{collab.phone}</span>
                    </a>
                  </div>
                  <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">E-mail</span>
                    <span className="text-gray-300 truncate mt-0.5 block">{collab.email}</span>
                  </div>
                </div>

                {/* Residential Address */}
                <div className="bg-dark-900 p-3 rounded-xl border border-white/5 mt-3 text-xs">
                  <span className="text-[10px] uppercase font-bold text-gold-400/80 block mb-1">
                    Endereço Residencial
                  </span>
                  <div className="text-gray-200 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                    <span>
                      {collab.address.street}, {collab.address.number}
                      {collab.address.complement && ` (${collab.address.complement})`}<br />
                      {collab.address.neighborhood} - {collab.address.city}/{collab.address.state} • CEP {collab.address.zipCode}
                    </span>
                  </div>
                  {collab.address.landmark && (
                    <div className="text-[11px] text-gray-400 mt-1 pl-5">
                      Ref: {collab.address.landmark}
                    </div>
                  )}
                </div>

                {/* Skills tags */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                    Especialidades & Habilidades
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {collab.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-dark-950 text-gray-300 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer info: Installations count & admission date */}
              <div className="bg-dark-900 p-3 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Award className="w-4 h-4 text-gold-400" />
                  <span>
                    <strong className="text-white font-mono">{collab.completedInstallations}</strong> montagens concluídas
                  </span>
                </div>

                <div className="text-gray-400 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>Admissão: {formatAdmissionDate(collab.admissionDate)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
            <h4 className="font-bold text-gold-400 uppercase tracking-wider mb-2">
              3. Dados Profissionais & Função
            </h4>
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

              <div>
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
    </div>
  );
};
