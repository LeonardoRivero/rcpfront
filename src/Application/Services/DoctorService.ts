import { DoctorRepository } from '../Repositories/SettingsRepository';
import { GenericService, Repository, Service } from '../Repositories/Interface';
import { IDoctor } from 'src/Domine/ModelsDB';
import { DoctorResponse, DoctorSpecialityResponse } from 'src/Domine/Responses';

export class DoctorService extends GenericService<IDoctor, DoctorResponse> {
  public urlCreate: string;
  public urlList: string;
  public urlBase: string;
  public urlUpdate: string;

  public constructor() {
    super();
    const urlAPI = process.env.DOCTOR ? process.env.DOCTOR : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlCreate = `${this.urlBase}all/`;
    this.urlList = `${this.urlBase}all/`;
    this.urlUpdate = this.urlBase;
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
