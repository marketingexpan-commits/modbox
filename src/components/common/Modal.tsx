import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div data-modal-open="true" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div 
        className={`relative w-full ${maxWidthClasses} bg-dark-900 border border-gold-500/30 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 sm:my-8 max-h-[100dvh] sm:max-h-none flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Gold Accent Line */}
        <div className="h-1 w-full bg-gold-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 p-4 sm:p-6 border-b border-white/5 bg-dark-850/60">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500 inline-block"></span>
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 shrink-0 text-gray-400 hover:text-white hover:bg-dark-750 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 flex-1 sm:flex-none max-h-[calc(100dvh-110px)] sm:max-h-[calc(85vh-140px)] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
