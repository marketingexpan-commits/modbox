import React, { useEffect, useState } from 'react';
import { ArrowLeft, KeyRound, ShieldCheck, LogIn } from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';

interface LoginScreenProps {
  mode: 'colaborador' | 'admin';
  onBack: () => void;
  onSuccess: (role: 'admin' | 'colaborador', collaboratorId?: string) => void;
}

const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 30;

const formatCpf = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

const onlyPin = (value: string) => value.replace(/\D/g, '').slice(0, 6);

const inputClass =
  'w-full bg-dark-950 border border-white/10 rounded-xl px-3.5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors';

export const LoginScreen: React.FC<LoginScreenProps> = ({ mode, onBack, onSuccess }) => {
  const {
    admins,
    authenticateCollaborator,
    changeCollaboratorPin,
    authenticateAdmin,
    changeAdminPin
  } = useModBox();

  const isAdmin = mode === 'admin';

  const [selectedAdminId, setSelectedAdminId] = useState<string>(() => admins[0]?.id || '');
  const [cpf, setCpf] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);

  // Etapa de troca de PIN (primeiro acesso)
  const [pending, setPending] = useState<{ role: 'admin' | 'colaborador'; id?: string } | null>(null);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    if (isAdmin && !selectedAdminId && admins.length > 0) {
      setSelectedAdminId(admins[0].id);
    }
  }, [isAdmin, admins, selectedAdminId]);

  useEffect(() => {
    if (lockLeft <= 0) return;
    const t = setTimeout(() => setLockLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [lockLeft]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockLeft > 0) return;

    if (isAdmin) {
      if (!selectedAdminId) {
        setError('Selecione o usuário.');
        return;
      }
      const admin = pin.length === 6 ? authenticateAdmin(selectedAdminId, pin) : null;
      if (admin) {
        onSuccess('admin', admin.id);
        return;
      }
    } else {
      const collab = cpf.replace(/\D/g, '').length === 11 && pin.length === 6
        ? authenticateCollaborator(cpf, pin)
        : null;
      if (collab) {
        if (collab.mustChangePin) {
          setPending({ role: 'colaborador', id: collab.id });
        } else {
          onSuccess('colaborador', collab.id);
        }
        return;
      }
    }

    const next = attempts + 1;
    setPin('');
    if (next >= MAX_ATTEMPTS) {
      setAttempts(0);
      setLockLeft(LOCK_SECONDS);
      setError('');
    } else {
      setAttempts(next);
      setError(isAdmin ? 'Senha incorreta para este usuário.' : 'CPF ou PIN incorretos.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;
    if (newPin.length !== 6) return setError('O novo PIN deve ter 6 dígitos.');
    if (newPin === pin) return setError('O novo PIN deve ser diferente do provisório.');
    if (/^(\d)\1{5}$/.test(newPin) || '0123456789876543210'.includes(newPin)) {
      return setError('Evite PINs óbvios (ex.: 111111 ou 123456).');
    }
    if (newPin !== confirmPin) return setError('Os PINs não coincidem.');

    if (pending.role === 'admin' && pending.id) changeAdminPin(pending.id, newPin);
    else if (pending.id) changeCollaboratorPin(pending.id, newPin);
    onSuccess(pending.role, pending.id);
  };

  const locked = lockLeft > 0;

  return (
    <div className="relative min-h-[100dvh] bg-dark-950 flex flex-col items-center justify-center px-5 py-10 overflow-hidden">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-0.5 bg-gold-500" />

      <button
        onClick={onBack}
        aria-label="Voltar"
        className="absolute top-5 left-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors p-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <main className="animate-rise-in w-full max-w-[18rem] flex flex-col items-center">
        <img
          src="/modbox_logo_dourado.png"
          alt="ModBox"
          className="w-36 h-auto object-contain mb-8 select-none"
          draggable={false}
        />

        {!pending ? (
          <form onSubmit={handleLogin} className="w-full space-y-3" noValidate>

            {isAdmin && (
              <div>
                <label htmlFor="login-admin" className="text-xs text-gray-400 block mb-1">Usuário</label>
                <select
                  id="login-admin"
                  value={selectedAdminId}
                  onChange={e => { setSelectedAdminId(e.target.value); setError(''); }}
                  disabled={locked}
                  className={`${inputClass} cursor-pointer`}
                  autoFocus
                >
                  {admins.map(a => (
                    <option key={a.id} value={a.id} className="bg-dark-900 text-white">
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isAdmin && (
              <div>
                <label htmlFor="login-cpf" className="text-xs text-gray-400 block mb-1">CPF</label>
                <input
                  id="login-cpf"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={e => setCpf(formatCpf(e.target.value))}
                  disabled={locked}
                  className={inputClass}
                  autoFocus
                />
              </div>
            )}

            <div>
              <label htmlFor="login-pin" className="text-xs text-gray-400 block mb-1">
                Senha
              </label>
              <input
                id="login-pin"
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                placeholder="••••••"
                value={pin}
                onChange={e => setPin(onlyPin(e.target.value))}
                disabled={locked}
                className={`${inputClass} tracking-[0.4em]`}
              />
            </div>

            {locked ? (
              <p className="text-xs text-amber-400" role="alert">
                Muitas tentativas. Aguarde {lockLeft}s para tentar novamente.
              </p>
            ) : (
              error && <p className="text-xs text-rose-400" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={locked}
              className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-black font-bold text-sm px-3.5 py-3 rounded-xl transition-all mt-2"
            >
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="w-full space-y-3" noValidate>
            <div className="flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-wider">
              <KeyRound className="w-4 h-4" />
              Crie seu PIN
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Este é seu primeiro acesso. Defina um novo PIN de 6 dígitos para continuar.
            </p>

            <div>
              <label htmlFor="new-pin" className="text-xs text-gray-400 block mb-1">Novo PIN</label>
              <input
                id="new-pin"
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                placeholder="••••••"
                value={newPin}
                onChange={e => { setNewPin(onlyPin(e.target.value)); setError(''); }}
                className={`${inputClass} tracking-[0.4em]`}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="confirm-pin" className="text-xs text-gray-400 block mb-1">Confirmar PIN</label>
              <input
                id="confirm-pin"
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                placeholder="••••••"
                value={confirmPin}
                onChange={e => { setConfirmPin(onlyPin(e.target.value)); setError(''); }}
                className={`${inputClass} tracking-[0.4em]`}
              />
            </div>

            {error && <p className="text-xs text-rose-400" role="alert">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 active:scale-[0.98] text-black font-bold text-sm px-3.5 py-3 rounded-xl transition-all mt-2"
            >
              Salvar e continuar
            </button>
          </form>
        )}
      </main>
    </div>
  );
};
