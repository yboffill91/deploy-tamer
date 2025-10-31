import { User } from '@/core';

export interface IManageUsersRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
  updateRoles(id: string, roles: string[]): Promise<User | null>;
}
