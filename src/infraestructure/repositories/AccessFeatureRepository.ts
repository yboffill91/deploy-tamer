import { FeatureDTO } from '@/core/dto';
import { Feature } from '@/core/entities';
import { IFeatureRepository } from '@/core/interfaces/repositories/IAccessFeatureRepository';

export class FeatureManagementRepository implements IFeatureRepository {
  private readonly storageKey = 'features_management';

  private async getAllFromStorage(): Promise<FeatureDTO[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private async saveAllToStorage(features: FeatureDTO[]): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(features));
  }

  async findAll(): Promise<Feature[]> {
    const dtos = await this.getAllFromStorage();
    return dtos.map(Feature.fromPrimitives);
  }

  async findById(id: string): Promise<Feature | null> {
    const all = await this.getAllFromStorage();
    const dto = all.find((f) => f.id === id);
    return dto ? Feature.fromPrimitives(dto) : null;
  }

  async save(feature: Feature): Promise<void> {
    const all = await this.getAllFromStorage();
    const dto = feature.toPrimitives();
    const index = all.findIndex((f) => f.id === dto.id);
    if (index >= 0) all[index] = dto;
    else all.push(dto);
    await this.saveAllToStorage(all);
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAllFromStorage();
    await this.saveAllToStorage(all.filter((f) => f.id !== id));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}
