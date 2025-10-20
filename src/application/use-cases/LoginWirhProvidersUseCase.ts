import { AuthRepository, User } from '@/core';

export class LoginWithProvider {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(provider: 'google' | 'github'): Promise<User> {
    if (!this.authRepo.loginWithProvider) {
      throw new Error('This repository does not support provider login');
    }
    return await this.authRepo.loginWithProvider(provider);
  }
}
