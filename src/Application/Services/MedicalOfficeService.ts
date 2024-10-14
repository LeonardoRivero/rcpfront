import { IMedicalOffice } from 'src/Domine/ModelsDB';
import { MedicalOfficeResponse } from 'src/Domine/Responses';
import 'reflect-metadata';
// import { injectable } from 'inversify';
import { GenericService } from '../Repositories/Interface';

// @injectable()
export class MedicalOfficeService extends GenericService<
  IMedicalOffice,
  MedicalOfficeResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  constructor() {
    super();
    this.urlBase = process.env.MEDICAL_OFFICE ? process.env.MEDICAL_OFFICE : '';
    this.urlCreate = `${process.env.RCP}${this.urlBase}create/`;
    this.urlList = `${process.env.RCP}${this.urlBase}list/`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}update/`;
  }
}
