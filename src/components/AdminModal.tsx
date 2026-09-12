import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  ShieldCheck,
  Palette,
} from 'lucide-react';
import { api } from '../lib/api';
import type { UserRecord, UserTheme } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUserToPreview?: (username: string, passwordPlain: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onSelectUserToPreview,
}) => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('jhon');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states for the selected user
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editProfiling, setEditProfiling] = useState('');
  const [editText, setEditText] = useState('');
  const [editFlowerInstructions, setEditFlowerInstructions] = useState('');
  const [editFlowerTone, setEditFlowerTone] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  // Theme states
  const [themePrimary, setThemePrimary] = useState('');
  const [themeSecondary, setThemeSecondary] = useState('');
  const [themeBg, setThemeBg] = useState('');
  const [themeSurface, setThemeSurface] = useState('');
  const [themeText, setThemeText] = useState('');
  const [themeAccent, setThemeAccent] = useState('');
  const [themePetals, setThemePetals] = useState('');
  const [themeFontStyle, setThemeFontStyle] = useState<'serif' | 'sans'>('serif');
  const [themeName, setThemeName] = useState('');

  // New user form state
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getAdminUsers();
      setUsers(res.users);
      if (res.users.length > 0 && !res.users.find((u) => u.id === selectedUserId)) {
        setSelectedUserId(res.users[0].id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al cargar los usuarios.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  useEffect(() => {
    if (selectedUser) {
      setEditName(selectedUser.name);
      setEditPassword(selectedUser.passwordPlain);
      setEditProfiling(selectedUser.profiling || '');
      setEditText(selectedUser.personalText || '');
      setEditFlowerInstructions(selectedUser.flowerConfig?.specificInstructions || '');
      setEditFlowerTone(selectedUser.flowerConfig?.preferredTone || '');
      setEditIsActive(selectedUser.isActive);

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

  const handleSave = async () => {
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
      setSuccessMessage('Cambios guardados con éxito en la configuración.');
      await loadUsers();
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewUser = async (e: React.FormEvent) => {
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
      await loadUsers();
      setSelectedUserId(newUsername.toLowerCase().trim());
      setSuccessMessage('Nuevo usuario agregado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al crear el usuario.');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el perfil de ${name}?`)) return;
    try {
      await api.deleteAdminUser(id);
      await loadUsers();
      setSuccessMessage(`Usuario ${name} eliminado.`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al eliminar.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="admin-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-[#FFFFFF] w-full max-w-5xl max-h-[92vh] rounded-2xl sm:rounded-3xl border border-[#E8E2D9] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#2C2926] text-[#FAF8F5] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl text-[#2C2926] font-semibold">
                Estructura y Configuración Administrativa
              </h2>
              <p className="text-[11px] text-[#8C847B]">
                Gestión individual de usuarios, contraseñas, textos, colores y formulación floral
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C847B] hover:text-[#2C2926] hover:bg-[#EAE4DC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#FDF2F0] border border-[#F5C6CB] text-[#902A24] text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Body: Users Sidebar + Edit Form */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* User List Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E8E2D9] bg-[#FAF8F5] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C847B]">
                Usuarios ({users.length})
              </span>
              <button
                type="button"
                onClick={() => setShowNewUserModal(true)}
                className="inline-flex items-center space-x-1 text-xs text-[#2C2926] hover:text-[#000] font-medium bg-[#EFE9E0] px-2 py-1 rounded-md"
              >
                <Plus className="w-3 h-3" />
                <span>Agregar</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {users.map((u) => {
                const isSelected = u.id === selectedUserId;
                const isPendingContent =
                  !u.personalText ||
                  u.personalText.trim() === '' ||
                  !u.profiling ||
                  u.profiling.trim() === '';

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUserId(u.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#2C2926] text-[#FAF8F5] shadow-xs'
                        : 'hover:bg-[#EFE9E0] text-[#4A443D]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <User
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-[#D4AF37]' : 'text-[#8C847B]'
                        }`}
                      />
                      <span className="font-medium truncate">{u.name}</span>
                    </div>
                    {isPendingContent && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#EAE4DC] text-[#736C65]'
                        }`}
                        title="Datos aún no completados"
                      >
                        Pendiente
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Details & Form */}
          <div className="flex-1 p-5 sm:p-8 overflow-y-auto bg-white">
            {selectedUser ? (
              <div className="space-y-6 max-w-2xl">
                {/* Header info */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
                  <div>
                    <h3 className="font-serif-display text-2xl text-[#2C2926]">
                      Configurando a {selectedUser.name}
                    </h3>
                    <p className="text-xs text-[#8C847B]">
                      Usuario ID: <code className="text-[#2C2926] font-mono">{selectedUser.username}</code>
                    </p>
                  </div>

                  {selectedUser.id !== 'admin' && (
                    <div className="flex items-center space-x-2">
                      {onSelectUserToPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectUserToPreview(selectedUser.username, selectedUser.passwordPlain);
                            onClose();
                          }}
                          className="inline-flex items-center space-x-1 text-xs text-[#2C2926] bg-[#F5F1EB] hover:bg-[#EBE5DC] px-3 py-1.5 rounded-lg border border-[#E2DBD2] transition-colors"
                          title="Iniciar sesión inmediatamente con este usuario para probar la vista"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#937C67]" />
                          <span>Probar vista como {selectedUser.name}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(selectedUser.id, selectedUser.name)}
                        className="p-1.5 rounded-lg text-[#902A24] hover:bg-[#FDF2F0] transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 1. Account Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#736C65] mb-1">
                      Nombre Mostrado
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#736C65] mb-1 flex items-center justify-between">
                      <span>Contraseña Individual</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C847B]" />
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Contraseña del usuario"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Profiling */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736C65] mb-1 flex items-center justify-between">
                    <span>Perfilamiento Individual</span>
                    <span className="text-[10px] text-[#8C847B] font-normal">Información que tú proporcionas</span>
                  </label>
                  <p className="text-[11px] text-[#8C847B] mb-2 leading-relaxed">
                    Datos personales y sensibles que servirán para orientar la formulación de flores de {selectedUser.name}.
                  </p>
                  <textarea
                    rows={3}
                    value={editProfiling}
                    onChange={(e) => setEditProfiling(e.target.value)}
                    placeholder="Escribe aquí el perfilamiento de esta persona (gustos, personalidad, recuerdos, carácter)..."
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926] focus:ring-1 focus:ring-[#C29B38]"
                  />
                </div>

                {/* 3. Personal Text */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736C65] mb-1 flex items-center justify-between">
                    <span>Texto Exacto que Leerá {selectedUser.name}</span>
                    <span className="text-[10px] text-[#2C2926] font-medium bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#E8DCCF]">
                      100% fiel (Sin alteración por IA)
                    </span>
                  </label>
                  <p className="text-[11px] text-[#8C847B] mb-2 leading-relaxed">
                    La aplicación mostrará este texto exactamente como lo escribas aquí, respetando palabras, párrafos, saltos de línea y puntuación.
                  </p>
                  <textarea
                    rows={6}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder={`Escribe aquí la carta o mensaje personal para ${selectedUser.name}...`}
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-xs sm:text-sm text-[#2C2926] font-serif leading-relaxed focus:ring-1 focus:ring-[#C29B38]"
                  />
                </div>

                {/* 4. Individual Theme & Colors */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-3">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-[#937C67]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2C2926]">
                      Personalización de Estilo y Colores Favoritos
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8C847B] leading-relaxed">
                    Configura la atmósfera visual exclusiva para {selectedUser.name}: fondo, botones, acentos y pétalos flotantes.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#736C65] mb-1">
                        Color Primario / Botones:
                      </label>
                      <input
                        type="text"
                        value={themePrimary}
                        onChange={(e) => setThemePrimary(e.target.value)}
                        placeholder="ej. #2C2926 o #4A2E35"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#736C65] mb-1">
                        Color de Fondo:
                      </label>
                      <input
                        type="text"
                        value={themeBg}
                        onChange={(e) => setThemeBg(e.target.value)}
                        placeholder="ej. #FAF8F5 o #FBF6F0"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#736C65] mb-1">
                        Color de Acento Floral:
                      </label>
                      <input
                        type="text"
                        value={themeAccent}
                        onChange={(e) => setThemeAccent(e.target.value)}
                        placeholder="ej. #D4AF37 o #E6A598"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#736C65] mb-1">
                        Pétalos Flotantes (hex separados por coma):
                      </label>
                      <input
                        type="text"
                        value={themePetals}
                        onChange={(e) => setThemePetals(e.target.value)}
                        placeholder="ej. #E6A598, #A594B8, #8A9A86"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#736C65] mb-1">
                        Estilo Tipográfico:
                      </label>
                      <select
                        value={themeFontStyle}
                        onChange={(e) => setThemeFontStyle(e.target.value as 'serif' | 'sans')}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD2] text-xs text-[#2C2926]"
                      >
                        <option value="serif">Serif (Editorial, clásico y delicado)</option>
                        <option value="sans">Sans (Moderno, limpio y minimalista)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 5. Flower Configuration */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#C29B38]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2C2926]">
                      Instrucciones de Flores y Formulación (Gemini)
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#736C65] mb-1">
                      Instrucciones específicas de flores para esta persona:
                    </label>
                    <input
                      type="text"
                      value={editFlowerInstructions}
                      onChange={(e) => setEditFlowerInstructions(e.target.value)}
                      placeholder="ej. Enfatizar orquídeas blancas, notas de jazmín y simbolismo de nobleza..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DBD2] text-xs text-[#2C2926]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#736C65] mb-1">
                      Tono estético de la formulación:
                    </label>
                    <input
                      type="text"
                      value={editFlowerTone}
                      onChange={(e) => setEditFlowerTone(e.target.value)}
                      placeholder="ej. Cálido y sereno, Poético, Luminoso, Silvestre y noble"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2DBD2] text-xs text-[#2C2926]"
                    />
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#736C65] hover:bg-[#FAF8F5]"
                  >
                    Cerrar
                  </button>
                  <button
                    id="btn-admin-save-user"
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#2C2926] hover:bg-[#1A1817] text-[#FAF8F5] text-xs font-medium shadow transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span>Guardando...</span>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar Configuración de {selectedUser.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-[#8C847B]">
                Selecciona un usuario de la lista para configurar sus datos.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini Modal to Add a New User */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-[#E8E2D9] shadow-xl">
            <h4 className="font-serif-display text-lg text-[#2C2926] mb-3">
              Agregar Nuevo Usuario
            </h4>
            <form onSubmit={handleCreateNewUser} className="space-y-3">
              <div>
                <label className="block text-xs text-[#736C65] mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ej. Mariana"
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#736C65] mb-1">Usuario (identificador)</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="ej. mariana"
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
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
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2DBD2] text-xs text-[#2C2926] font-mono"
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
                  className="px-4 py-1.5 rounded-lg bg-[#2C2926] text-white text-xs font-medium"
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
