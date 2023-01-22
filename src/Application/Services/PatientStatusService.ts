import { IPatientStatus } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { PatientStatusResponse } from 'src/Domine/Responses';
import { PatientStatusRepository } from '../Repositories';

export class PatientStatusService {
  private repository: IRepository<IPatientStatus, PatientStatusResponse>;
  private allPatientStatus: Array<PatientStatusResponse>;
  private static instance: PatientStatusService;

  public constructor() {
    this.repository = new PatientStatusRepository();
    this.allPatientStatus = [];
    return;
  }

  public static getInstance(): PatientStatusService {
    if (!PatientStatusService.instance) {
      PatientStatusService.instance = new PatientStatusService();
    }
    return PatientStatusService.instance;
  }

  public async getAll(): Promise<Array<PatientStatusResponse>> {
    if (this.allPatientStatus.length !== 0) {
      return this.allPatientStatus;
    }
    const response = await this.repository.getAll();
    if (response == null) return [];
    this.allPatientStatus = response;
    return response;
  }
}
