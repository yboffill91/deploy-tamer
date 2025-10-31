'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Email, Password, User } from '@/core';
import {
  FirebaseAuthRepository,
  SessionRepository,
} from '@/infraestructure/repositories';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { FirebaseUserMapper } from '@/infraestructure/dto';
import { LocalStorageOTPRepository } from '@/infraestructure/repositories/OTPRepository';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithProvider: (
    provider: 'google' | 'github' | 'facebook'
  ) => Promise<void>;

  logout: () => Promise<void>;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const AuthRepository = new FirebaseAuthRepository();
  const OtpRepository = new LocalStorageOTPRepository();
  const ManageSessionRepository = new SessionRepository();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (FirebaseUser) => {
      if (FirebaseUser) {
        const domainUser = FirebaseUserMapper.toDomain(FirebaseUser);
        setUser(domainUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const generateOtp = async (user: User) => {
    try {
      await OtpRepository.generateOTP(user.email.getValue());
    } catch (error) {
      setError('Error generating OTP' + error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const emailVO = new Email(email);
      const passwordVO = new Password(password);
      const user = await AuthRepository.login(emailVO, passwordVO);
      setUser(user);
      ManageSessionRepository.createSessionCookie(user.id);
      await generateOtp(user);
      router.push('/verify_account');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Error logging in User: ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const emailVO = new Email(email);
      const passwordVO = new Password(password);
      const user = await AuthRepository.register(emailVO, passwordVO);
      setUser(user);
      ManageSessionRepository.createSessionCookie(user.id);

      await generateOtp(user);
      router.push('/verify_account');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Error registring User: ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  const loginWithProvider = async (
    provider: 'google' | 'github' | 'facebook'
  ) => {
    setLoading(true);
    try {
      const user = await AuthRepository.loginWithProvider(provider);
      setUser(user);
      ManageSessionRepository.createSessionCookie(user.id);

      await generateOtp(user);
      router.push('/verify_account');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Error logging in User: ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthRepository.logout();

      ManageSessionRepository.deleteSessionCookie();

      setUser(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Error logging out User: ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  // --> Return
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        loginWithProvider,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
