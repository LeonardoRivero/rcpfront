import { routerInstance } from 'src/boot/globalRouter';
import {
  IDoctorRequest,
  IDoctorResponse,
  IDXMainCodeRequest,
  IDXMainCodeResponse,
  IPhysicalExamRequest,
  IRelationCodeRequest,
  IRelationCodeResponse,
  ISpeciality,
} from 'src/models/IConsults';
import { IHealthInsurance } from 'src/models/IPatients';
import { EndPoints, Messages } from 'src/scripts/Constants';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { GET, POST, PUT, handleResponse } from 'src/scripts/Request';
import { IRepository } from './Interface';
const endpoint = EndPoints.getInstance();
const messages = Messages.getInstance();

type IPhysical = IPhysicalExamRequest;
export class PhysicalMedicalParameterRepository
  implements IRepository<IPhysical>
{
  getById(id: number): Promise<IPhysicalExamRequest | null> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<IPhysicalExamRequest[] | null> {
    throw new Error('Method not implemented.');
  }
  create(entity: IPhysicalExamRequest): Promise<IPhysicalExamRequest | null> {
    throw new Error('Method not implemented.');
  }
  update(
    entity: Partial<IPhysicalExamRequest>
  ): Promise<IPhysicalExamRequest | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByParameters(parameters: object): Promise<IPhysicalExamRequest[]> {
    throw new Error('Method not implemented.');
  }
}
