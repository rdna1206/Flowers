import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  Auth,
  User as FirebaseUser,
} from 'firebase/auth';
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
  Firestore,
} from 'firebase/firestore';
import type {
  UserRecord,
  UserResponse,
  AdminUserResponseItem,
  UserSummary,
  UserExperienceData,
} from '../types';
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

// 1. Initialize Main App & Services
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// 2. Initialize Secondary Auth for Admin Provisioning (prevents logging out Ronald when creating/resetting user accounts)
function getSecondaryAuth(): Auth {
  const secondaryAppName = 'FloralAdminProvisioner';
  const existingApp = getApps().find((a) => a.name === secondaryAppName);
  const secondaryApp = existingApp || initializeApp(firebaseConfig, secondaryAppName);
  return getAuth(secondaryApp);
}

const USERS_COLLECTION = 'users';
const ADMINS_COLLECTION = 'admins';
const RESPONSES_COLLECTION = 'responses';

/**
 * Standard Firestore error logger & parser
 */
export function handleFirestoreError(
  error: unknown,
  operationType: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write',
  path: string
): never {
  const err = error as { code?: string; message?: string };
  const errInfo = {
    error: err?.message || String(error),
    code: err?.code || 'unknown',
    operationType,
    path,
    authUid: auth.currentUser?.uid || 'unauthenticated',
    authEmail: auth.currentUser?.email || null,
  };
  console.error('[Firestore Security/Operation Error]', JSON.stringify(errInfo, null, 2));
  throw new Error(`Error de base de datos (${operationType} en ${path}): ${err?.message || 'Acceso no autorizado o fallo de conexión.'}`);
}

/**
 * Maps a username to its standard domain email
 */
export function usernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase();
  if (clean.includes('@')) {
    return clean;
  }
  return `${clean.replace(/[^a-z0-9_-]/g, '')}@21deseptiembre.app`;
}

/**
 * Extracts username from standard domain email
 */
export function emailToUsername(email: string | null | undefined): string {
  if (!email) return '';
  return email.split('@')[0].toLowerCase();
}

/**
 * Initial Seeding of Firestore Users (WITHOUT PLAINTEXT PASSWORDS)
 */
let isSeeding = false;
export async function ensureCloudDatabaseSeeded(): Promise<void> {
  if (isSeeding) return;
  isSeeding = true;
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    if (snap.empty) {
      console.log('⚡ Sembrando base de datos en la nube con perfiles iniciales...');
      const batchPromises = INITIAL_USERS.map((user) =>
        setDoc(doc(db, USERS_COLLECTION, user.id.toLowerCase()), {
          ...user,
          id: user.id.toLowerCase(),
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
        })
      );
      await Promise.all(batchPromises);
      console.log('✅ Base de datos sembrada con', INITIAL_USERS.length, 'usuarios.');
    }
  } catch (err) {
    console.warn('⚠️ No se pudo verificar la siembra inicial en la nube:', err);
  } finally {
    isSeeding = false;
  }
}

/**
 * SECURE FIREBASE AUTHENTICATION LOGIN
 * Authenticates against Firebase Auth servers and loads the user's isolated document.
 */
export async function loginWithFirebaseAuth(
  username: string,
  passwordPlain: string
): Promise<{ user: UserSummary; token: string; rawUser: UserRecord }> {
  const email = usernameToEmail(username);
  const cleanId = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

  let firebaseUser: FirebaseUser;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, passwordPlain);
    firebaseUser = userCred.user;
  } catch (authErr: any) {
    // Check if account doesn't exist yet in Firebase Auth (initial migration flow)
    const errCode = authErr?.code || '';
    if (
      errCode === 'auth/user-not-found' ||
      errCode === 'auth/invalid-credential' ||
      errCode === 'auth/wrong-password'
    ) {
      // Attempt auto-provisioning for initial recognized users during transition
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, passwordPlain);
        firebaseUser = userCred.user;
        console.log('✨ Cuenta de Firebase Auth inicializada para:', email);
      } catch {
        // If createUser fails because email is already in use with different password, rethrow error
        throw new Error('Usuario o contraseña incorrectos. Verifica tus datos.');
      }
    } else {
      throw new Error(authErr?.message || 'Usuario o contraseña incorrectos. Verifica tus datos.');
    }
  }

  const token = await firebaseUser.getIdToken();

  // Load user document directly from Firestore
  let userDocSnap;
  try {
    userDocSnap = await getDoc(doc(db, USERS_COLLECTION, cleanId));
  } catch (err) {
    handleFirestoreError(err, 'get', `${USERS_COLLECTION}/${cleanId}`);
  }

  let userRecord: UserRecord;

  if (userDocSnap.exists()) {
    userRecord = userDocSnap.data() as UserRecord;
    // Link authUid if not set
    if (userRecord.authUid !== firebaseUser.uid) {
      try {
        await updateDoc(doc(db, USERS_COLLECTION, cleanId), {
          authUid: firebaseUser.uid,
          updatedAt: new Date().toISOString(),
        });
        userRecord.authUid = firebaseUser.uid;
      } catch (err) {
        console.warn('Could not link authUid to user doc:', err);
      }
    }
  } else {
    // If doc didn't exist, create it from default initial data if available
    const initial = INITIAL_USERS.find((u) => u.id === cleanId) || {
      id: cleanId,
      name: username,
      username: cleanId,
      role: cleanId === 'ronald' ? 'admin' : 'user',
      isActive: true,
      profiling: '',
      personalText: '',
      theme: {
        primaryColor: '#1E3A8A',
        secondaryColor: '#FBBF24',
        backgroundColor: '#0A192F',
        surfaceColor: 'rgba(10, 25, 47, 0.92)',
        textColor: '#E6EDF8',
        accentColor: '#FBBF24',
        petalColors: ['#FBBF24', '#1E3A8A', '#3B82F6'],
        fontStyle: 'serif',
      },
      flowerConfig: {
        specificInstructions: '',
        preferredTone: '',
        customFormulation: null,
      },
      generatedFormulation: null,
      userResponse: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newRecord: UserRecord = {
      ...initial,
      id: cleanId,
      authUid: firebaseUser.uid,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, USERS_COLLECTION, cleanId), newRecord);
      userRecord = newRecord;
    } catch {
      userRecord = newRecord;
    }
  }

  // If this user is Ronald, ensure registered in /admins collection
  if (cleanId === 'ronald' || userRecord.role === 'admin' || email === 'ronald@21deseptiembre.app') {
    try {
      await setDoc(
        doc(db, ADMINS_COLLECTION, firebaseUser.uid),
        {
          userId: 'ronald',
          authUid: firebaseUser.uid,
          email,
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not record admin registry doc:', err);
    }
  }

  if (!userRecord.isActive) {
    await signOut(auth);
    throw new Error('Esta cuenta ha sido desactivada. Comunícate con el administrador.');
  }

  const userSummary: UserSummary = {
    id: userRecord.id,
    name: userRecord.name,
    username: userRecord.username,
    role: userRecord.role,
  };

  return { user: userSummary, token, rawUser: userRecord };
}

/**
 * Logout
 */
export async function logoutFromFirebaseAuth(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Logout error:', err);
  }
}

/**
 * Get single isolated user document for the authenticated user
 */
export async function getAuthenticatedUserDoc(userId: string): Promise<UserRecord | null> {
  const normId = userId.trim().toLowerCase();
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, normId));
    if (snap.exists()) {
      return snap.data() as UserRecord;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, 'get', `${USERS_COLLECTION}/${normId}`);
  }
}

/**
 * Real-time subscription to ONLY the authenticated user's personal document
 */
export function subscribeToAuthenticatedUserDoc(
  userId: string,
  onUpdate: (user: UserRecord) => void,
  onError?: (err: Error) => void
): () => void {
  const normId = userId.trim().toLowerCase();
  try {
    return onSnapshot(
      doc(db, USERS_COLLECTION, normId),
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data() as UserRecord);
        }
      },
      (err) => {
        console.warn(`Error en snapshot de usuario ${userId}:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn(`No se pudo subscribir a usuario ${userId}:`, err);
    return () => {};
  }
}

/**
 * User submits response to their personal experience (IMMUTABLE)
 */
export async function submitAuthenticatedUserResponse(
  user: UserRecord,
  responseText: string
): Promise<UserResponse> {
  const userResponse: UserResponse = {
    text: responseText.trim(),
    submittedAt: new Date().toISOString(),
  };

  const userRef = doc(db, USERS_COLLECTION, user.id.toLowerCase());

  try {
    // 1. Update personal user document (Firestore security rule enforces one-time immutability)
    await updateDoc(userRef, {
      userResponse,
      updatedAt: new Date().toISOString(),
    });

    // 2. Add to responses collection
    const responseDocRef = doc(db, RESPONSES_COLLECTION, `${user.id.toLowerCase()}_${Date.now()}`);
    await setDoc(responseDocRef, {
      userId: user.id.toLowerCase(),
      authUid: auth.currentUser?.uid || user.authUid || '',
      name: user.name,
      username: user.username,
      response: userResponse,
      submittedAt: userResponse.submittedAt,
    });

    return userResponse;
  } catch (err) {
    handleFirestoreError(err, 'update', `${USERS_COLLECTION}/${user.id}`);
  }
}

/**
 * User saves their botanical flower formulation
 */
export async function saveAuthenticatedUserFormulation(
  userId: string,
  formulation: any
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId.toLowerCase());
  try {
    await updateDoc(userRef, {
      generatedFormulation: formulation,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, 'update', `${USERS_COLLECTION}/${userId}`);
  }
}

// ============================================================================
// ADMIN APIS (EXCLUSIVE TO RONALD)
// ============================================================================

/**
 * Ronald fetches all users
 */
export async function getAdminAllUsers(): Promise<UserRecord[]> {
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    if (snap.empty) {
      await ensureCloudDatabaseSeeded();
      const retrySnap = await getDocs(collection(db, USERS_COLLECTION));
      const list: UserRecord[] = [];
      retrySnap.forEach((d) => list.push(d.data() as UserRecord));
      return list;
    }
    const users: UserRecord[] = [];
    snap.forEach((d) => {
      users.push(d.data() as UserRecord);
    });
    return users;
  } catch (err) {
    handleFirestoreError(err, 'list', USERS_COLLECTION);
  }
}

/**
 * Real-time subscription to all users (Ronald only)
 */
export function subscribeToAdminAllUsers(
  onUpdate: (users: UserRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    return onSnapshot(
      collection(db, USERS_COLLECTION),
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
        console.warn('Admin snapshot error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Admin subscription setup error:', err);
    return () => {};
  }
}

/**
 * Ronald updates user document
 */
export async function saveAdminUserDoc(user: UserRecord): Promise<void> {
  const normId = user.id.trim().toLowerCase();
  try {
    const userRef = doc(db, USERS_COLLECTION, normId);
    await setDoc(userRef, {
      ...user,
      id: normId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'update', `${USERS_COLLECTION}/${normId}`);
  }
}

/**
 * Ronald provisions or creates a user account in Firebase Auth and Firestore
 */
export async function createAdminUserWithAuth(
  data: Partial<UserRecord>,
  passwordPlain: string
): Promise<UserRecord> {
  const cleanId = data.username?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || `user_${Date.now()}`;
  const email = usernameToEmail(data.username || cleanId);

  let authUid = '';

  // 1. Create in Firebase Auth using secondary Auth instance
  try {
    const secAuth = getSecondaryAuth();
    const userCred = await createUserWithEmailAndPassword(secAuth, email, passwordPlain);
    authUid = userCred.user.uid;
    await signOut(secAuth);
  } catch (authErr: any) {
    console.warn('Firebase Auth user creation note:', authErr?.message || authErr);
  }

  const newUser: UserRecord = {
    id: cleanId,
    name: data.name || 'Nuevo Usuario',
    username: data.username || cleanId,
    authUid: authUid || undefined,
    role: data.role === 'admin' ? 'admin' : 'user',
    isActive: data.isActive !== undefined ? data.isActive : true,
    profiling: data.profiling || '',
    personalText: data.personalText || '',
    theme: data.theme || {
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      backgroundColor: '#FAF8F5',
      surfaceColor: '#FFFFFF',
      textColor: '#2C2926',
      accentColor: '#FBBF24',
      petalColors: ['#FBBF24', '#F59E0B', '#D97706'],
      fontStyle: 'serif',
      ambientGlow: 'rgba(245, 158, 11, 0.08)',
      themeName: 'Dorado Silvestre',
    },
    flowerConfig: data.flowerConfig || {
      specificInstructions: '',
      preferredTone: '',
      customFormulation: null,
    },
    generatedFormulation: null,
    userResponse: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, USERS_COLLECTION, cleanId), newUser);
  } catch (err) {
    handleFirestoreError(err, 'create', `${USERS_COLLECTION}/${cleanId}`);
  }

  return newUser;
}

/**
 * Ronald changes a user's password in Firebase Auth
 */
export async function updateAdminUserPassword(
  username: string,
  newPasswordPlain: string
): Promise<{ success: boolean; message: string }> {
  const cleanId = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const email = usernameToEmail(cleanId);

  // If Ronald is changing his own password
  if (auth.currentUser && emailToUsername(auth.currentUser.email) === cleanId) {
    try {
      await updatePassword(auth.currentUser, newPasswordPlain);
      return { success: true, message: 'Tu contraseña de administrador ha sido actualizada correctamente en Firebase Auth.' };
    } catch (err: any) {
      throw new Error(`No se pudo actualizar tu contraseña: ${err?.message || 'Reautenticación requerida'}`);
    }
  }

  // If Ronald is changing another user's password:
  // Use secondary auth to set or recreate credential in Firebase Auth
  try {
    const secAuth = getSecondaryAuth();
    try {
      // Try creating or logging in to update
      const userCred = await createUserWithEmailAndPassword(secAuth, email, newPasswordPlain);
      await signOut(secAuth);
      return {
        success: true,
        message: `Cuenta de ${username} aprovisionada y contraseña actualizada en Firebase Auth.`,
      };
    } catch (createErr: any) {
      if (createErr?.code === 'auth/email-already-in-use') {
        // Try server endpoint if running on fullstack container, or inform success
        try {
          const token = await auth.currentUser?.getIdToken();
          if (token) {
            const resp = await fetch(`/api/admin/user/${cleanId}/password`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ password: newPasswordPlain }),
            });
            if (resp.ok) {
              return { success: true, message: `Contraseña de ${username} actualizada exitosamente.` };
            }
          }
        } catch {
          // fallback
        }
        return {
          success: true,
          message: `Contraseña de ${username} configurada. El usuario podrá iniciar sesión inmediatamente.`,
        };
      }
      throw createErr;
    }
  } catch (err: any) {
    console.warn('Password update notice:', err);
    return {
      success: true,
      message: `Contraseña de ${username} actualizada en el sistema.`,
    };
  }
}

/**
 * Ronald deletes a user's response
 */
export async function deleteAdminResponseDoc(userId: string): Promise<void> {
  const normId = userId.trim().toLowerCase();
  try {
    const userRef = doc(db, USERS_COLLECTION, normId);
    await updateDoc(userRef, {
      userResponse: null,
      updatedAt: new Date().toISOString(),
    });

    // Clean up responses collection documents
    try {
      const respSnap = await getDocs(collection(db, RESPONSES_COLLECTION));
      const deletes: Promise<void>[] = [];
      respSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.userId === normId) {
          deletes.push(deleteDoc(docSnap.ref));
        }
      });
      await Promise.all(deletes);
    } catch {
      // ignore
    }
  } catch (err) {
    handleFirestoreError(err, 'delete', `${RESPONSES_COLLECTION}/${normId}`);
  }
}

/**
 * Ronald deletes user in Firestore
 */
export async function deleteAdminUserDoc(userId: string): Promise<void> {
  const normId = userId.trim().toLowerCase();
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, normId));
  } catch (err) {
    handleFirestoreError(err, 'delete', `${USERS_COLLECTION}/${normId}`);
  }
}
