import { z } from 'zod';

export const userEditSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    email: z.string().email('You must provide a valid email address'),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Must contain at least one number' }),
    rePassword: z.string(),
  })
  .refine((d) => d.password === d.rePassword, {
    message: 'Passwords do not match',
    path: ['rePassword'],
  });

export type userEditType = z.infer<typeof userEditSchema>;
