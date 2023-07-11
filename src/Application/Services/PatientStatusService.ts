import { IPatientStatus } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { PatientStatusResponse } from 'src/Domine/Responses';
import { PatientStatusRepository } from '../Repositories';

export class PatientStatusService extends Service<
  IPatientStatus,
  PatientStatusResponse
> {
  public repository: Repository<IPatientStatus>;
  private allPatientStatus: Array<PatientStatusResponse>;
  private static instance: PatientStatusService;

  public constructor() {
    super();
    this.repository = new PatientStatusRepository();
    this.allPatientStatus = [];
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
    const response = await this.repository.getAll();
    if (!response.ok) return [];
    this.allPatientStatus = await response.json();
    return this.allPatientStatus;
  }
}
