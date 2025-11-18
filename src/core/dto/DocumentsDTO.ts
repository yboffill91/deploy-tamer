import { DocumentInfo, DocumentsAccessType, DocumentsType } from "../entities";

export class CreateDocumentDTO extends DocumentInfo {}

export class DocumentsDTO {
  readonly name?: string;
  readonly type?: DocumentsType;
  readonly accessType?: DocumentsAccessType;
  readonly info?: DocumentInfo;
  readonly teamId?: string;
  readonly file?: File;
}

export class ResponseDocumentsDTO {
  readonly id?: number;
  readonly name?: string;
  readonly url?: string | null;
  readonly type?: DocumentsType;
  readonly uploadedById?: number;
  readonly accessType?: DocumentsAccessType;
  readonly teamId?: number;
  readonly publicURL?: string | null;
  readonly hashAccess?: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date | null;
}
