'use client';
import { showToast } from '@/components/CustomToaster';
import { AuthError, UsersEntity } from '@/core';
import { FirebaseUserMapper } from '@/infrastructure/dto';
import {
  FirebaseAuthRepository,
  SessionRepository,
  SessionVerificationRepository,
} from '@/infrastructure/repositories';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Props {
  children: ReactNode;
}

interface AuthContextType {
  user: UsersEntity | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithProvider: (
    provider: 'google' | 'github' | 'facebook'
  ) => Promise<void>;

  logout: () => Promise<void>;
}

const ManageAuthAndToken = async (user: UsersEntity) => {
  const SESSION_REPOSITORY = new SessionVerificationRepository();
  const COOKIES_MANAGER_REPOSITORY = new SessionRepository();
  console.log(user);
  try {
    const userToken = await SESSION_REPOSITORY.sendEmailUuid(
      user.email!,
      user.token!
    );
    if (userToken === 'User Not Found') {
      showToast({
        type: 'error',
        message: 'Auth Error',
        description:
          'You cannot authenticate at this time. Please contact our support team.Error: User Disabled',
      });
      return `/sign_in`;
    } else if (!userToken) {
      throw new AuthError(
        'This error should not have occurred. Please try again, and if the problem persists, contact the Support team.'
      );
    } else {
      const { access_token, usuario } = JSON.parse(userToken);
      SESSION_REPOSITORY.getCode(access_token!);
      await COOKIES_MANAGER_REPOSITORY.createSessionCookie(
        access_token!,
        'TS_SESSION'
      );
      await COOKIES_MANAGER_REPOSITORY.createSessionCookie(usuario!, 'TS_USER');
      showToast({
        type: 'success',
        message: 'Success',
        description:
          'We have sent an email to your address with the OTP code for the second authentication factor.',
      });
      return '/verify_account';
    }
  } catch (error) {
    throw new Error(`Error getting user ${user.email} auth: ${error}`);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UsersEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const AuthRepository = new FirebaseAuthRepository();
  const CookiesRepository = new SessionRepository();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (FirebaseUser) => {
      if (FirebaseUser) {
        const fireBaseUSerDto = FirebaseUserMapper.toDTO(FirebaseUser);
        const domainUser = Object.assign(new UsersEntity(), fireBaseUSerDto);
        setUser(domainUser);
      } else {
        setUser(null);
        // setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        type: 'error',
        message: 'Error',
        description: error,
      });
    }
  }, [error]);

  const login = async (email: string, uid: string) => {
    try {
      const user = await AuthRepository.login(email, uid);
      try {
        setLoading(true);
        const ManageNextStep = await ManageAuthAndToken(user);
        router.push(ManageNextStep);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Error managing user auth next step'
        );
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error logging in User'
      );
    } finally {
      setLoading(false);
    }
  };
  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await AuthRepository.register(email, password);
      try {
        const ManageNextStep = await ManageAuthAndToken(user);
        router.push(ManageNextStep);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Error managing user auth next step'
        );
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error logging in User'
      );
    } finally {
      setLoading(false);
    }
  };
  const loginWithProvider = async (
    provider: 'google' | 'github' | 'facebook'
  ) => {
    try {
      setLoading(true);
      const user = await AuthRepository.loginWithProvider(provider);
      try {
        const ManageNextStep = await ManageAuthAndToken(user);
        router.push(ManageNextStep);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Error managing user auth next step'
        );
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error logging in User'
      );
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      setLoading(true);
      await AuthRepository.logout();
      showToast({
        message: 'Success',
        type: 'success',
        description: 'Session successfully closed',
      });

      CookiesRepository.deleteSessionCookie();

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
  if (!context)
    throw new AuthError('useAuth must be used within an AuthProvider');
  return context;
};
