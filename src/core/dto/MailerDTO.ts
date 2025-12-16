export class CreateDomainDTO {
  readonly id?: string;
  readonly domain?: string;
  readonly region?: string;
  readonly fromSender?: string;
  readonly companyId: number;
}