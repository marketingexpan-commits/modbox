import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribes to a Firestore collection with real-time updates.
 * If the collection is completely empty on first connection, seeds it with initialData.
 */
export function subscribeToCollection<T extends { id: string }>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  initialData: T[]
): () => void {
  const colRef = collection(db, collectionName);

  // Check if seeding is needed
  getDocs(colRef)
    .then((snapshot: any) => {
      if (snapshot.empty && initialData.length > 0) {
        const batch = writeBatch(db);
        initialData.forEach((item) => {
          const docRef = doc(colRef, item.id);
          batch.set(docRef, item);
        });
        batch.commit().catch((err: any) => {
          console.warn(`[Firestore] Could not seed ${collectionName}:`, err);
        });
      }
    })
    .catch((err: any) => {
      console.warn(`[Firestore] Initial check failed for ${collectionName}:`, err);
    });

  // Real-time listener
  const unsubscribe = onSnapshot(
    colRef,
    (snapshot: any) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap: any) => docSnap.data() as T);
        onUpdate(items);
      }
    },
    (error: any) => {
      console.warn(`[Firestore] Listener error on ${collectionName}:`, error);
    }
  );

  return unsubscribe;
}

/**
 * Saves or updates a document in Firestore.
 */
export async function setFirestoreDoc<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.warn(`[Firestore] Error setting ${collectionName}/${item.id}:`, err);
  }
}

/**
 * Deletes a document from Firestore.
 */
export async function deleteFirestoreDoc(
  collectionName: string,
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn(`[Firestore] Error deleting ${collectionName}/${id}:`, err);
  }
}
