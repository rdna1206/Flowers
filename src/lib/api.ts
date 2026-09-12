import type {
  UserSummary,
  UserExperienceData,
  FlowerFormulation,
  UserRecord,
  UserResponse,
  AdminUserResponseItem,
} from '../types';
import {
  auth,
  loginWithFirebaseAuth,
  logoutFromFirebaseAuth,
  getAuthenticatedUserDoc,
  submitAuthenticatedUserResponse,
  saveAuthenticatedUserFormulation,
  getAdminAllUsers,
  saveAdminUserDoc,
  createAdminUserWithAuth,
  updateAdminUserPassword,
  deleteAdminResponseDoc,
  deleteAdminUserDoc,
  ensureCloudDatabaseSeeded,
} from './firebase';

const TOKEN_KEY = 'floral_session_token';
const ACTIVE_USER_ID_KEY = 'floral_active_user_id';
const ACTIVE_USER_ROLE_KEY = 'floral_active_user_role';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACTIVE_USER_ID_KEY);
  localStorage.removeItem(ACTIVE_USER_ROLE_KEY);
}

function getActiveUserId(): string | null {
  return localStorage.getItem(ACTIVE_USER_ID_KEY);
}

function setActiveUserSession(user: UserSummary, token: string): void {
  setStoredToken(token);
  localStorage.setItem(ACTIVE_USER_ID_KEY, user.id);
  localStorage.setItem(ACTIVE_USER_ROLE_KEY, user.role);
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

// Fallback formulation generator if Gemini is offline
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
// SECURE API CLIENT (FIREBASE AUTH + ISOLATED FIRESTORE + GH PAGES COMPATIBLE)
// ----------------------------------------------------------------------------
export const api = {
  /**
   * Secure Login using Firebase Authentication
   */
  async login(username: string, passwordPlain: string): Promise<{ token: string; user: UserSummary }> {
    const { user, token } = await loginWithFirebaseAuth(username, passwordPlain);
    setActiveUserSession(user, token);
    return { token, user };
  },

  /**
   * Get authenticated user summary
   */
  async getMe(): Promise<UserSummary> {
    const userId = getActiveUserId();
    if (!userId) {
      throw new Error('No hay sesión activa.');
    }

    const userDoc = await getAuthenticatedUserDoc(userId);
    if (!userDoc) {
      throw new Error('No se pudo encontrar el usuario autenticado.');
    }

    return {
      id: userDoc.id,
      name: userDoc.name,
      username: userDoc.username,
      role: userDoc.role,
    };
  },

  /**
   * Logout from Firebase Auth and clear session
   */
  async logout(): Promise<void> {
    await logoutFromFirebaseAuth();
    clearStoredToken();
  },

  /**
   * Fetch authenticated user's own experience (STRICT PRIVACY: reads ONLY this user's doc)
   */
  async getExperience(): Promise<UserExperienceData> {
    const userId = getActiveUserId();
    if (!userId) {
      throw new Error('No hay sesión activa.');
    }

    const userDoc = await getAuthenticatedUserDoc(userId);
    if (!userDoc) {
      throw new Error('Perfil de usuario no encontrado.');
    }

    return toUserExperienceData(userDoc);
  },

  /**
   * Submit personal user response (STRICT IMMUTABILITY: only once)
   */
  async submitResponse(responseText: string): Promise<{ success: boolean; userResponse: UserResponse }> {
    const userId = getActiveUserId();
    if (!userId) {
      throw new Error('No hay sesión activa.');
    }

    const userDoc = await getAuthenticatedUserDoc(userId);
    if (!userDoc) {
      throw new Error('Usuario no encontrado.');
    }

    if (userDoc.userResponse && userDoc.userResponse.text && userDoc.userResponse.text.trim().length > 0) {
      throw new Error(
        'Tu respuesta ya fue enviada y se encuentra bloqueada de forma permanente. No es posible modificarla ni reemplazarla.'
      );
    }

    const userResponse = await submitAuthenticatedUserResponse(userDoc, responseText);
    return { success: true, userResponse };
  },

  /**
   * Security enforcement: users CANNOT delete responses
   */
  async deleteUserResponse(): Promise<{ success: boolean }> {
    throw new Error(
      'Acceso denegado: los usuarios no tienen autorización para eliminar respuestas. Esta acción es exclusiva de Ronald.'
    );
  },

  /**
   * Flower Formulation Generator
   */
  async formulateFlowers(): Promise<{ formulation: FlowerFormulation }> {
    const userId = getActiveUserId();
    if (!userId) {
      throw new Error('No hay sesión activa.');
    }

    const user = await getAuthenticatedUserDoc(userId);
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    // If server is running with Gemini API key, try it
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
          await saveAuthenticatedUserFormulation(user.id, data.formulation);
          return { formulation: data.formulation };
        }
      }
    } catch {
      // Fallback for static GitHub Pages client
    }

    const formulation = createSimulatedFormulation(user);
    await saveAuthenticatedUserFormulation(user.id, formulation);
    return { formulation };
  },

  /**
   * Reset flower formulation
   */
  async resetFormulation(): Promise<{ success: boolean }> {
    const userId = getActiveUserId();
    if (!userId) {
      throw new Error('No hay sesión activa.');
    }
    await saveAuthenticatedUserFormulation(userId, null);
    return { success: true };
  },

  // --------------------------------------------------------------------------
  // ADMIN APIS (RONALD ONLY)
  // --------------------------------------------------------------------------

  /**
   * Ronald fetches all users from Firestore
   */
  async getAdminUsers(): Promise<{ users: UserRecord[] }> {
    const users = await getAdminAllUsers();
    return { users };
  },

  /**
   * Ronald fetches all user responses
   */
  async getAdminResponses(): Promise<{ responses: AdminUserResponseItem[] }> {
    const users = await getAdminAllUsers();
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

  /**
   * Ronald deletes a user response
   */
  async deleteAdminResponse(userId: string): Promise<{ success: boolean }> {
    await deleteAdminResponseDoc(userId);
    return { success: true };
  },

  /**
   * Ronald updates user details in Firestore
   */
  async updateAdminUser(id: string, updates: Partial<UserRecord>): Promise<{ user: UserRecord }> {
    const existing = await getAuthenticatedUserDoc(id);
    if (!existing) {
      throw new Error('Usuario no encontrado.');
    }

    const updatedUser: UserRecord = {
      ...existing,
      ...updates,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    await saveAdminUserDoc(updatedUser);
    return { user: updatedUser };
  },

  /**
   * Ronald previews any user's experience
   */
  async getAdminUserExperience(userId: string): Promise<UserExperienceData> {
    const userDoc = await getAuthenticatedUserDoc(userId);
    if (!userDoc) {
      throw new Error('Usuario no encontrado.');
    }
    return toUserExperienceData(userDoc);
  },

  /**
   * Ronald changes a user's password in Firebase Auth
   */
  async updateAdminUserPassword(username: string, newPasswordPlain: string): Promise<{ success: boolean; message: string }> {
    return await updateAdminUserPassword(username, newPasswordPlain);
  },

  /**
   * Ronald creates a new user in Firebase Auth and Firestore
   */
  async createAdminUser(data: Partial<UserRecord>, passwordPlain: string = '123456'): Promise<{ user: UserRecord }> {
    const user = await createAdminUserWithAuth(data, passwordPlain);
    return { user };
  },

  /**
   * Ronald deletes a user
   */
  async deleteAdminUser(id: string): Promise<{ success: boolean }> {
    await deleteAdminUserDoc(id);
    return { success: true };
  },
};
