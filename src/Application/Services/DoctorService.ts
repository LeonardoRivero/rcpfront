import { DoctorRepository } from '../Repositories/SettingsRepository';
import { Repository, Service } from '../Repositories/Interface';
import { IDoctor } from 'src/Domine/ModelsDB';
import { DoctorResponse, DoctorSpecialityResponse } from 'src/Domine/Responses';

export class DoctorService extends Service<IDoctor, DoctorResponse> {
  public repository: Repository<IDoctor>;
  public constructor() {
    super();
    this.repository = DoctorRepository.getInstance();
  }
}

export class DoctorSpecialityService extends Service<
  IDoctor,
  DoctorSpecialityResponse
> {
  public repository: Repository<IDoctor>;
  public constructor() {
    super();
    this.repository = DoctorRepository.getInstance();
  }
}
