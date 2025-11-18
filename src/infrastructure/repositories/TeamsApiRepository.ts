import { requestCreateTeamDTO, responseTeamsDTO, responseUpdateTeamDTO } from "@/core/dto";
import { TeamsEntity } from "@/core/entities";
import { IRepository } from "@/core/interfaces";
import { teamsApi } from "@/lib/apis";
import { fetchHelper } from "@/lib/fetch-helper";
export class TeamsApiRepository implements IRepository {

  private CommonHeaders = {
    'Content-Type': 'application/json',
    accept: '*/*'
  }


  async findAll(): Promise<TeamsEntity[]> {
    try {
      const response = await fetchHelper<responseTeamsDTO[]>(teamsApi)
      if (!response) {
        throw new Error('Error getting teams data')
      }

      return response.map((resp) => (Object.assign(new TeamsEntity(), resp)))
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error getting teams data')
    }

  }

  async findById(id: string): Promise<TeamsEntity> {
    try {
      const response = await fetchHelper<responseTeamsDTO>(`${teamsApi}/${id}`)
      if (!response) {
        throw new Error('Error getting teams data')
      }
      return Object.assign(new TeamsEntity(), response)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error getting teams data')
    }
  }

  async create(data: requestCreateTeamDTO): Promise<void> {
    try {
      await fetchHelper<responseTeamsDTO>(teamsApi, {
        method: 'POST',
        headers: this.CommonHeaders,
        body: JSON.stringify(data)
      })

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error creating teams data')
    }
  }

  async update(id: string, data: requestCreateTeamDTO): Promise<void> {
    try {
      await fetchHelper<responseUpdateTeamDTO>(`${teamsApi}/${id}`, {
        method: 'PATCH',
        headers: this.CommonHeaders,
        body: JSON.stringify(data)
      })

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error updating teams data')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(`${teamsApi}/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*'
        }
      })
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error deleting teams data')
    }
  }
}