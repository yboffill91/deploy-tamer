

export class UsersDTO {
  readonly id?: number;
  readonly email?: string;
  readonly uuid?: string;
  readonly positionId?: number;
  readonly infoId?: string | null;
  readonly teamId?: number | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date | null;
  readonly positions?: UsersPositionsDTO
}

export class UsersPositionsDTO {
  readonly id?: number;
  readonly name?: string;
  readonly description?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date | null;
  readonly roles?: number[];
}

export class requestUsersDTO {
  readonly email?: string;
  readonly uuid?: string;
  readonly positionId?: number;
}