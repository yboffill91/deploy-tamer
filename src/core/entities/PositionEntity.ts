import { PositionDTO } from '@/core/dto';
import { PositionName } from '@/core/value-objects';

export class Position {
  constructor(
    readonly id: string,
    readonly name: PositionName,
    readonly description: string,
    readonly roleIds: string[] = []
  ) {}

  static create(params: {
    id: string;
    name: string;
    description: string;
    roleIds?: string[];
  }) {
    return new Position(
      params.id,
      new PositionName(params.name),
      params.description,
      params.roleIds ?? []
    );
  }

  updateName(newName: string): Position {
    return new Position(
      this.id,
      new PositionName(newName),
      this.description,
      this.roleIds
    );
  }

  assignRole(roleId: string): Position {
    if (this.roleIds.includes(roleId)) return this;
    return new Position(this.id, this.name, this.description, [
      ...this.roleIds,
      roleId,
    ]);
  }

  removeRole(roleId: string): Position {
    return new Position(
      this.id,
      this.name,
      this.description,
      this.roleIds.filter((r) => r !== roleId)
    );
  }

  toPrimitives(): PositionDTO {
    return {
      id: this.id,
      name: this.name.getValue(),
      description: this.description,
      roleIds: [...this.roleIds],
    };
  }

  static fromPrimitives(data: PositionDTO): Position {
    return new Position(
      data.id,
      new PositionName(data.name),
      data.description,
      data.roleIds
    );
  }
}
