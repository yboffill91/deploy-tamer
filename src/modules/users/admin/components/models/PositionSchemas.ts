import z from 'zod';

export const addPositionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
});

export type AddPositionFormType = z.infer<typeof addPositionSchema>;

export const editpositionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
});

export type EditPositionFormType = z.infer<typeof editpositionSchema>;
