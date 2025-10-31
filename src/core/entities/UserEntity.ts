import { Email } from '@/core/value-objects';
import { UserDTO } from '@/core/dto';

export class User {
  constructor(
    readonly id: string,
    readonly email: Email,
    readonly displayName?: string,
    readonly photoUrl?: string,
    readonly positionId
    ?: string
  ) {}

  static create(params: {
    id: string;
    email: string;
    displayName?: string;
    photoUrl?: string;
    positionId
    ?: string;
  }) {
    return new User(
      params.id,
      new Email(params.email),
      params.displayName,
      params.photoUrl,
      params.positionId
      
    );
  }

  get getDisplayName() {
    return this.displayName ?? '';
  }

  get getPhotoUrl() {
    return this.photoUrl ?? '';
  }

  updateEmail(newEmail: string): User {
    return new User(
      this.id,
      new Email(newEmail),
      this.displayName,
      this.photoUrl,
      this.positionId
      
    );
  }

  updateCargo(newpositionId
    : string): User {
    return new User(
      this.id,
      this.email,
      this.displayName,
      this.photoUrl,
      newpositionId
      
    );
  }

  toPrimitives(): UserDTO {
    return {
      id: this.id,
      name: this.displayName ?? '',
      email: this.email.getValue(),
      photoUrl: this.photoUrl ?? '',
      positionId
      : this.positionId
       ?? '',
    };
  }

  static fromPrimitives(data: UserDTO): User {
    return new User(
      data.id,
      new Email(data.email),
      data.name,
      data.photoUrl,
      data.positionId
      
    );
  }
}
