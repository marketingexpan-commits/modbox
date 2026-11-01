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

// Tracks which collections have already been seeded in this session.
// This prevents re-seeding when the user intentionally deletes all items.
const seededCollections = new Set<string>();

/**
 * Subscribes to a Firestore collection with real-time updates.
 * Seeds with initialData ONLY on the very first time the collection is found empty.
 * After the user explicitly empties a collection, it will remain empty.
 */
export function subscribeToCollection<T extends { id: string }>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  initialData: T[]
): () => void {
  const colRef = collection(db, collectionName);

  // Check if seeding is needed (only once per session per collection)
  getDocs(colRef)
    .then((snapshot: any) => {
      if (snapshot.empty && initialData.length > 0 && !seededCollections.has(collectionName)) {
        // Mark as seeded immediately so concurrent calls don't re-seed
        seededCollections.add(collectionName);
        const batch = writeBatch(db);
        initialData.forEach((item) => {
          const docRef = doc(colRef, item.id);
          batch.set(docRef, item);
        });
        batch.commit().catch((err: any) => {
          console.warn(`[Firestore] Could not seed ${collectionName}:`, err);
        });
      } else if (!snapshot.empty) {
        // Collection already has data — mark as seeded so we never overwrite
        seededCollections.add(collectionName);
      }
    })
    .catch((err: any) => {
      console.warn(`[Firestore] Initial check failed for ${collectionName}:`, err);
    });

  // Real-time listener — updates state whenever Firestore changes (including deletions)
  const unsubscribe = onSnapshot(
    colRef,
    (snapshot: any) => {
      // Always update local state, even when the collection becomes empty
      const items = snapshot.docs.map((docSnap: any) => docSnap.data() as T);
      onUpdate(items);
    },
    (error: any) => {
      console.warn(`[Firestore] Listener error on ${collectionName}:`, error);
    }
  );

  return unsubscribe;
}

/**
 * Saves or updates a document in Firestore.
 * Automatically sanitizes the item to remove `undefined` fields, which Firestore rejects.
 */
export async function setFirestoreDoc<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, item.id);
    const cleanItem = JSON.parse(JSON.stringify(item));
    await setDoc(docRef, cleanItem, { merge: true });
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
