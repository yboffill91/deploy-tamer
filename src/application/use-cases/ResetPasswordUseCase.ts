import { AuthRepository, Email } from '@/core';

export class ResetPassword {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: Email): Promise<void> {
    await this.authRepository.resetPassword(email);
  }
}
