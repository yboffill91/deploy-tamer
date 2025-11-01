import z from 'zod';

export const UserEditSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  positionId: z.string().min(1, 'Position is required'),
});

export type UserEditFormType = z.infer<typeof UserEditSchema>;

export const UserAddSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  positionId: z.string().min(1, 'Select a position'),
});

export type UserAddFormType = z.infer<typeof UserAddSchema>;
