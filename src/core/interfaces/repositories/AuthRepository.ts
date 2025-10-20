import { User } from '@/core/entities';
import { Email, Password } from '@/core/value-objects';

export interface AuthRepository {
  getCurrentUser(): Promise<User | null>;
  login(email: Email, password: Password): Promise<User>;
  loginWithProvider(provider: 'google' | 'github' | 'facebook'): Promise<User>;
  logout(): Promise<void>;
  register(email: Email, password: Password): Promise<User>;
  resetPassword(email: Email): Promise<void>;
  confirmPasswordReset(oobCode: string, newPassword: Password): Promise<void>;
}
