import { AuthError, AuthRepository, User } from '@/core';

export class RegisterUserWithProvider {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(provider: 'google' | 'github' | 'facebook'): Promise<User> {
    try {
      const user = await this.authRepository.loginWithProvider(provider);
      return user;
    } catch (error: any) {
      if (error instanceof AuthError) throw error;
      throw new AuthError(error.message || 'Error registering with provider');
    }
  }
}
