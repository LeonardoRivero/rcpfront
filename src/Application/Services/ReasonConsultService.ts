import { IReasonConsult } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { ReasonConsultResponse } from 'src/Domine/Responses';
import { ReasonConsultRepository } from '../Repositories';

export class ReasonConsultService {
  private repository: IRepository<IReasonConsult, ReasonConsultResponse>;
  private allReasonConsult: Array<ReasonConsultResponse>;
  private static instance: ReasonConsultService;

  public constructor() {
    this.repository = new ReasonConsultRepository();
    this.allReasonConsult = [];
    return;
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
    const response = await this.repository.getAll();
    if (response == null) return [];
    this.allReasonConsult = response;
    return response;
  }
}
