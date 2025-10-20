export class Password {
  private readonly value: string;

  constructor(password: string) {
    if (!this.validate(password)) {
      throw new Error('Password must be at least 6 characters');
    }
    this.value = password;
  }

  private validate(password: string): boolean {
    return password.length >= 6;
  }

  public getValue(): string {
    return this.value;
  }
}
