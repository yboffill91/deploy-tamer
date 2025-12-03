import {
  requestCreateTeamDTO,
  responseTeamsDTO,
  responseUpdateTeamDTO,
} from '@/core/dto';
import { TeamsEntity } from '@/core/entities';
import { IRepository } from '@/core/interfaces';
import { teamsApi } from '@/lib/apis';
import { fetchHelper } from '@/lib/fetch-helper';
import { SessionRepository } from './SessionRepository';
export class TeamsApiRepository implements IRepository {
  private auth = async () => {
    const AuthRepo = new SessionRepository();
    const auth = await AuthRepo.autorization();
    return auth;
  };

  private CommonHeaders = {
    'Content-Type': 'application/json',
    accept: '*/*',
  };

  async findAll(): Promise<TeamsEntity[]> {
    try {
      const response = await fetchHelper<responseTeamsDTO[]>(teamsApi, {
        headers: { Authorization: `Bearer ${await this.auth()}` },
      });
      if (!response) {
        throw new Error('Error getting teams data');
      }

      return response.map((resp) => Object.assign(new TeamsEntity(), resp));
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error getting teams data'
      );
    }
  }

  async findById(id: string): Promise<TeamsEntity> {
    try {
      const response = await fetchHelper<responseTeamsDTO>(
        `${teamsApi}/${id}`,
        { headers: { Authorization: `Bearer ${await this.auth()}` } }
      );
      if (!response) {
        throw new Error('Error getting teams data');
      }
      return Object.assign(new TeamsEntity(), response);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error getting teams data'
      );
    }
  }

  async create(data: requestCreateTeamDTO): Promise<void> {
    try {
      await fetchHelper<responseTeamsDTO>(teamsApi, {
        method: 'POST',
        headers: {
          ...this.CommonHeaders,
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error creating teams data'
      );
    }
  }

  async update(id: string, data: requestCreateTeamDTO): Promise<void> {
    try {
      await fetchHelper<responseUpdateTeamDTO>(`${teamsApi}/${id}`, {
        method: 'PATCH',
        headers: {
          ...this.CommonHeaders,
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error updating teams data'
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(`${teamsApi}/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${await this.auth()}`,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error deleting teams data'
      );
    }
  }
}
