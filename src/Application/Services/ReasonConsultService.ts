import { IReasonConsult } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { ReasonConsultResponse } from 'src/Domine/Responses';
import { ReasonConsultRepository } from '../Repositories';

export class ReasonConsultService extends Service<
  IReasonConsult,
  ReasonConsultResponse
> {
  public repository: Repository<IReasonConsult>;
  private allReasonConsult: Array<ReasonConsultResponse>;
  private static instance: ReasonConsultService;

  public constructor() {
    super();
    this.repository = new ReasonConsultRepository();
    this.allReasonConsult = [];
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
    if (!response.ok) return [];
    this.allReasonConsult = await response.json();
    return this.allReasonConsult;
  }
}
