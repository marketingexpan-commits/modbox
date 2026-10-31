import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { AdminUser } from '../../types';
import { Modal } from '../common/Modal';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

export const AdminsManager: React.FC = () => {
  const { admins, addAdmin, updateAdmin, deleteAdmin, activeAdminId } = useModBox();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const openNewModal = () => {
    setEditingAdmin(null);
    setName('');
    setPin('');
    setShowPin(false);
    setIsModalOpen(true);
  };

  const openEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setPin(admin.pin || '');
    setShowPin(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Informe o nome completo do administrador.');
      return;
    }

    if (pin.length !== 6) {
      alert('A senha deve conter exatamente 6 dígitos numéricos.');
      return;
    }

    if (editingAdmin) {
      updateAdmin(editingAdmin.id, {
        name: name.trim(),
        pin
      });
      alert(`Administrador ${name.trim()} atualizado com sucesso!`);
    } else {
      addAdmin({
        name: name.trim(),
        pin
      });
      alert(`Administrador ${name.trim()} cadastrado com sucesso!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (admin: AdminUser) => {
    if (admins.length <= 1) {
      alert('Não é possível excluir o único administrador do sistema.');
      return;
    }

    if (admin.id === activeAdminId) {
      alert('Você não pode excluir o administrador atualmente conectado.');
      return;
    }

    if (window.confirm(`Tem certeza que deseja remover o acesso de ${admin.name}?`)) {
      deleteAdmin(admin.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-4 sm:p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Gestores</h2>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap self-start sm:self-auto shadow-lg shadow-gold-500/10"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Gestor</span>
        </button>
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.map((admin) => {
          const isCurrentUser = admin.id === activeAdminId;

          return (
            <div
              key={admin.id}
              className={`bg-dark-850 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isCurrentUser 
                  ? 'border-gold-500/50 shadow-md shadow-gold-500/5' 
                  : 'border-white/5 hover:border-gold-500/20'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-sm">
                      {admin.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight flex items-center gap-1.5">
                        {admin.name}
                        {isCurrentUser && (
                          <span className="text-[10px] bg-gold-500/20 text-gold-400 border border-gold-500/40 px-2 py-0.5 rounded-full font-semibold">
                            Você
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 py-3 border-y border-white/5 text-xs">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-400">Senha cadastrada:</span>
                    <span className="font-mono tracking-widest text-gold-400">••••••</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold-500" />
                      Cadastrado em:
                    </span>
                    <span className="text-gray-300">{admin.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-2">
                <button
                  onClick={() => openEditModal(admin)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-dark-900 hover:bg-dark-950 hover:text-gold-400 px-3 py-1.5 rounded-lg border border-white/5 transition-all"
                  title="Editar nome e senha"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gold-500" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => handleDelete(admin)}
                  disabled={isCurrentUser || admins.length <= 1}
                  className="p-2 text-gray-400 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed bg-dark-900 hover:bg-dark-950 rounded-lg border border-white/5 transition-all"
                  title={isCurrentUser ? 'Você não pode se excluir' : 'Remover administrador'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Cadastro / Edição Completa de Administrador */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAdmin ? 'Editar Administrador' : 'Cadastrar Novo Administrador'}
        subtitle={editingAdmin ? 'Atualize o nome ou a senha de 6 dígitos.' : 'Defina o nome e a senha numérica de 6 dígitos para login.'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Nome Completo *</label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Eduardo Silveira"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
              autoFocus
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1 font-semibold">
              Senha de Acesso (PIN de 6 dígitos) *
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                required
                placeholder="6 dígitos numéricos"
                value={pin}
                onChange={e => setPin(onlyDigits(e.target.value).slice(0, 6))}
                className="w-full bg-dark-950 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-white font-mono tracking-[0.3em] placeholder:tracking-normal placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                title={showPin ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Senha de 6 números usada na tela de login. Clique no ícone do olho para visualizar.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-black font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-gold-500/10"
            >
              {editingAdmin ? 'Salvar Alterações' : 'Cadastrar Administrador'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
