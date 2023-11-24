import { IPathologycalHistory } from 'src/Domine/ModelsDB';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { GenericService } from '../Repositories';

export class PathologicalHistoryService extends GenericService<
  IPathologycalHistory,
  PathologicalHistoryResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;

  public constructor() {
    super();
    const urlAPI = process.env.PATHOLOGY_HISTORY
      ? process.env.PATHOLOGY_HISTORY
      : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlCreate = `${process.env.RCP}${urlAPI}all/`;
    this.urlList = `${this.urlBase}all/`;
    this.urlUpdate = `${this.urlBase}`;
  }
  // public async save(
  //   payload: IPathologycalHistory
  // ): Promise<PathologicalHistoryResponse | null> {
  //   const response = await this.repository.create(payload);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public async update(
  //   payload: IPathologycalHistory
  // ): Promise<PathologicalHistoryResponse | null> {
  //   if (payload.id == undefined) {
  //     throw EvalError('id is undefined');
  //   }
  //   const response = await this.repository.update(payload, payload.id);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public async findByParameters(
  //   queryParameters: object
  // ): Promise<Array<PathologicalHistoryResponse>> {
  //   const response = await this.repository.findByParameters(queryParameters);
  //   if (!response.ok) return [];
  //   return await response.json();
  // }

  // public async getAll(): Promise<Array<PathologicalHistoryResponse>> {
  //   const response = await this.repository.getAll();
  //   if (!response.ok || response.status == HttpStatusCode.NO_CONTENT) return [];
  //   const data: Array<PathologicalHistoryResponse> = await response.json();
  //   console.log(data);
  //   return data;
  // }

  // public async getById(
  //   id: number
  // ): Promise<PathologicalHistoryResponse | null> {
  //   const response = await this.repository.getById(id);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }
}
