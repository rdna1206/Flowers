import React from 'react';
import { Flower2, LogOut, ShieldCheck } from 'lucide-react';
import type { UserSummary } from '../types';

interface HeaderNavProps {
  user: UserSummary | null;
  currentView?: string;
  isDarkTheme?: boolean;
  onLogout: () => void;
  onOpenAdmin?: () => void;
  onViewExperience?: () => void;
  hasUnreadResponses?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  user,
  currentView,
  isDarkTheme = false,
  onLogout,
  onOpenAdmin,
  onViewExperience,
}) => {
  return (
    <header
      id="main-header"
      className="relative z-20 w-full backdrop-blur-md transition-colors duration-500"
      style={{
        backgroundColor: isDarkTheme ? 'rgba(5, 8, 17, 0.75)' : 'rgba(250, 248, 245, 0.85)',
        borderBottom: isDarkTheme
          ? '1px solid rgba(43, 120, 228, 0.2)'
          : '1px solid rgba(232, 226, 217, 0.8)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity: ONLY the icon, as requested */}
        <div className="flex items-center space-x-3">
          <div
            className="w-9 h-9 rounded-full border flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-pointer"
            style={{
              backgroundColor: isDarkTheme ? 'rgba(15, 29, 62, 0.8)' : '#F3ECE4',
              borderColor: isDarkTheme ? 'rgba(43, 120, 228, 0.35)' : '#E2DBD2',
              color: isDarkTheme ? '#F4D03F' : '#937C67',
            }}
            title="Inicio"
            onClick={user?.role === 'admin' ? onOpenAdmin : onViewExperience}
          >
            <Flower2 className="w-5 h-5 stroke-[1.4]" />
          </div>
        </div>

        {/* Controls */}
        {user && (
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* If user is Ronald (admin) */}
            {user.role === 'admin' && (
              <div className="flex items-center space-x-2">
                {currentView !== 'admin' && onOpenAdmin && (
                  <button
                    id="btn-nav-to-admin"
                    type="button"
                    onClick={onOpenAdmin}
                    className="flex items-center space-x-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all shadow-2xs cursor-pointer"
                    style={{
                      backgroundColor: isDarkTheme ? '#102A45' : '#EFE9E0',
                      color: isDarkTheme ? '#E6EDF8' : '#2C2926',
                      borderColor: isDarkTheme ? '#2B78E4' : '#DCD3C5',
                    }}
                    title="Abrir Panel Administrativo"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F4D03F]" />
                    <span className="hidden sm:inline">Panel Administrativo</span>
                    <span className="sm:hidden">Panel</span>
                  </button>
                )}

                {currentView === 'admin' && onViewExperience && (
                  <button
                    id="btn-nav-to-preview"
                    type="button"
                    onClick={onViewExperience}
                    className="flex items-center space-x-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer"
                    style={{
                      backgroundColor: isDarkTheme ? '#102A45' : '#FAF8F5',
                      color: isDarkTheme ? '#8EAFDD' : '#736C65',
                      borderColor: isDarkTheme ? '#1F4B78' : '#E2DBD2',
                    }}
                  >
                    <span>Ver mi Experiencia</span>
                  </button>
                )}
              </div>
            )}

            {/* Logout button */}
            <button
              id="btn-logout"
              type="button"
              onClick={onLogout}
              className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer hover:opacity-80"
              style={{
                color: isDarkTheme ? '#8EAFDD' : '#736C65',
              }}
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
