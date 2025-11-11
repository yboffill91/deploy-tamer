// import { Email, User } from '@/core';
import { User } from 'firebase/auth';


export class FirebaseUserMapper {

  constructor(readonly uuid: string, readonly email: string, readonly displayName: string, readonly photoURL: string) { }

  static toDTO(user: User): ResponseFireBaseDto {
    return new ResponseFireBaseDto(
      user.uid,
      user.email ?? '',
      user.displayName ?? '',
      user.photoURL ?? ''
    );
  }

}

export class ResponseFireBaseDto {
  constructor(readonly uid: string, readonly email: string, readonly displayName: string, readonly photoURL: string) { }


}
