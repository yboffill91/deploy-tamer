import { IRepository } from '@/core';
import { CompanyDTO } from '@/core/dto/CompanyDTO';
import { CompanyEntity } from '@/core/entities/CompanyEntity';
import { companiesApi } from '@/lib/apis';
import { fetchHelper } from '@/lib/fetch-helper';
import { SessionRepository } from './SessionRepository';
export class CompanyApiRepository implements IRepository {
  private auth = async () => {
    const AuthRepo = new SessionRepository();
    const auth = await AuthRepo.autorization();
    return auth;
  };

  async findAll(): Promise<CompanyEntity[]> {
    try {
      const response = await fetchHelper<CompanyDTO[]>(
        companiesApi,

        {
          headers: {
            Authorization: `Bearer ${await this.auth()}`,
          },
        }
      );
      if (!response) {
        throw new Error('Error fetching Companies Data');
      }
      return response.map((company) =>
        Object.assign(new CompanyEntity(), company)
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching Companies Data'
      );
    }
  }
  async findById(id: string): Promise<CompanyEntity | null> {
    try {
      const response = await fetchHelper<CompanyDTO>(`${companiesApi}/${id}`, {
        headers: {
          Authorization: `Bearer ${await this.auth()}`,
        },
      });
      if (!response) {
        throw new Error('Error fetching Company Data');
      }
      return Object.assign(new CompanyEntity(), response);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching Company Data'
      );
    }
  }
  async create(company: CompanyDTO): Promise<void> {
    const payload = { ...company, ownerId: Number(company.ownerId) };
    try {
      const response = await fetchHelper<CompanyDTO>(companiesApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response) {
        throw new Error('Error creating Company Data');
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error creating Company Data'
      );
    }
  }
  async update(id: string, company: CompanyDTO): Promise<void> {
    const payload = { ...company, ownerId: Number(company.ownerId) };
    try {
      const response = await fetchHelper<CompanyDTO>(`${companiesApi}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response) {
        throw new Error('Error updating Company Data');
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error updating Company Data'
      );
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(`${companiesApi}/${id}`, {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${await this.auth()}`,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error deleting Company Data'
      );
    }
  }
}
