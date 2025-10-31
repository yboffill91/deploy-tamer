// * Este service sería un seed de la base de datos, solo sirve mientras utilicemos datos desde un mock en localstorage

import { Position, PositionName } from '@/core';
import { PositionManagementRepository } from '@/infraestructure/repositories/PositionManagementRepository';
import { v4 as uuid } from 'uuid';

export class PositionMockService {
  constructor(
    private readonly repository = new PositionManagementRepository()
  ) {}

  private readonly basePositions = [
    { name: 'CTO', description: 'Chief Technology Officer' },
    { name: 'Head of SEO', description: 'SEO Department Lead' },
    {
      name: 'SEO Specialist',
      description: 'Responsible for on-page and off-page optimizations',
    },
    {
      name: 'Content Strategist',
      description: 'Develops content plans aligned with SEO goals',
    },
    {
      name: 'Link Building Specialist',
      description: 'Manages link acquisition and partnerships',
    },
    {
      name: 'Customer Success Manager',
      description: 'Ensures client satisfaction and retention',
    },
  ];

  async initialize(): Promise<void> {
    const existing = await this.repository.findAll();
    const existingNames = existing.map((p) => p.name.getValue().toLowerCase());

    const toCreate = this.basePositions.filter(
      (pos) => !existingNames.includes(pos.name.toLowerCase())
    );

    for (const data of toCreate) {
      const position = new Position(
        uuid(),
        new PositionName(data.name),
        data.description
      );
      await this.repository.save(position);
    }

    if (toCreate.length > 0) {
      console.info(
        `[PositionMockService] Added ${toCreate.length} new positions.`
      );
    } else {
      console.info(
        '[PositionMockService] No new positions were added — all exist.'
      );
    }
  }
}
