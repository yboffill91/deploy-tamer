export class BrandDTO {
  readonly id?: number;
  readonly name?: string;
  readonly companyId?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly deletedAt?: string | null;
}

export class CreateBrandDTO {
  readonly name?: string;
  readonly companyId?: number;
}
