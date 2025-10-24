import { SmtpEmailRepository } from '@/infraestructure/repositories';
import { SendEmailUseCase } from '@/application/use-cases';

const emailRepository = new SmtpEmailRepository();
export const sendEmail = new SendEmailUseCase(emailRepository);
