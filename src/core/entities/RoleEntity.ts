// src/core/entities/Role.ts
import { RoleDTO } from '@/core/dto';
import { AccessLevel, RoleName, RolePermission } from '../value-objects';

export class Role {
  constructor(
    readonly id: string,
    readonly name: RoleName,
    readonly permissions: RolePermission[] = []
  ) {}

  static create(params: {
    id: string;
    name: string;
    permissions?: RolePermission[];
  }) {
    return new Role(
      params.id,
      new RoleName(params.name),
      params.permissions ?? []
    );
  }

  updateName(newName: string): Role {
    return new Role(this.id, new RoleName(newName), this.permissions);
  }

  addPermission(feature: string, access: AccessLevel): Role {
    const exists = this.permissions.some(
      (p) => p.feature === feature && p.access === access
    );
    if (exists) return this;
    return new Role(this.id, this.name, [
      ...this.permissions,
      new RolePermission(feature, access),
    ]);
  }

  removePermission(feature: string): Role {
    return new Role(
      this.id,
      this.name,
      this.permissions.filter((p) => p.feature !== feature)
    );
  }

  updatePermission(feature: string, access: AccessLevel): Role {
    const updated = this.permissions.map((p) =>
      p.feature === feature ? new RolePermission(feature, access) : p
    );
    return new Role(this.id, this.name, updated);
  }

  toPrimitives(): RoleDTO {
    return {
      id: this.id,
      name: this.name.getValue(),
      permissions: this.permissions.map((p) => p.getValue()),
    };
  }

  static fromPrimitives(data: RoleDTO): Role {
    return new Role(
      data.id,
      new RoleName(data.name),
      data.permissions.map((p) => new RolePermission(p.feature, p.access))
    );
  }
}
