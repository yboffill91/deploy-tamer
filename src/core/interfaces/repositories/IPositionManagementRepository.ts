import { PositionDTO } from '@/core/dto';
import { Position } from '@/core/entities';

export interface IPositionManagementRepository {
  findAll(): Promise<Position[]>;
  findById(id: string): Promise<Position | null>;
  save(position: Position): Promise<void>;
  update(
    id: string,
    changes: Partial<Pick<PositionDTO, 'name' | 'description' | 'roleIds'>>
  ): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}
