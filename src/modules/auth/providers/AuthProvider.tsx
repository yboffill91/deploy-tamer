'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  useLoginUser,
  useRegisterUser,
  useLoginUserWithProvider,
  useRegisterUserWithProvider,
  useLogoutUser,
} from '../hooks';
import type { User } from '@/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseUserMapper } from '@/infraestructure/dto';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithProvider: (
    provider: 'google' | 'github' | 'facebook'
  ) => Promise<void>;
  registerWithProvider: (
    provider: 'google' | 'github' | 'facebook'
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Custom hooks de casos de uso
  const { executeLogin, error: loginError } = useLoginUser();
  const { executeRegister, error: registerError } = useRegisterUser();
  const { executeLoginWithProvider, error: loginProviderError } =
    useLoginUserWithProvider();
  const { executeRegisterWithProvider, error: registerProviderError } =
    useRegisterUserWithProvider();
  const { executeLogout, error: logoutError } = useLogoutUser();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listener de Firebase para la sesión actual
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(FirebaseUserMapper.toDomain(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Manejo de errores combinados de todos los hooks
  useEffect(() => {
    const combinedError =
      loginError ||
      registerError ||
      loginProviderError ||
      registerProviderError ||
      logoutError ||
      null;

    setError(combinedError);
  }, [
    loginError,
    registerError,
    loginProviderError,
    registerProviderError,
    logoutError,
  ]);

  // Funciones expuestas
  const login = async (email: string, password: string) => {
    const u = await executeLogin(email, password);
    setUser(u);
  };

  const register = async (email: string, password: string) => {
    const u = await executeRegister(email, password);
    setUser(u);
  };

  const loginWithProvider = async (
    provider: 'google' | 'github' | 'facebook'
  ) => {
    const u = await executeLoginWithProvider(provider);
    setUser(u);
  };

  const registerWithProvider = async (
    provider: 'google' | 'github' | 'facebook'
  ) => {
    const u = await executeRegisterWithProvider(provider);
    setUser(u);
  };

  const logout = async () => {
    await executeLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        loginWithProvider,
        registerWithProvider,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
