import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.82;
const MAX_FILE_SIZE_MB = 15;

/**
 * Compresses an image using the Canvas API.
 * Resizes to max 1280px on the longest side and encodes as JPEG at 82% quality.
 * Typical result: 4-6 MB phone photo → 250-450 KB with good visual quality.
 */
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`Arquivo muito grande (máximo ${MAX_FILE_SIZE_MB}MB). Selecione uma foto menor.`));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { width, height } = img;
      const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Falha ao criar contexto de canvas'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        blob => {
          if (blob) resolve(blob);
          else reject(new Error('Falha ao comprimir imagem'));
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Falha ao carregar imagem. Verifique o formato do arquivo.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Compresses and uploads a photo to Firebase Storage.
 * Returns the public download URL and the storage path (for future deletion).
 */
export async function uploadProjectPhoto(
  saleId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; storagePath: string }> {
  onProgress?.(10);
  const compressed = await compressImage(file);
  onProgress?.(40);

  const timestamp = Date.now();
  const storagePath = `projects/${saleId}/photos/${timestamp}.jpg`;
  const storageRef = ref(storage, storagePath);

  onProgress?.(60);
  const snapshot = await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
  onProgress?.(85);

  const url = await getDownloadURL(snapshot.ref);
  onProgress?.(100);

  return { url, storagePath };
}

/**
 * Deletes a photo from Firebase Storage by its storage path.
 */
export async function deleteStoragePhoto(storagePath: string): Promise<void> {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('[Storage] Erro ao deletar foto:', err);
  }
}

