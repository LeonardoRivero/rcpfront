import { IPatient } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { PatientResponse } from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';
import { IPatientService } from 'src/Domine/IServices';

export class PatientService extends GenericService<IPatient, PatientResponse> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;

  public constructor() {
    super();
    const urlAPI = process.env.PATIENT ? process.env.PATIENT : '';
    this.urlBase = `${process.env.RCP}${urlAPI}all/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}all/`;
    this.urlList = `${process.env.RCP}${this.urlBase}all/`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }

  async findByIdentification(
    identification: string
  ): Promise<PatientResponse | null> {
    const queryParameters = { identification: identification };
    const yyy = await this.httpClient.GET(this.urlBase, queryParameters);
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
// export class PatientService implements IPatientService {
//   GenericService: GenericService<unknown, unknown>;
//   constructor() {
//     this.GenericService = new PatientGenericService();
//   }
//   async findByIdentification(
//     identification: string
//   ): Promise<PatientResponse | null> {
//     const queryParameters = { identification: identification };
//     const yyy = await this.GenericService.httpClient.GET(
//       this.GenericService.urlBase,
//       queryParameters
//     );
//     if (!yyy.ok || yyy.status == HttpStatusCode.NO_CONTENT) {
//       return null;
//     }
//     const fgfg: PatientResponse = await yyy.json();
//     console.log(fgfg);
//     // const register = fgfg.pop();
//     // if (register === undefined) {
//     //   return null;
//     // }
//     return fgfg;
//   }
// }
