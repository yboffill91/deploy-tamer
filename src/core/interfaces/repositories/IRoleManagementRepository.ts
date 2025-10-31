import { Role } from '@/core/entities';

export interface IRoleManagementRepository {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findManyByIds(ids: string[]): Promise<Role[]>;
  save(role: Role): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}
