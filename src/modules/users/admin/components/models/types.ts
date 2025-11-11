export interface Feature {
  id: number;
  name: string;
}

type typeAccess = 'READ' | 'WRITE' | 'FULL_ACCESS';

export interface RoleFeature {
  functionalityId: number;
  mode: typeAccess[];
}

export interface Role {
  id: number;
  name: string;
  feature: Array<{
    id: number;
    mode: typeAccess[];
  }>;
}

export interface RoleFormData {
  name: string;
  feature: RoleFeature[];
}

// export interface Position {
//   name: string;
//   description: string;
//   roles: number[];
// }

export interface PositionFormData {
  name: string;
  description: string;
  roles: number[];
}

// export interface User {
//   id: string
//   email: string
//   uuid: string
//   positionId: number
// }

// export interface UserFormData {
//   email: string
//   positionId: number | null
// }

// export interface UserDetailData extends User {
//   infoId: string | null
//   teamId: string | null
//   createdAt: string
//   updatedAt: string
//   deletedAt: string | null
// }



export interface Team {
  id: number
  name: string
  description: string
  users: User[]
}

export interface TeamFormData {
  name: string
  description: string
  userIds: number[]
}

export interface Functionality {
  id: number
  name: string
}

export interface RoleFunctionality {
  id: number
  roleId: number
  functionalityId: number
  mode: ("READ" | "WRITE" | "FULL_ACCESS")[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface Role {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  roleFunctionality: RoleFunctionality[]
}

export interface RoleFeature {
  functionalityId: number
  mode: ("READ" | "WRITE" | "FULL_ACCESS")[]
}

export interface RoleFormData {
  name: string
  feature: RoleFeature[]
}

export interface Position {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  roles: Role[]
}

export interface Team {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface User {
  id: number
  email: string
  uuid: string
  infoId: string | null
  positionId: number
  teamId: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  position: Position
  team: Team | null
}

export interface UserFormData {
  email: string
  positionId: number | null
}
