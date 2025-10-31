import * as z from 'zod';

export const userRoleSchema = z.object({
  role: z.enum(['user', 'customer', 'admin']),
});

export type UserRoleForm = z.infer<typeof userRoleSchema>;
