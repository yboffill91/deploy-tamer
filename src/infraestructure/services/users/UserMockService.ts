import { UserDTO } from '@/core/dto';
import { IUserManagementRepository } from '@/core/interfaces';

export class UserSeedService {
  constructor(private readonly repository: IUserManagementRepository) {}

  async seed(): Promise<void> {
    const existing = await this.repository.findAll();
    if (existing.length > 0) return;

    const mockUsers: UserDTO[] = [
      {
        id: crypto.randomUUID(),
        name: 'Carlos Méndez',
        email: 'carlos.mendez@example.com',
        photoUrl: '/avatars/carlos.png',
        positionId: '',
      },
      {
        id: crypto.randomUUID(),
        name: 'María Torres',
        email: 'maria.torres@example.com',
        photoUrl: '/avatars/maria.png',
        positionId: '',
      },
      {
        id: crypto.randomUUID(),
        name: 'Lucía Gómez',
        email: 'lucia.gomez@example.com',
        photoUrl: '/avatars/lucia.png',
        positionId: '',
      },
    ];

    for (const user of mockUsers) {
      await this.repository.save(user);
    }
  }

  async reset(): Promise<void> {
    await this.repository.clear();
    await this.seed();
  }
}
