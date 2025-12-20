import { CompanyEntity } from './CompanyEntity';

export class MailerDomainsEntity {
  readonly id?: string;
  readonly domain?: string;
  readonly region?: string;
  readonly fromSender?: string;
  readonly companyId: number;
}

export enum templateType {
  WELLCOME = 'Wellcome',
  PASSWORD_RESET = 'Password Reset',
  NEWSLETTER = 'Newsletter',
  PROMOTIONAL = 'Promotional',
  TRANSACTIONAL = 'Transactional',
}

export enum bodyType {
  HTML = 'HTML',
  TEXT = 'Text',
  REACT = 'ReactJS',
}

export enum Regions {
  NORTH_VIRGINIA = 'North Virginia (us-east-1)',
  IRELAND = 'Ireland (eu-west-1)',
  SAO_PAULO = 'São Paulo (sa-east-1)',
  TOKYO = 'Tokio (ap-northeast-1)',
}

export enum EmailEvents {
  BOUNCED = 'bounced',
  CANCELED = 'canceled',
  CLICKED = 'clicked',
  COMPLAINED = 'complained', //--> Spam
  DELIVERED = 'delivered',
  DELIVERY_DELAYED = 'delivery_delayed',
  FAILED = 'failed',
  OPENED = 'opened',
  QUEUED = 'queued',
  SHCEDULED = 'scheduled',
  SENT = 'sent',
}

export class CreateDomainDTO {
  readonly id?: string;
  readonly domain?: MailerDomainsEntity['domain'];
  readonly region?: Regions;
  readonly fromSender?: string;
  readonly companyId?: CompanyEntity['id'];
  readonly clickTracking?: boolean
}

export enum BroadCastEvents {
  DRAFT = 'Draft',
  SHCEDULED = 'Scheduled',
  QUEUED = 'Quewed',
  SENT = 'SENT',
  FAILED = 'Failed',
}

export class EmailsEntity {
  readonly id?: string;
  readonly from?: string;
  readonly to?: string[];
  readonly subject?: string;
  readonly text?: string;
  readonly html?: string;
  readonly react?: string;
}

export class ResendEmailEntity extends EmailsEntity {
  readonly bcc?: string[];
  readonly cc?: string[];
  readonly reply_to?: string[];
  readonly created_at?: Date;
  readonly last_event?: EmailEvents;
  readonly scheduled_at?: Date | null;
}

export class ResendEmailEntityByTag extends EmailsEntity {
  readonly html?: string;
  readonly text?: string;
  readonly error?: string | null;
}