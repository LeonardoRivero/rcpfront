import { IRepository } from '../Repositories';

export class CommonService<T1, T2> {
  private _repository: IRepository<T1, T2>;
  public constructor(repository: IRepository<T1, T2>) {
    this._repository = repository;
    return;
  }
  public async save(payload: T1): Promise<T2 | null> {
    const response = await this._repository.create(payload);
    return response;
  }

  public async update(payload: T1): Promise<T2 | null> {
    const response = await this._repository.update(payload);
    return response;
  }

  public async findByParameters(queryParameters: object): Promise<Array<T2>> {
    const response = await this._repository.findByParameters(queryParameters);
    if (response == null || response.length === 0) return [];
    return response;
  }

  public async getAll(): Promise<Array<T2>> {
    const response = await this._repository.getAll();
    if (response == null) return [];
    return response;
  }

  public async getById(id: number): Promise<T2 | null> {
    const response = await this._repository.getById(id);
    return response;
  }

  public setRepository(repository: IRepository<T1, T2>) {
    this._repository = repository;
  }
}
