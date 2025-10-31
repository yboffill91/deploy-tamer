import { IRoleManagementRepository, Role, RoleDTO } from '@/core';

export class RoleManagementRepository implements IRoleManagementRepository {
  private readonly storageKey = 'roles_management';

  private async getAllFromStorage(): Promise<RoleDTO[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private async saveAllToStorage(roles: RoleDTO[]): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(roles));
  }

  async findAll(): Promise<Role[]> {
    const dtos = await this.getAllFromStorage();
    return dtos.map(Role.fromPrimitives);
  }

  async findById(id: string): Promise<Role | null> {
    const roles = await this.getAllFromStorage();
    const dto = roles.find((r) => r.id === id);
    return dto ? Role.fromPrimitives(dto) : null;
  }

  async findManyByIds(ids: string[]): Promise<Role[]> {
    const roles = await this.getAllFromStorage();
    return roles.filter((r) => ids.includes(r.id)).map(Role.fromPrimitives);
  }

  async save(role: Role): Promise<void> {
    const roles = await this.getAllFromStorage();
    const dto = role.toPrimitives();
    const index = roles.findIndex((r) => r.id === dto.id);
    if (index >= 0) roles[index] = dto;
    else roles.push(dto);
    await this.saveAllToStorage(roles);
  }

  async delete(id: string): Promise<void> {
    const roles = await this.getAllFromStorage();
    await this.saveAllToStorage(roles.filter((r) => r.id !== id));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}
