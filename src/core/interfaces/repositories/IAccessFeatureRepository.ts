import { Feature } from '@/core/entities';

export interface IFeatureRepository {
  findAll(): Promise<Feature[]>;
  save(feature: Feature): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}
