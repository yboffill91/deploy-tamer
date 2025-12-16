import { readonly } from 'zod';

export class CreateDomainDTO {
  readonly id?: string;
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

export class ResponseEmailDTO {
  readonly id?: string;
}
