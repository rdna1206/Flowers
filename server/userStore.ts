import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { UserRecord, FlowerFormulation, UserResponse, AdminUserResponseItem } from '../src/types.js';

const DATA_FILE = path.join(process.cwd(), 'server', 'data', 'users.json');

// In-memory cache synced to disk
let usersCache: UserRecord[] = [];

// Session map: token -> { userId: string, expiresAt: number }
const sessions = new Map<string, { userId: string; expiresAt: number }>();
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function ensureDataLoaded(): UserRecord[] {
  if (usersCache.length > 0) {
    return usersCache;
  }
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      usersCache = JSON.parse(raw);
    } else {
      usersCache = [];
    }
  } catch (err) {
    console.error('Error loading users from disk:', err);
    usersCache = [];
  }
  return usersCache;
}

function persistToDisk(): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(usersCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving users to disk:', err);
  }
}

export function getAllUsers(): UserRecord[] {
  return ensureDataLoaded();
}

export function getUserById(id: string): UserRecord | undefined {
  return ensureDataLoaded().find(u => u.id.toLowerCase() === id.toLowerCase());
}

export function getUserByUsername(username: string): UserRecord | undefined {
  return ensureDataLoaded().find(
    u => u.username.trim().toLowerCase() === username.trim().toLowerCase()
  );
}

export function authenticate(username: string, _passwordPlain: string): UserRecord | null {
  const user = getUserByUsername(username);
  if (!user) return null;
  if (!user.isActive) return null;
  return user;
}

export function createSession(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS
  });
  return token;
}

export function getUserByToken(token: string): UserRecord | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  const user = getUserById(session.userId);
  if (!user || !user.isActive) {
    sessions.delete(token);
    return null;
  }
  return user;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export function updateUser(id: string, updates: Partial<UserRecord>): UserRecord | null {
  const users = ensureDataLoaded();
  const index = users.findIndex(u => u.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const current = users[index];
  const updated: UserRecord = {
    ...current,
    ...updates,
    id: current.id, // Immutable ID
    updatedAt: new Date().toISOString()
  };

  users[index] = updated;
  persistToDisk();
  return updated;
}

export function saveUserFormulation(id: string, formulation: FlowerFormulation): UserRecord | null {
  return updateUser(id, { generatedFormulation: formulation });
}

export function saveUserResponse(userId: string, responseText: string): UserResponse | null {
  const user = getUserById(userId);
  if (!user) return null;

  const now = new Date().toISOString();
  const newResponse: UserResponse = {
    text: responseText.trim(),
    submittedAt: user.userResponse?.submittedAt || now,
    updatedAt: now,
  };

  updateUser(userId, { userResponse: newResponse });
  return newResponse;
}

export function getAllUserResponses(): AdminUserResponseItem[] {
  const users = ensureDataLoaded();
  const responses: AdminUserResponseItem[] = [];

  for (const u of users) {
    if (u.userResponse && u.userResponse.text && u.userResponse.text.trim().length > 0) {
      responses.push({
        userId: u.id,
        name: u.name,
        username: u.username,
        response: u.userResponse,
      });
    }
  }

  // Sort newest first
  responses.sort((a, b) => {
    const timeA = new Date(a.response.updatedAt || a.response.submittedAt).getTime();
    const timeB = new Date(b.response.updatedAt || b.response.submittedAt).getTime();
    return timeB - timeA;
  });

  return responses;
}

export function createUser(data: Omit<UserRecord, 'createdAt' | 'updatedAt'>): UserRecord {
  const users = ensureDataLoaded();
  const id = data.id.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const newUser: UserRecord = {
    ...data,
    id,
    userResponse: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(newUser);
  persistToDisk();
  return newUser;
}

export function deleteUser(id: string): boolean {
  const users = ensureDataLoaded();
  const initialLength = users.length;
  usersCache = users.filter(u => u.id.toLowerCase() !== id.toLowerCase());
  if (usersCache.length !== initialLength) {
    persistToDisk();
    return true;
  }
  return false;
}
