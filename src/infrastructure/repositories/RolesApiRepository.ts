import { buildRolesCascadeDTO, IRepository, RolesDTO, RolesEntity } from '@/core';
import { rolesApi } from '@/lib/apis';
import { fetchHelper } from '@/lib/fetch-helper';

export class RolesApiRepository implements IRepository {
  async findAll(): Promise<RolesEntity[]> {
    try {
      const data = await fetchHelper<RolesDTO[]>(rolesApi);
      if (!data) {
        return [];
      }
      return data.map((r) => Object.assign(new RolesEntity, r));
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching roles'
      );
    }
  }

  async findById(id: string): Promise<RolesEntity> {
    try {
      const data = await fetchHelper<RolesDTO>(`${rolesApi}/${id}`);
      if (!data) {
        throw new Error('Role not found');
      }
      return Object.assign(new RolesEntity, data)
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching role'
      );
    }
  }
  async create(data: buildRolesCascadeDTO): Promise<void> {
    try {
      await fetchHelper<RolesEntity>(`${rolesApi}/cascade`, {
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error creating roles'
      );
    }
  }
  async update(id: string, data: buildRolesCascadeDTO): Promise<void> {
    try {
      await fetchHelper<RolesEntity>(`${rolesApi}/cascade/${id}`, {
        method: 'PATCH',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error updating roles'
      );
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await fetchHelper<RolesEntity>(`${rolesApi}/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*',
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error deleting roles'
      );
    }
  }
}
