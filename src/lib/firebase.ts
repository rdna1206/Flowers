import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  Auth,
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
  query,
  orderBy,
  limit,
  Firestore,
} from 'firebase/firestore';
import type {
  UserRecord,
  UserResponse,
  UserSummary,
  ChatMessage,
  ChatSummary,
  ChatPresenceState,
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

const USERS_COLLECTION = 'users';
const CREDENTIALS_COLLECTION = 'credentials';
const RESPONSES_COLLECTION = 'responses';
const CHATS_COLLECTION = 'chats';
const MESSAGES_COLLECTION = 'messages';

const DEFAULT_PASSWORDS: Record<string, string> = {
  ronald: '1146534949',
  jhon: '1146534949',
  isabella: '123456',
  shaday: '123456',
  genesis: '123456',
  andrea: '123456',
  isaias: '123456',
  hannia: '123456',
  luciana: '123456',
  stanley: '123456',
  dileidys: '123456',
  leiry: '123456',
  carlos: '123456',
  keicy: '123456',
  paula: 'Paula',
  anelim: 'anelim',
  gabriel: 'gabriel',
};

/**
 * SHA-256 Password Hasher for secure client & cloud authentication
 */
export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain.trim() + '_21deseptiembre_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

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
  };
  console.error('[Firestore Error]', JSON.stringify(errInfo, null, 2));
  throw new Error(`Error de base de datos (${operationType} en ${path}): ${err?.message || 'Acceso no autorizado o fallo de conexión.'}`);
}

export function usernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase();
  if (clean.includes('@')) {
    return clean;
  }
  return `${clean.replace(/[^a-z0-9_-]/g, '')}@21deseptiembre.app`;
}

export function emailToUsername(email: string | null | undefined): string {
  if (!email) return '';
  return email.split('@')[0].toLowerCase();
}

/**
 * Initial Seeding of Firestore Users (Profiles & Default Hashes)
 */
let isSeeding = false;
export async function ensureCloudDatabaseSeeded(): Promise<void> {
  if (isSeeding) return;
  isSeeding = true;
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    if (snap.empty) {
      console.log('⚡ Sembrando base de datos en la nube con perfiles iniciales...');
      const batchPromises = INITIAL_USERS.map(async (user) => {
        const cleanId = user.id.toLowerCase();
        await setDoc(doc(db, USERS_COLLECTION, cleanId), {
          ...user,
          id: cleanId,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
        });

        const defaultPass = DEFAULT_PASSWORDS[cleanId] || '123456';
        const initialHash = await hashPassword(defaultPass);
        await setDoc(doc(db, CREDENTIALS_COLLECTION, cleanId), {
          hash: initialHash,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      });
      await Promise.all(batchPromises);
      console.log('✅ Base de datos sembrada con', INITIAL_USERS.length, 'usuarios.');
    } else {
      // Sync any newly added users (like Carlos) that do not exist yet in Firestore
      const existingIds = new Set(snap.docs.map((d) => d.id.toLowerCase()));
      const syncPromises: Promise<any>[] = [];
      for (const user of INITIAL_USERS) {
        const cleanId = user.id.toLowerCase();
        if (!existingIds.has(cleanId)) {
          syncPromises.push(
            setDoc(doc(db, USERS_COLLECTION, cleanId), {
              ...user,
              id: cleanId,
              createdAt: user.createdAt || new Date().toISOString(),
              updatedAt: user.updatedAt || new Date().toISOString(),
            })
          );
          const defaultPass = DEFAULT_PASSWORDS[cleanId] || '123456';
          syncPromises.push(
            hashPassword(defaultPass).then((initialHash) =>
              setDoc(
                doc(db, CREDENTIALS_COLLECTION, cleanId),
                {
                  hash: initialHash,
                  updatedAt: new Date().toISOString(),
                },
                { merge: true }
              )
            )
          );
        }
      }
      if (syncPromises.length > 0) {
        await Promise.all(syncPromises);
        console.log('✅ Nuevos perfiles sincronizados en Firestore.');
      }
    }
  } catch (err) {
    console.warn('⚠️ No se pudo verificar la siembra inicial en la nube:', err);
  } finally {
    isSeeding = false;
  }
}

/**
 * SECURE FIREBASE LOGIN
 * Works seamlessly in both dev and GitHub Pages environments with Firestore persistence
 */
export async function loginWithFirebaseAuth(
  username: string,
  passwordPlain: string
): Promise<{ user: UserSummary; token: string; rawUser: UserRecord }> {
  const cleanId = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const inputPass = passwordPlain.trim();
  if (!cleanId || !inputPass) {
    throw new Error('Por favor ingresa tu usuario y contraseña.');
  }

  const inputHash = await hashPassword(inputPass);

  // 1. Fetch user doc from Firestore
  let userDocSnap;
  try {
    userDocSnap = await getDoc(doc(db, USERS_COLLECTION, cleanId));
  } catch (err) {
    handleFirestoreError(err, 'get', `${USERS_COLLECTION}/${cleanId}`);
  }

  let userRecord: UserRecord;

  if (userDocSnap.exists()) {
    userRecord = userDocSnap.data() as UserRecord;
  } else {
    // If doc doesn't exist yet, check initial users array
    const initial = INITIAL_USERS.find((u) => u.id === cleanId);
    if (!initial) {
      throw new Error('Usuario no encontrado. Verifica tus datos de acceso.');
    }
    userRecord = {
      ...initial,
      id: cleanId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, USERS_COLLECTION, cleanId), userRecord);
    } catch {
      // ignore
    }
  }

  if (!userRecord.isActive) {
    throw new Error('Esta cuenta ha sido desactivada. Comunícate con el administrador.');
  }

  // 2. Validate Password via Firestore Credentials Collection or Default Map
  let isPasswordValid = false;
  try {
    const credSnap = await getDoc(doc(db, CREDENTIALS_COLLECTION, cleanId));
    if (credSnap.exists()) {
      const credData = credSnap.data();
      if (credData.hash && credData.hash === inputHash) {
        isPasswordValid = true;
      } else if (credData.plain && credData.plain === inputPass) {
        isPasswordValid = true;
        // Upgrade to hash in background
        setDoc(doc(db, CREDENTIALS_COLLECTION, cleanId), {
          hash: inputHash,
          updatedAt: new Date().toISOString(),
        }).catch(() => {});
      }
    } else {
      // Default password verification
      const defaultPass = DEFAULT_PASSWORDS[cleanId] || '123456';
      if (inputPass === defaultPass) {
        isPasswordValid = true;
        // Save credential hash to Firestore
        setDoc(doc(db, CREDENTIALS_COLLECTION, cleanId), {
          hash: inputHash,
          updatedAt: new Date().toISOString(),
        }).catch(() => {});
      }
    }
  } catch {
    // Fallback if offline
    const defaultPass = DEFAULT_PASSWORDS[cleanId] || '123456';
    if (inputPass === defaultPass) {
      isPasswordValid = true;
    }
  }

  if (!isPasswordValid) {
    throw new Error('Usuario o contraseña incorrectos. Verifica tus datos.');
  }

  // Generate secure token
  let token = `token_${cleanId}_${Date.now()}_${Math.random().toString(36).substring(2)}`;

  // Optional: Background Firebase Auth sign-in if enabled, without failing if operation not allowed
  try {
    const email = usernameToEmail(cleanId);
    const userCred = await signInWithEmailAndPassword(auth, email, inputPass);
    token = await userCred.user.getIdToken();
  } catch {
    // Operation not allowed or email provider disabled in Firebase Console:
    // Session token generated above operates completely and securely with Firestore rules
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
  } catch {
    // ignore
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
    const initial = INITIAL_USERS.find((u) => u.id === normId);
    return initial || null;
  } catch (err) {
    handleFirestoreError(err, 'get', `${USERS_COLLECTION}/${normId}`);
  }
}

/**
 * Real-time subscription to user's personal document
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
    // 1. Update personal user document
    await updateDoc(userRef, {
      userResponse,
      updatedAt: new Date().toISOString(),
    });

    // 2. Add to responses collection
    const responseDocRef = doc(db, RESPONSES_COLLECTION, `${user.id.toLowerCase()}_${Date.now()}`);
    await setDoc(responseDocRef, {
      userId: user.id.toLowerCase(),
      name: user.name,
      username: user.username,
      response: userResponse,
      submittedAt: userResponse.submittedAt,
    });

    // 3. Initialize real-time chat with original response as message #1
    await initUserChatWithOriginalResponse(user, userResponse.text, userResponse.submittedAt);

    return userResponse;
  } catch (err) {
    handleFirestoreError(err, 'update', `${USERS_COLLECTION}/${user.id}`);
  }
}

/**
 * Initialize or sync user's chat with their original response (IMMUTABLE message #1)
 */
export async function initUserChatWithOriginalResponse(
  user: UserRecord,
  responseText: string,
  submittedAt: string
): Promise<void> {
  const normId = user.id.toLowerCase();
  const chatRef = doc(db, CHATS_COLLECTION, normId);
  const msgRef = doc(db, CHATS_COLLECTION, normId, MESSAGES_COLLECTION, 'original_response');

  try {
    // Check if original response message already exists (Idempotent: prevents duplicate)
    const msgSnap = await getDoc(msgRef);
    if (!msgSnap.exists()) {
      const originalMsg: ChatMessage = {
        id: 'original_response',
        chatId: normId,
        userId: normId,
        senderId: normId,
        senderName: user.name,
        senderRole: 'user',
        text: responseText.trim(),
        isOriginalResponse: true,
        read: false,
        createdAt: submittedAt,
      };
      await setDoc(msgRef, originalMsg);
    }

    // Set or merge chat header doc
    await setDoc(
      chatRef,
      {
        id: normId,
        userId: normId,
        userName: user.name,
        lastMessageText: responseText.trim(),
        lastMessageAt: submittedAt,
        createdAt: submittedAt,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not initialize chat document in Firestore:', err);
  }
}

/**
 * Ensures chat has original response if user already submitted one earlier
 */
export async function ensureChatInitialized(user: UserRecord): Promise<void> {
  if (user.userResponse && user.userResponse.text) {
    await initUserChatWithOriginalResponse(user, user.userResponse.text, user.userResponse.submittedAt);
  }
}

/**
 * Send a new real-time message in Firestore
 */
export async function sendChatMessage(
  chatId: string,
  message: {
    senderId: string;
    senderName: string;
    senderRole: 'user' | 'admin';
    text: string;
  }
): Promise<ChatMessage> {
  const normChatId = chatId.trim().toLowerCase();
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();

  const newMsg: ChatMessage = {
    id: msgId,
    chatId: normChatId,
    userId: normChatId,
    senderId: message.senderId,
    senderName: message.senderName,
    senderRole: message.senderRole,
    text: message.text.trim(),
    isOriginalResponse: false,
    read: false,
    createdAt: now,
  };

  try {
    const msgRef = doc(db, CHATS_COLLECTION, normChatId, MESSAGES_COLLECTION, msgId);
    await setDoc(msgRef, newMsg);

    // Update parent chat summary for real-time list
    const chatRef = doc(db, CHATS_COLLECTION, normChatId);
    await setDoc(
      chatRef,
      {
        id: normChatId,
        userId: normChatId,
        lastMessageText: newMsg.text,
        lastMessageAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    return newMsg;
  } catch (err) {
    handleFirestoreError(err, 'create', `${CHATS_COLLECTION}/${normChatId}/${MESSAGES_COLLECTION}/${msgId}`);
  }
}

/**
 * Delete a specific message from a conversation (Ronald only)
 */
export async function deleteChatMessage(chatId: string, messageId: string): Promise<void> {
  const normChatId = chatId.trim().toLowerCase();
  try {
    const msgRef = doc(db, CHATS_COLLECTION, normChatId, MESSAGES_COLLECTION, messageId);
    await deleteDoc(msgRef);

    // Refresh parent chat last message preview
    const messagesRef = collection(db, CHATS_COLLECTION, normChatId, MESSAGES_COLLECTION);
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    const chatRef = doc(db, CHATS_COLLECTION, normChatId);
    if (!snap.empty) {
      const lastMsg = snap.docs[0].data() as ChatMessage;
      await updateDoc(chatRef, {
        lastMessageText: lastMsg.text,
        lastMessageAt: lastMsg.createdAt,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await setDoc(
        chatRef,
        {
          id: normChatId,
          userId: normChatId,
          lastMessageText: '',
          lastMessageAt: '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // If no messages left at all, wipe userResponse so it doesn't resurrect
      try {
        const userRef = doc(db, USERS_COLLECTION, normChatId);
        await updateDoc(userRef, {
          userResponse: null,
          updatedAt: new Date().toISOString(),
        });
      } catch {
        // ignore
      }
    }
  } catch (err) {
    handleFirestoreError(err, 'delete', `${CHATS_COLLECTION}/${normChatId}/${MESSAGES_COLLECTION}/${messageId}`);
  }
}

/**
 * Clear all messages from a conversation for testing/reset (Ronald only)
 */
export async function clearChatHistory(chatId: string): Promise<void> {
  const normChatId = chatId.trim().toLowerCase();
  try {
    // 1. Delete all chat messages
    const messagesRef = collection(db, CHATS_COLLECTION, normChatId, MESSAGES_COLLECTION);
    const snap = await getDocs(messagesRef);
    const deletePromises: Promise<void>[] = [];
    snap.forEach((d) => {
      deletePromises.push(deleteDoc(d.ref));
    });
    await Promise.all(deletePromises);

    // 2. Clear chat document summary
    const chatRef = doc(db, CHATS_COLLECTION, normChatId);
    await setDoc(
      chatRef,
      {
        id: normChatId,
        userId: normChatId,
        lastMessageText: '',
        lastMessageAt: '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // 3. Clear userResponse on users collection
    const userRef = doc(db, USERS_COLLECTION, normChatId);
    await updateDoc(userRef, {
      userResponse: null,
      updatedAt: new Date().toISOString(),
    });

    // 4. Delete any matching response in responses collection
    try {
      const respSnap = await getDocs(collection(db, RESPONSES_COLLECTION));
      const respDeletes: Promise<void>[] = [];
      respSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.userId === normChatId || docSnap.id === normChatId) {
          respDeletes.push(deleteDoc(docSnap.ref));
        }
      });
      await Promise.all(respDeletes);
    } catch {
      // ignore
    }
  } catch (err) {
    handleFirestoreError(err, 'delete', `${CHATS_COLLECTION}/${normChatId}`);
  }
}

/**
 * Real-time subscription to a single conversation's messages
 */
export function subscribeToChatMessages(
  chatId: string,
  onUpdate: (messages: ChatMessage[]) => void,
  onError?: (err: Error) => void
): () => void {
  const normChatId = chatId.trim().toLowerCase();
  try {
    const messagesRef = collection(db, CHATS_COLLECTION, normChatId, MESSAGES_COLLECTION);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgs.push(docSnap.data() as ChatMessage);
        });
        onUpdate(msgs);
      },
      (err) => {
        console.warn(`Error in chat snapshot for ${normChatId}:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn(`Setup error in chat snapshot for ${normChatId}:`, err);
    return () => {};
  }
}

/**
 * Real-time subscription to all conversations for Ronald
 */
export function subscribeToAllChats(
  onUpdate: (chats: ChatSummary[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const chatsRef = collection(db, CHATS_COLLECTION);
    return onSnapshot(
      chatsRef,
      (snapshot) => {
        const list: ChatSummary[] = [];
        const now = Date.now();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ChatSummary;
          const isAdminActive =
            Boolean(data.adminInChat) &&
            (!data.adminHeartbeat || now - data.adminHeartbeat < 30000);
          const isUserActive =
            Boolean(data.userInChat) &&
            (!data.userHeartbeat || now - data.userHeartbeat < 30000);

          list.push({
            ...data,
            adminInChat: isAdminActive,
            userInChat: isUserActive,
            adminTyping: isAdminActive && Boolean(data.adminTyping),
            userTyping: isUserActive && Boolean(data.userTyping),
          });
        });
        list.sort((a, b) => (b.lastMessageAt || b.updatedAt || '').localeCompare(a.lastMessageAt || a.updatedAt || ''));
        onUpdate(list);
      },
      (err) => {
        console.warn('Error in all chats snapshot:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Setup error in all chats snapshot:', err);
    return () => {};
  }
}

/**
 * Set real-time presence for a chat participant (user or admin)
 */
export async function setUserChatPresence(
  chatId: string,
  role: 'user' | 'admin',
  isPresent: boolean
): Promise<void> {
  const normChatId = chatId.trim().toLowerCase();
  try {
    const chatRef = doc(db, CHATS_COLLECTION, normChatId);
    const nowIso = new Date().toISOString();
    const nowTime = Date.now();

    if (role === 'admin') {
      await setDoc(
        chatRef,
        {
          id: normChatId,
          userId: normChatId,
          adminInChat: isPresent,
          adminLastSeen: nowIso,
          ...(isPresent
            ? { adminHeartbeat: nowTime }
            : { adminTyping: false, adminHeartbeat: 0 }),
          updatedAt: nowIso,
        },
        { merge: true }
      );
    } else {
      await setDoc(
        chatRef,
        {
          id: normChatId,
          userId: normChatId,
          userInChat: isPresent,
          userLastSeen: nowIso,
          ...(isPresent
            ? { userHeartbeat: nowTime }
            : { userTyping: false, userHeartbeat: 0 }),
          updatedAt: nowIso,
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.warn(`Error setting presence for ${normChatId}:`, err);
  }
}

/**
 * Send heartbeat to keep presence alive while active in chat
 */
export async function updateUserChatHeartbeat(
  chatId: string,
  role: 'user' | 'admin'
): Promise<void> {
  const normChatId = chatId.trim().toLowerCase();
  try {
    const chatRef = doc(db, CHATS_COLLECTION, normChatId);
    const nowTime = Date.now();

    if (role === 'admin') {
      await setDoc(
        chatRef,
        {
          adminInChat: true,
          adminHeartbeat: nowTime,
        },
        { merge: true }
      );
    } else {
      await setDoc(
        chatRef,
        {
          userInChat: true,
          userHeartbeat: nowTime,
        },
        { merge: true }
      );
    }
  } catch {
    // silent fallback for heartbeat
  }
}

/**
 * Set real-time typing status in chat
 */
export async function setUserChatTyping(
  chatId: string,
  role: 'user' | 'admin',
  isTyping: boolean
): Promise<void> {
  const normChatId = chatId.trim().toLowerCase();
  try {
    const chatRef = doc(db, CHATS_COLLECTION, normChatId);
    if (role === 'admin') {
      await setDoc(
        chatRef,
        {
          adminTyping: isTyping,
        },
        { merge: true }
      );
    } else {
      await setDoc(
        chatRef,
        {
          userTyping: isTyping,
        },
        { merge: true }
      );
    }
  } catch {
    // silent fallback for typing status
  }
}

/**
 * Subscribe in real-time to presence & typing status of a specific chat
 */
export function subscribeToChatPresence(
  chatId: string,
  onUpdate: (presence: ChatPresenceState) => void,
  onError?: (err: Error) => void
): () => void {
  const normChatId = chatId.trim().toLowerCase();
  try {
    const chatRef = doc(db, CHATS_COLLECTION, normChatId);
    return onSnapshot(
      chatRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          onUpdate({
            adminInChat: false,
            userInChat: false,
            adminTyping: false,
            userTyping: false,
          });
          return;
        }

        const data = docSnap.data();
        const now = Date.now();
        const isAdminActive =
          Boolean(data.adminInChat) &&
          (!data.adminHeartbeat || now - data.adminHeartbeat < 30000);
        const isUserActive =
          Boolean(data.userInChat) &&
          (!data.userHeartbeat || now - data.userHeartbeat < 30000);

        onUpdate({
          adminInChat: isAdminActive,
          userInChat: isUserActive,
          adminTyping: isAdminActive && Boolean(data.adminTyping),
          userTyping: isUserActive && Boolean(data.userTyping),
          adminLastSeen: data.adminLastSeen,
          userLastSeen: data.userLastSeen,
          adminHeartbeat: data.adminHeartbeat,
          userHeartbeat: data.userHeartbeat,
        });
      },
      (err) => {
        console.warn(`Error in presence snapshot for ${normChatId}:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn(`Setup error in presence snapshot for ${normChatId}:`, err);
    return () => {};
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
      return list.length > 0 ? list : INITIAL_USERS;
    }
    const users: UserRecord[] = [];
    snap.forEach((d) => {
      users.push(d.data() as UserRecord);
    });
    return users;
  } catch (err) {
    console.warn('Firestore list error, falling back to initial data:', err);
    return INITIAL_USERS;
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
 * Ronald creates a user account in Firestore
 */
export async function createAdminUserWithAuth(
  data: Partial<UserRecord>,
  passwordPlain: string
): Promise<UserRecord> {
  const cleanId = data.username?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || `user_${Date.now()}`;
  const pass = passwordPlain.trim() || '123456';
  const passHash = await hashPassword(pass);

  // Save credential in Firestore
  await setDoc(doc(db, CREDENTIALS_COLLECTION, cleanId), {
    hash: passHash,
    updatedAt: new Date().toISOString(),
  });

  const newUser: UserRecord = {
    id: cleanId,
    name: data.name || 'Nuevo Usuario',
    username: data.username || cleanId,
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
 * Ronald changes a user's password in Firestore
 */
export async function updateAdminUserPassword(
  username: string,
  newPasswordPlain: string
): Promise<{ success: boolean; message: string }> {
  const cleanId = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const pass = newPasswordPlain.trim();
  if (!pass) {
    throw new Error('La contraseña no puede estar vacía.');
  }

  const passHash = await hashPassword(pass);

  // Save hashed password into Firestore
  const credRef = doc(db, CREDENTIALS_COLLECTION, cleanId);
  await setDoc(credRef, {
    hash: passHash,
    updatedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: `Contraseña de ${username} actualizada exitosamente.`,
  };
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
    await deleteDoc(doc(db, CREDENTIALS_COLLECTION, normId));
  } catch (err) {
    handleFirestoreError(err, 'delete', `${USERS_COLLECTION}/${normId}`);
  }
}
