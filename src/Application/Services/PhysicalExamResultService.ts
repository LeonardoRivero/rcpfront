import { IExam } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { PhysicalExamResultRepository } from '../Repositories';
import { PhysicalExamResultResponse } from 'src/Domine/Responses';

export class PhysicalExamResultService extends Service<
  IExam,
  PhysicalExamResultResponse
> {
  repository: Repository<IExam>;
  public constructor() {
    super();
    this.repository = new PhysicalExamResultRepository();
  }
}
