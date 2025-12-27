export class PlanEntity {
  readonly id?: string;
  readonly name?: string;
  readonly price?: number;
  readonly interval?: 'month' | 'year';
  readonly features?: string[];
  readonly recommended?: boolean;
  readonly toolId?: string;
  readonly requirementIds: string[];
}

export class RequirementEntity {
  readonly id?: string;
  readonly name?: string;
  readonly description?: string;
  readonly required?: boolean;
  readonly category?: 'technical' | 'legal' | 'business' | 'other';
}

export class PromotionEntity {
  readonly id?: string;
  readonly name?: string;
  readonly code?: string;
  readonly discount?: number;
  readonly discountType?: 'percentage' | 'fixed';
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly isActive?: boolean;
  readonly usageLimit?: number;
  readonly usageCount?: number;
}

export class ToolEntity {
  readonly id?: string;
  readonly name?: string;
}
