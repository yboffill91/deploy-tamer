import { UsersPositionsDTO } from "../dto";
import { TeamsEntity } from "./TeamsEntity";

export class UsersEntity {
  readonly id?: number;
  readonly email?: string;
  readonly uid?: string;
  readonly positionId?: number;
  readonly infoId?: string | null;
  readonly teamId?: number | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date | null;
  readonly position?: UsersPositionsDTO;
  readonly team?: TeamsEntity;
  readonly photoURL?: string;
  readonly displayName?: string;
}
