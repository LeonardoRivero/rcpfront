import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { HealthInsuranceResponse } from 'src/Domine/Responses';

export class InsuranceService extends GenericService<
  IHealthInsurance,
  HealthInsuranceResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  public constructor() {
    super();
    const urlAPI = process.env.INSURANCE ? process.env.INSURANCE : '';
    this.urlBase = `${process.env.RCP}${urlAPI}filter/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}all/`;
    this.urlList = `${process.env.RCP}${urlAPI}list`;
    this.urlUpdate = `${process.env.RCP}${urlAPI}`;
  }
}
