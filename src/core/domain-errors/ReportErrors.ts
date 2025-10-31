export class ReportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReportError';
  }

  static invalidStat() {
    return new ReportError('Stat must be a positive number');
  }
  static invalidGrowth() {
    return new ReportError(
      'Growth must be greater than -100 and less than 100 '
    );
  }
  static invalidVisitorCount() {
    return new ReportError(
      'The visit counter must be equal to or greater than zero'
    );
  }

  //   static userAlreadyExists() {
  //     return new ReportError('User already exists');
  //   }

  //   static unauthorized() {
  //     return new ReportError('Unauthorized access');
  //   }
  //   static userNotFound() {
  //     return new ReportError('User not found');
  //   }
}
