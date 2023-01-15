import { routerInstance } from 'src/boot/globalRouter';
import { EndPoints, Messages } from 'src/Application/Utilities';
import HttpStatusCodes from 'src/Application/Utilities/HttpStatusCodes';
import {
  GET,
  POST,
  PUT,
  handleResponse,
} from 'src/Infraestructure/Utilities/Request';
import { IRepository } from './Interface';
import { IPhysicalExam } from 'src/Domine/ModelsDB';
import { PhysicalExamResponse } from 'src/Domine/Responses';
const endpoint = EndPoints.getInstance();
const messages = Messages.getInstance();

// type IPhysical = IPhysicalExam;
export class PhysicalMedicalParameterRepository
  implements IRepository<IPhysicalExam, PhysicalExamResponse>
{
  getById(id: number): Promise<PhysicalExamResponse | null> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<PhysicalExamResponse[] | null> {
    throw new Error('Method not implemented.');
  }
  create(entity: IPhysicalExam): Promise<PhysicalExamResponse | null> {
    throw new Error('Method not implemented.');
  }
  update(entity: Partial<IPhysicalExam>): Promise<PhysicalExamResponse | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByParameters(parameters: object): Promise<PhysicalExamResponse[]> {
    throw new Error('Method not implemented.');
  }
}
