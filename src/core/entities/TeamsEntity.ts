import { UsersEntity } from "./UsersEntity";

export interface TeamsData {
  id: number;
  name: string;
  description: string;
  users: UsersEntity[]
}

export class TeamsEntity {

    readonly id?: number
    readonly name?: string
    readonly description?: string
    readonly users?: UsersEntity[]
}



