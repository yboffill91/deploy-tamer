import { z } from "zod"

export const planSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  interval: z.enum(["month", "year"]),
  features: z.string().min(1, "At least one feature is required"),
  recommended: z.boolean(),
  requirementIds: z.array(z.string()),
})

export const requirementSchema = z.object({
  name: z.string().min(1, "Requirement name is required"),
  description: z.string().min(1, "Description is required"),
  required: z.boolean(),
  category: z.enum(["technical", "legal", "business", "other"]),
})

export const promotionSchema = z.object({
  name: z.string().min(1, "Promotion name is required"),
  code: z.string().min(1, "Promotion code is required"),
  discount: z.number().min(0, "Discount must be a positive number"),
  discountType: z.enum(["percentage", "fixed"]),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean(),
  usageLimit: z.number().min(1),
})

export type PlanFormValues = z.infer<typeof planSchema>
export type RequirementFormValues = z.infer<typeof requirementSchema>
export type PromotionFormValues = z.infer<typeof promotionSchema>
