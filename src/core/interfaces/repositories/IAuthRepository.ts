import { User } from '@/core/entities';
import { Email, Password } from '@/core/value-objects';
import { UserProfileDTO } from '@/infraestructure/dto';

export interface IAuthRepository {
  getCurrentUser(): Promise<User | null>;
  login(email: Email, password: Password): Promise<User>;
  loginWithProvider(provider: 'google' | 'github' | 'facebook'): Promise<User>;
  logout(): Promise<void>;
  register(email: Email, password: Password): Promise<User>;
  resetPassword(email: Email): Promise<void>;
  confirmPasswordReset(oobCode: string, newPassword: string): Promise<void>;
  register(email: Email, password: Password): Promise<User>;
  updateUser(data: UserProfileDTO): Promise<User>;
}
