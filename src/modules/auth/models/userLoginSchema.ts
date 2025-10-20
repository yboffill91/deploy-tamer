import { z } from 'zod';

export const userLoginSchema = z.object({
  email: z.string().email('You must provide a valid email address'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Must contain at least one number' }),
});

export type userLoginType = z.infer<typeof userLoginSchema>;
