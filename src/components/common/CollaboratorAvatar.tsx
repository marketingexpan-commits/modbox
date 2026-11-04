import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn } from 'lucide-react';

interface CollaboratorAvatarProps {
  name: string;
  photoUrl?: string;
  /** Classes de tamanho, ex: "w-12 h-16". Mantenha a proporção 3x4. */
  sizeClass?: string;
  textClass?: string;
  roundedClass?: string;
}

/**
 * Foto 3x4 do colaborador. Se houver foto, clicar nela amplia a imagem na tela.
 * Se não houver foto, mostra a inicial do nome.
 */
export const CollaboratorAvatar: React.FC<CollaboratorAvatarProps> = ({
  name,
  photoUrl,
  sizeClass = 'w-12 h-16',
  textClass = 'text-lg',
  roundedClass = 'rounded-lg'
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    if (!isZoomOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen]);

  if (photoUrl) {
    return (
      <>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setIsZoomOpen(true);
          }}
          title="Clique para ampliar a foto"
          className={`${sizeClass} ${roundedClass} relative group overflow-hidden border border-gold-500/40 hover:border-gold-400 shrink-0 bg-dark-900 cursor-zoom-in transition-all focus:outline-none`}
        >
          <img
            src={photoUrl}
            alt={`Foto de ${name}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ZoomIn className="w-4 h-4 text-white drop-shadow" />
          </span>
        </button>

        {isZoomOpen &&
          createPortal(
            <div
              data-modal-open="true"
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={e => {
                e.stopPropagation();
                setIsZoomOpen(false);
              }}
            >
              <div
                className="relative bg-dark-900 border border-gold-500/40 rounded-2xl p-3 sm:p-4 shadow-2xl max-w-sm w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10">
                  <span className="text-sm font-bold text-white truncate">{name}</span>
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(false)}
                    aria-label="Fechar foto ampliada"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-black border border-white/10">
                  <img
                    src={photoUrl}
                    alt={`Foto ampliada de ${name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  return (
    <div
      className={`${sizeClass} ${roundedClass} bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 font-bold ${textClass} shrink-0`}
    >
      {name.charAt(0)}
    </div>
  );
};
