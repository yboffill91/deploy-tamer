// src/core/repositories/UserRepository.ts

import { User } from '@/core/entities';

export interface IUserManagementRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}
