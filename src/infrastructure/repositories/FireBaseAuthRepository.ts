import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
  GithubAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset,

} from 'firebase/auth';
import { AuthError, IAuthRepository, UsersEntity } from '@/core';
import { firebaseApp } from '../services/firebase';
import { FirebaseUserMapper } from '../dto';

export class FirebaseAuthRepository implements IAuthRepository {

  private readonly auth = getAuth(firebaseApp);


  async register(email: string, password: string): Promise<UsersEntity> {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
      const responseDTO = FirebaseUserMapper.toDTO(user);
      const returnedUser = Object.assign(new UsersEntity(), responseDTO)
      return returnedUser
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error registering user'
      );
    }
  }

  async login(email: string, password: string): Promise<UsersEntity> {
    try {
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
      const responseDTO = FirebaseUserMapper.toDTO(user);
      const returnedUser = Object.assign(new UsersEntity(), responseDTO)
      return returnedUser
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error logging in user'
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error logging out'
      );
    }
  }

  async loginWithProvider(provider: 'google' | 'github' | 'facebook'): Promise<UsersEntity> {
    let providerInstance;

    if (provider === 'google') {
      providerInstance = new GoogleAuthProvider();
    } else if (provider === 'github') {
      providerInstance = new GithubAuthProvider();
    } else if (provider === 'facebook') {
      providerInstance = new FacebookAuthProvider();
    } else {
      throw new AuthError(`Unsupported provider: ${provider}`);
    }

    try {
      const { user }: UserCredential = await signInWithPopup(
        this.auth,
        providerInstance
      );

      const responseDTO = FirebaseUserMapper.toDTO(user);
      const returnedUser = Object.assign(new UsersEntity(), responseDTO)
      return returnedUser
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error singing in user'
      );
    }
  }
  async resetPassword(email: string): Promise<void> {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(
        this.auth,
        email,
        actionCodeSettings
      );
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error reseting user password'
      );
    }
  }

  async confirmPasswordReset(
    oobCode: string,
    newPassword: string
  ): Promise<void> {
    try {
      await confirmPasswordReset(this.auth, oobCode, newPassword);
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error resetting password'
      );
    }
  }

  findUser(): UsersEntity {
    const user = this.auth.currentUser;
    if (!user) throw new AuthError('User no authenticated');
    const responseDTO = FirebaseUserMapper.toDTO(user);
    const returnedUser = Object.assign(new UsersEntity(), responseDTO)
    return returnedUser
  }

  async getUserToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  }

}
