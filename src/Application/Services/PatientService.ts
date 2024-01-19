import { IPatient } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { PatientResponse } from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';
import { UseCase } from 'src/Domine/IPatterns';
import { injectable } from 'inversify';

export class PatientService extends GenericService<IPatient, PatientResponse> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;

  public constructor() {
    super();
    const urlAPI = process.env.PATIENT ? process.env.PATIENT : '';
    this.urlBase = `${process.env.RCP}${urlAPI}filter/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}create/`;
    this.urlList = '';
    this.urlUpdate = `${process.env.RCP}${urlAPI}`;
  }

  override async getAll(): Promise<PatientResponse[]> {
    throw new Error('Method not implemented.');
  }
}

@injectable()
export class FindPatientByIdentificationUseCase
  implements UseCase<string, PatientResponse | null>
{
  GenericService: GenericService<IPatient, PatientResponse>;

  public constructor() {
    this.GenericService = new PatientService();
  }

  async execute(
    identification: string | undefined
  ): Promise<PatientResponse | null> {
    const queryParameters = { identification: identification };
    const response = await this.GenericService.httpClient.GET(
      this.GenericService.urlBase,
      queryParameters
    );
    if (!response.ok || response.status == HttpStatusCode.NO_CONTENT) {
      return null;
    }
    const patient: PatientResponse = await response.json();
    // const register = fgfg.pop();
    // if (register === undefined) {
    //   return null;
    // }
    return patient;
  }
}
