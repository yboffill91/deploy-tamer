// import { Email, EmailAddress, EmailContent } from '@/core';

// export class EmailFactory {
//   createWelcomeEmail(emailTo: string, name?: string): Email {
//     const subject = '🎉 Bienvenido a la plataforma';
//     const content = `
//       <div style="font-family: Arial, sans-serif; padding: 24px;">
//         <h2>¡Hola ${name ?? 'allí'}!</h2>
//         <p>Gracias por unirte a nuestra comunidad. Esperamos que disfrutes de la experiencia.</p>
//         <p>💡 Si tienes dudas, puedes contactarnos en cualquier momento.</p>
//         <p style="margin-top: 20px;">— El equipo de soporte</p>
//       </div>
//     `;

//     return new Email(
//       EmailAddress.create(emailTo),
//       subject,
//       EmailContent.create(content)
//     );
//   }
// }
