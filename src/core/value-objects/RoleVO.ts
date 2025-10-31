// TODO: -> Revisar al final de la implementacion para eliminar UserRole y Role como VO

export type UserRole = 'admin' | 'customer' | 'user';

export class RoleVO {
  private readonly value: UserRole;

  constructor(role?: string) {
    const validRoles: UserRole[] = ['admin', 'customer', 'user'];
    const normalized = (role ?? 'user').trim().toLowerCase();

    if (!validRoles.includes(normalized as UserRole)) {
      throw new Error(`Invalid role: ${role}`);
    }

    this.value = normalized as UserRole;
  }

  getValue(): UserRole {
    return this.value;
  }
}

export class RoleName {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error('Role name must be at least 2 characters long');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }
}

export type AccessLevel = 'read' | 'write' | 'full';

export class RolePermission {
  constructor(
    readonly feature: string, // e.g., 'users', 'reports', 'settings'
    readonly access: AccessLevel
  ) {
    if (!feature || feature.trim().length < 2) {
      throw new Error('Feature name must be valid');
    }

    if (!['read', 'write', 'full'].includes(access)) {
      throw new Error('Invalid access level');
    }
  }

  getValue() {
    return { feature: this.feature, access: this.access };
  }
}
