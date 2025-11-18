import { IRepository } from "@/core";
import { CompanyDTO } from "@/core/dto/CompanyDTO";
import { CompanyEntity } from "@/core/entities/CompanyEntity";
import { companiesApi } from "@/lib/apis";
import { fetchHelper } from "@/lib/fetch-helper";
export class CompanyApiRepository implements IRepository {
  async findAll(): Promise<CompanyEntity[]> {
    try {
      const response = await fetchHelper<CompanyDTO[]>(companiesApi);
      if (!response) {
        throw new Error("Error fetching Companies Data");
      }
      return response.map((company) =>
        Object.assign(new CompanyEntity(), company)
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching Companies Data"
      );
    }
  }
  async findById(id: string): Promise<CompanyEntity | null> {
    try {
      const response = await fetchHelper<CompanyDTO>(`${companiesApi}/${id}`);
      if (!response) {
        throw new Error("Error fetching Company Data");
      }
      return Object.assign(new CompanyEntity(), response);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching Company Data"
      );
    }
  }
  async create(company: CompanyEntity): Promise<CompanyEntity> {
    try {
      const response = await fetchHelper<CompanyDTO>(companiesApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(company),
      });
      if (!response) {
        throw new Error("Error creating Company Data");
      }
      return Object.assign(new CompanyEntity(), response);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error creating Company Data"
      );
    }
  }
  async update(id: string, company: CompanyEntity): Promise<CompanyEntity> {
    try {
      const response = await fetchHelper<CompanyDTO>(`${companiesApi}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(company),
      });
      if (!response) {
        throw new Error("Error updating Company Data");
      }
      return Object.assign(new CompanyEntity(), response);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating Company Data"
      );
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(`${companiesApi}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting Company Data"
      );
    }
  }
}
