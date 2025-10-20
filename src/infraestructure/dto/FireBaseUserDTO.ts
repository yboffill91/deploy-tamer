import { Email, User } from '@/core';

interface FirebaseUserDTO {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
import { User as FireBaseUser } from 'firebase/auth';
export class FirebaseUserMapper {
  static toDomain(user: FireBaseUser): User {
    return new User(
      user.uid,
      new Email(user.email ?? ''),
      user.displayName ?? '',
      user.photoURL ?? undefined
    );
  }
  static fromDTO(dto: FirebaseUserDTO): User {
    return new User(
      dto.uid,
      new Email(dto.email ?? ''),
      dto.displayName ?? '',
      dto.photoURL ?? undefined
    );
  }
}
