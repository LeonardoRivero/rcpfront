import { IPatientStatus } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { PatientStatusResponse } from 'src/Domine/Responses';

export class PatientStatusService extends GenericService<
  IPatientStatus,
  PatientStatusResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  private allPatientStatus: Array<PatientStatusResponse>;
  private static instance: PatientStatusService;

  public constructor() {
    super();
    this.allPatientStatus = [];
    const urlAPI = process.env.PATIENT_STATUS ? process.env.PATIENT_STATUS : '';
    this.urlBase = `${process.env.RCP}${urlAPI}all/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}create/`;
    this.urlList = `${process.env.RCP}${urlAPI}list/`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }

  public static getInstance(): PatientStatusService {
    if (!PatientStatusService.instance) {
      PatientStatusService.instance = new PatientStatusService();
    }
    return PatientStatusService.instance;
  }

  public override async getAll(): Promise<Array<PatientStatusResponse>> {
    if (this.allPatientStatus.length !== 0) {
      return this.allPatientStatus;
    }
    const response = await this.httpClient.GET(this.urlList);
    if (!response.ok) return [];
    this.allPatientStatus = await response.json();
    return this.allPatientStatus;
  }
}
