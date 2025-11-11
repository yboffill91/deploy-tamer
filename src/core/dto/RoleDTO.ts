// export interface RolesDTO {
//   id: number;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt?: string | null;
//   roleFunctionality: {
//     id: number;
//     roleId: number;
//     functionalityId: number;
//     mode: string[];
//     createdAt: string;
//     updatedAt: string;
//     deletedAt?: string | null;
//   }[];
// }

// interface Feature {
//   functionalityId: number;
//   mode: ('READ' | 'WRITE' | 'FULL_ACCESS')[];
// }

// export interface buildRolesCascadeDTO {
//   name: string;
//   feature: Feature[];
// }


export class RolesDTO {
  readonly id?: number;
  readonly name?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly deletedAt?: string | null;
  readonly roleFunctionality?: RolesFuncionalitiesDTO[];
}

export class RolesFuncionalitiesDTO {
  readonly functionalityId?: number;
  readonly mode?: ('READ' | 'WRITE' | 'FULL_ACCESS')[];
}

export class buildRolesCascadeDTO {
  readonly name?: string;
  readonly feature?: RolesFuncionalitiesDTO[];
}