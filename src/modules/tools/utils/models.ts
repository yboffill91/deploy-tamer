import z from 'zod';

export const KeywordResearchSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters wide'),
  searchVolume: z
    .string()
    .min(0, 'Search volume must be at positive')
    .regex(/^\d+$/, { message: 'Positive volume' }),

  positiveKeywords: z
    .array(z.string())
    .refine((list) => new Set(list).size === list.length, {
      message: 'Positive keywords has duplicates',
    }),

  negativeKeywords: z
    .array(z.string())
    .refine((list) => new Set(list).size === list.length, {
      message: 'Negative keywords has duplicates',
    }),

  city: z
    .array(z.string())
    .refine((list) => new Set(list).size === list.length, {
      message: 'Cities has duplicates',
    }),

  allCitys: z.boolean(),

  region: z.array(z.string()).optional(),

  requestLanguage: z.string(),

  brand: z
    .array(z.string())
    .refine((list) => new Set(list).size === list.length, {
      message: 'Brand has duplicates',
    }),

  type: z.enum(['INFORMATIONAL', 'TRANSACTIONAL']).default('TRANSACTIONAL'),

  companyId: z.number(),
});

export type KeywordResearchFormType = z.infer<typeof KeywordResearchSchema>;

export type KeywordResearchFormInput = z.input<typeof KeywordResearchSchema>;
