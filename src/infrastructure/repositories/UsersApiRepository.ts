import { requestUsersDTO, UsersDTO } from "@/core/dto";
import { UsersEntity } from "@/core/entities";
import { IRepository } from "@/core/interfaces";
import { usersApi } from "@/lib/apis";
import { fetchHelper } from "@/lib/fetch-helper";

export class UsersApiRepository implements IRepository {
  private commonHeader = {
    "Content-Type": "application/json",
    accept: "*/*",
  };
  async findAll(): Promise<UsersEntity[]> {
    try {
      const users = await fetchHelper<UsersDTO[]>(usersApi);
      if (!users) {
        return [];
      }
      return users.map((u) => Object.assign(new UsersEntity(), u));
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching users"
      );
    }
  }

  async findById(id: string): Promise<UsersEntity> {
    try {
      const user = await fetchHelper<UsersDTO>(`${usersApi}/${id}`);
      if (!user) {
        throw new Error("User not found");
      }
      return Object.assign(new UsersEntity(), user);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching user"
      );
    }
  }

  async create(data: requestUsersDTO): Promise<UsersEntity | void> {
    try {
      const user = await fetchHelper<UsersEntity>(usersApi, {
        method: "POST",
        headers: this.commonHeader,
        body: JSON.stringify(data),
      });
      if (!user) {
        throw new Error("User not created");
      }
      return Object.assign(new UsersEntity(), user);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error creating user"
      );
    }
  }

  async update(id: string, data: requestUsersDTO): Promise<void> {
    try {
      await fetchHelper(`${usersApi}/${id}`, {
        method: "PATCH",
        headers: this.commonHeader,
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating user"
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(`${usersApi}/${id}`, {
        method: "DELETE",
        headers: this.commonHeader,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting user"
      );
    }
  }
}
