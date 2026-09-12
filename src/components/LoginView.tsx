import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { LogoR } from './LogoR';

interface LoginViewProps {
  onLogin: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  isDarkTheme?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  isLoading,
  errorMessage,
  isDarkTheme = true,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    await onLogin(username.trim(), password);
  };

  return (
    <div
      id="login-view-container"
      className="relative z-10 min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-12 sm:py-16"
    >
      <div className="w-full max-w-md relative">
        {/* Minimalist & Elegant Card */}
        <div className="bg-[#121824]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#232D42] text-[#E2E8F0] shadow-xl p-8 sm:p-11 relative overflow-hidden transition-all duration-500">

          {/* Subtle top delicate accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#701A75]/50 via-[#FACC15]/70 to-[#4C0519]/50" />

          {/* Icon Only Header */}
          <div className="flex flex-col items-center text-center mb-9">
            <div
              className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-xs hover:scale-105 transition-transform ${
                isDarkTheme
                  ? 'bg-[#1A2234] border-[#2E3B56] text-[#F4D03F]'
                  : 'bg-[#FAF6F0] border-[#E8E0D5] text-[#2C2926]'
              }`}
            >
              <LogoR className="w-7 h-7 p-0.5" />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              id="login-error-banner"
              className={`mb-6 p-3.5 rounded-xl border text-xs leading-relaxed flex items-center space-x-2.5 ${
                isDarkTheme
                  ? 'bg-[#3A181C] border-[#6B2128] text-[#F87171]'
                  : 'bg-[#FDF2F0] border-[#F5C6CB] text-[#902A24]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isDarkTheme ? 'bg-[#F87171]' : 'bg-[#902A24]'
                }`}
              />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form: Manual username & password entry */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-username-input"
                className={`block text-xs font-medium uppercase tracking-wider mb-2 ${
                  isDarkTheme ? 'text-[#94A3B8]' : 'text-[#736C65]'
                }`}
              >
                Usuario
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    isDarkTheme ? 'text-[#64748B]' : 'text-[#9E958C]'
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username-input"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tu usuario"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all disabled:opacity-50 focus:outline-hidden ${
                    isDarkTheme
                      ? 'bg-[#0D121D] border-[#232D42] text-[#F8FAFC] placeholder-[#64748B] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8]'
                      : 'bg-[#FAF8F5] border-[#E2DBD2] text-[#2C2926] placeholder-[#A8A199] focus:ring-1 focus:ring-[#C29B38] focus:border-[#C29B38]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password-input"
                className={`block text-xs font-medium uppercase tracking-wider mb-2 ${
                  isDarkTheme ? 'text-[#94A3B8]' : 'text-[#736C65]'
                }`}
              >
                Contraseña
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    isDarkTheme ? 'text-[#64748B]' : 'text-[#9E958C]'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all disabled:opacity-50 focus:outline-hidden ${
                    isDarkTheme
                      ? 'bg-[#0D121D] border-[#232D42] text-[#F8FAFC] placeholder-[#64748B] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8]'
                      : 'bg-[#FAF8F5] border-[#E2DBD2] text-[#2C2926] placeholder-[#A8A199] focus:ring-1 focus:ring-[#C29B38] focus:border-[#C29B38]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3.5 flex items-center focus:outline-hidden ${
                    isDarkTheme
                      ? 'text-[#64748B] hover:text-[#94A3B8]'
                      : 'text-[#9E958C] hover:text-[#4A443D]'
                  }`}
                  tabIndex={-1}
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading || !username.trim() || !password}
                className={`w-full py-3 px-6 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer ${
                  isDarkTheme
                    ? 'bg-[#38BDF8] hover:bg-[#0284C7] text-[#0F172A]'
                    : 'bg-[#2C2926] hover:bg-[#1C1A18] text-[#FAF8F5]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar sesión</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
