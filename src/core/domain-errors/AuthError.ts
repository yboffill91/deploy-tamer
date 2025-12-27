export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }

  static invalidCredentials() {
    return new AuthError('Invalid credentials');
  }

  static userAlreadyExists() {
    return new AuthError('User already exists');
  }

  static unauthorized() {
    return new AuthError(
      'Your token has expired, for security reasons your session will be closed.'
    );
  }
  static userNotFound() {
    return new AuthError('User not found');
  }
}
