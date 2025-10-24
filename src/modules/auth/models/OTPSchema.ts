import z from 'zod';

export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/[0-9]/, { message: 'OTP Only can contain number' })
    .max(6, 'OTP is a 6 numbers code sended via email'),
});

export type otpType = z.infer<typeof otpSchema>;
