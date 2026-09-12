import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { LogoR } from './LogoR';
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
  isDarkTheme = true,
  onLogout,
  onOpenAdmin,
  onViewExperience,
}) => {
  return (
    <header
      id="main-header"
      className="relative z-20 w-full backdrop-blur-md transition-colors duration-500"
      style={{
        backgroundColor: 'rgba(5, 8, 17, 0.75)',
        borderBottom: '1px solid rgba(43, 120, 228, 0.2)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity: ONLY the icon, as requested */}
        <div className="flex items-center space-x-3">
          <div
            className="w-9 h-9 rounded-full border flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-pointer"
            style={{
              backgroundColor: 'rgba(15, 29, 62, 0.8)',
              borderColor: 'rgba(43, 120, 228, 0.35)',
              color: '#E6EDF8',
            }}
            title="Inicio"
            onClick={user?.role === 'admin' ? onOpenAdmin : onViewExperience}
          >
            <LogoR className="w-5 h-5 p-0.5" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {user && (
            <>
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
                        backgroundColor: '#102A45',
                        color: '#E6EDF8',
                        borderColor: '#2B78E4',
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
                        backgroundColor: '#102A45',
                        color: '#8EAFDD',
                        borderColor: '#1F4B78',
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
                  color: '#8EAFDD',
                }}
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
