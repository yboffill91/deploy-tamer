export class EmailAddress {
  private constructor(private readonly value: string) {}

  static create(value: string): EmailAddress {
    if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Invalid email address');
    }
    return new EmailAddress(value);
  }

  getValue(): string {
    return this.value;
  }
}
