import { IExam } from 'src/Domine/ModelsDB';
import {
  PhysicalExamResultAbstract,
  Repository,
  Service,
} from '../Repositories/Interface';
import { PhysicalExamResultRepository } from '../Repositories';
import { PhysicalExamResultResponse } from 'src/Domine/Responses';

export class PhysicalExamResultService extends PhysicalExamResultAbstract {
  public constructor() {
    super();
    this.repository = new PhysicalExamResultRepository();
  }
  repository: Repository<IExam>;
  findHistoryPatient(doc: string): Promise<PhysicalExamResultResponse[]> {
    throw new Error('Method not implemented.');
  }
}
// export class PhysicalExamResultService extends PhysicalExamResultAbstract {
//   public constructor() {
//     super();
//     this.repository = new PhysicalExamResultRepository();
//   }
//   repository: Repository<IExam>;

//   public async findHistoryPatient(
//     doc: string
//   ): Promise<Array<PhysicalExamResultResponse>> {
//     const parameters = { documentPatient: doc };
//     const response = await this.repository.findByParameters(parameters);
//     console.log(await response.json());
//     return [];
//   }
// }
