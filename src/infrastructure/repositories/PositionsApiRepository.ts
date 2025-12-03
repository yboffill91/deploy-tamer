import { PositionsDTO, responsePositionsDTO } from '@/core/dto';
import { PositionsEntity } from '@/core/entities';
import { IRepository } from '@/core/interfaces';
import { positionsApi } from '@/lib/apis';
import { fetchHelper } from '@/lib/fetch-helper';
import { SessionRepository } from './SessionRepository';

export class PositionsApiRepository implements IRepository {
  private auth = async () => {
    const AuthRepo = new SessionRepository();
    const auth = await AuthRepo.autorization();
    return auth;
  };
  private commonHeader = {
    'Content-Type': 'application/json',
    accept: '*/*',
  };

  async findAll(): Promise<PositionsEntity[]> {
    try {
      const positions = await fetchHelper<responsePositionsDTO[]>(
        positionsApi,
        { headers: { Authorization: `Bearer ${await this.auth()}` } }
      );

      if (!positions) {
        throw new Error('Error getting positions');
      }

      return positions.map((p) => Object.assign(new PositionsEntity(), p));
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching positions'
      );
    }
  }

  async findById(id: string): Promise<PositionsEntity> {
    try {
      const position = await fetchHelper<responsePositionsDTO>(
        `${positionsApi}/${id}`,
        { headers: { Authorization: `Bearer ${await this.auth()}` } }
      );
      return Object.assign(new PositionsEntity(), position);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching position'
      );
    }
  }

  async create(data: PositionsDTO): Promise<PositionsEntity> {
    try {
      const created = await fetchHelper<PositionsEntity>(positionsApi, {
        method: 'POST',
        headers: {
          ...this.commonHeader,
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(data),
      });

      if (!created) throw new Error('Error creating position');

      return created;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error creating position'
      );
    }
  }
  async update(id: string, data: PositionsDTO): Promise<PositionsEntity> {
    try {
      const updated = await fetchHelper<PositionsEntity>(
        `${positionsApi}/${id}`,
        {
          method: 'PATCH',
          headers: {
            ...this.commonHeader,
            Authorization: `Bearer ${await this.auth()}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!updated) throw new Error('Error updating position');
      return updated;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error updating position'
      );
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await fetchHelper<void>(`${positionsApi}/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${await this.auth()}`,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error deleting position'
      );
    }
  }
}
