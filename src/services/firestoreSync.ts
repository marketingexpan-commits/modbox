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

// Tracks which collections have already been seeded (persisted in localStorage across page reloads).
// This prevents re-seeding when the user intentionally deletes all items and presses F5.
const SEEDED_STORAGE_KEY = 'modbox_firestore_seeded_v1';

function isCollectionSeeded(collectionName: string): boolean {
  try {
    const raw = localStorage.getItem(SEEDED_STORAGE_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return Array.isArray(list) && list.includes(collectionName);
  } catch {
    return false;
  }
}

function markCollectionSeeded(collectionName: string): void {
  try {
    const raw = localStorage.getItem(SEEDED_STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(collectionName)) {
      list.push(collectionName);
      localStorage.setItem(SEEDED_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore storage errors
  }
}

/**
 * Subscribes to a Firestore collection with real-time updates.
 * Seeds with initialData ONLY on the very first time the collection is found empty
 * and has never been initialized or modified before.
 * After the user explicitly empties a collection, it will remain empty even after F5.
 */
export function subscribeToCollection<T extends { id: string }>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  initialData: T[]
): () => void {
  const colRef = collection(db, collectionName);

  // Check if seeding is needed (only if never seeded/modified before)
  getDocs(colRef)
    .then((snapshot: any) => {
      if (snapshot.empty && initialData.length > 0 && !isCollectionSeeded(collectionName)) {
        markCollectionSeeded(collectionName);
        const batch = writeBatch(db);
        initialData.forEach((item) => {
          const docRef = doc(colRef, item.id);
          batch.set(docRef, item);
        });
        batch.commit().catch((err: any) => {
          console.warn(`[Firestore] Could not seed ${collectionName}:`, err);
        });
      } else if (!snapshot.empty) {
        // Collection already has data — mark as seeded permanently so we never re-seed after deletions
        markCollectionSeeded(collectionName);
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
    markCollectionSeeded(collectionName);
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
    markCollectionSeeded(collectionName);
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn(`[Firestore] Error deleting ${collectionName}/${id}:`, err);
  }
}
