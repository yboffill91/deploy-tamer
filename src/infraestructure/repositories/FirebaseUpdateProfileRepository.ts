import { IFirebaseUpdateProfileRepository } from '@/core/interfaces';
import {
  updateEmail,
  updatePassword,
  updateProfile,
  User,
} from 'firebase/auth';

export class FirebaseUpdateProfileUser
  implements IFirebaseUpdateProfileRepository
{
  async updateUserEmail(user: User, value: string): Promise<void> {
    try {
      await updateEmail(user, value);
      await user.reload();
    } catch (error) {
      throw new Error(`Error changing user email: ${error}`);
    }
  }

  async updateUserName(user: User, value: string): Promise<void> {
    try {
      await updateProfile(user, { displayName: value });
      await user.reload();
    } catch (error) {
      throw new Error(`Error updating user data: ${error}`);
    }
  }

  async updateUserPassword(user: User, value: string): Promise<void> {
    try {
      await updatePassword(user, value);
      await user.reload();
    } catch (error) {
      throw new Error(`Error changing password: ${error}`);
    }
  }
}
