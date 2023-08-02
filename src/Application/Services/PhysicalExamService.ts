import { IPhysicalExam } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { PhysicalExamResponse } from 'src/Domine/Responses';
import { PhysicalExamParameterRepository } from '../Repositories';

export class PhysicalExamService extends Service<
  IPhysicalExam,
  PhysicalExamResponse
> {
  public repository: Repository<IPhysicalExam>;
  private allPaymentOptions: Array<PhysicalExamResponse>;
  private static instance: PhysicalExamService;

  private constructor() {
    super();
    this.repository = PhysicalExamParameterRepository.getInstance();
    this.allPaymentOptions = [];
  }

  public static getInstance(): PhysicalExamService {
    if (!PhysicalExamService.instance) {
      PhysicalExamService.instance = new PhysicalExamService();
    }
    return PhysicalExamService.instance;
  }

  public override async getAll(): Promise<Array<PhysicalExamResponse>> {
    if (this.allPaymentOptions.length !== 0) {
      return this.allPaymentOptions;
    }
    const response = await this.repository.getAll();
    if (!response.ok) return [];
    this.allPaymentOptions = await response.json();
    return this.allPaymentOptions;
  }
}
