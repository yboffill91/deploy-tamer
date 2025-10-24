import { Email, EmailServiceRepository } from '@/core';

export class SendEmailUseCase {
  constructor(private readonly emailService: EmailServiceRepository) {}

  async execute(email: Email): Promise<void> {
    // * --> validaciones extras o logger para cuando te manden a hacerlo
    await this.emailService.send(email);
  }
}
