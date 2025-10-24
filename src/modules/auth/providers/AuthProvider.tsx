"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  useLoginUser,
  useRegisterUser,
  useLoginUserWithProvider,
  useRegisterUserWithProvider,
  useLogoutUser,
} from "../hooks";
import type { User } from "@/core";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FirebaseUserMapper } from "@/infraestructure/dto";
import { authEvents, AuthEventType } from "@/application/events";
import { LocalStorageOTPRepository } from "@/infraestructure/repositories/OTPRepository";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithProvider: (
    provider: "google" | "github" | "facebook"
  ) => Promise<void>;
  registerWithProvider: (
    provider: "google" | "github" | "facebook"
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const otpRepository = new LocalStorageOTPRepository();

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

  // ? Listener de Firebase para la sesión actual
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const domainUser = FirebaseUserMapper.toDomain(firebaseUser);
        setUser(domainUser);
        authEvents.emit(AuthEventType.USER_LOGGED_IN, { user: domainUser });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const login = async (email: string, password: string) => {
    const user = await executeLogin(email, password);
    setUser(user);

    try {
      await otpRepository.generateOTP(user.email.getValue());
    } catch (error) {
      setError("Error generating OTP" + error);
    }
  };

  const register = async (email: string, password: string) => {
    const user = await executeRegister(email, password);
    setUser(user);
  };

  const loginWithProvider = async (
    provider: "google" | "github" | "facebook"
  ) => {
    const u = await executeLoginWithProvider(provider);
    setUser(u);
    try {
      await otpRepository.generateOTP(u.email.getValue());
    } catch (error) {
      setError("Error generating OTP" + error);
    }
  };

  const registerWithProvider = async (
    provider: "google" | "github" | "facebook"
  ) => {
    const user = await executeRegisterWithProvider(provider);
    setUser(user);
    try {
      await otpRepository.generateOTP(user.email.getValue());
    } catch (error) {
      setError("Error generating OTP" + error);
    }
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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
