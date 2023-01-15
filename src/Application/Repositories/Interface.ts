export interface IRepository<T1, T2> {
  getById(id: number): Promise<T2 | null>;
  getAll(): Promise<T2[] | null>;
  create(entity: T1): Promise<T2 | null>;
  update(entity: Partial<T1>): Promise<T2 | null>;
  delete(id: number): Promise<boolean>;
  findByParameters(parameters: object): Promise<T2[]>;
}
