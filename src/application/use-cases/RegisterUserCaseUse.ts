import { AuthError, AuthRepository, Email, Password, User } from '@/core';

export class RegisterUser {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    try {
      const emailVO = new Email(email);
      const passwordVO = new Password(password);
      const user = await this.authRepository.register(emailVO, passwordVO);
      return user;
    } catch (error: any) {
      if (error instanceof AuthError) throw error;
      throw new AuthError(error.message || 'Error registering user');
    }
  }
}
