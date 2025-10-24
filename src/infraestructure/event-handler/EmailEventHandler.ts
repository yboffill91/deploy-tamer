// import { authEvents, AuthEventType } from '@/application/events';
// import { EmailFactory } from '@/application/services/EmailFactory';
// import { SendOnboardingEmailUseCase } from '@/application/use-cases';
// import { SmtpEmailRepository } from '@/infraestructure/repositories';

// const emailRepository = new SmtpEmailRepository();
// const emailFactory = new EmailFactory();

// const sendOnboardingEmail = new SendOnboardingEmailUseCase(
//   emailRepository,
//   emailFactory
// );

// // ? Así es como se suscribe a un evento
// authEvents.on(AuthEventType.USER_REGISTERED, async (payload) => {
//   try {
//     await sendOnboardingEmail.execute({
//       to: payload.user.email,
//       name: payload.user.name,
//     });
//     //   * Manejar un logger
//     // logger.log('Wellcome email sended to', payload.user.email);
//   } catch (err) {
//     //   * Manejar un logger
//     console.error(err);
//   }
// });
