
export interface IRepository {
  findAll(): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
  update(id: string, data: unknown): Promise<unknown>;
  delete(id: string): Promise<void>;
}
