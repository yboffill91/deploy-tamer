import { User } from '@/core';
import { UserDTO } from '@/core/dto';
import { IUserManagementRepository } from '@/core/interfaces';

export class UserManagementRepository implements IUserManagementRepository {
  private readonly STORAGE_KEY = 'users';

  async findAll(): Promise<UserDTO[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as UserDTO[];
  }

  async findById(id: string): Promise<UserDTO | null> {
    const users = await this.findAll();
    return users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const users = await this.findAll();
    return users.find((u) => u.email === email) ?? null;
  }

  async save(user: User | UserDTO): Promise<void> {
    let dto: UserDTO;

    if ('toPrimitives' in user) {
      dto = user.toPrimitives();
    } else {
      dto = user;
    }

    const users = await this.findAll();
    const index = users.findIndex((u) => u.id === dto.id);

    if (index >= 0) users[index] = dto;
    else users.push(dto);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  async delete(id: string): Promise<void> {
    const users = await this.findAll();
    const filtered = users.filter((u) => u.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
