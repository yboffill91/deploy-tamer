import { AuthRepository } from '@/core';

export class LogoutUser {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
