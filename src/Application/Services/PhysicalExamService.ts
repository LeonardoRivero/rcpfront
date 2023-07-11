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

  // public async findByParameters(
  //   queryParameters: object
  // ): Promise<Array<PhysicalExamResponse>> {
  //   const response = await this.repository.findByParameters(queryParameters);
  //   if (!response.ok) return [];
  //   return await response.json();
  // }

  // public async save(
  //   payload: IPhysicalExam
  // ): Promise<PhysicalExamResponse | null> {
  //   const response = await this.repository.create(payload);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public async update(
  //   payload: IPhysicalExam
  // ): Promise<PhysicalExamResponse | null> {
  //   if (payload.id == undefined) {
  //     throw EvalError('id is undefined');
  //   }
  //   const response = await this.repository.update(payload, payload.id);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  public override async getAll(): Promise<Array<PhysicalExamResponse>> {
    if (this.allPaymentOptions.length !== 0) {
      return this.allPaymentOptions;
    }
    const response = await this.repository.getAll();
    if (!response.ok) return [];
    this.allPaymentOptions = await response.json();
    return this.allPaymentOptions;
  }

  // public async getById(id: number): Promise<PhysicalExamResponse | null> {
  //   const response = await this.repository.getById(id);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }
}
