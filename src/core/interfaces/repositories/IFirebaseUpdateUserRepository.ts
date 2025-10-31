import { User } from 'firebase/auth';

export interface IFirebaseUpdateProfileRepository {
  updateUserName(user: User, value: string): Promise<void>;
  updateUserEmail(user: User, value: string): Promise<void>;
  updateUserPassword(user: User, value: string): Promise<void>;
}
