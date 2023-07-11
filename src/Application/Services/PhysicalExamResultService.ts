import { IExam } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { PhysicalExamResultRepository } from '../Repositories';

export class PhysicalExamResultService extends Service<IExam, null> {
  repository: Repository<IExam>;
  public constructor() {
    super();
    this.repository = new PhysicalExamResultRepository();
  }
  // private repository: Repository<IExam>;

  // public async create(payload: IExam): Promise<IExam | null> {
  //   const response = await this.repository.create(payload);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public async update(payload: IExam): Promise<IExam | null> {
  //   throw new Error('Method not implemented.');
  // }
  // public async findByParameters(
  //   queryParameters: object
  // ): Promise<Array<RelationCodeResponse>> {
  //   throw new Error('Method not implemented.');
  // }

  // public async getAll(): Promise<Array<PhysicalExamResultResponse>> {
  //   const response = await this.repository.getAll();
  //   if (!response.ok) return [];
  //   return await response.json();
  // }
}
