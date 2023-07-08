import { IPatientStatus } from 'src/Domine/ModelsDB';
import { Repository } from '../Repositories/Interface';
import { PatientStatusResponse } from 'src/Domine/Responses';
import { PatientStatusRepository } from '../Repositories';

export class PatientStatusService {
  private repository: Repository<IPatientStatus>;
  private allPatientStatus: Array<PatientStatusResponse>;
  private static instance: PatientStatusService;

  public constructor() {
    this.repository = new PatientStatusRepository();
    this.allPatientStatus = [];
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
    if (!response.ok) return [];
    this.allPatientStatus = await response.json();
    return this.allPatientStatus;
  }
}
