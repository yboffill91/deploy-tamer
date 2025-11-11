import { LogsData } from "../dto";

export class LogsEntity {
  readonly id?: number;
  readonly tableName?: string;
  readonly recordId?: string;
  readonly action?: "CREATE" | "UPDATE" | "DELETE";
  readonly oldData?: string | LogsData;
  readonly newData?: string | LogsData;
  readonly changedBy?: string;
  readonly timestamp?: string;
}

