import { IManageUserRepository, User, UserDTO, UserRole } from '@/core';
import { mockUsers } from '@/lib/mocks/Users.Mock';

const STORAGE_KEY = 'app_users_mock';

export class InMemoryUserRepository implements IManageUserRepository {
  private users: User[] = [];

  constructor() {
    this.load();
  }

  private load() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: UserDTO[] = JSON.parse(stored);
      this.users = data.map(User.fromPrimitives);
    } else {
      this.users = mockUsers;
      this.save();
    }
  }

  private save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.users.map((u) => u.toPrimitives()))
    );
  }

  async getAll(): Promise<User[]> {
    return [...this.users];
  }

  async getById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async add(user: User): Promise<void> {
    const exists = this.users.some((u) => u.id === user.id);
    if (!exists) {
      this.users.push(user);
      this.save();
    }
  }

  async updateRole(userId: string, newRole: UserRole): Promise<void> {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      const updated = this.users[idx].updateRole(newRole);
      this.users[idx] = updated;
      this.save();
    }
  }

  async saveAll(users: User[]): Promise<void> {
    this.users = users;
    this.save();
  }

  async clear(): Promise<void> {
    this.users = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}
