import { CompanyDTO } from './CompanyDTO';

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
  readonly positions?: UsersPositionsDTO;
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

export class ResponseUsersDTO {
  readonly authCode?: string;
  readonly companies?: CompanyDTO[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date | null;
  readonly email?: string;
  readonly generatedTime?: Date | null;
  readonly id?: number;
  readonly infoId?: number | null;
  readonly positionId?: number | null;
  readonly teamId?: number | null;
  readonly token?: string | null;
  readonly uuid?: string;
}
