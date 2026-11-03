/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

declare module 'firebase/app' {
  export function initializeApp(config: Record<string, any>): any;
}

declare module 'firebase/firestore' {
  export function getFirestore(app?: any): any;
  export function collection(firestore: any, path: string, ...pathSegments: string[]): any;
  export function doc(firestore: any, path: string, ...pathSegments: string[]): any;
  export function onSnapshot(
    reference: any,
    onNext: (snapshot: any) => void,
    onError?: (error: any) => void
  ): () => void;
  export function setDoc(reference: any, data: any, options?: any): Promise<void>;
  export function deleteDoc(reference: any): Promise<void>;
  export function getDocs(query: any): Promise<any>;
  export function writeBatch(firestore: any): any;
}
