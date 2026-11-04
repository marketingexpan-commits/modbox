const PHOTO_WIDTH = 300;
const PHOTO_HEIGHT = 400; // proporção 3x4
const JPEG_QUALITY = 0.85;
const MAX_FILE_SIZE_MB = 15;

/**
 * Prepara a foto de perfil (3x4) do colaborador.
 * Recorta o centro da imagem na proporção 3:4, reduz para 300x400 e comprime em JPEG.
 * O resultado (cerca de 20-40 KB) é devolvido como data URL e salvo junto ao cadastro.
 */
export async function processProfilePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`Arquivo muito grande (máximo ${MAX_FILE_SIZE_MB}MB). Selecione uma foto menor.`));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const targetRatio = PHOTO_WIDTH / PHOTO_HEIGHT;
      const sourceRatio = img.width / img.height;

      let sx = 0;
      let sy = 0;
      let sw = img.width;
      let sh = img.height;

      if (sourceRatio > targetRatio) {
        // imagem mais larga que 3:4: corta as laterais
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        // imagem mais alta que 3:4: corta o excesso, priorizando o topo (rosto)
        sh = img.width / targetRatio;
        sy = (img.height - sh) * 0.25;
      }

      const canvas = document.createElement('canvas');
      canvas.width = PHOTO_WIDTH;
      canvas.height = PHOTO_HEIGHT;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Falha ao processar a imagem.'));
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);

      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Falha ao carregar a imagem. Verifique o formato do arquivo.'));
    };

    img.src = objectUrl;
  });
}

