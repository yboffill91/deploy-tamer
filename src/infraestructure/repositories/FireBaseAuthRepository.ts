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
} from 'firebase/auth';
import { AuthError, AuthRepository, Email, Password, User } from '@/core';
import { firebaseApp } from '../services/firebase';
import { FirebaseUserMapper } from '../dto';


export class FirebaseAuthRepository implements AuthRepository {
  private readonly auth = getAuth(firebaseApp);

  async register(email: Email, password: Password): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        email.getValue(),
        password.getValue()
      );

      return FirebaseUserMapper.toDomain(user);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use')
        throw AuthError.userAlreadyExists();
      console.warn(error);
      throw new AuthError(error.message);
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
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential')
        throw AuthError.invalidCredentials();
      throw new AuthError(error.message);
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
    } catch (error: any) {
      throw new AuthError(error.message || 'Error signing out');
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
    } catch (error: any) {
      throw new AuthError(error.message);
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
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw AuthError.userNotFound();
      }
      throw new AuthError(error.message);
    }
  }

  async confirmPasswordReset(
    oobCode: string,
    newPassword: string
  ): Promise<void> {
    try {
      await confirmPasswordReset(this.auth, oobCode, newPassword);
    } catch (error: any) {
      if (error.code === 'auth/invalid-action-code') {
        throw new AuthError(
          'Reset link has expired'
        );
      }
      throw new AuthError(
        error.message || 'Error resetting the password'
      );
    }
  }

  mapToDomain(user: FirebaseUser): User {
    return FirebaseUserMapper.toDomain(user);
  }
}
