import { AuthError, AuthRepository, Password } from '@/core';

export class ResetPasswordConfirm {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(oobCode: string, newPassword: string): Promise<void> {
    try {
      const passwordVO = new Password(newPassword);
      await this.authRepository.confirmPasswordReset(oobCode, passwordVO);
    } catch (error: any) {
      if (error instanceof AuthError) throw error;
      throw new AuthError(
        error.message || 'Error confirmando el restablecimiento'
      );
    }
  }
}
