import { IPathologycalHistory } from 'src/Domine/ModelsDB';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { IRepository, PathologicalHistoryRepository } from '../Repositories';

export class PathologicalHistoryService {
  private repository: IRepository<
    IPathologycalHistory,
    PathologicalHistoryResponse
  >;
  public constructor() {
    this.repository = new PathologicalHistoryRepository();
    return;
  }
  public async save(
    payload: IPathologycalHistory
  ): Promise<PathologicalHistoryResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: IPathologycalHistory
  ): Promise<PathologicalHistoryResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<PathologicalHistoryResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response == null || response.length === 0) return [];
    return response;
  }

  public async getAll(): Promise<Array<PathologicalHistoryResponse>> {
    const response = await this.repository.getAll();
    if (response == null) return [];
    return response;
  }

  public async getById(
    id: number
  ): Promise<PathologicalHistoryResponse | null> {
    const response = await this.repository.getById(id);
    return response;
  }

  public setRepository(
    repository: IRepository<IPathologycalHistory, PathologicalHistoryResponse>
  ) {
    this.repository = repository;
  }
}
