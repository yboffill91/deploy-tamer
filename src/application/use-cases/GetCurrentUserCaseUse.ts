import { AuthRepository, User } from '@/core';

export class GetCurrentUser {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<User | null> {
    return await this.authRepository.getCurrentUser();
  }
}
