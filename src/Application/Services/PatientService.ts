import { IPatient } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { PatientResponse } from 'src/Domine/Responses';
import { PatientRepository } from '../Repositories/PatientRepository';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

export class PatientService extends Service<IPatient, PatientResponse> {
  public repository: Repository<IPatient>;
  public constructor() {
    super();
    this.repository = new PatientRepository();
  }

  // public async save(payload: IPatient): Promise<PatientResponse | null> {
  //   const response = await this.repository.create(payload);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public async update(payload: IPatient): Promise<PatientResponse | null> {
  //   if (payload.id == undefined) {
  //     throw EvalError('id is undefined');
  //   }
  //   const response = await this.repository.update(payload, payload.id);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public override async findByParameters(
  //   queryParameters: object
  // ): Promise<Array<PatientResponse>> {
  //   const response = await this.repository.findByParameters(queryParameters);
  //   if (!response.ok) return [];
  //   return await response.json();
  // }

  public async findByIdentification(
    identification: string
  ): Promise<PatientResponse | null> {
    const queryParameters = { identification: identification };
    const yyy = await this.repository.findByParameters(queryParameters);
    if (!yyy.ok || yyy.status == HttpStatusCode.NO_CONTENT) {
      return null;
    }
    const fgfg: PatientResponse = await yyy.json();
    console.log(fgfg);
    // const register = fgfg.pop();
    // if (register === undefined) {
    //   return null;
    // }
    return fgfg;
  }
}
