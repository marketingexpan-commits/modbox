import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { Modal } from './Modal';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

/**
 * Abre a webcam do notebook/desktop para tirar a foto do colaborador.
 * Mostra uma moldura 3x4 para o enquadramento.
 */
export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setReady(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setError(null);
    setReady(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Este navegador não permite acessar a câmera. Use a opção "Galeria".');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false })
      .then(stream => {
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play().catch(() => {});
        }
      })
      .catch((err: any) => {
        if (cancelled) return;
        if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') {
          setError('Permissão da câmera negada. Libere o acesso à câmera no navegador (ícone de cadeado ao lado do endereço) e tente novamente.');
        } else if (err?.name === 'NotFoundError' || err?.name === 'OverconstrainedError') {
          setError('Nenhuma câmera foi encontrada neste computador. Use a opção "Galeria".');
        } else {
          setError('Não foi possível abrir a câmera. Verifique se ela não está sendo usada por outro programa.');
        }
      });

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [isOpen, attempt]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      blob => {
        if (!blob) return;
        const file = new File([blob], `foto-${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopStream();
        onCapture(file);
        onClose();
      },
      'image/jpeg',
      0.92
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        stopStream();
        onClose();
      }}
      title="Tirar foto do colaborador"
      subtitle="Posicione o rosto dentro da moldura 3x4 e clique em Capturar"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {error ? (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-4 space-y-3">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setAttempt(a => a + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-gold-400 border border-gold-500/30 font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar novamente</span>
            </button>
          </div>
        ) : (
          <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-[4/3]">
            <video
              ref={videoRef}
              playsInline
              muted
              onLoadedMetadata={() => setReady(true)}
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            {/* Moldura 3x4 para enquadramento */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="h-[92%] aspect-[3/4] rounded-lg border-2 border-gold-500/90"
                style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }}
              />
            </div>
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center text-gold-400 font-bold bg-black/70">
                Abrindo câmera...
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!ready || !!error}
            onClick={handleCapture}
            className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Capturar</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

