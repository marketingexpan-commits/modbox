import React from 'react';

interface CollaboratorAvatarProps {
  name: string;
  photoUrl?: string;
  /** Classes de tamanho, ex: "w-12 h-16". Mantenha a proporção 3x4. */
  sizeClass?: string;
  textClass?: string;
}

/**
 * Foto 3x4 do colaborador. Se não houver foto, mostra a inicial do nome.
 */
export const CollaboratorAvatar: React.FC<CollaboratorAvatarProps> = ({
  name,
  photoUrl,
  sizeClass = 'w-12 h-16',
  textClass = 'text-lg'
}) => {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`Foto de ${name}`}
        className={`${sizeClass} rounded-xl object-cover border border-gold-500/40 shrink-0 bg-dark-900`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 font-bold ${textClass} shrink-0`}
    >
      {name.charAt(0)}
    </div>
  );
};

