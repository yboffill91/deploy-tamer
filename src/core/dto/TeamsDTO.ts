import { UsersDTO } from "./UsersDTO";

export class TeamsDTO {
  name?: string;
  description?: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class responseTeamsDTO extends TeamsDTO {

  users?: UsersDTO[]
}

export class requestCreateTeamDTO extends TeamsDTO {
  usersIds?: number[]
}

export class responseUpdateTeamDTO extends TeamsDTO {
  users?: UsersDTO[]
}