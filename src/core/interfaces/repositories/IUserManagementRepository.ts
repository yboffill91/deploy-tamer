import { UserDTO } from '@/core/dto';
import { User } from '@/core/entities';

export interface IUserManagementRepository {
  findAll(): Promise<UserDTO[]>;
  findById(id: string): Promise<UserDTO | null>;
  findByEmail(email: string): Promise<UserDTO | null>;
  save(user: UserDTO | User): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}
