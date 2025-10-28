import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
  GithubAuthProvider,
  User as FirebaseUser,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateProfile,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { AuthError, IAuthRepository, Email, Password, User } from '@/core';
import { firebaseApp } from '../services/firebase';
import { FirebaseUserMapper, UserProfileDTO } from '../dto';

export class FirebaseAuthRepository implements IAuthRepository {
  private readonly auth = getAuth(firebaseApp);

  async register(email: Email, password: Password): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        email.getValue(),
        password.getValue()
      );

      return FirebaseUserMapper.toDomain(user);
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error registring user'
      );
    }
  }

  async login(email: Email, password: Password): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(
        this.auth,
        email.getValue(),
        password.getValue()
      );
      return FirebaseUserMapper.toDomain(user);
    } catch (error) {
      throw new AuthError(
        error instanceof AuthError ? error.message : 'Error signing in user'
      );
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;
    if (!user || !user.email) return null;
    return FirebaseUserMapper.toDomain(user);
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

  async loginWithProvider(
    provider: 'github' | 'google' | 'facebook'
  ): Promise<User> {
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
      return FirebaseUserMapper.toDomain(user);
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error singing in user'
      );
    }
  }
  async resetPassword(email: Email): Promise<void> {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(
        this.auth,
        email.getValue(),
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

  async updateUser(data: UserProfileDTO): Promise<User> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new AuthError('User no authenticated');

    try {
      const { displayName, email, password, photoUrl } = data;

      if (displayName || photoUrl) {
        await updateProfile(currentUser, {
          displayName: displayName ?? currentUser.displayName,
          photoURL: photoUrl ?? currentUser.photoURL,
        });
      }

      if (email && email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      if (password) {
        await updatePassword(currentUser, password);
      }

      await currentUser.reload();
      return FirebaseUserMapper.toDomain(currentUser);
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Error updating user info'
      );
    }
  }

  mapToDomain(user: FirebaseUser): User {
    return FirebaseUserMapper.toDomain(user);
  }
}
