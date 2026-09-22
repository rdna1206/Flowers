import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, LogIn } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030206] text-[#E6EDF8] p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl border border-[#2B78E4]/30 bg-[#0A1226]/90 backdrop-blur-md shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#2B78E4]/20 border border-[#2B78E4]/40 flex items-center justify-center text-[#2B78E4] mb-4">
              <LogIn className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-[#E6EDF8]">Sesión finalizada</h2>
            <p className="text-sm text-[#8EAFDD] mb-6">
              Tu sesión se ha cerrado correctamente. Haz clic abajo para volver a la pantalla principal.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-[#2B78E4] hover:bg-[#3A86FF] text-white text-sm font-semibold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ir al inicio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
