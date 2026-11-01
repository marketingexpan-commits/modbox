import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, LogIn, ChevronRight } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: (role: 'admin' | 'colaborador') => void;
}

const CLICKS_TO_UNLOCK = 5;
const CLICK_WINDOW_MS = 2000;

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const handleLogoClick = () => {
    if (showAdmin) return;
    clicks.current += 1;
    clearTimeout(timer.current);
    if (clicks.current >= CLICKS_TO_UNLOCK) {
      clicks.current = 0;
      setShowAdmin(true);
      return;
    }
    // Zera a contagem se o usuário parar de clicar
    timer.current = setTimeout(() => { clicks.current = 0; }, CLICK_WINDOW_MS);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="relative min-h-[100dvh] bg-dark-950 flex flex-col items-center justify-center px-5 py-10 overflow-hidden">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-0.5 bg-gold-500" />

      <main className="relative z-10 w-full max-w-[15rem] flex flex-col items-center text-center">
        <img
          src="/modbox_logo_dourado.png"
          alt="ModBox Contêineres Modernos e Coberturas Metálicas"
          className="animate-logo-reveal w-48 sm:w-60 max-w-full h-auto object-contain select-none"
          draggable={false}
          onClick={handleLogoClick}
        />
        <h1 className="sr-only">ModBox - Sistema de Gestão: Modulares, Coberturas e Estruturas Metálicas</h1>

        <div className="w-full mt-10 space-y-2.5">
          <button
            id="enter-collaborator"
            onClick={() => onEnter('colaborador')}
            style={{ animationDelay: '1.5s' }}
            className="animate-rise-in group w-full flex items-center gap-3 bg-dark-850 hover:bg-dark-800 active:scale-[0.98] text-white font-bold px-3.5 py-2.5 rounded-xl border border-gold-500/40 hover:border-gold-500 transition-all"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-500/10 text-gold-500">
              <LogIn className="w-4 h-4" />
            </span>
            <span className="flex-1 text-left text-sm">Entrar</span>
            <ChevronRight className="w-4 h-4 text-gold-500 transition-transform group-hover:translate-x-1" />
          </button>

          {showAdmin && (
            <button
              id="enter-admin"
              onClick={() => onEnter('admin')}
              className="animate-rise-in group w-full flex items-center gap-3 bg-gold-500 hover:bg-gold-600 active:scale-[0.98] text-black font-bold px-3.5 py-2.5 rounded-xl transition-all"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/15">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="flex-1 text-left text-sm">Gestão</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
