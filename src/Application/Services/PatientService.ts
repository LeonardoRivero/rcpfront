import { IPatient } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { PatientResponse } from 'src/Domine/Responses';
import { PatientRepository } from '../Repositories/PatientRepository';

export class PatientService {
  private repository: IRepository<IPatient, PatientResponse>;
  public constructor() {
    this.repository = new PatientRepository();
    return;
  }
  public async save(payload: IPatient): Promise<PatientResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(payload: IPatient): Promise<PatientResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }
  public async findByParameters(
    queryParameters: object
  ): Promise<Array<PatientResponse> | PatientResponse> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response == null) return [];
    return response;
  }
  public async findByIdentification(
    identification: string
  ): Promise<PatientResponse | null> {
    const queryParameters = { identification: identification };
    const response = await this.repository.findByParameters(queryParameters);
    const register = response.pop();
    if (register === undefined) {
      return null;
    }
    return register;
  }
  public setRepository(repository: IRepository<IPatient, PatientResponse>) {
    this.repository = repository;
  }
}
