import { EmailAddress, EmailContent } from '../value-objects';


export class EmailEntity {
  constructor(
    private to: EmailAddress,
    private subject: string,
    private content: EmailContent
  ) { }

  toValues() {
    return {
      to: this.to,
      subject: this.subject,
      conten: this.content,
    };
  }
}
