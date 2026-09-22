import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  FileText,
  Palette,
  Sparkles,
  Plus,
  Trash2,
  Lock,
  KeyRound,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  RefreshCw,
  Clock,
  UserCheck,
  UserX,
  X,
  Check,
  Cloud,
  Send,
  Layers,
} from 'lucide-react';
import { api } from '../lib/api';
import { subscribeToAdminAllUsers } from '../lib/firebase';
import type { UserRecord, UserTheme, AdminUserResponseItem, ChatSummary } from '../types';
import { WhatsAppAdminMultiChatManager } from './WhatsAppAdminMultiChatManager';
import { ChatReadReceipt } from './ChatReadReceipt';

interface AdminDashboardProps {
  onSelectUserToPreview?: (username: string, passwordPlain?: string) => void;
  onViewMyExperience?: () => void;
  isDarkTheme?: boolean;
}

type AdminTab = 'chats' | 'users' | 'texts' | 'profiling' | 'styles' | 'flowers';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectUserToPreview,
  onViewMyExperience,
  isDarkTheme = false,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('chats');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [responses, setResponses] = useState<AdminUserResponseItem[]>([]);
  const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('jhon');
  const [searchTerm, setSearchTerm] = useState('');
  const [openChatUsers, setOpenChatUsers] = useState<UserRecord[]>([]);

  const handleOpenChat = (user: UserRecord) => {
    // Clear unread count locally for immediate badge update
    setChatSummaries((prev) =>
      prev.map((c) =>
        c.userId?.toLowerCase() === user.id.toLowerCase() || c.id?.toLowerCase() === user.id.toLowerCase()
          ? { ...c, unreadCountForAdmin: 0 }
          : c
      )
    );
    api.markChatMessagesAsRead(user.id, 'admin').catch(() => {});

    setOpenChatUsers((prev) => {
      const exists = prev.some((u) => u.id.toLowerCase() === user.id.toLowerCase());
      if (exists) {
        // Bring to end (highest priority / active)
        return [...prev.filter((u) => u.id.toLowerCase() !== user.id.toLowerCase()), user];
      }
      return [...prev, user];
    });
  };

  const handleCloseChat = (userId: string) => {
    setOpenChatUsers((prev) => prev.filter((u) => u.id.toLowerCase() !== userId.toLowerCase()));
  };

  const handleCloseAllChats = () => {
    setOpenChatUsers([]);
  };

  const handleOpenAllChats = () => {
    const chatUsers = users.filter(
      (u) =>
        u.id !== 'ronald' &&
        u.id !== 'leiry' &&
        u.username?.toLowerCase() !== 'leiry'
    );
    setOpenChatUsers(chatUsers);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New user modal
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [newHasFlowerExperience, setNewHasFlowerExperience] = useState(false);

  // Edit User & Password Modal
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editUserModalName, setEditUserModalName] = useState('');
  const [editUserModalPassword, setEditUserModalPassword] = useState('');
  const [editUserModalIsActive, setEditUserModalIsActive] = useState(true);
  const [editUserModalHasFlowerExperience, setEditUserModalHasFlowerExperience] = useState(false);
  const [showEditUserModalPassword, setShowEditUserModalPassword] = useState(false);
  const [isSavingUserEdit, setIsSavingUserEdit] = useState(false);

  // Selected User Form state
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editHasFlowerExperience, setEditHasFlowerExperience] = useState(false);
  const [editProfiling, setEditProfiling] = useState('');
  const [editText, setEditText] = useState('');
  const [editFlowerInstructions, setEditFlowerInstructions] = useState('');
  const [editFlowerTone, setEditFlowerTone] = useState('');

  // Selected User Theme state
  const [themePrimary, setThemePrimary] = useState('');
  const [themeSecondary, setThemeSecondary] = useState('');
  const [themeBg, setThemeBg] = useState('');
  const [themeSurface, setThemeSurface] = useState('');
  const [themeText, setThemeText] = useState('');
  const [themeAccent, setThemeAccent] = useState('');
  const [themePetals, setThemePetals] = useState('');
  const [themeFontStyle, setThemeFontStyle] = useState<'serif' | 'sans'>('serif');
  const [themeName, setThemeName] = useState('');
  const [deletingResponseUserId, setDeletingResponseUserId] = useState<string | null>(null);
  const [confirmDeleteResponse, setConfirmDeleteResponse] = useState<{ userId: string; name: string } | null>(null);
  const [clearingChatUserId, setClearingChatUserId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [usersRes, responsesRes] = await Promise.all([
        api.getAdminUsers(),
        api.getAdminResponses(),
      ]);
      setUsers(usersRes.users);
      setResponses(responsesRes.responses);

      if (usersRes.users.length > 0 && !usersRes.users.find((u) => u.id === selectedUserId)) {
        const firstNonAdmin = usersRes.users.find((u) => u.id !== 'ronald') || usersRes.users[0];
        setSelectedUserId(firstNonAdmin.id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al cargar información del panel.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time changes in Firestore Cloud
    const unsubUsers = subscribeToAdminAllUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setUsers(cloudUsers);
        const liveResponses: AdminUserResponseItem[] = cloudUsers
          .filter((u) => u.userResponse && u.userResponse.text)
          .map((u) => ({
            userId: u.id,
            name: u.name,
            username: u.username,
            response: u.userResponse!,
          }));
        setResponses(liveResponses);
      }
    });

    const unsubChats = api.subscribeToAllChats((liveChats) => {
      if (liveChats) {
        setChatSummaries(liveChats);
      }
    });

    return () => {
      unsubUsers();
      unsubChats();
    };
  }, []);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  useEffect(() => {
    if (selectedUser) {
      setEditName(selectedUser.name);
      setEditPassword('');
      setEditIsActive(selectedUser.isActive);
      setEditHasFlowerExperience(selectedUser.hasFlowerExperience !== false);
      setEditProfiling(selectedUser.profiling || '');
      setEditText(selectedUser.personalText || '');
      setEditFlowerInstructions(selectedUser.flowerConfig?.specificInstructions || '');
      setEditFlowerTone(selectedUser.flowerConfig?.preferredTone || '');

      const t = selectedUser.theme || {};
      setThemePrimary(t.primaryColor || '');
      setThemeSecondary(t.secondaryColor || '');
      setThemeBg(t.backgroundColor || '');
      setThemeSurface(t.surfaceColor || '');
      setThemeText(t.textColor || '');
      setThemeAccent(t.accentColor || '');
      setThemePetals(Array.isArray(t.petalColors) ? t.petalColors.join(', ') : '');
      setThemeFontStyle(t.fontStyle === 'sans' ? 'sans' : 'serif');
      setThemeName(t.themeName || '');
    }
  }, [selectedUserId, users]);

  const handleSaveSelectedUser = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const petalColorsArray = themePetals
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const updatedTheme: UserTheme = {
        primaryColor: themePrimary.trim(),
        secondaryColor: themeSecondary.trim(),
        backgroundColor: themeBg.trim(),
        surfaceColor: themeSurface.trim(),
        textColor: themeText.trim(),
        accentColor: themeAccent.trim(),
        petalColors: petalColorsArray,
        fontStyle: themeFontStyle,
        themeName: themeName.trim(),
      };

      await api.updateAdminUser(selectedUser.id, {
        name: editName,
        isActive: editIsActive,
        hasFlowerExperience: selectedUser.id === 'ronald' ? true : editHasFlowerExperience,
        profiling: editProfiling,
        personalText: editText,
        theme: updatedTheme,
        flowerConfig: {
          ...selectedUser.flowerConfig,
          specificInstructions: editFlowerInstructions,
          preferredTone: editFlowerTone,
        },
      });

      setSuccessMessage(`Datos de ${editName} guardados correctamente.`);
      await loadData();
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleUserStatus = async (user: UserRecord) => {
    if (user.id === 'ronald') return;
    try {
      await api.updateAdminUser(user.id, { isActive: !user.isActive });
      await loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'No se pudo cambiar el estado del usuario.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim() || !newPassword.trim()) return;
    try {
      await api.createAdminUser(
        {
          name: newName.trim(),
          username: newUsername.trim(),
          role: 'user',
          hasFlowerExperience: newHasFlowerExperience,
          profiling: '',
          personalText: '',
          theme: {
            primaryColor: '',
            secondaryColor: '',
            backgroundColor: '',
            surfaceColor: '',
            textColor: '',
            accentColor: '',
            petalColors: [],
            fontStyle: 'serif',
            ambientGlow: '',
            themeName: '',
          },
          flowerConfig: {
            specificInstructions: '',
            preferredTone: '',
            customFormulation: null,
          },
        },
        newPassword.trim()
      );
      setShowNewUserModal(false);
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      setNewHasFlowerExperience(false);
      await loadData();
      setSelectedUserId(newUsername.toLowerCase().trim());
      setSuccessMessage('Nuevo usuario creado y credencial registrada con éxito.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al crear el usuario.');
    }
  };

  const handleOpenEditUser = (user: UserRecord) => {
    setEditingUser(user);
    setEditUserModalName(user.name);
    setEditUserModalPassword('');
    setEditUserModalIsActive(user.isActive);
    setEditUserModalHasFlowerExperience(user.hasFlowerExperience !== false);
    setShowEditUserModalPassword(false);
  };

  const handleSaveUserEditModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const trimmedPass = editUserModalPassword.trim();
    const trimmedName = editUserModalName.trim();
    if (!trimmedPass) {
      setErrorMessage('La contraseña no puede estar vacía.');
      return;
    }
    if (!trimmedName) {
      setErrorMessage('El nombre no puede estar vacío.');
      return;
    }

    setIsSavingUserEdit(true);
    setErrorMessage(null);
    try {
      // 1. Update password in Firebase Auth
      await api.updateAdminUserPassword(editingUser.username, trimmedPass);

      // 2. Update user name, status, and flower experience in Firestore
      await api.updateAdminUser(editingUser.id, {
        name: trimmedName,
        isActive: editingUser.id === 'ronald' ? true : editUserModalIsActive,
        hasFlowerExperience: editingUser.id === 'ronald' ? true : editUserModalHasFlowerExperience,
      });

      // Update in-memory user list
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: trimmedName,
                isActive: editingUser.id === 'ronald' ? true : editUserModalIsActive,
                hasFlowerExperience: editingUser.id === 'ronald' ? true : editUserModalHasFlowerExperience,
              }
            : u
        )
      );

      setEditingUser(null);
      setSuccessMessage(`Datos y credencial de ${trimmedName} actualizados correctamente.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al actualizar los datos del usuario.');
    } finally {
      setIsSavingUserEdit(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (id === 'ronald') {
      alert('La cuenta principal de Ronald no puede ser eliminada.');
      return;
    }
    if (!window.confirm(`¿Estás seguro de eliminar el usuario ${name}? Esta acción es irreversible.`)) {
      return;
    }
    try {
      await api.deleteAdminUser(id);
      await loadData();
      setSuccessMessage(`Usuario ${name} eliminado.`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al eliminar el usuario.');
    }
  };

  const handleDeleteResponse = (userId: string, userName: string) => {
    // Open in-app modal to ask for confirmation before deleting
    setConfirmDeleteResponse({ userId, name: userName });
  };

  const executeDeleteResponse = async () => {
    if (!confirmDeleteResponse) return;
    const { userId, name } = confirmDeleteResponse;

    try {
      setDeletingResponseUserId(userId);
      await api.deleteAdminResponse(userId);
      setResponses((prev) => prev.filter((r) => r.userId !== userId));
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, userResponse: null } : u))
      );
      setSuccessMessage(`Respuesta de ${name} eliminada.`);
      setTimeout(() => setSuccessMessage(null), 3500);
      setConfirmDeleteResponse(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al eliminar la respuesta.');
    } finally {
      setDeletingResponseUserId(null);
    }
  };

  const totalUnreadMessages = chatSummaries.reduce((sum, c) => sum + (c.unreadCountForAdmin || 0), 0);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      id="admin-dashboard-container"
      className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 min-w-0 text-slate-100"
    >
      {/* Top Banner & Stats - DARK MODE */}
      <div className="bg-[#0F172A]/95 rounded-2xl sm:rounded-3xl border border-[#1E293B] p-4 sm:p-7 shadow-2xl mb-5 sm:mb-8 min-w-0 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1E293B]">
          <div className="flex items-start sm:items-center space-x-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1E293B] border border-[#334155] text-white flex items-center justify-center shadow-md shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#EAB308]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="font-serif-display text-lg sm:text-2xl md:text-3xl text-white font-semibold leading-tight">
                  Panel de Administración
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30 px-2.5 py-0.5 rounded-full shrink-0">
                  Ronald
                </span>
                {totalUnreadMessages > 0 && (
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#25D366] text-[#052E16] px-2.5 py-0.5 rounded-full shrink-0 animate-pulse shadow-xs">
                    {totalUnreadMessages} {totalUnreadMessages === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94A3B8] mt-1 leading-normal break-words">
                Control y personalización individual de usuarios, textos, estilos, flores y chat en tiempo real.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-[#1E293B] hover:bg-[#334155] px-3.5 py-2 rounded-xl border border-[#334155] transition-colors cursor-pointer"
              title="Recargar información"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>

            {onViewMyExperience && (
              <button
                type="button"
                onClick={onViewMyExperience}
                className="inline-flex items-center space-x-1.5 text-xs text-[#38BDF8] hover:text-white bg-[#1E293B] hover:bg-[#334155] px-3.5 py-2 rounded-xl border border-[#38BDF8]/40 font-medium transition-colors shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Ver Mi Experiencia</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-4 sm:pt-5">
          <div className="p-3 sm:p-4 rounded-xl bg-[#1E293B]/70 border border-[#334155]/60">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold block">
              Total Usuarios
            </span>
            <span className="text-xl sm:text-2xl font-serif-display font-semibold text-white mt-0.5 block">
              {users.filter((u) => u.id !== 'ronald').length}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#1E293B]/70 border border-[#334155]/60">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold block">
              Mensajes Nuevos
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-serif-display font-semibold text-white">
                {totalUnreadMessages}
              </span>
              {totalUnreadMessages > 0 ? (
                <span className="text-[10px] font-bold text-[#052E16] bg-[#25D366] px-2 py-0.5 rounded-full animate-pulse">
                  Sin leer
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400 bg-[#334155]/60 px-2 py-0.5 rounded-full">
                  Al día
                </span>
              )}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#1E293B]/70 border border-[#334155]/60">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold block">
              Respuestas Recibidas
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-serif-display font-semibold text-white">
                {responses.length}
              </span>
              {responses.length > 0 && (
                <span className="text-[10px] font-semibold text-[#25D366] bg-[#25D366]/20 px-2 py-0.5 rounded-full">
                  Nuevas
                </span>
              )}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#1E293B]/70 border border-[#334155]/60">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold block">
              Sincronización
            </span>
            <span className="text-xs font-medium text-[#25D366] mt-1.5 flex items-center space-x-1.5">
              <Cloud className="w-3.5 h-3.5 text-[#25D366] animate-pulse" />
              <span>Nube en Vivo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0 text-[#25D366]" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-200 text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs - DARK MODE */}
      <div className="w-full max-w-full overflow-x-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0F172A]/90 border border-[#1E293B] mb-5 sm:mb-6 shadow-lg no-scrollbar touch-pan-x min-w-0">
        <button
          type="button"
          onClick={() => setActiveTab('chats')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'chats'
              ? 'bg-[#25D366] text-[#052E16] font-bold shadow-md'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Chats en Vivo</span>
          {totalUnreadMessages > 0 ? (
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 shadow-xs animate-pulse ${
                activeTab === 'chats'
                  ? 'bg-[#052E16] text-[#25D366]'
                  : 'bg-[#25D366] text-[#052E16]'
              }`}
            >
              {totalUnreadMessages} {totalUnreadMessages === 1 ? 'nuevo' : 'nuevos'}
            </span>
          ) : users.filter(u => u.id !== 'ronald' && u.id !== 'leiry' && u.username?.toLowerCase() !== 'leiry').length > 0 ? (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 ${
                activeTab === 'chats'
                  ? 'bg-[#052E16]/40 text-[#052E16]'
                  : 'bg-[#334155] text-slate-300'
              }`}
            >
              {users.filter(u => u.id !== 'ronald' && u.id !== 'leiry' && u.username?.toLowerCase() !== 'leiry').length}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#1E293B] text-white border border-[#38BDF8]/60 shadow-xs font-semibold'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Usuarios y Credenciales</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('texts')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'texts'
              ? 'bg-[#1E293B] text-white border border-[#38BDF8]/60 shadow-xs font-semibold'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Textos Exactos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profiling')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'profiling'
              ? 'bg-[#1E293B] text-white border border-[#38BDF8]/60 shadow-xs font-semibold'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Perfilamiento</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('styles')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'styles'
              ? 'bg-[#1E293B] text-white border border-[#38BDF8]/60 shadow-xs font-semibold'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Colores y Estilo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flowers')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'flowers'
              ? 'bg-[#1E293B] text-white border border-[#38BDF8]/60 shadow-xs font-semibold'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Flores e Instrucciones</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: CHATS EN VIVO CON USUARIOS (EXCEPTO LEIRY) - DARK MODE
          ======================================================== */}
      {activeTab === 'chats' && (
        <div className="bg-[#0F172A]/95 rounded-2xl sm:rounded-3xl border border-[#1E293B] p-4 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1E293B]">
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl text-white flex items-center space-x-2">
                <span>Chats en Vivo</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Conversaciones directas y respuestas en tiempo real con todos los destinatarios (Leiry excluida). Nuevos y recientes arriba.
              </p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOpenAllChats}
                className="inline-flex items-center space-x-1.5 text-xs font-bold bg-[#25D366] hover:bg-[#1EAA53] text-[#052E16] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md shrink-0"
                title="Abrir ventanas de todos los chats a la vez"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Abrir Todos</span>
              </button>
              <div className="relative w-full sm:w-auto">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#64748B]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar conversación..."
                  className="w-full sm:w-48 pl-8 pr-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#25D366]"
                />
              </div>
            </div>
          </div>

          {/* List of Chat-Eligible Users (Excluding Ronald and Leiry) */}
          {(() => {
            const chatUsers = users.filter(
              (u) =>
                u.id !== 'ronald' &&
                u.id !== 'leiry' &&
                u.username?.toLowerCase() !== 'leiry' &&
                (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.username.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            if (chatUsers.length === 0) {
              return (
                <div className="py-14 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#64748B] mx-auto mb-3">
                    <MessageSquare className="w-5 h-5 stroke-[1.4]" />
                  </div>
                  <h3 className="font-serif-display text-lg text-white mb-1">
                    No se encontraron conversaciones
                  </h3>
                  <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                    Las conversaciones y respuestas de los usuarios se sincronizan automáticamente aquí en vivo.
                  </p>
                </div>
              );
            }

            // SORT: 1. En línea arriba, 2. No leídos arriba, 3. Fecha más reciente, 4. Alfabético
            const sortedChatUsers = [...chatUsers].sort((a, b) => {
              const summaryA = chatSummaries.find(
                (c) => c.userId?.toLowerCase() === a.id.toLowerCase() || c.id?.toLowerCase() === a.id.toLowerCase()
              );
              const summaryB = chatSummaries.find(
                (c) => c.userId?.toLowerCase() === b.id.toLowerCase() || c.id?.toLowerCase() === b.id.toLowerCase()
              );

              const onlineA = Boolean(summaryA?.userInChat || summaryA?.userTyping);
              const onlineB = Boolean(summaryB?.userInChat || summaryB?.userTyping);

              // 1. Prioridad 1: Chats en línea (online) arriba
              if (onlineA && !onlineB) return -1;
              if (!onlineA && onlineB) return 1;

              const unreadA = summaryA?.unreadCountForAdmin || 0;
              const unreadB = summaryB?.unreadCountForAdmin || 0;

              // 2. Prioridad 2: Chats con mensajes no leídos (mayor cantidad arriba)
              if (unreadA > 0 && unreadB === 0) return -1;
              if (unreadB > 0 && unreadA === 0) return 1;
              if (unreadA > 0 && unreadB > 0 && unreadA !== unreadB) {
                return unreadB - unreadA;
              }

              // 3. Prioridad 3: Fecha del mensaje más reciente
              const timeA = summaryA?.lastMessageAt || summaryA?.updatedAt || a.userResponse?.submittedAt || '';
              const timeB = summaryB?.lastMessageAt || summaryB?.updatedAt || b.userResponse?.submittedAt || '';

              if (timeA && !timeB) return -1;
              if (!timeA && timeB) return 1;
              if (timeA && timeB) {
                return new Date(timeB).getTime() - new Date(timeA).getTime();
              }

              // 4. Alfabético por defecto
              return a.name.localeCompare(b.name);
            });

            return (
              <div className="space-y-3.5 mt-4">
                {sortedChatUsers.map((u) => {
                  const chatSummary = chatSummaries.find(
                    (c) => c.userId?.toLowerCase() === u.id.toLowerCase() || c.id?.toLowerCase() === u.id.toLowerCase()
                  );
                  const unreadCount = chatSummary?.unreadCountForAdmin || 0;
                  const hasUnread = unreadCount > 0;
                  const lastText = chatSummary?.lastMessageText || u.userResponse?.text || '';
                  const isLastFromAdmin = chatSummary?.lastMessageSenderRole === 'admin';
                  const lastRead = Boolean(chatSummary?.lastMessageRead);
                  const isUserOnline = Boolean(chatSummary?.userInChat || chatSummary?.userTyping);

                  const lastTime =
                    chatSummary?.lastMessageAt ||
                    chatSummary?.updatedAt ||
                    u.userResponse?.submittedAt ||
                    u.userResponse?.updatedAt;
                  const isChatOpen = openChatUsers.some((oc) => oc.id.toLowerCase() === u.id.toLowerCase());

                  return (
                    <div
                      key={u.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        hasUnread
                          ? 'bg-[#13221C] border-[#25D366]/50 shadow-[0_0_20px_rgba(37,211,102,0.12)] ring-1 ring-[#25D366]/30'
                          : 'bg-[#1E293B]/50 border-[#334155]/60 hover:bg-[#1E293B]/80 hover:border-[#475569]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div
                              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-transform ${
                                hasUnread
                                  ? 'bg-[#25D366] text-[#052E16] shadow-md ring-2 ring-[#25D366]/40'
                                  : 'bg-[#008069]/20 border border-[#008069]/40 text-[#25D366]'
                              }`}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Indicador numérico sobre el avatar si hay mensajes sin leer */}
                            {hasUnread && (
                              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#25D366] text-[#052E16] font-extrabold text-[11px] flex items-center justify-center shadow-lg ring-2 ring-[#0F172A] animate-bounce">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                            )}

                            {chatSummary?.userInChat ? (
                              <span
                                className="w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#0F172A] absolute bottom-0 right-0 animate-pulse"
                                title="Usuario dentro del chat"
                              />
                            ) : (
                              <span
                                className="w-2.5 h-2.5 rounded-full bg-slate-500 border-2 border-[#0F172A] absolute bottom-0 right-0"
                                title="Fuera del chat"
                              />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                              <span className="text-sm font-semibold text-white">
                                {u.name}
                              </span>
                              <span className="text-[11px] text-[#94A3B8] font-mono">
                                @{u.username}
                              </span>

                              {/* BADGE NUMÉRICO DESTACADO DE MENSAJES RECIBIDOS */}
                              {hasUnread && (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#25D366] text-[#052E16] font-extrabold text-xs shadow-md animate-pulse">
                                  <span>{unreadCount} {unreadCount === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}</span>
                                </span>
                              )}

                              {chatSummary?.userTyping ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#25D366]/20 text-[#25D366] font-medium animate-pulse border border-[#25D366]/30">
                                  Escribiendo...
                                </span>
                              ) : chatSummary?.userInChat ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#25D366]/15 text-[#25D366] font-medium border border-[#25D366]/20">
                                  En su chat
                                </span>
                              ) : null}
                            </div>

                            {lastTime && (
                              <span className="text-[11px] text-[#94A3B8] flex items-center space-x-1.5 mt-0.5">
                                <Clock className="w-3 h-3 text-[#64748B]" />
                                <span>
                                  {new Date(lastTime).toLocaleString('es-ES', {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                  })}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Top Action Buttons for this chat */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenChat(u)}
                            className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md ${
                              isChatOpen
                                ? 'bg-[#1E293B] text-[#38BDF8] border border-[#38BDF8]/50 hover:bg-[#273549]'
                                : hasUnread
                                ? 'bg-[#25D366] hover:bg-[#1EAA53] text-[#052E16] font-extrabold ring-2 ring-[#25D366]/40'
                                : 'bg-[#008069] hover:bg-[#009378] text-white'
                            }`}
                            title={`Abrir ventana de chat con ${u.name}`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>
                              {isChatOpen
                                ? 'Ventana Abierta'
                                : hasUnread
                                ? `Responder (${unreadCount})`
                                : 'Abrir Chat'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`¿Vaciar todos los mensajes de prueba con ${u.name}?`)) {
                                setClearingChatUserId(u.id);
                                try {
                                  await api.clearChatHistory(u.id);
                                  setUsers((prev) =>
                                    prev.map((usr) =>
                                      usr.id.toLowerCase() === u.id.toLowerCase()
                                        ? { ...usr, userResponse: null }
                                        : usr
                                    )
                                  );
                                  setChatSummaries((prev) =>
                                    prev.map((c) =>
                                      c.userId?.toLowerCase() === u.id.toLowerCase() ||
                                      c.id?.toLowerCase() === u.id.toLowerCase()
                                        ? { ...c, lastMessageText: '', lastMessageAt: '', unreadCountForAdmin: 0 }
                                        : c
                                    )
                                  );
                                  setSuccessMessage(`Mensajes de prueba con ${u.name} borrados.`);
                                  setTimeout(() => setSuccessMessage(null), 3000);
                                } catch (err: any) {
                                  setErrorMessage(err.message || 'Error al vaciar chat.');
                                } finally {
                                  setClearingChatUserId(null);
                                }
                              }
                            }}
                            disabled={clearingChatUserId === u.id}
                            className="inline-flex items-center space-x-1 text-xs text-[#94A3B8] hover:text-red-400 bg-[#1E293B] hover:bg-red-950/40 px-3 py-2 rounded-xl border border-[#334155] hover:border-red-800 transition-colors cursor-pointer disabled:opacity-50"
                            title="Borrar mensajes de prueba de este chat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Vaciar</span>
                          </button>

                          {onSelectUserToPreview && (
                            <button
                              type="button"
                              onClick={() => onSelectUserToPreview(u.username)}
                              className="p-2 text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#334155] rounded-xl border border-[#334155] transition-colors cursor-pointer"
                              title={`Ver experiencia como ${u.name}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Message preview snippet */}
                      <div
                        onClick={() => handleOpenChat(u)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          hasUnread
                            ? 'bg-[#0B141A] border-[#25D366]/40 hover:border-[#25D366]'
                            : 'bg-[#0B141A]/90 border-[#2A3942] hover:border-[#3E525E]'
                        }`}
                      >
                        {lastText ? (
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start space-x-1.5 flex-1 min-w-0">
                              {isLastFromAdmin && (
                                <span className="mt-0.5 shrink-0">
                                  <ChatReadReceipt
                                    read={lastRead}
                                    isRecipientActive={isUserOnline}
                                    isDarkBackground={true}
                                    className="w-3.5 h-3.5"
                                  />
                                </span>
                              )}
                              <p className="text-xs text-slate-200 leading-relaxed line-clamp-2 whitespace-pre-wrap font-sans">
                                {lastText}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1.5 shrink-0">
                              {hasUnread ? (
                                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#25D366] text-[#052E16] font-extrabold text-[11px] shadow-md animate-bounce">
                                  {unreadCount}
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#25D366] font-medium bg-[#25D366]/15 border border-[#25D366]/30 px-2 py-0.5 rounded-md">
                                  En vivo
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-[#64748B] italic">
                            Aún no hay mensajes. Cuando {u.name} envíe un mensaje, aparecerá aquí en vivo.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================
          TAB: USUARIOS Y CREDENCIALES - DARK MODE
          ======================================================== */}
      {activeTab === 'users' && (
        <div className="bg-[#0F172A]/95 rounded-2xl sm:rounded-3xl border border-[#1E293B] p-4 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1E293B]">
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl text-white">
                Gestión de Usuarios y Contraseñas
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Crea, activa, desactiva o edita las credenciales de cada usuario sin tocar código.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#64748B]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar usuario..."
                  className="w-full sm:w-44 pl-8 pr-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#38BDF8]"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowNewUserModal(true)}
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EAA53] text-[#052E16] text-xs font-bold transition-all cursor-pointer shrink-0 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>

          {/* MOBILE VIEW (CARD LIST - NO HORIZONTAL SCROLL) */}
          <div className="block md:hidden space-y-3 mt-4">
            {filteredUsers.map((u) => {
              const isAdmin = u.id === 'ronald';
              return (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-[#1E293B]/60 border border-[#334155]/60 space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#334155] border border-[#475569] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{u.name}</h4>
                        <span className="text-[11px] text-[#94A3B8] font-mono">{u.username}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 justify-end">
                      {!isAdmin && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            u.hasFlowerExperience !== false
                              ? 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40'
                              : 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                          }`}
                        >
                          {u.hasFlowerExperience !== false ? '🌸 Flor + Chat' : '💬 Solo Chat'}
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isAdmin ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40' : 'bg-[#334155] text-slate-300'
                        }`}
                      >
                        {isAdmin ? 'Admin' : 'Usuario'}
                      </span>
                      <button
                        type="button"
                        disabled={isAdmin}
                        onClick={() => handleToggleUserStatus(u)}
                        className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-md ${
                          u.isActive ? 'text-[#25D366] bg-[#25D366]/15 border border-[#25D366]/30' : 'text-rose-400 bg-rose-950/40 border border-rose-800'
                        } ${isAdmin ? 'opacity-80' : 'cursor-pointer'}`}
                      >
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </div>
                  </div>

                  {/* Password row with direct edit trigger */}
                  <div
                    onClick={() => handleOpenEditUser(u)}
                    className="p-2.5 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-between text-xs cursor-pointer hover:border-[#EAB308] transition-colors"
                    title="Pulsar para cambiar contraseña"
                  >
                    <span className="text-[#94A3B8] flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#EAB308]" />
                      <span>Contraseña:</span>
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-xs font-semibold text-slate-300 bg-[#1E293B] px-2.5 py-0.5 rounded-md border border-[#334155]">
                        ••••••••
                      </span>
                      <span className="text-[10px] text-[#EAB308] font-medium bg-[#EAB308]/15 px-2 py-0.5 rounded border border-[#EAB308]/30">
                        Cambiar
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#334155]/60">
                    {onSelectUserToPreview && (
                      <button
                        type="button"
                        onClick={() => onSelectUserToPreview(u.username)}
                        className="flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-medium text-slate-200 bg-[#1E293B] border border-[#334155] flex items-center justify-center space-x-1 hover:bg-[#334155] transition-colors cursor-pointer"
                        title="Ver experiencia"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Ver</span>
                      </button>
                    )}
                    {u.id !== 'ronald' && u.id !== 'leiry' && u.username?.toLowerCase() !== 'leiry' && (
                      <button
                        type="button"
                        onClick={() => handleOpenChat(u)}
                        className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-medium border flex items-center justify-center space-x-1 transition-colors cursor-pointer ${
                          openChatUsers.some((oc) => oc.id.toLowerCase() === u.id.toLowerCase())
                            ? 'bg-[#1E293B] text-[#38BDF8] border-[#38BDF8]/60'
                            : 'bg-[#1E293B] text-[#25D366] border-[#334155] hover:bg-[#334155]'
                        }`}
                        title={`Abrir ventana de chat con ${u.name}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Chat</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenEditUser(u)}
                      className="flex-1 min-w-[75px] py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#EAB308]" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserId(u.id);
                        setActiveTab('texts');
                      }}
                      className="flex-1 min-w-[75px] py-2 px-2.5 rounded-xl text-xs font-medium text-slate-300 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                      title="Configurar carta y textos"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Textos</span>
                    </button>
                    {!isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="py-2 px-3 rounded-xl text-xs font-medium text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP VIEW (CLEAN DATA TABLE) */}
          <div className="hidden md:block overflow-x-auto mt-4 rounded-xl border border-[#334155]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#334155] bg-[#1E293B] text-[#94A3B8] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3.5">Nombre</th>
                  <th className="py-3 px-3.5">Usuario</th>
                  <th className="py-3 px-3.5">Contraseña</th>
                  <th className="py-3 px-3.5">Rol</th>
                  <th className="py-3 px-3.5">Experiencia</th>
                  <th className="py-3 px-3.5">Estado</th>
                  <th className="py-3 px-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {filteredUsers.map((u) => {
                  const isAdmin = u.id === 'ronald';
                  return (
                    <tr key={u.id} className="hover:bg-[#1E293B]/70 transition-colors">
                      <td className="py-3.5 px-3.5 font-medium text-white">
                        {u.name}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono text-[#94A3B8]">
                        {u.username}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono text-white">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="group inline-flex items-center space-x-1.5 bg-[#1E293B] hover:bg-[#334155] px-2.5 py-1 rounded-md border border-[#334155] hover:border-[#EAB308]/60 transition-colors cursor-pointer"
                          title="Clic para cambiar contraseña"
                        >
                          <span className="font-semibold text-xs tracking-widest text-slate-300">••••••••</span>
                          <span className="text-[10px] text-[#EAB308] font-sans font-medium ml-1">Cambiar</span>
                          <KeyRound className="w-3 h-3 text-[#94A3B8] group-hover:text-[#EAB308]" />
                        </button>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isAdmin
                              ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                              : 'bg-[#334155] text-slate-300'
                          }`}
                        >
                          {isAdmin ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5">
                        {isAdmin ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#38BDF8]/20 text-[#38BDF8]">
                            Panel
                          </span>
                        ) : u.hasFlowerExperience !== false ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40">
                            <span>🌸</span>
                            <span>Flor + Chat</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40">
                            <span>💬</span>
                            <span>Solo Chat</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <button
                          type="button"
                          disabled={isAdmin}
                          onClick={() => handleToggleUserStatus(u)}
                          className={`inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md ${
                            u.isActive
                              ? 'text-[#25D366] bg-[#25D366]/15 border border-[#25D366]/30'
                              : 'text-rose-400 bg-rose-950/40 border border-rose-800'
                          } ${isAdmin ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                          title={isAdmin ? 'Ronald siempre está activo' : 'Clic para cambiar'}
                        >
                          {u.isActive ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>Inactivo</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-3.5 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {onSelectUserToPreview && (
                            <button
                              type="button"
                              onClick={() => onSelectUserToPreview(u.username)}
                              className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#334155] rounded-lg transition-colors cursor-pointer"
                              title={`Probar experiencia como ${u.name}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {u.id !== 'ronald' && u.id !== 'leiry' && u.username?.toLowerCase() !== 'leiry' && (
                            <button
                              type="button"
                              onClick={() => handleOpenChat(u)}
                              className={`inline-flex items-center space-x-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                                openChatUsers.some((oc) => oc.id.toLowerCase() === u.id.toLowerCase())
                                  ? 'bg-[#1E293B] text-[#38BDF8] border-[#38BDF8]/60'
                                  : 'bg-[#1E293B] text-slate-200 hover:bg-[#334155] border-[#334155]'
                              }`}
                              title={`Abrir ventana de chat con ${u.name}`}
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                              <span>Chat</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            className="inline-flex items-center space-x-1 text-[11px] text-slate-200 font-semibold bg-[#1E293B] hover:bg-[#334155] px-2.5 py-1 rounded-lg border border-[#334155] hover:border-[#EAB308]/60 transition-colors cursor-pointer"
                            title="Editar contraseña y datos de usuario"
                          >
                            <KeyRound className="w-3 h-3 text-[#EAB308]" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setActiveTab('texts');
                            }}
                            className="text-[11px] text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#334155] px-2.5 py-1 rounded-lg border border-[#334155] transition-colors cursor-pointer"
                            title="Configurar carta y textos"
                          >
                            Textos
                          </button>
                          {!isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TABS 3, 4, 5, 6: EDIT CONFIGURATION PER USER - DARK MODE
          ======================================================== */}
      {['texts', 'profiling', 'styles', 'flowers'].includes(activeTab) && (
        <div className="bg-[#0F172A]/95 rounded-2xl sm:rounded-3xl border border-[#1E293B] overflow-hidden shadow-2xl backdrop-blur-md flex flex-col md:flex-row">
          {/* User selection: MOBILE HORIZONTAL SCROLLER */}
          <div className="block md:hidden border-b border-[#1E293B] bg-[#1E293B]/60 p-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#94A3B8] block mb-2 px-1">
              Seleccionar Usuario ({users.length})
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {users.map((u) => {
                const isSelected = u.id === selectedUserId;
                const hasPendingText = !u.personalText || u.personalText.trim() === '';
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUserId(u.id)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#25D366] text-[#052E16] font-bold shadow-md'
                        : 'bg-[#0F172A] text-slate-300 border border-[#334155] hover:bg-[#1E293B]'
                    }`}
                  >
                    <span>{u.name}</span>
                    {hasPendingText && u.id !== 'ronald' && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded-full ${
                          isSelected ? 'bg-black/20 text-[#052E16]' : 'bg-[#334155] text-[#94A3B8]'
                        }`}
                      >
                        •
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User selection: DESKTOP VERTICAL SIDEBAR */}
          <div className="hidden md:block w-60 border-r border-[#1E293B] bg-[#1E293B]/40 p-4 shrink-0">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#94A3B8] block mb-2 px-2">
              Seleccionar Usuario
            </span>
            <div className="space-y-1">
              {users.map((u) => {
                const isSelected = u.id === selectedUserId;
                const hasPendingText = !u.personalText || u.personalText.trim() === '';
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUserId(u.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#25D366] text-[#052E16] font-bold shadow-md'
                        : 'text-slate-300 hover:bg-[#1E293B]'
                    }`}
                  >
                    <span>{u.name}</span>
                    {hasPendingText && u.id !== 'ronald' && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-black/20 text-[#052E16]' : 'bg-[#334155] text-[#94A3B8]'
                        }`}
                      >
                        Pendiente
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configuration form for selected user */}
          <div className="flex-1 p-4 sm:p-8">
            {selectedUser ? (
              <div className="space-y-6 max-w-2xl">
                {/* Header for user */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
                  <div>
                    <h3 className="font-serif-display text-xl sm:text-2xl text-white">
                      {selectedUser.name}
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Usuario: <code className="font-mono text-[#38BDF8]">@{selectedUser.username}</code>
                    </p>
                  </div>

                  <div className="flex items-center">
                    {onSelectUserToPreview && (
                      <button
                        type="button"
                        onClick={() => onSelectUserToPreview(selectedUser.username)}
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs text-slate-200 bg-[#1E293B] hover:bg-[#334155] px-3.5 py-2 rounded-xl border border-[#334155] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Ver como {selectedUser.name}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Toggle: Flor vs Solo Chat */}
                {selectedUser.id !== 'ronald' && (
                  <div className="p-3.5 rounded-xl bg-[#1E293B]/60 border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Tipo de Experiencia
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">
                        {editHasFlowerExperience
                          ? '🌸 Modo Flor + Texto + Chat (Menú de recuerdo con flor animada)'
                          : '💬 Modo Solo Chat (Entra directamente al chat de WhatsApp sin flor ni texto)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditHasFlowerExperience(!editHasFlowerExperience)}
                      className={`self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        editHasFlowerExperience
                          ? 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40 hover:bg-[#EAB308]/30'
                          : 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/30'
                      }`}
                    >
                      {editHasFlowerExperience ? 'Cambiar a Solo Chat' : 'Activar Flor + Texto'}
                    </button>
                  </div>
                )}

                {/* Sub-form: TEXTS EXACTOS */}
                {activeTab === 'texts' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#EAB308]/30 text-xs text-[#FDE047] leading-relaxed">
                      <strong>Preservación fiel del texto:</strong> Escribe aquí la carta o texto personal para {selectedUser.name}. La aplicación lo mostrará con exactitud total, respetando cada palabra, párrafo, salto de línea y signo de puntuación. La IA nunca intervendrá en este contenido.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                        Texto Personal para {selectedUser.name}
                      </label>
                      <textarea
                        rows={10}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder={`Escribe aquí el texto exacto para ${selectedUser.name}...`}
                        className="w-full p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-sm text-white font-serif leading-relaxed focus:outline-hidden focus:border-[#38BDF8]"
                      />
                      <span className="text-[11px] text-[#94A3B8] mt-1 block">
                        {editText.trim() ? `${editText.split(/\s+/).filter(Boolean).length} palabras` : 'Sin texto configurado'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Sub-form: PERFILAMIENTO */}
                {activeTab === 'profiling' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-slate-300 leading-relaxed">
                      <strong>Base para la Formulación:</strong> Ingresa aquí los detalles personales, recuerdos, gustos y características de {selectedUser.name}. Servirán como guía para que Gemini configure su formulación floral personalizada.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                        Perfilamiento de {selectedUser.name}
                      </label>
                      <textarea
                        rows={6}
                        value={editProfiling}
                        onChange={(e) => setEditProfiling(e.target.value)}
                        placeholder="Escribe aquí las características, virtudes, recuerdos o personalidad de esta persona..."
                        className="w-full p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-xs sm:text-sm text-white leading-relaxed focus:outline-hidden focus:border-[#38BDF8]"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-form: COLORES Y ESTILO */}
                {activeTab === 'styles' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-slate-300 leading-relaxed">
                      <strong>Personalización visual única:</strong> Configura los colores favoritos y estilo exclusivo de {selectedUser.name}. Una personalización nunca afectará a otro usuario.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#94A3B8] mb-1">Color Principal / Botones</label>
                        <input
                          type="text"
                          value={themePrimary}
                          onChange={(e) => setThemePrimary(e.target.value)}
                          placeholder="ej. #2C2926 o #4A2E35"
                          className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white focus:outline-hidden focus:border-[#38BDF8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#94A3B8] mb-1">Color de Fondo Pantalla</label>
                        <input
                          type="text"
                          value={themeBg}
                          onChange={(e) => setThemeBg(e.target.value)}
                          placeholder="ej. #FAF8F5 o #FBF6F0"
                          className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white focus:outline-hidden focus:border-[#38BDF8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#94A3B8] mb-1">Acento Floral</label>
                        <input
                          type="text"
                          value={themeAccent}
                          onChange={(e) => setThemeAccent(e.target.value)}
                          placeholder="ej. #D4AF37 o #E6A598"
                          className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white focus:outline-hidden focus:border-[#38BDF8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#94A3B8] mb-1">Estilo Tipográfico</label>
                        <select
                          value={themeFontStyle}
                          onChange={(e) => setThemeFontStyle(e.target.value as 'serif' | 'sans')}
                          className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                        >
                          <option value="serif">Serif (Elegante y literaria)</option>
                          <option value="sans">Sans (Limpia y moderna)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#94A3B8] mb-1">
                        Pétalos Flotantes (colores hexadecimales separados por coma)
                      </label>
                      <input
                        type="text"
                        value={themePetals}
                        onChange={(e) => setThemePetals(e.target.value)}
                        placeholder="ej. #E6A598, #A594B8, #8A9A86"
                        className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white focus:outline-hidden focus:border-[#38BDF8]"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-form: FLORES E INSTRUCCIONES */}
                {activeTab === 'flowers' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-slate-300 leading-relaxed">
                      <strong>Instrucciones para Gemini:</strong> Define las preferencias botánicas y el tono estético con el que se formulará la composición floral de {selectedUser.name}.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                        Instrucciones Botánicas
                      </label>
                      <input
                        type="text"
                        value={editFlowerInstructions}
                        onChange={(e) => setEditFlowerInstructions(e.target.value)}
                        placeholder="ej. Incluir flores silvestres, lirios blancos, notas de calidez y nobleza..."
                        className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                        Tono Estético Preferido
                      </label>
                      <input
                        type="text"
                        value={editFlowerTone}
                        onChange={(e) => setEditFlowerTone(e.target.value)}
                        placeholder="ej. Cálido y poético, Sereno, Luminoso"
                        className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                      />
                    </div>
                  </div>
                )}

                {/* Save button */}
                <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end">
                  <button
                    id="btn-admin-save-changes"
                    type="button"
                    onClick={handleSaveSelectedUser}
                    disabled={isSaving}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EAA53] text-[#052E16] text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <span>Guardando...</span>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar Cambios de {selectedUser.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-xs text-[#94A3B8]">
                Selecciona un usuario de la lista superior para editar su información.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Response Confirmation Modal - DARK MODE */}
      {confirmDeleteResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0F172A] rounded-2xl p-6 w-full max-w-sm border border-[#1E293B] shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-rose-950/50 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-display text-lg text-white">
                  ¿Eliminar respuesta?
                </h4>
                <p className="text-xs text-[#94A3B8]">
                  Usuario: {confirmDeleteResponse.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#1E293B] p-3 rounded-xl border border-[#334155]">
              Esta acción es exclusiva del administrador. Se borrará permanentemente la respuesta para permitir pruebas o reinicios.
            </p>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteResponse(null)}
                className="px-3.5 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDeleteResponse}
                disabled={deletingResponseUserId !== null}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {deletingResponseUserId ? 'Borrando...' : 'Eliminar Respuesta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal - DARK MODE */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0F172A] rounded-2xl p-6 w-full max-w-sm border border-[#1E293B] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
              <h4 className="font-serif-display text-lg text-white">
                Agregar Nuevo Usuario
              </h4>
              <button
                type="button"
                onClick={() => setShowNewUserModal(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ej. Mariana"
                  className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">Usuario</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="ej. mariana"
                  className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-[#64748B] font-mono focus:outline-hidden focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-[#94A3B8]">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="text-[10px] text-[#EAB308] hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    {showNewUserPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Ocultar</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Mostrar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewUserPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Contraseña inicial"
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-[#64748B] font-mono focus:outline-hidden focus:border-[#38BDF8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#94A3B8] hover:text-white cursor-pointer"
                  >
                    {showNewUserPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Selection: ¿Tendrá flor o sólo chat? */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  ¿Tendrá experiencia de Flor o sólo Chat?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewHasFlowerExperience(false)}
                    className={`flex items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      !newHasFlowerExperience
                        ? 'border-[#25D366] bg-[#25D366]/15 ring-1 ring-[#25D366]'
                        : 'border-[#334155] bg-[#1E293B]/60 hover:bg-[#1E293B]'
                    }`}
                  >
                    <div className="mr-2.5 mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        !newHasFlowerExperience ? 'border-[#25D366] bg-[#25D366]' : 'border-[#64748B]'
                      }`}>
                        {!newHasFlowerExperience && <div className="w-1.5 h-1.5 rounded-full bg-[#052E16]" />}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
                        <span>💬 Solo Chat</span>
                        <span className="text-[10px] bg-[#25D366] text-[#052E16] px-1.5 py-0.2 rounded-full font-bold">Futuros usuarios</span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                        Entra directo al chat de WhatsApp al iniciar sesión. Sin flor ni texto.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewHasFlowerExperience(true)}
                    className={`flex items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      newHasFlowerExperience
                        ? 'border-[#EAB308] bg-[#EAB308]/15 ring-1 ring-[#EAB308]'
                        : 'border-[#334155] bg-[#1E293B]/60 hover:bg-[#1E293B]'
                    }`}
                  >
                    <div className="mr-2.5 mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        newHasFlowerExperience ? 'border-[#EAB308] bg-[#EAB308]' : 'border-[#64748B]'
                      }`}>
                        {newHasFlowerExperience && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
                        <span>🌸 Flor + Texto + Chat</span>
                        <span className="text-[10px] bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40 px-1.5 py-0.2 rounded-full font-medium">Modo recuerdo</span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                        Conservará la flor animada, lectura de texto personal y menú.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EAA53] text-[#052E16] text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User & Password Modal - DARK MODE */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0F172A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 w-full max-w-md border border-[#1E293B] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3.5 border-b border-[#1E293B]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1E293B] text-white flex items-center justify-center shadow-xs shrink-0 border border-[#334155]">
                  <KeyRound className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <h4 className="font-serif-display text-lg sm:text-xl text-white font-semibold leading-tight">
                    Editar Credenciales
                  </h4>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Modificar contraseña para <span className="font-mono text-[#38BDF8]">@{editingUser.username}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEditModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={editUserModalName}
                  onChange={(e) => setEditUserModalName(e.target.value)}
                  placeholder="ej. Mariana"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs sm:text-sm text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Nombre de usuario (Identificador)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingUser.username}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B]/40 border border-[#334155] text-xs sm:text-sm text-[#64748B] font-mono cursor-not-allowed"
                />
                <span className="text-[11px] text-[#94A3B8] mt-1 block">
                  El nombre de usuario se mantiene fijo para preservar su correspondencia botánica y textos personales.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8]">
                    Nueva Contraseña de Acceso
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEditUserModalPassword(!showEditUserModalPassword)}
                    className="text-[11px] text-[#EAB308] hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    {showEditUserModalPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Ocultar</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Mostrar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showEditUserModalPassword ? 'text' : 'password'}
                    required
                    value={editUserModalPassword}
                    onChange={(e) => setEditUserModalPassword(e.target.value)}
                    placeholder="Escribe la nueva contraseña..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs sm:text-sm text-white placeholder-[#64748B] font-mono focus:outline-hidden focus:border-[#38BDF8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditUserModalPassword(!showEditUserModalPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-white cursor-pointer"
                    title={showEditUserModalPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showEditUserModalPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {editingUser.id !== 'ronald' && (
                <>
                  <div className="p-3 rounded-xl bg-[#1E293B]/60 border border-[#334155] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Estado de la cuenta</span>
                      <span className="text-[11px] text-[#94A3B8]">Permitir iniciar sesión</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditUserModalIsActive(!editUserModalIsActive)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        editUserModalIsActive
                          ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                          : 'bg-rose-950/50 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {editUserModalIsActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1E293B]/60 border border-[#334155] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Experiencia al Iniciar Sesión
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                          {editUserModalHasFlowerExperience
                            ? '🌸 Flor + Texto (Modo recuerdo con menú)'
                            : '💬 Solo Chat directo (Sin flor ni texto)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditUserModalHasFlowerExperience(!editUserModalHasFlowerExperience)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          editUserModalHasFlowerExperience
                            ? 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40 hover:bg-[#EAB308]/30'
                            : 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/30'
                        }`}
                      >
                        {editUserModalHasFlowerExperience ? 'Cambiar a Solo Chat' : 'Activar Flor + Texto'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="p-3 rounded-xl bg-[#1E293B] border border-[#EAB308]/30 text-[11px] text-[#FDE047] leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#EAB308] mt-0.5" />
                <span>
                  <strong>Sincronización Inmediata:</strong> Al guardar, la contraseña se actualizará de inmediato en Firestore y en el almacenamiento local. El usuario deberá usar esta nueva contraseña en su próximo inicio de sesión.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  disabled={isSavingUserEdit}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingUserEdit}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EAA53] text-[#052E16] text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingUserEdit ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Contraseña</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Window Live WhatsApp Admin Chat Manager */}
      <WhatsAppAdminMultiChatManager
        openUsers={openChatUsers}
        onCloseUser={handleCloseChat}
        onCloseAll={handleCloseAllChats}
        onOpenUser={handleOpenChat}
      />
    </div>
  );
};
