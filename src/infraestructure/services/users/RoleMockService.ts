import { v4 as uuid } from 'uuid';
import { Role } from '@/core';
import { IRoleManagementRepository } from '@/core';

export class RoleMockService {
  constructor(private readonly repository: IRoleManagementRepository) {}

  async initialize(): Promise<void> {
    const existing = await this.repository.findAll();
    if (existing.length > 0) return;

    const mockRoles = [
      Role.create({
        id: uuid(),
        name: 'Admin',
        permissions: [],
      }),
      Role.create({
        id: uuid(),
        name: 'SEO Specialist',
        permissions: [],
      }),
      Role.create({
        id: uuid(),
        name: 'Content Manager',
        permissions: [],
      }),
      Role.create({
        id: uuid(),
        name: 'Customer Success',
        permissions: [],
      }),
    ];

    for (const role of mockRoles) {
      await this.repository.save(role);
    }
  }
}
