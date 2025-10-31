import { User } from '@/core/entities';
// import { UserRole } from '@/core/value-objects';

export interface IManageUserRepository {
  getAll(): Promise<User[]>;

  getById(id: string): Promise<User | null>;

  add(user: User): Promise<void>;

  // updateRole(userId: string, newRole: UserRole): Promise<void>;

  saveAll(users: User[]): Promise<void>;

  clear(): Promise<void>;
}
