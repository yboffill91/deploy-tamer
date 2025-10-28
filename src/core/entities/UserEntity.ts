import { Email } from '@/core/value-objects';

export class User {
  constructor(
    readonly id: string,
    readonly email: Email,
    readonly displayName?: string,
    readonly photoUrl?: string
  ) {}

  static create(params: {
    id: string;
    email: string;
    displayName?: string;
    photoUrl?: string;
  }) {
    return new User(
      params.id,
      new Email(params.email),
      params.displayName,
      params.photoUrl
    );
  }

  getDisplayName() {
    return this.displayName;
  }

  getPhotoUrl() {
    return this.photoUrl;
  }

  updateEmail(newEmail: string) {
    return this.email.setValue(newEmail);
  }
}
