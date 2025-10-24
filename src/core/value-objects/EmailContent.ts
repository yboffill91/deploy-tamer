export class EmailContent {
  private constructor(private readonly value: string) {}

  static create(value: string): EmailContent {
    if (!value || value.trim().length === 0) {
      throw new Error('Email content cannot be empty');
    }
    return new EmailContent(value);
  }

  getValue(): string {
    return this.value;
  }
}
