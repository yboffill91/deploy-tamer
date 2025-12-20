import { EmailEvents } from '../entities';

export class CreateDomainDTO {
  readonly domain?: string;
  readonly region?: string;

  readonly fromSender?: string;
  readonly companyId: number;
}

export class CreateEmailDTO {
  readonly from?: string;
  readonly to?: string[];
  readonly subject?: string;
  readonly text?: string;
  readonly html?: string;
  readonly react?: string;
}

export class ResedApiEmailsResponseDTO {
  readonly data?: ResendApiEmailObjectResponse;
}

export class ResendApiEmailObjectResponse {
  readonly object?: string;
  readonly has_more?: boolean;
  readonly data?: ResponseResendEmailsDTO[];
}

export class ResponseDataEmailDTO {
  readonly data?: ResponseResendEmailsDTO[];
}

export class ResendApiBaseEmailDTO {
  readonly id?: string;
  readonly from?: string;
  readonly to?: string[];
  readonly subject?: string;
}

export class ResponseResendEmailsDTO extends ResendApiBaseEmailDTO {
  readonly bcc?: string[];
  readonly cc?: string[];
  readonly reply_to?: string[];
  readonly created_at?: Date;
  readonly last_event?: EmailEvents;
  readonly scheduled_at?: Date | null;
}

export class ResponseResendEmailByIdDTO extends ResponseResendEmailsDTO {
  readonly object?: string;
  readonly html?: string;
  readonly text?: string;
  readonly error?: string | null;
}

export class ResendApiEmailByIdResponseDTO {
  readonly data?: ResponseResendEmailByIdDTO;
}
