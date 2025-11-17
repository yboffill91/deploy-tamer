import { DocumentInfo, DocumentsAccessType, DocumentsType } from "../entities";

export class CreateDocumentDTO extends DocumentInfo {

}

export class DocumentsDTO {
  readonly name?: string;
  readonly type?: DocumentsType;
  readonly accessType?: DocumentsAccessType;
  readonly info?: DocumentInfo;
  readonly teamId?: string;
  readonly file?: File

}


