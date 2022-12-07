export interface IRepository<T> {
  getById(id: number): Promise<T | null>;
  getAll(): Promise<T[] | null>;
  create(entity: T): Promise<T | null>;
  update(entity: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
  findByParameters(parameters: object): Promise<T[] | T>;
}
