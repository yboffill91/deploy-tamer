import { Feature } from '@/core/entities';
import { IFeatureRepository } from '@/core/interfaces/repositories/IAccessFeatureRepository';

export class FeatureMockService {
  constructor(private readonly repository: IFeatureRepository) {}

  async initialize(): Promise<void> {
    const existing = await this.repository.findAll();
    if (existing.length > 0) return;

    const defaults = [
      Feature.create({ id: crypto.randomUUID(), code: 'users', name: 'Users' }),
      Feature.create({
        id: crypto.randomUUID(),
        code: 'positions',
        name: 'Positions',
      }),
      Feature.create({ id: crypto.randomUUID(), code: 'roles', name: 'Roles' }),
      Feature.create({
        id: crypto.randomUUID(),
        code: 'reports',
        name: 'Reports',
      }),
      Feature.create({
        id: crypto.randomUUID(),
        code: 'settings',
        name: 'Settings',
      }),
    ];

    for (const f of defaults) {
      await this.repository.save(f);
    }

    console.log('✅ Features seeded into localStorage');
  }
}
