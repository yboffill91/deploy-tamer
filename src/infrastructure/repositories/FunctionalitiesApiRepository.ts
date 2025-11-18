import { FunctionalitiesDTO, FunctionalitiesEntity, IRepository, requestFunctionalitiesDTO } from "@/core"
import { apiFunctionalities } from "@/lib/apis"
import { fetchHelper } from "@/lib/fetch-helper"

export class FunctionalitiesApiRepository implements IRepository {
  private commonHeader = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  async findAll(): Promise<FunctionalitiesEntity[]> {
    try {
      const response = await fetchHelper<FunctionalitiesDTO[]>(apiFunctionalities)
      if (!response) {
        throw new Error('Error getting functionalities data')
      }
      return response.map((resp) => (Object.assign(new FunctionalitiesEntity(), resp)))
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error getting functionalities data')
    }




  }

  async findById(id: string): Promise<FunctionalitiesEntity> {
    try {
      const response = await fetchHelper<FunctionalitiesDTO>(`${apiFunctionalities}/${id}`)
      if (!response) {
        throw new Error('Error getting functionalities data')
      }
      return Object.assign(new FunctionalitiesEntity(), response)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error getting functionalities data')
    }
  }

  async create(data: requestFunctionalitiesDTO): Promise<FunctionalitiesEntity> {
    try {
      const response = await fetchHelper<FunctionalitiesDTO>(apiFunctionalities, {
        method: 'POST',
        headers: this.commonHeader,
        body: JSON.stringify(data)
      })
      if (!response) {
        throw new Error('Error creating functionalities data')
      }
      return Object.assign(new FunctionalitiesEntity(), response)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error creating functionalities data')
    }
  }

  async update(id: string, data: requestFunctionalitiesDTO): Promise<void> {
    try {
      await fetchHelper<FunctionalitiesDTO>(`${apiFunctionalities}/${id}`, {
        method: 'PATCH',
        headers: this.commonHeader,
        body: JSON.stringify(data)
      })
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error updating functionalities data')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(`${apiFunctionalities}/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*'
        }
      })
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error deleting functionalities data')
    }
  }

}