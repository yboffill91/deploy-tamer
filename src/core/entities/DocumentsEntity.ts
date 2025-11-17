

export enum DocumentsType {
  REPORT = 'REPORT',
  INVOICE = 'INVOICE',
  CONTRACT = 'CONTRACT',
  MULTIMEDIA = 'MULTIMEDIA'
}

export enum DocumentsAccessType {
  PRIVATE = 'PRIVATE',
  TEAM = 'TEAM',
  PUBLIC = 'PUBLIC',
  SHARED = 'SHARED',
  SHARED_PRIVATE = 'SHARED_PRIVATE',

}

export class DocumentInfo {
  readonly description?: string;
  readonly tags?: string[];
  readonly metadata?: Record<string, string>;
}

export class DocumentsEntity {
  readonly name?: string;
  readonly type?: DocumentsType;
  readonly accessType?: DocumentsAccessType;
  readonly info?: DocumentInfo;
}