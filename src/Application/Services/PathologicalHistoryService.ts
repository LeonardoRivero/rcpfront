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
    this.urlList = `${this.urlBase}list/`;
    this.urlUpdate = `${this.urlBase}`;
  }
}
