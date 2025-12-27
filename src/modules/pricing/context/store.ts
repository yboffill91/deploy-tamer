import { create } from "zustand"
import { PlanEntity, PromotionEntity, RequirementEntity } from "../utils"

type PricingStore = {
  plans: PlanEntity[]
  requirements: RequirementEntity[]
  promotions: PromotionEntity[]

  addPlan: (plan: PlanEntity) => void
  updatePlan: (plan: PlanEntity) => void
  deletePlan: (id: string) => void

  addRequirement: (requirement: RequirementEntity) => void
  updateRequirement: (requirement: RequirementEntity) => void
  deleteRequirement: (id: string) => void

  addPromotion: (promotion: PromotionEntity) => void
  updatePromotion: (promotion: PromotionEntity) => void
  deletePromotion: (id: string) => void
}

export const usePricingStore = create<PricingStore>((set) => ({
  plans: [],
  requirements: [],
  promotions: [],

  addPlan: (plan) =>
    set((state) => ({
      plans: [...state.plans, { ...plan, id: Date.now().toString() }],
    })),
  updatePlan: (plan) =>
    set((state) => ({
      plans: state.plans.map((p) => (p.id === plan.id ? plan : p)),
    })),
  deletePlan: (id) =>
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
    })),

  addRequirement: (requirement) =>
    set((state) => ({
      requirements: [...state.requirements, { ...requirement, id: Date.now().toString() }],
    })),
  updateRequirement: (requirement) =>
    set((state) => ({
      requirements: state.requirements.map((r) => (r.id === requirement.id ? requirement : r)),
    })),
  deleteRequirement: (id) =>
    set((state) => ({
      requirements: state.requirements.filter((r) => r.id !== id),
    })),

  addPromotion: (promotion) =>
    set((state) => ({
      promotions: [...state.promotions, { ...promotion, id: Date.now().toString(), usageCount: 0 }],
    })),
  updatePromotion: (promotion) =>
    set((state) => ({
      promotions: state.promotions.map((p) => (p.id === promotion.id ? promotion : p)),
    })),
  deletePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.filter((p) => p.id !== id),
    })),
}))
