// import { SendOnboardingEmailDTO } from '@/application/dto';
// import { EmailServiceRepository } from '@/core';
// import { EmailFactory } from '../services/EmailFactory';

// export class SendOnboardingEmailUseCase {
//   constructor(
//     private readonly emailRepository: EmailServiceRepository,
//     private readonly emailFactory: EmailFactory
//   ) {}

//   async execute({ to, name }: SendOnboardingEmailDTO): Promise<void> {
//     const email = this.emailFactory.createWelcomeEmail(to, name);
//     await this.emailRepository.send(email);
//   }
// }
