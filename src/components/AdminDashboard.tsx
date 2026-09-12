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
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  Search,
  RefreshCw,
  Clock,
  UserCheck,
  UserX,
  X,
  Check,
  Cloud,
} from 'lucide-react';
import { api } from '../lib/api';
import { subscribeToCloudUsers } from '../lib/firebase';
import type { UserRecord, UserTheme, AdminUserResponseItem } from '../types';

interface AdminDashboardProps {
  onSelectUserToPreview?: (username: string, passwordPlain: string) => void;
  onViewMyExperience?: () => void;
  isDarkTheme?: boolean;
}

type AdminTab = 'responses' | 'users' | 'texts' | 'profiling' | 'styles' | 'flowers';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectUserToPreview,
  onViewMyExperience,
  isDarkTheme = false,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('responses');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [responses, setResponses] = useState<AdminUserResponseItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('jhon');
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New user modal
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Selected User Form state
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
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
    const unsubscribe = subscribeToCloudUsers((cloudUsers) => {
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

    return () => {
      unsubscribe();
    };
  }, []);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  useEffect(() => {
    if (selectedUser) {
      setEditName(selectedUser.name);
      setEditPassword(selectedUser.passwordPlain);
      setEditIsActive(selectedUser.isActive);
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
        passwordPlain: editPassword,
        isActive: editIsActive,
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
      await api.createAdminUser({
        name: newName.trim(),
        username: newUsername.trim(),
        passwordPlain: newPassword.trim(),
        role: 'user',
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
      });
      setShowNewUserModal(false);
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      await loadData();
      setSelectedUserId(newUsername.toLowerCase().trim());
      setSuccessMessage('Nuevo usuario agregado con éxito.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al crear el usuario.');
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

  const handleDeleteResponse = async (userId: string, userName: string) => {
    if (
      !window.confirm(
        `¿Eliminar la respuesta de prueba de ${userName}? Se borrará de la nube para que puedas volver a probar.`
      )
    ) {
      return;
    }

    try {
      setDeletingResponseUserId(userId);
      await api.deleteAdminResponse(userId);
      setResponses((prev) => prev.filter((r) => r.userId !== userId));
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, userResponse: null } : u))
      );
      setSuccessMessage(`Respuesta de ${userName} eliminada de la nube.`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al eliminar la respuesta.');
    } finally {
      setDeletingResponseUserId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      id="admin-dashboard-container"
      className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10"
    >
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-xs mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F0EAE1]">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2C2926] text-[#FAF8F5] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif-display text-2xl sm:text-3xl text-[#2C2926] font-semibold">
                  Panel de Administración
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#FAF0E6] text-[#8C6D37] border border-[#E8DFC8] px-2 py-0.5 rounded-full">
                  Ronald
                </span>
              </div>
              <p className="text-xs text-[#8C847B] mt-0.5">
                Control y personalización individual de usuarios, textos, estilos, flores y respuestas privadas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 text-xs text-[#736C65] hover:text-[#2C2926] bg-[#FAF8F5] hover:bg-[#F2ECE4] px-3.5 py-2 rounded-xl border border-[#E2DBD2] transition-colors"
              title="Recargar información"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            {onViewMyExperience && (
              <button
                type="button"
                onClick={onViewMyExperience}
                className="inline-flex items-center space-x-1.5 text-xs text-[#2C2926] bg-[#F3ECE4] hover:bg-[#EAE1D6] px-3.5 py-2 rounded-xl border border-[#DCD3C5] font-medium transition-colors shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-[#937C67]" />
                <span>Ver Mi Experiencia</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 pt-5">
          <div className="p-3 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE6DB]">
            <span className="text-[10px] uppercase tracking-wider text-[#8C847B] font-semibold block">
              Total Usuarios
            </span>
            <span className="text-xl sm:text-2xl font-serif-display font-semibold text-[#2C2926] mt-0.5 block">
              {users.filter((u) => u.id !== 'ronald').length}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE6DB]">
            <span className="text-[10px] uppercase tracking-wider text-[#8C847B] font-semibold block">
              Respuestas Recibidas
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-serif-display font-semibold text-[#2C2926]">
                {responses.length}
              </span>
              {responses.length > 0 && (
                <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  Nuevas
                </span>
              )}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE6DB] col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8C847B] font-semibold block">
              Sincronización
            </span>
            <span className="text-xs font-medium text-[#15803D] mt-2 flex items-center space-x-1.5">
              <Cloud className="w-3.5 h-3.5 text-[#16A34A] animate-pulse" />
              <span>Nube en Tiempo Real</span>
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0 text-[#16A34A]" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-[#FDF2F0] border border-[#F5C6CB] text-[#902A24] text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-[#E8E2D9] mb-6 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('responses')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'responses'
              ? 'bg-[#2C2926] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#FAF8F5] hover:text-[#2C2926]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Respuestas de Usuarios</span>
          {responses.length > 0 && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                activeTab === 'responses'
                  ? 'bg-white/25 text-white'
                  : 'bg-[#2C2926] text-white'
              }`}
            >
              {responses.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'users'
              ? 'bg-[#2C2926] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#FAF8F5] hover:text-[#2C2926]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Usuarios y Credenciales</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('texts')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'texts'
              ? 'bg-[#2C2926] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#FAF8F5] hover:text-[#2C2926]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Textos Exactos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profiling')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'profiling'
              ? 'bg-[#2C2926] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#FAF8F5] hover:text-[#2C2926]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Perfilamiento</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('styles')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'styles'
              ? 'bg-[#2C2926] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#FAF8F5] hover:text-[#2C2926]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colores y Estilo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flowers')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'flowers'
              ? 'bg-[#2C2926] text-[#FAF8F5] shadow-xs'
              : 'text-[#6B635A] hover:bg-[#FAF8F5] hover:text-[#2C2926]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flores e Instrucciones</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: RESPUESTAS PRIVADAS DE USUARIOS (RONALD ONLY)
          ======================================================== */}
      {activeTab === 'responses' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EAE1]">
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl text-[#2C2926]">
                Respuestas Personales Recibidas
              </h2>
              <p className="text-xs text-[#8C847B] mt-0.5">
                Buzón confidencial visible exclusivamente para Ronald. Ningún usuario puede ver respuestas ajenas.
              </p>
            </div>
            <span className="text-xs text-[#8C847B] font-mono">
              Total: {responses.length} respuesta{responses.length === 1 ? '' : 's'}
            </span>
          </div>

          {responses.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center text-[#8C847B] mx-auto mb-3">
                <MessageSquare className="w-5 h-5 stroke-[1.4]" />
              </div>
              <h3 className="font-serif-display text-lg text-[#2C2926] mb-1">
                Aún no hay respuestas enviadas
              </h3>
              <p className="text-xs text-[#8C847B] max-w-md mx-auto leading-relaxed">
                Cuando Jhon, Isabella, Shaday, Genesis, Andrea, Isaias o Hannia finalicen su experiencia y envíen su respuesta personal, se mostrarán aquí con su identificación y fecha exacta.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EAE1] mt-4">
              {responses.map((item, idx) => (
                <div key={idx} className="py-6 first:pt-2 last:pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#E8DFC8] flex items-center justify-center text-[#2C2926] font-semibold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#2C2926] block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#8C847B] font-mono">
                          @{item.username}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-[#8C847B]">
                      <span className="inline-flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#937C67]" />
                        <span>
                          {new Date(
                            item.response.updatedAt || item.response.submittedAt
                          ).toLocaleString('es-ES', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserId(item.userId);
                          setActiveTab('texts');
                        }}
                        className="text-[11px] text-[#937C67] hover:text-[#2C2926] hover:underline underline-offset-2"
                      >
                        Ver configuración
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteResponse(item.userId, item.name)}
                        disabled={deletingResponseUserId === item.userId}
                        className="inline-flex items-center space-x-1 text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
                        title="Eliminar respuesta para pruebas"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Borrar</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-sm text-[#2C2926] leading-relaxed whitespace-pre-wrap font-serif">
                    {item.response.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: USUARIOS Y CREDENCIALES
          ======================================================== */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EAE1]">
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl text-[#2C2926]">
                Gestión de Usuarios y Contraseñas
              </h2>
              <p className="text-xs text-[#8C847B] mt-0.5">
                Crea, activa, desactiva o edita las credenciales de cada usuario sin tocar código.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8C847B]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar usuario..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926] w-36 sm:w-48 focus:outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowNewUserModal(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#2C2926] text-white text-xs font-medium hover:bg-[#1A1817] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0EAE1] text-[#8C847B] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Nombre</th>
                  <th className="py-3 px-3">Usuario</th>
                  <th className="py-3 px-3">Contraseña</th>
                  <th className="py-3 px-3">Rol</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE7]">
                {filteredUsers.map((u) => {
                  const isAdmin = u.id === 'ronald';
                  return (
                    <tr key={u.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3.5 px-3 font-medium text-[#2C2926]">
                        {u.name}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#736C65]">
                        {u.username}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#2C2926] bg-[#FAF8F5] rounded-md inline-block my-2">
                        {u.passwordPlain}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isAdmin
                              ? 'bg-[#2C2926] text-[#FAF8F5]'
                              : 'bg-[#F2EDE5] text-[#736C65]'
                          }`}
                        >
                          {isAdmin ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          disabled={isAdmin}
                          onClick={() => handleToggleUserStatus(u)}
                          className={`inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md ${
                            u.isActive
                              ? 'text-[#15803D] bg-[#DCFCE7]'
                              : 'text-[#902A24] bg-[#FDF2F0]'
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
                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {onSelectUserToPreview && (
                            <button
                              type="button"
                              onClick={() => onSelectUserToPreview(u.username, u.passwordPlain)}
                              className="p-1.5 text-[#736C65] hover:text-[#2C2926] hover:bg-[#F2ECE4] rounded-lg transition-colors"
                              title={`Probar experiencia como ${u.name}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setActiveTab('texts');
                            }}
                            className="text-[11px] text-[#2C2926] bg-[#F2EDE5] hover:bg-[#EAE2D6] px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Editar
                          </button>
                          {!isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 text-[#902A24] hover:bg-[#FDF2F0] rounded-lg transition-colors"
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
          TABS 3, 4, 5, 6: EDIT CONFIGURATION PER USER
          ======================================================== */}
      {['texts', 'profiling', 'styles', 'flowers'].includes(activeTab) && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E2D9] overflow-hidden shadow-xs flex flex-col md:flex-row">
          {/* User selection sidebar */}
          <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-[#E8E2D9] bg-[#FAF8F5] p-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C847B] block mb-2 px-2">
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#2C2926] text-[#FAF8F5] font-medium shadow-2xs'
                        : 'text-[#4A443D] hover:bg-[#F0EAE1]'
                    }`}
                  >
                    <span>{u.name}</span>
                    {hasPendingText && u.id !== 'ronald' && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#EAE3D8] text-[#8C847B]'
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
          <div className="flex-1 p-6 sm:p-8">
            {selectedUser ? (
              <div className="space-y-6 max-w-2xl">
                {/* Header for user */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
                  <div>
                    <h3 className="font-serif-display text-2xl text-[#2C2926]">
                      {selectedUser.name}
                    </h3>
                    <p className="text-xs text-[#8C847B]">
                      Usuario ID: <code className="font-mono text-[#2C2926]">{selectedUser.username}</code>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {onSelectUserToPreview && (
                      <button
                        type="button"
                        onClick={() => onSelectUserToPreview(selectedUser.username, selectedUser.passwordPlain)}
                        className="inline-flex items-center space-x-1 text-xs text-[#2C2926] bg-[#F5F1EB] hover:bg-[#EBE5DC] px-3 py-1.5 rounded-xl border border-[#E2DBD2] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#937C67]" />
                        <span>Probar vista como {selectedUser.name}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-form: TEXTS EXACTOS */}
                {activeTab === 'texts' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#FAF0E6] border border-[#E8DFC8] text-xs text-[#8C6D37] leading-relaxed">
                      <strong>Preservación fiel del texto:</strong> Escribe aquí la carta o texto personal para {selectedUser.name}. La aplicación lo mostrará con exactitud total, respetando cada palabra, párrafo, salto de línea y signo de puntuación. La IA nunca intervendrá en este contenido.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#736C65] mb-1.5">
                        Texto Personal para {selectedUser.name}
                      </label>
                      <textarea
                        rows={10}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder={`Escribe aquí el texto exacto para ${selectedUser.name}...`}
                        className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-sm text-[#2C2926] font-serif leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-[#C29B38]"
                      />
                      <span className="text-[11px] text-[#8C847B] mt-1 block">
                        {editText.trim() ? `${editText.split(/\s+/).filter(Boolean).length} palabras` : 'Sin texto configurado'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Sub-form: PERFILAMIENTO */}
                {activeTab === 'profiling' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#736C65] leading-relaxed">
                      <strong>Base para la Formulación:</strong> Ingresa aquí los detalles personales, recuerdos, gustos y características de {selectedUser.name}. Servirán como guía para que Gemini configure su formulación floral personalizada.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#736C65] mb-1.5">
                        Perfilamiento de {selectedUser.name}
                      </label>
                      <textarea
                        rows={6}
                        value={editProfiling}
                        onChange={(e) => setEditProfiling(e.target.value)}
                        placeholder="Escribe aquí las características, virtudes, recuerdos o personalidad de esta persona..."
                        className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs sm:text-sm text-[#2C2926] leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-[#C29B38]"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-form: COLORES Y ESTILO */}
                {activeTab === 'styles' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#736C65] leading-relaxed">
                      <strong>Personalización visual única:</strong> Configura los colores favoritos y estilo exclusivo de {selectedUser.name}. Una personalización nunca afectará a otro usuario.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#736C65] mb-1">Color Principal / Botones</label>
                        <input
                          type="text"
                          value={themePrimary}
                          onChange={(e) => setThemePrimary(e.target.value)}
                          placeholder="ej. #2C2926 o #4A2E35"
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#736C65] mb-1">Color de Fondo Pantalla</label>
                        <input
                          type="text"
                          value={themeBg}
                          onChange={(e) => setThemeBg(e.target.value)}
                          placeholder="ej. #FAF8F5 o #FBF6F0"
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#736C65] mb-1">Acento Floral</label>
                        <input
                          type="text"
                          value={themeAccent}
                          onChange={(e) => setThemeAccent(e.target.value)}
                          placeholder="ej. #D4AF37 o #E6A598"
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#736C65] mb-1">Estilo Tipográfico</label>
                        <select
                          value={themeFontStyle}
                          onChange={(e) => setThemeFontStyle(e.target.value as 'serif' | 'sans')}
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs"
                        >
                          <option value="serif">Serif (Elegante y literaria)</option>
                          <option value="sans">Sans (Limpia y moderna)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#736C65] mb-1">
                        Pétalos Flotantes (colores hexadecimales separados por coma)
                      </label>
                      <input
                        type="text"
                        value={themePetals}
                        onChange={(e) => setThemePetals(e.target.value)}
                        placeholder="ej. #E6A598, #A594B8, #8A9A86"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-form: FLORES E INSTRUCCIONES */}
                {activeTab === 'flowers' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#736C65] leading-relaxed">
                      <strong>Instrucciones para Gemini:</strong> Define las preferencias botánicas y el tono estético con el que se formulará la composición floral de {selectedUser.name}.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#736C65] mb-1">
                        Instrucciones Botánicas
                      </label>
                      <input
                        type="text"
                        value={editFlowerInstructions}
                        onChange={(e) => setEditFlowerInstructions(e.target.value)}
                        placeholder="ej. Incluir flores silvestres, lirios blancos, notas de calidez y nobleza..."
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#736C65] mb-1">
                        Tono Estético Preferido
                      </label>
                      <input
                        type="text"
                        value={editFlowerTone}
                        onChange={(e) => setEditFlowerTone(e.target.value)}
                        placeholder="ej. Cálido y poético, Sereno, Luminoso"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Save button */}
                <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-end">
                  <button
                    id="btn-admin-save-changes"
                    type="button"
                    onClick={handleSaveSelectedUser}
                    disabled={isSaving}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#2C2926] hover:bg-[#1A1817] text-[#FAF8F5] text-xs font-medium shadow-xs transition-all disabled:opacity-50"
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
              <div className="text-center py-16 text-xs text-[#8C847B]">
                Selecciona un usuario de la lista izquierda para editar su información.
              </div>
            )}
          </div>
        </div>
      )}

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-[#E8E2D9] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1] mb-4">
              <h4 className="font-serif-display text-lg text-[#2C2926]">
                Agregar Nuevo Usuario
              </h4>
              <button
                type="button"
                onClick={() => setShowNewUserModal(false)}
                className="text-[#8C847B] hover:text-[#2C2926]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs text-[#736C65] mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ej. Mariana"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#736C65] mb-1">Usuario</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="ej. mariana"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-[#736C65] mb-1">Contraseña</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Contraseña inicial"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#736C65]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2C2926] text-white text-xs font-medium"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
