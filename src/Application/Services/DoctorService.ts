import { DoctorRepository } from '../Repositories/SettingsRepository';
import { Repository, Service } from '../Repositories/Interface';
import { IDoctor } from 'src/Domine/ModelsDB';
import { DoctorResponse } from 'src/Domine/Responses';

export class DoctorService extends Service<IDoctor, DoctorResponse> {
  public repository: Repository<IDoctor>;
  public constructor() {
    super();
    this.repository = DoctorRepository.getInstance();
  }
}
