export interface LogsData {
  id: number;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface LogsDTO {
  id: number;
  tableName: string;
  recordId: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  oldData: string | LogsData;
  newData: string | LogsData;
  changedBy: string;
  timestamp: string;
}

export class ResponseMultipleLogsDTO {
  readonly attributes?: LogsDTO[]
}

export class ResponseSingleLogDTO {
  readonly attributes?: LogsDTO
}

export interface ResponseLogsDTO {
  count: number;
  data: LogsDTO[]
}