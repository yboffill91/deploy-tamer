/* eslint-disable @typescript-eslint/no-explicit-any */
//  Este repositorio es para tratar el mock de usuarios y roles hasta que esté listo el backend

import { IManageUsersRepository, User } from '@/core';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from '@/lib/mocks/localStorage';
import { defaultUsers } from '@/lib/mocks/mockUsers';

const STORAGE_KEY = 'mock_users';

export class ManageUsersRepository implements IManageUsersRepository {
  private users: User[];

  constructor() {
    const saved = loadFromLocalStorage<any[]>(STORAGE_KEY);
    this.users = (saved ?? defaultUsers).map((u) => User.fromPrimitives(u));
    if (!saved) this.persist();
  }

  private persist() {
    saveToLocalStorage(
      STORAGE_KEY,
      this.users.map((u) => u.toPrimitives())
    );
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async getById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase();
    return (
      this.users.find((u) => u.email.getValue().toLowerCase() === normalized) ??
      null
    );
  }

  async create(user: User): Promise<User> {
    const exists = this.users.find((u) => u.id === user.id);
    if (exists) throw new Error(`User with id ${user.id} already exists`);
    this.users.push(user);
    this.persist();
    return user;
  }

  async update(user: User): Promise<User> {
    const idx = this.users.findIndex((u) => u.id === user.id);
    if (idx === -1) throw new Error(`User with id ${user.id} not found`);
    this.users[idx] = user;
    this.persist();
    return user;
  }

  async delete(email: string): Promise<boolean> {
    const prevLength = this.users.length;
    this.users = this.users.filter((u) => u.email.getValue() !== email);
    this.persist();
    return this.users.length < prevLength;
  }

  async updateRoles(id: string, roles: string[]): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const updated = user.setRoles(roles);
    this.users = this.users.map((u) => (u.id === id ? updated : u));
    this.persist();
    return updated;
  }
}
