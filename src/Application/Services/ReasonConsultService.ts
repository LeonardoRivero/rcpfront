import { IReasonConsult } from 'src/Domine/Request';
import { GenericService } from '../Repositories/Interface';
import { ReasonConsultResponse } from 'src/Domine/Responses';

export class ReasonConsultService extends GenericService<
  IReasonConsult,
  ReasonConsultResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  private allReasonConsult: Array<ReasonConsultResponse>;
  private static instance: ReasonConsultService;

  public constructor() {
    super();
    this.allReasonConsult = [];
    const urlAPI = process.env.REASON_CONSULT ? process.env.REASON_CONSULT : '';
    this.urlBase = `${process.env.RCP}${urlAPI}all/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}all/`;
    this.urlList = `${process.env.RCP}${urlAPI}list/`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }

  public static getInstance(): ReasonConsultService {
    if (!ReasonConsultService.instance) {
      ReasonConsultService.instance = new ReasonConsultService();
    }
    return ReasonConsultService.instance;
  }

  public async getAll(): Promise<Array<ReasonConsultResponse>> {
    if (this.allReasonConsult.length !== 0) {
      return this.allReasonConsult;
    }
    const response = await this.httpClient.GET(this.urlList);
    if (!response.ok) return [];
    this.allReasonConsult = await response.json();
    return this.allReasonConsult;
  }
}
