import { LogsEntity } from "@/core/entities";
import { fetchHelper } from "@/lib/fetch-helper";
import { logsApi } from "@/lib/apis";
import { ResponseLogsDTO } from "@/core/dto";

interface ILogsRepository {
  // getAllLogs(): Promise<LogsEntity[]>;
  // getLogById(id: number): Promise<LogsEntity>;
  getLogsByPage(page: number, quant: number): Promise<LogsEntity[]>;
  getTotalRecord(): Promise<number>;
}

export class LogsApiRepository implements ILogsRepository {

  async getLogsByPage(page: number, limit: number): Promise<LogsEntity[]> {
    try {
      const response = await fetchHelper<ResponseLogsDTO>(`${logsApi}?page=${page}&limit=${limit}`);
      if (!response) {
        throw new Error("Failed to fetch logs");
      }
      const Logs = response.data.map((log) => Object.assign(new LogsEntity(), log));
      return Logs;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  async getTotalRecord(): Promise<number> {
    try {
      const response = await fetchHelper<ResponseLogsDTO>(`${logsApi}?page=1&limit=1`);
      if (!response) {
        throw new Error("Failed to fetch logs");
      }
      console.log("🛜 response", response.count);
      return response.count;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Something went wrong")
    }
  }
}
