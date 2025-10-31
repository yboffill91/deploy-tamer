import { FeatureDTO } from '@/core/dto';

export class Feature {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly code: string
  ) {}

  static create(params: { id: string; name: string; code: string }) {
    return new Feature(params.id, params.name, params.code);
  }

  toPrimitives(): FeatureDTO {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
    };
  }

  static fromPrimitives(dto: FeatureDTO): Feature {
    return new Feature(dto.id, dto.name, dto.code);
  }
}
