export class PositionName {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error('Position name must be at least 2 characters long');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }
}
