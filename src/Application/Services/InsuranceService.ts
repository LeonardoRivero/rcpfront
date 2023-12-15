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
    this.urlBase = process.env.INSURANCE ? process.env.INSURANCE : '';
    this.urlCreate = `${process.env.RCP}${this.urlBase}all/`;
    this.urlList = `${process.env.RCP}${this.urlBase}all`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }
}
