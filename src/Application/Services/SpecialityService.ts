import { ISpeciality } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { SpecialityResponse } from 'src/Domine/Responses';
import 'reflect-metadata';
import { injectable } from 'inversify';
@injectable()
export class SpecialityService extends GenericService<
  ISpeciality,
  SpecialityResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  constructor() {
    super();
    this.urlBase = process.env.SPECIALITY ? process.env.SPECIALITY : '';
    this.urlCreate = `${process.env.RCP}${this.urlBase}all`;
    this.urlList = `${process.env.RCP}${this.urlBase}list`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }
}
