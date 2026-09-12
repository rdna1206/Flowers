import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { LogoR } from './LogoR';

interface LoginViewProps {
  onLogin: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  isLoading,
  errorMessage,
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
      <div className="w-full max-w-md">
        {/* Minimalist & Elegant Card */}
        <div className="bg-[#FFFFFF]/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#E8E2D9] shadow-sm p-8 sm:p-11 relative overflow-hidden transition-all">
          {/* Subtle top delicate accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E6A598]/30 via-[#A594B8]/30 to-[#8A9A86]/30" />

          {/* Icon Only Header */}
          <div className="flex flex-col items-center text-center mb-9">
            <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#E8E0D5] flex items-center justify-center text-[#2C2926] shadow-xs hover:scale-105 transition-transform">
              <LogoR className="w-7 h-7 p-0.5" />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              id="login-error-banner"
              className="mb-6 p-3.5 rounded-xl bg-[#FDF2F0] border border-[#F5C6CB] text-[#902A24] text-xs leading-relaxed flex items-center space-x-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#902A24] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form: Manual username & password entry */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-username-input"
                className="block text-xs font-medium uppercase tracking-wider text-[#736C65] mb-2"
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E958C]">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-[#2C2926] text-sm placeholder-[#A8A199] focus:outline-hidden focus:ring-1 focus:ring-[#C29B38] focus:border-[#C29B38] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password-input"
                className="block text-xs font-medium uppercase tracking-wider text-[#736C65] mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E958C]">
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
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#FAF8F5] border border-[#E2DBD2] text-[#2C2926] text-sm placeholder-[#A8A199] focus:outline-hidden focus:ring-1 focus:ring-[#C29B38] focus:border-[#C29B38] transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E958C] hover:text-[#4A443D] focus:outline-hidden"
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
                className="w-full py-3 px-6 rounded-xl bg-[#2C2926] hover:bg-[#1C1A18] text-[#FAF8F5] text-sm font-medium tracking-wide transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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
