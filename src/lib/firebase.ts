import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import type { UserRecord, UserResponse, AdminUserResponseItem } from '../types';
import { INITIAL_USERS } from '../data/initialUsers';

export const firebaseConfig = {
  projectId: "gen-lang-client-0570662670",
  appId: "1:745097466596:web:ec0ffe1ea46fae992f12f1",
  apiKey: "AIzaSyB_622XWomHkUl_BMQf1MQhRO66DykqVyY",
  authDomain: "gen-lang-client-0570662670.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-21deseptiembre-33b8a9b7-35d5-43db-8076-d3f367a85392",
  storageBucket: "gen-lang-client-0570662670.firebasestorage.app",
  messagingSenderId: "745097466596",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const USERS_COLLECTION = 'users';
const RESPONSES_COLLECTION = 'responses';

/**
 * Ensures Firestore is populated with initial users if empty
 */
let isSeeding = false;
export async function ensureCloudDatabaseSeeded(): Promise<void> {
  if (isSeeding) return;
  isSeeding = true;
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    if (snap.empty) {
      console.log('⚡ Sembrando base de datos en la nube con los usuarios iniciales...');
      const batchPromises = INITIAL_USERS.map((user) =>
        setDoc(doc(db, USERS_COLLECTION, user.id), {
          ...user,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
        })
      );
      await Promise.all(batchPromises);
      console.log('✅ Base de datos en la nube sembrada exitosamente con', INITIAL_USERS.length, 'usuarios');
    }
  } catch (err) {
    console.warn('⚠️ No se pudo verificar la siembra inicial en la nube:', err);
  } finally {
    isSeeding = false;
  }
}

/**
 * Fetch all users from Firestore cloud
 */
export async function getCloudUsers(): Promise<UserRecord[]> {
  try {
    await ensureCloudDatabaseSeeded();
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    if (snap.empty) {
      return INITIAL_USERS;
    }
    const users: UserRecord[] = [];
    snap.forEach((d) => {
      users.push(d.data() as UserRecord);
    });
    const leiryUser = INITIAL_USERS.find((u) => u.id === 'leiry');
    if (leiryUser) {
      const existingLeiryIndex = users.findIndex((u) => u.id === 'leiry');
      if (existingLeiryIndex === -1) {
        await saveCloudUser(leiryUser);
        users.push(leiryUser);
      } else {
        // Ensure leiry theme and flowerConfig are up to date
        users[existingLeiryIndex].theme = leiryUser.theme;
        users[existingLeiryIndex].flowerConfig = leiryUser.flowerConfig;
      }
    }
    return users;
  } catch (err) {
    console.warn('Fallback a almacenamiento local tras error en Firestore:', err);
    throw err;
  }
}

/**
 * Fetch a single user by ID
 */
export async function getCloudUser(id: string): Promise<UserRecord | null> {
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, id));
    if (snap.exists()) {
      return snap.data() as UserRecord;
    }
    return null;
  } catch (err) {
    console.warn(`Error al obtener usuario ${id} de la nube:`, err);
    return null;
  }
}

/**
 * Save or update user in Firestore cloud
 */
export async function saveCloudUser(user: UserRecord): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Error al guardar usuario en la nube:', err);
    throw err;
  }
}

/**
 * Save user response to both user document and global responses collection
 */
export async function submitCloudResponse(
  user: UserRecord,
  responseText: string
): Promise<UserResponse> {
  const userResponse: UserResponse = {
    text: responseText.trim(),
    submittedAt: new Date().toISOString(),
  };

  try {
    // 1. Update user doc
    const userRef = doc(db, USERS_COLLECTION, user.id);
    await updateDoc(userRef, {
      userResponse,
      updatedAt: new Date().toISOString(),
    });

    // 2. Also record in global responses collection with detailed metadata
    const responseDocRef = doc(db, RESPONSES_COLLECTION, `${user.id}_${Date.now()}`);
    await setDoc(responseDocRef, {
      userId: user.id,
      name: user.name,
      username: user.username,
      response: userResponse,
      submittedAt: userResponse.submittedAt,
    });

    return userResponse;
  } catch (err) {
    console.error('Error al enviar respuesta a Firestore:', err);
    throw err;
  }
}

/**
 * Fetch all responses for admin
 */
export async function getCloudResponses(): Promise<AdminUserResponseItem[]> {
  try {
    const users = await getCloudUsers();
    return users
      .filter((u) => u.userResponse && u.userResponse.text)
      .map((u) => ({
        userId: u.id,
        name: u.name,
        username: u.username,
        response: u.userResponse!,
      }));
  } catch (err) {
    console.warn('Error al obtener respuestas de la nube:', err);
    throw err;
  }
}

/**
 * Real-time listener for users (live updates in Admin and User views)
 */
export function subscribeToCloudUsers(
  onUpdate: (users: UserRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const q = collection(db, USERS_COLLECTION);
    return onSnapshot(
      q,
      (snapshot) => {
        const users: UserRecord[] = [];
        snapshot.forEach((docSnap) => {
          users.push(docSnap.data() as UserRecord);
        });
        if (users.length > 0) {
          onUpdate(users);
        }
      },
      (err) => {
        console.warn('Snapshot error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('No se pudo establecer listener en tiempo real:', err);
    return () => {};
  }
}

/**
 * Delete a user's response in Firestore cloud (resets response to null)
 */
export async function deleteCloudResponse(userId: string): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      userResponse: null,
      updatedAt: new Date().toISOString(),
    });

    // Also clean up any responses docs for this user
    try {
      const respSnap = await getDocs(collection(db, RESPONSES_COLLECTION));
      const deletes: Promise<void>[] = [];
      respSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.userId === userId) {
          deletes.push(deleteDoc(docSnap.ref));
        }
      });
      await Promise.all(deletes);
    } catch {
      // non-blocking
    }
  } catch (err) {
    console.error('Error al borrar respuesta de la nube:', err);
    throw err;
  }
}

/**
 * Delete user in cloud
 */
export async function deleteCloudUser(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, id));
  } catch (err) {
    console.error('Error al eliminar usuario en la nube:', err);
    throw err;
  }
}
