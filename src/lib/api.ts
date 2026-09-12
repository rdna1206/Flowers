import type {
  UserSummary,
  UserExperienceData,
  FlowerFormulation,
  UserRecord,
  UserResponse,
  AdminUserResponseItem,
} from '../types';
import { INITIAL_USERS } from '../data/initialUsers';
import {
  getCloudUsers,
  getCloudUser,
  saveCloudUser,
  submitCloudResponse,
  deleteCloudResponse,
  deleteCloudUser,
  ensureCloudDatabaseSeeded,
} from './firebase';

const TOKEN_KEY = 'floral_session_token';
const USERS_DB_KEY = 'floral_offline_users_db';
const ACTIVE_USER_ID_KEY = 'floral_offline_active_user_id';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACTIVE_USER_ID_KEY);
}

// ----------------------------------------------------------------------------
// LOCAL CACHE SYNC ENGINE
// ----------------------------------------------------------------------------
function mergeUserRecords(cached: UserRecord, incoming: UserRecord): UserRecord {
  // If incoming has personalText, use incoming. If incoming is empty but cached has personalText, preserve cached!
  const personalText =
    incoming.personalText && incoming.personalText.trim().length > 0
      ? incoming.personalText
      : cached.personalText || '';

  const profiling =
    incoming.profiling && incoming.profiling.trim().length > 0
      ? incoming.profiling
      : cached.profiling || '';

  const userResponse = incoming.userResponse || cached.userResponse || null;

  return {
    ...cached,
    ...incoming,
    id: incoming.id || cached.id,
    personalText,
    profiling,
    userResponse,
    theme: incoming.theme || cached.theme,
    flowerConfig: incoming.flowerConfig || cached.flowerConfig,
  };
}

function getLocalUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure leiry is present and updated
      const leiryInitial = INITIAL_USERS.find((u) => u.id === 'leiry');
      if (leiryInitial) {
        const idx = parsed.findIndex((u: UserRecord) => u.id === 'leiry');
        if (idx === -1) {
          parsed.push(leiryInitial);
        } else {
          parsed[idx].theme = leiryInitial.theme;
          parsed[idx].flowerConfig = leiryInitial.flowerConfig;
        }
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

function saveLocalUsers(users: UserRecord[]): void {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Failed to persist users in localStorage:', err);
  }
}

function getActiveLocalUser(): UserRecord | null {
  const userId = localStorage.getItem(ACTIVE_USER_ID_KEY);
  if (!userId) return null;
  const users = getLocalUsers();
  const norm = userId.trim().toLowerCase();
  return users.find((u) => u.id.toLowerCase() === norm || u.username.toLowerCase() === norm) || null;
}

function toUserSummary(user: UserRecord): UserSummary {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  };
}

function toUserExperienceData(user: UserRecord): UserExperienceData {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    personalText: user.personalText || '',
    isPendingText: !user.personalText || user.personalText.trim() === '',
    isPendingProfiling: !user.profiling || user.profiling.trim() === '',
    theme: user.theme,
    flowerConfig: user.flowerConfig,
    savedFormulation: user.generatedFormulation,
    userResponse: user.userResponse,
  };
}

// Fallback formulation generator
function createSimulatedFormulation(user: UserRecord): FlowerFormulation {
  return {
    title: `Armonía y Esencia Botánica para ${user.name}`,
    essence: `Una composición diseñada para reflejar la sensibilidad, el equilibrio y la profundidad singular de ${user.name}.`,
    flowers: [
      {
        name: 'Rosa Silvestre Dorada',
        botanicalName: 'Rosa lutea',
        meaning: 'Símbolo de amistad inquebrantable, calidez luminosa y presencia reconfortante.',
        role: 'Flor Principal',
        color: 'Amarillo Dorado #FBBF24',
      },
      {
        name: 'Lirio de Zafiro y Sombra',
        botanicalName: 'Iris nigricans',
        meaning: 'Representa la concentración profunda, el misterio y la capacidad de enfoque sereno.',
        role: 'Acorde de Profundidad',
        color: 'Azul Profundo #1E3A8A',
      },
      {
        name: 'Ranúnculo Imperial',
        botanicalName: 'Ranunculus asiaticus',
        meaning: 'Elegancia sutil, gracia natural y armonía en los detalles.',
        role: 'Acompañamiento',
        color: 'Amarillo Canario #FDE047',
      },
      {
        name: 'Brote de Luz Blanca',
        botanicalName: 'Anemone nemorosa',
        meaning: 'Claridad de pensamiento y sinceridad en las palabras no dichas.',
        role: 'Toque Luminoso',
        color: 'Blanco Luna #FFFFFF',
      },
    ],
    synergy:
      'La estructura armoniza la vitalidad de los pétalos dorados con la serenidad de los tonos profundos, creando un equilibrio orgánico entre acción, introspección y belleza perdurable.',
    finalDedication: `Para ${user.name}: que este ramo sea un recordatorio de la luz y la fuerza única que aportas al mundo.`,
    generatedAt: new Date().toISOString(),
  };
}

// Trigger initial cloud seed in background
ensureCloudDatabaseSeeded().catch(() => {});

// ----------------------------------------------------------------------------
// UNIFIED REAL-TIME API OBJECT (CLOUD FIRESTORE + LOCAL CACHE + GH PAGES)
// ----------------------------------------------------------------------------
export const api = {
  async login(username: string, password: string): Promise<{ token: string; user: UserSummary }> {
    const normInputUser = username.trim().toLowerCase();
    const normInputPass = password.trim();

    // 1. Try Firebase Cloud Firestore first
    try {
      const cloudUsers = await getCloudUsers();
      if (cloudUsers && cloudUsers.length > 0) {
        const localUsers = getLocalUsers();
        // Merge cloud users with local users without wiping local text
        const mergedUsers = cloudUsers.map((cu) => {
          const matchingLocal = localUsers.find(
            (lu) => lu.id.toLowerCase() === cu.id.toLowerCase()
          );
          return matchingLocal ? mergeUserRecords(matchingLocal, cu) : cu;
        });
        saveLocalUsers(mergedUsers);

        const cloudUser = mergedUsers.find(
          (u) =>
            u.isActive &&
            (u.username.toLowerCase() === normInputUser || u.name.toLowerCase() === normInputUser) &&
            u.passwordPlain === normInputPass
        );
        if (cloudUser) {
          const token = `firebase_token_${cloudUser.id}_${Date.now()}`;
          setStoredToken(token);
          localStorage.setItem(ACTIVE_USER_ID_KEY, cloudUser.id);
          return {
            token,
            user: toUserSummary(cloudUser),
          };
        }
      }
    } catch (cloudErr) {
      console.warn('Login cloud lookup failed, checking local cache:', cloudErr);
    }

    // 2. Fallback to Local Storage
    const users = getLocalUsers();
    const user = users.find(
      (u) =>
        u.isActive &&
        (u.username.toLowerCase() === normInputUser || u.name.toLowerCase() === normInputUser) &&
        u.passwordPlain === normInputPass
    );

    if (!user) {
      throw new Error('Usuario o contraseña incorrectos. Verifica tus datos.');
    }

    const dummyToken = `token_${user.id}_${Date.now()}`;
    setStoredToken(dummyToken);
    localStorage.setItem(ACTIVE_USER_ID_KEY, user.id);

    return {
      token: dummyToken,
      user: toUserSummary(user),
    };
  },

  async getMe(): Promise<UserSummary> {
    const userId = localStorage.getItem(ACTIVE_USER_ID_KEY);
    if (!userId) {
      throw new Error('No active local session');
    }

    try {
      const cloudUser = await getCloudUser(userId);
      if (cloudUser) {
        return toUserSummary(cloudUser);
      }
    } catch {
      // ignore
    }

    const user = getActiveLocalUser();
    if (!user) {
      throw new Error('No active local session');
    }
    return toUserSummary(user);
  },

  async logout(): Promise<void> {
    clearStoredToken();
  },

  async getExperience(): Promise<UserExperienceData> {
    const userId = localStorage.getItem(ACTIVE_USER_ID_KEY);
    const localUser = getActiveLocalUser();

    if (userId) {
      try {
        const cloudUser = await getCloudUser(userId);
        if (cloudUser) {
          const merged = localUser ? mergeUserRecords(localUser, cloudUser) : cloudUser;
          // update local cache for this user
          const localUsers = getLocalUsers();
          const updated = localUsers.map((u) =>
            u.id.toLowerCase() === cloudUser.id.toLowerCase() ? merged : u
          );
          saveLocalUsers(updated);
          return toUserExperienceData(merged);
        }
      } catch (err) {
        console.warn('Could not fetch cloud experience, using cached data:', err);
      }
    }

    if (!localUser) {
      throw new Error('No active local user');
    }
    return toUserExperienceData(localUser);
  },

  async submitResponse(responseText: string): Promise<{ success: boolean; userResponse: UserResponse }> {
    const activeUser = getActiveLocalUser();
    if (!activeUser) {
      throw new Error('No active local user');
    }

    // STRICT SECURITY & IMMUTABILITY:
    // A regular user can only submit their response once. It is permanently locked thereafter.
    if (
      activeUser.userResponse &&
      activeUser.userResponse.text &&
      activeUser.userResponse.text.trim().length > 0
    ) {
      throw new Error(
        'Tu respuesta ya fue enviada y se encuentra bloqueada de forma permanente. No es posible modificarla ni reemplazarla.'
      );
    }

    const userResponse: UserResponse = {
      text: responseText.trim(),
      submittedAt: new Date().toISOString(),
    };

    // 1. Update local cache immediately for instant UI feedback
    const users = getLocalUsers();
    const updatedUsers = users.map((u) => (u.id === activeUser.id ? { ...u, userResponse } : u));
    saveLocalUsers(updatedUsers);

    // 2. Submit to Firebase Cloud Firestore for real-time sync across all devices
    try {
      await submitCloudResponse(activeUser, responseText);
      console.log('✅ Respuesta sincronizada exitosamente en la nube (Firestore)');
    } catch (cloudErr) {
      console.warn('⚠️ Guardado localmente. Error al enviar a la nube:', cloudErr);
    }

    // 3. Try server API if present
    try {
      const token = getStoredToken();
      if (token) {
        await fetch('/api/user/response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ responseText: responseText.trim() }),
        });
      }
    } catch {
      // server optional
    }

    return { success: true, userResponse };
  },

  async deleteUserResponse(): Promise<{ success: boolean }> {
    // SECURITY: Users can NEVER delete their own response. Only Ronald can from the admin dashboard.
    throw new Error(
      'Acceso denegado: los usuarios no tienen autorización para eliminar respuestas. Esta acción es exclusiva de Ronald.'
    );
  },

  async formulateFlowers(): Promise<{ formulation: FlowerFormulation }> {
    const user = getActiveLocalUser();
    if (!user) {
      throw new Error('No active local user');
    }

    // Try server API first if server is running
    try {
      const token = getStoredToken();
      const res = await fetch('/api/flowers/formulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.formulation) {
          // save to cloud
          const updatedUser = { ...user, generatedFormulation: data.formulation };
          saveCloudUser(updatedUser).catch(() => {});
          return { formulation: data.formulation };
        }
      }
    } catch {
      // server not present (GitHub Pages)
    }

    const formulation = createSimulatedFormulation(user);
    const users = getLocalUsers();
    const updatedUser = { ...user, generatedFormulation: formulation };
    const updatedUsers = users.map((u) =>
      u.id === user.id ? updatedUser : u
    );
    saveLocalUsers(updatedUsers);

    // Sync to Cloud
    saveCloudUser(updatedUser).catch(() => {});

    return { formulation };
  },

  async resetFormulation(): Promise<{ success: boolean }> {
    const user = getActiveLocalUser();
    if (!user) {
      throw new Error('No active local user');
    }

    const users = getLocalUsers();
    const updatedUser = { ...user, generatedFormulation: null };
    const updatedUsers = users.map((u) =>
      u.id === user.id ? updatedUser : u
    );
    saveLocalUsers(updatedUsers);

    // Sync to Cloud
    saveCloudUser(updatedUser).catch(() => {});

    return { success: true };
  },

  // --------------------------------------------------------------------------
  // ADMIN APIS (Ronald)
  // --------------------------------------------------------------------------
  async getAdminUsers(): Promise<{ users: UserRecord[] }> {
    try {
      const cloudUsers = await getCloudUsers();
      if (cloudUsers && cloudUsers.length > 0) {
        saveLocalUsers(cloudUsers);
        return { users: cloudUsers };
      }
    } catch (err) {
      console.warn('Error loading admin users from cloud, using cache:', err);
    }
    return { users: getLocalUsers() };
  },

  async getAdminResponses(): Promise<{ responses: AdminUserResponseItem[] }> {
    try {
      const cloudUsers = await getCloudUsers();
      if (cloudUsers && cloudUsers.length > 0) {
        saveLocalUsers(cloudUsers);
        const responses: AdminUserResponseItem[] = cloudUsers
          .filter((u) => u.userResponse && u.userResponse.text)
          .map((u) => ({
            userId: u.id,
            name: u.name,
            username: u.username,
            response: u.userResponse!,
          }));
        return { responses };
      }
    } catch (err) {
      console.warn('Error loading admin responses from cloud, using cache:', err);
    }

    const users = getLocalUsers();
    const responses: AdminUserResponseItem[] = users
      .filter((u) => u.userResponse && u.userResponse.text)
      .map((u) => ({
        userId: u.id,
        name: u.name,
        username: u.username,
        response: u.userResponse!,
      }));
    return { responses };
  },

  async deleteAdminResponse(userId: string): Promise<{ success: boolean }> {
    const activeUser = getActiveLocalUser();
    if (!activeUser || activeUser.role !== 'admin') {
      throw new Error('Permiso denegado: solo Ronald tiene autorización para eliminar respuestas.');
    }

    const users = getLocalUsers();
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, userResponse: null } : u));
    saveLocalUsers(updatedUsers);

    try {
      await deleteCloudResponse(userId);
      console.log(`✅ Respuesta de usuario ${userId} eliminada de la nube`);
    } catch (err) {
      console.warn('Error deleting response from cloud:', err);
    }

    try {
      const token = getStoredToken();
      if (token) {
        await fetch(`/api/admin/response/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // server optional
    }

    return { success: true };
  },

  async updateAdminUser(id: string, updates: Partial<UserRecord>): Promise<{ user: UserRecord }> {
    const users = getLocalUsers();
    const norm = id.trim().toLowerCase();
    const index = users.findIndex((u) => u.id.toLowerCase() === norm || u.username.toLowerCase() === norm);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    const updatedUser: UserRecord = {
      ...users[index],
      ...updates,
      id: users[index].id,
      updatedAt: new Date().toISOString(),
    };
    users[index] = updatedUser;
    saveLocalUsers(users);

    // Sync immediately to Firestore Cloud
    try {
      await saveCloudUser(updatedUser);
      console.log(`✅ Usuario ${id} sincronizado en la nube`);
    } catch (err) {
      console.warn('Error syncing user update to cloud:', err);
    }

    // Try server API sync as well if server is active
    try {
      const token = getStoredToken();
      if (token) {
        await fetch(`/api/admin/user/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
      }
    } catch {
      // server optional
    }

    return { user: updatedUser };
  },

  async createAdminUser(data: Partial<UserRecord>): Promise<{ user: UserRecord }> {
    const users = getLocalUsers();
    const newId =
      data.username?.toLowerCase().replace(/\s+/g, '_') || `user_${Date.now()}`;

    const newUser: UserRecord = {
      id: newId,
      name: data.name || 'Nuevo Usuario',
      username: data.username || newId,
      passwordPlain: data.passwordPlain || '123456',
      role: 'user',
      isActive: true,
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

    users.push(newUser);
    saveLocalUsers(users);

    // Sync to Firestore Cloud
    try {
      await saveCloudUser(newUser);
    } catch (err) {
      console.warn('Error syncing new user to cloud:', err);
    }

    return { user: newUser };
  },

  async deleteAdminUser(id: string): Promise<{ success: boolean }> {
    const users = getLocalUsers();
    const filtered = users.filter((u) => u.id !== id);
    saveLocalUsers(filtered);

    // Delete in Firestore Cloud
    try {
      await deleteCloudUser(id);
    } catch (err) {
      console.warn('Error deleting user in cloud:', err);
    }

    return { success: true };
  },
};
