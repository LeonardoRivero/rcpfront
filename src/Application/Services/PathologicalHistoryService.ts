import { IPathologycalHistory } from 'src/Domine/ModelsDB';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { Repository, PathologicalHistoryRepository } from '../Repositories';

export class PathologicalHistoryService {
  private repository: Repository<IPathologycalHistory>;
  public constructor() {
    this.repository = new PathologicalHistoryRepository();
    return;
  }
  public async save(
    payload: IPathologycalHistory
  ): Promise<PathologicalHistoryResponse | null> {
    const response = await this.repository.create(payload);
    if (!response.ok) return null;
    return await response.json();
  }

  public async update(
    payload: IPathologycalHistory
  ): Promise<PathologicalHistoryResponse | null> {
    if (payload.id == undefined) {
      throw EvalError('id is undefined');
    }
    const response = await this.repository.update(payload, payload.id);
    if (!response.ok) return null;
    return await response.json();
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<PathologicalHistoryResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (!response.ok) return [];
    return await response.json();
  }

  public async getAll(): Promise<Array<PathologicalHistoryResponse>> {
    const response = await this.repository.getAll();
    if (!response.ok) return [];
    return await response.json();
  }

  public async getById(
    id: number
  ): Promise<PathologicalHistoryResponse | null> {
    const response = await this.repository.getById(id);
    if (!response.ok) return null;
    return await response.json();
  }
}
