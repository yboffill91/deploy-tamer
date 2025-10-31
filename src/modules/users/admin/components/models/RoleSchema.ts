import z from 'zod';

export const RoleSchema = z.object({
  name: z.string().min(2, 'The role name is required'),
  feature: z.string().optional(),
  access: z.enum(['read', 'write', 'full']).optional(),
});

export type RoleFormData = z.infer<typeof RoleSchema>;
