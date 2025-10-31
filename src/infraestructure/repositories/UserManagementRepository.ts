import { IUserManagementRepository, User } from '@/core';
import { UserDTO } from '@/core/dto';

export class UserManagementRepository implements IUserManagementRepository {
  private readonly storageKey = 'users_management';

  private async getAllFromStorage(): Promise<UserDTO[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private async saveAllToStorage(users: UserDTO[]): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  async findAll(): Promise<User[]> {
    const dtos = await this.getAllFromStorage();
    return dtos.map(User.fromPrimitives);
  }

  async findById(id: string): Promise<User | null> {
    const users = await this.getAllFromStorage();
    const dto = users.find((u) => u.id === id);
    return dto ? User.fromPrimitives(dto) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.getAllFromStorage();
    const dto = users.find((u) => u.email === email);
    return dto ? User.fromPrimitives(dto) : null;
  }

  async save(user: User): Promise<void> {
    const users = await this.getAllFromStorage();
    const dto = user.toPrimitives();
    const index = users.findIndex((u) => u.id === dto.id);
    if (index >= 0) users[index] = dto;
    else users.push(dto);
    await this.saveAllToStorage(users);
  }

  async delete(id: string): Promise<void> {
    const users = await this.getAllFromStorage();
    await this.saveAllToStorage(users.filter((u) => u.id !== id));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}
