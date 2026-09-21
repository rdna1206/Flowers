export type UserRole = 'user' | 'admin';

export interface FlowerItem {
  name: string;
  botanicalName: string;
  meaning: string;
  role: string;
  color: string;
  accent?: string;
}

export interface FlowerFormulation {
  title: string;
  essence: string;
  flowers: FlowerItem[];
  synergy: string;
  finalDedication: string;
  generatedAt: string;
}

export interface FlowerConfig {
  specificInstructions: string;
  preferredTone?: string;
  customFormulation?: FlowerFormulation | null;
}

export interface UserTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  accentColor?: string;
  petalColors?: string[];
  fontStyle?: 'serif' | 'sans';
  ambientGlow?: string;
  themeName?: string;
}

export interface UserResponse {
  text: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  username: string;
  authUid?: string;
  role: UserRole;
  isActive: boolean;
  profiling: string;
  personalText: string;
  theme: UserTheme;
  flowerConfig: FlowerConfig;
  generatedFormulation: FlowerFormulation | null;
  userResponse?: UserResponse | null;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

export interface UserExperienceData {
  id: string;
  name: string;
  username: string;
  personalText: string;
  isPendingText: boolean;
  isPendingProfiling: boolean;
  theme: UserTheme;
  flowerConfig?: FlowerConfig;
  savedFormulation: FlowerFormulation | null;
  userResponse?: UserResponse | null;
  audioUrl?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  text: string;
  isOriginalResponse?: boolean;
  read: boolean;
  createdAt: string;
}

export interface ChatSummary {
  id: string;
  userId: string;
  userName: string;
  lastMessageText?: string;
  lastMessageAt?: string;
  unreadCountForAdmin?: number;
  unreadCountForUser?: number;
  originalResponse?: UserResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserResponseItem {
  userId: string;
  name: string;
  username: string;
  response: UserResponse;
}

export interface AuthState {
  token: string | null;
  user: UserSummary | null;
  isAuthenticated: boolean;
}
