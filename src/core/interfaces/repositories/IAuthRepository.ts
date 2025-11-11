import { UsersEntity } from '@/core/entities';


export interface IAuthRepository {
  login(email: string, password: string): Promise<UsersEntity>
  register(email: string, password: string): Promise<UsersEntity>
  loginWithProvider(provider: 'google' | 'github' | 'facebook'): Promise<UsersEntity>
  logout(): Promise<void>
  resetPassword(email: string): Promise<void>
  confirmPasswordReset(oobCode: string, newPassword: string): Promise<void>
  findUser(): UsersEntity
  getUserToken(): Promise<string | null>


}
