import { IPatient } from 'src/Domine/ModelsDB';
import { Repository } from '../Repositories/Interface';
import { PatientResponse } from 'src/Domine/Responses';
import { PatientRepository } from '../Repositories/PatientRepository';

export class PatientService {
  private repository: Repository<IPatient>;
  public constructor() {
    this.repository = new PatientRepository();
  }

  public async save(payload: IPatient): Promise<PatientResponse | null> {
    const response = await this.repository.create(payload);
    if (!response.ok) return null;
    return await response.json();
  }

  public async update(payload: IPatient): Promise<PatientResponse | null> {
    if (payload.id == undefined) {
      throw EvalError('id is undefined');
    }
    const response = await this.repository.update(payload, payload.id);
    if (!response.ok) return null;
    return await response.json();
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<PatientResponse> | PatientResponse> {
    const response = await this.repository.findByParameters(queryParameters);
    if (!response.ok) return [];
    return await response.json();
  }

  public async findByIdentification(
    identification: string
  ): Promise<PatientResponse | null> {
    const queryParameters = { identification: identification };
    const response = await this.repository.findByParameters(queryParameters);
    const data = [await response.json()];
    const register = data.pop();
    if (register === undefined) {
      return null;
    }
    return register;
  }
}
