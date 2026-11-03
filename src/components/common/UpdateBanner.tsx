import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

const COUNTDOWN_SECONDS = 10;
// Verificação de segurança para quem deixa o sistema aberto por muitas horas
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

// Considera o usuário "ocupado" se houver um modal aberto ou um campo em edição,
// para não recarregar a página e perder o que está sendo digitado.
const isUserBusy = () => {
  if (document.querySelector('[data-modal-open="true"]')) return true;
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
};

export const UpdateBanner: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [busy, setBusy] = useState(false);

  // Verifica se existe uma versão nova publicada ao abrir o sistema (e ao voltar para a aba)
  useEffect(() => {
    if (import.meta.env.DEV) return;

    const checkForNewVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.version && data.version !== __APP_VERSION__) {
          setUpdateAvailable(true);
        }
      } catch {
        // sem conexão: tenta novamente na próxima verificação
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') checkForNewVersion();
    };

    checkForNewVersion();
    const interval = window.setInterval(checkForNewVersion, CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', checkForNewVersion);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', checkForNewVersion);
    };
  }, []);

  // Contagem regressiva (pausa enquanto o usuário estiver digitando / com modal aberto)
  useEffect(() => {
    if (!updateAvailable) return;

    const tick = window.setInterval(() => {
      if (isUserBusy()) {
        setBusy(true);
        setSecondsLeft(COUNTDOWN_SECONDS);
        return;
      }
      setBusy(false);
      setSecondsLeft(prev => {
        if (prev <= 1) {
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(tick);
  }, [updateAvailable]);

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[100] bg-gold-500 text-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 shrink-0" />
          <span>
            <strong>Sistema atualizado!</strong>{' '}
            {busy
              ? 'Conclua ou feche o que está fazendo — a página atualiza em seguida.'
              : `Uma nova versão está disponível. Atualizando em ${secondsLeft}s…`}
          </span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-black text-gold-400 hover:bg-dark-900 px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          Atualizar agora
        </button>
      </div>
    </div>
  );
};

