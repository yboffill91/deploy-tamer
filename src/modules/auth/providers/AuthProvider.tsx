"use client";

import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthError, UsersEntity } from "@/core";
import {
  FirebaseAuthRepository,
  SessionRepository,
  SessionVerificationRepository,
} from "@/infraestructure/repositories";
import { FirebaseUserMapper } from "@/infraestructure/dto";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/CustomToaster";

interface AuthContextType {
  user: UsersEntity | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithProvider: (
    provider: "google" | "github" | "facebook"
  ) => Promise<void>;

  logout: () => Promise<void>;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UsersEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const AuthRepository = new FirebaseAuthRepository();
  const OtpRepository = new SessionVerificationRepository();
  const CookiesManagerRepository = new SessionRepository();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (FirebaseUser) => {
      if (FirebaseUser) {
        const fireBaseUSerDto = FirebaseUserMapper.toDTO(FirebaseUser);
        const domainUser = Object.assign(new UsersEntity(), fireBaseUSerDto);
        setUser(domainUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const user = await AuthRepository.login(email, password);
      const userToken = await OtpRepository.sendEmailUuid(
        user.email!,
        user.uid!
      );

      OtpRepository.getCode(userToken!);
      console.log(userToken);
      setUser(user);

      CookiesManagerRepository.createSessionCookie(userToken!);
      showToast({
        message: "Success",
        type: "success",
        description:
          "We have sent an email to your address with the OTP code for the second authentication factor.",
      });
      router.push("/verify_account");
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
      const user = await AuthRepository.register(email, password);
      setUser(user);
      const userToken = await OtpRepository.sendEmailUuid(
        user.email!,
        user.uid!
      );

      OtpRepository.getCode(userToken!);

      showToast({
        message: "Success",
        type: "success",
        description:
          "We have sent an email to your address with the OTP code for the second authentication factor.",
      });

      CookiesManagerRepository.createSessionCookie(userToken!);

      router.push("/verify_account");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Error registering User: ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  const loginWithProvider = async (
    provider: "google" | "github" | "facebook"
  ) => {
    setLoading(true);
    try {
      const user = await AuthRepository.loginWithProvider(provider);
      setUser(user);
      const userToken = await OtpRepository.sendEmailUuid(
        user.email!,
        user.uid!
      );

      OtpRepository.getCode(userToken!);

      showToast({
        message: "Success",
        type: "success",
        description:
          "We have sent an email to your address with the OTP code for the second authentication factor.",
      });

      CookiesManagerRepository.createSessionCookie(userToken!);

      router.push("/verify_account");
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
      showToast({
        message: "Success",
        type: "success",
        description: "Session successfully closed",
      });

      CookiesManagerRepository.deleteSessionCookie();

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
    throw new AuthError("useAuth must be used within an AuthProvider");
  return context;
};
