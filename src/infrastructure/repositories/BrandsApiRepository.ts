import { IRepository } from "@/core";
import { fetchHelper } from "@/lib/fetch-helper";
import { brandsApi } from "@/lib/apis";
import { BrandsEntity } from "@/core/entities";
import { BrandDTO, CreateBrandDTO } from "@/core/dto";

export class BrandApiRepository implements IRepository {
  async findAll(): Promise<BrandsEntity[]> {
    try {
      const response = await fetchHelper<BrandDTO[]>(brandsApi);
      if (!response) {
        throw new Error("Failed to fetch brands");
      }
      return response.map((brand) => Object.assign(new BrandsEntity(), brand));
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<BrandsEntity> {
    try {
      const response = await fetchHelper<BrandDTO>(`${brandsApi}/${id}`);
      if (!response) {
        throw new Error("Failed to fetch brand");
      }
      return Object.assign(new BrandsEntity(), response);
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateBrandDTO): Promise<void> {
    try {
      const response = await fetchHelper<BrandDTO>(brandsApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error("Failed to create brand");
      }
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: CreateBrandDTO): Promise<void> {
    try {
      const response = await fetchHelper<BrandDTO>(`${brandsApi}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error("Failed to update brand");
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetchHelper<BrandDTO>(`${brandsApi}/${id}`, {
        method: "DELETE",
      });
      if (!response) {
        throw new Error("Failed to delete brand");
      }
    } catch (error) {
      throw error;
    }
  }
}
