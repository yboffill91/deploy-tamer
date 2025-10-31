import { IPositionManagementRepository, Position } from '@/core';
import { PositionDTO } from '@/core/dto';

type UpdatePositionParams = Partial<
  Pick<PositionDTO, 'name' | 'description' | 'roleIds'>
>;

export class PositionManagementRepository
  implements IPositionManagementRepository
{
  private readonly storageKey = 'positions_management';

  private async getAllFromStorage(): Promise<PositionDTO[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private async saveAllToStorage(positions: PositionDTO[]): Promise<void> {
    const unique = positions.reduce<PositionDTO[]>((acc, curr) => {
      if (!acc.some((p) => p.id === curr.id)) {
        acc.push(curr);
      } else {
        const index = acc.findIndex((p) => p.id === curr.id);
        acc[index] = curr;
      }
      return acc;
    }, []);

    localStorage.setItem(this.storageKey, JSON.stringify(unique));
  }

  async findAll(): Promise<Position[]> {
    const dtos = await this.getAllFromStorage();
    return dtos.map(Position.fromPrimitives);
  }

  async findById(id: string): Promise<Position | null> {
    const dtos = await this.getAllFromStorage();
    const dto = dtos.find((p) => p.id === id);
    return dto ? Position.fromPrimitives(dto) : null;
  }

  async save(position: Position): Promise<void> {
    const positions = await this.getAllFromStorage();
    const dto = position.toPrimitives();
    const index = positions.findIndex((p) => p.id === dto.id);
    if (index >= 0) positions[index] = dto;
    else positions.push(dto);
    await this.saveAllToStorage(positions);
  }

  async update(id: string, changes: UpdatePositionParams): Promise<void> {
    const positions = await this.getAllFromStorage();
    const idx = positions.findIndex((p) => p.id === id);

    if (idx === -1) {
      throw new Error(`Position with id "${id}" not found`);
    }

    const existing = positions[idx];

    const updated: PositionDTO = {
      ...existing,
      ...changes,
      id: existing.id,
      roleIds: changes.roleIds ?? existing.roleIds ?? [],
    };

    const filtered = positions.filter((p) => p.id !== id);
    filtered.push(updated);

    await this.saveAllToStorage(filtered);
  }

  async delete(id: string): Promise<void> {
    const positions = await this.getAllFromStorage();
    await this.saveAllToStorage(positions.filter((p) => p.id !== id));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}
