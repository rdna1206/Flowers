import React, { useState, useEffect } from 'react';
import { api, getStoredToken } from './lib/api';
import type {
  UserSummary,
  UserExperienceData,
  UserResponse,
} from './types';
import { BackgroundVideo } from './components/BackgroundVideo';
import { PetalBackground } from './components/PetalBackground';
import { MainHomePageBackground } from './components/MainHomePageBackground';
import { HeaderNav } from './components/HeaderNav';
import { LoginView } from './components/LoginView';
import { ReadingExperience } from './components/ReadingExperience';
import { OrganicFlowerCreation } from './components/OrganicFlowerCreation';
import { UserResponseView } from './components/UserResponseView';
import { AdminDashboard } from './components/AdminDashboard';
import { IsaiasChatView } from './components/IsaiasChatView';

type AppStep =
  | 'login'
  | 'reading'
  | 'flower-formation'
  | 'flower-result'
  | 'response'
  | 'chat'
  | 'admin';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
  const [experience, setExperience] = useState<UserExperienceData | null>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>('login');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initialize session on load
  useEffect(() => {
    const initSession = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const user = await api.getMe();
        setCurrentUser(user);

        if (user.role === 'admin') {
          // Ronald lands directly on the Admin Dashboard
          setCurrentStep('admin');
        } else {
          const exp = await api.getExperience();
          setExperience(exp);
          setCurrentStep('flower-formation');
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        await api.logout();
        setCurrentUser(null);
        setExperience(null);
        setCurrentStep('login');
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const handleLogin = async (username: string, passwordPlain: string) => {
    setIsLoginLoading(true);
    setLoginError(null);
    try {
      const res = await api.login(username, passwordPlain);
      setCurrentUser(res.user);

      if (res.user.role === 'admin') {
        // Ronald: Direct entry to the Admin Dashboard
        setCurrentStep('admin');
      } else {
        // Normal User: Pure visual bouquet first, then optional personal message from admin, then response
        const exp = await api.getExperience();
        setExperience(exp);
        setCurrentStep('flower-formation');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Usuario o contraseña incorrectos. Verifica tus datos.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setExperience(null);
    setCurrentStep('login');
  };

  const handleSubmitResponse = async (text: string): Promise<UserResponse | null> => {
    const res = await api.submitResponse(text);
    if (experience) {
      setExperience({ ...experience, userResponse: res.userResponse });
    }
    return res.userResponse;
  };

  // Preview experience for Ronald
  const handlePreviewAsUser = async (username: string) => {
    try {
      setIsLoading(true);
      const exp = await api.getAdminUserExperience(username);
      setExperience(exp);
      setCurrentStep('flower-formation');
    } catch (err: any) {
      alert(err?.message || 'No se pudo cargar la experiencia del usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminViewOwnExperience = async () => {
    try {
      setIsLoading(true);
      const exp = await api.getExperience();
      setExperience(exp);
      setCurrentStep('flower-formation');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine current user theme (Dark Mode is now permanently fixed & non-modifiable)
  const userTheme = experience?.theme;
  const handleProceedToReading = async () => {
    try {
      const latestExp = await api.getExperience();
      if (latestExp) {
        setExperience(latestExp);
      }
    } catch {
      // non-blocking fallback
    }
    setCurrentStep('reading');
  };

  const isNeutralView = currentStep === 'login' || currentStep === 'admin';
  const isDarkTheme = true;

  const pageBg = 'transparent';
  const userTextColor = '#E6EDF8';

  return (
    <div
      className="min-h-screen flex flex-col relative w-full max-w-full overflow-x-hidden selection:bg-[#E8DED1] transition-colors duration-700 bg-[#030206] text-[#E6EDF8]"
    >
      {/* EXCLUSIVE MAIN HOME SCREEN BACKGROUND vs REGULAR APP BACKGROUNDS */}
      {currentStep === 'login' ? (
        <MainHomePageBackground />
      ) : (
        <>
          {/* Dynamic Space Background Video (Vertical/Cell vs Horizontal/Desktop) */}
          <BackgroundVideo />

          {/* Delicate floating background petals */}
          <PetalBackground
            petalColors={!isNeutralView ? userTheme?.petalColors : undefined}
            ambientGlow={!isNeutralView ? userTheme?.ambientGlow : undefined}
            backgroundColor={pageBg}
          />
        </>
      )}

      {/* Header bar: Icon only brand, role controls & logout */}
      <HeaderNav
        user={currentUser}
        currentView={currentStep}
        isDarkTheme={isDarkTheme}
        onLogout={handleLogout}
        onOpenAdmin={() => setCurrentStep('admin')}
        onViewExperience={handleAdminViewOwnExperience}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 w-full max-w-full min-w-0 overflow-x-hidden">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-8 h-8 rounded-full border-2 border-[#E8DFC8] border-t-[#C29B38] animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#8C847B]">
              Cargando espacio personal...
            </p>
          </div>
        ) : (
          <>
            {/* Step 1: Login (Neutral, without user lists) */}
            {currentStep === 'login' && (
              <LoginView
                onLogin={handleLogin}
                isLoading={isLoginLoading}
                errorMessage={loginError}
                isDarkTheme={isDarkTheme}
              />
            )}

            {/* Step: Admin Dashboard (Ronald Only) */}
            {currentStep === 'admin' && currentUser?.role === 'admin' && (
              <AdminDashboard
                onSelectUserToPreview={handlePreviewAsUser}
                onViewMyExperience={handleAdminViewOwnExperience}
                isDarkTheme={isDarkTheme}
              />
            )}

            {/* Step 2: MI TEXTO (Only Ronald's exact text) */}
            {currentStep === 'reading' && experience && (
              <ReadingExperience
                experience={experience}
                onProceedToFlowers={() => setCurrentStep('flower-result')}
                onProceedToResponse={() => setCurrentStep('response')}
              />
            )}

            {/* Step 3: FORMACIÓN VISUAL DE LA FLOR (100% Visual, Progressive, Organic, ZERO WORDS) */}
            {currentStep === 'flower-formation' && experience && (
              <OrganicFlowerCreation
                experience={experience}
                mode="formation"
                onProceedToReading={handleProceedToReading}
                onProceedToResponse={() => setCurrentStep('response')}
                onProceedToChat={() => setCurrentStep('chat')}
                onBackToReading={handleProceedToReading}
                onReplayFormation={() => setCurrentStep('flower-formation')}
              />
            )}

            {/* Step 4: RESULTADO VISUAL (Living flower in contemplation, no cards, direct to "Mi respuesta") */}
            {currentStep === 'flower-result' && experience && (
              <OrganicFlowerCreation
                experience={experience}
                mode="result"
                onProceedToReading={handleProceedToReading}
                onProceedToResponse={() => setCurrentStep('response')}
                onProceedToChat={() => setCurrentStep('chat')}
                onBackToReading={handleProceedToReading}
                onReplayFormation={() => setCurrentStep('flower-formation')}
              />
            )}

            {/* Step 5: "Mi respuesta" (Strictly named "Mi respuesta", saved to Ronald only) */}
            {currentStep === 'response' && experience && (
              <UserResponseView
                experience={experience}
                onSubmitResponse={handleSubmitResponse}
                onBackToFlowers={() => setCurrentStep('flower-result')}
                onBackToReading={() => setCurrentStep('reading')}
                onProceedToChat={() => setCurrentStep('chat')}
              />
            )}

            {/* Step 6: CHAT EN TIEMPO REAL (Exclusivo de Isaías con Ronald, bidireccional y persistente) */}
            {currentStep === 'chat' && experience && (
              <IsaiasChatView
                experience={experience}
                onBackToFlowers={() => setCurrentStep('flower-result')}
                onBackToReading={handleProceedToReading}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
