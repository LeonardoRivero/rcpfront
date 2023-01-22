import { IPhysicalExam } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { PhysicalExamResponse } from 'src/Domine/Responses';
import { PhysicalExamParameterRepository } from '../Repositories';

export class PhysicalExamService {
  private repository: IRepository<IPhysicalExam, PhysicalExamResponse>;
  private allPaymentOptions: Array<PhysicalExamResponse>;
  private static instance: PhysicalExamService;

  private constructor() {
    this.repository = PhysicalExamParameterRepository.getInstance();
    this.allPaymentOptions = [];
    return;
  }

  public static getInstance(): PhysicalExamService {
    if (!PhysicalExamService.instance) {
      PhysicalExamService.instance = new PhysicalExamService();
    }
    return PhysicalExamService.instance;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<PhysicalExamResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response == null || response.length === 0) return [];
    return response;
  }

  public async save(
    payload: IPhysicalExam
  ): Promise<PhysicalExamResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: IPhysicalExam
  ): Promise<PhysicalExamResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }

  public async getAll(): Promise<Array<PhysicalExamResponse>> {
    if (this.allPaymentOptions.length !== 0) {
      return this.allPaymentOptions;
    }
    const response = await this.repository.getAll();
    if (response == null) return [];
    this.allPaymentOptions = response;
    return response;
  }

  public async getById(id: number): Promise<PhysicalExamResponse | null> {
    const response = await this.repository.getById(id);
    return response;
  }

  public setRepository(
    repository: IRepository<IPhysicalExam, PhysicalExamResponse>
  ) {
    this.repository = repository;
  }
}
