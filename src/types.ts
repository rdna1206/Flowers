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
  hasFlowerExperience?: boolean; // false = direct chat only, true or undefined = has flower & letter
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
  hasFlowerExperience?: boolean;
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
  hasFlowerExperience?: boolean;
}

export interface ChatPresenceState {
  adminInChat?: boolean;
  userInChat?: boolean;
  adminTyping?: boolean;
  userTyping?: boolean;
  adminRecording?: boolean;
  userRecording?: boolean;
  adminLastSeen?: string;
  userLastSeen?: string;
  adminHeartbeat?: number;
  userHeartbeat?: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  type?: 'text' | 'image' | 'audio';
  text: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  audioDuration?: number;
  isOriginalResponse?: boolean;
  read: boolean;
  readAt?: string;
  delivered?: boolean;
  createdAt: string;
  timestamp?: string;
  reactions?: Record<string, string[]>;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
}

export interface ChatSummary {
  id: string;
  userId: string;
  userName: string;
  lastMessageText?: string;
  lastMessageType?: 'text' | 'image' | 'audio';
  lastMessageAt?: string;
  lastMessageSenderRole?: 'user' | 'admin';
  lastMessageRead?: boolean;
  unreadCountForAdmin?: number;
  unreadCountForUser?: number;
  adminInChat?: boolean;
  userInChat?: boolean;
  adminTyping?: boolean;
  userTyping?: boolean;
  adminRecording?: boolean;
  userRecording?: boolean;
  adminLastSeen?: string;
  userLastSeen?: string;
  adminHeartbeat?: number;
  userHeartbeat?: number;
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
