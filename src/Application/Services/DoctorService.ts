
import { DoctorSpecialityResponse } from 'src/Domine/Responses';
import { HTTPClient, IToRead } from 'src/Domine/IPatterns';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';
// import 'reflect-metadata';
// import { inject, injectable } from 'inversify';

// export class DoctorService extends GenericService<IDoctor, DoctorResponse> {
//   public urlCreate: string;
//   public urlList: string;
//   public urlBase: string;
//   public urlUpdate: string;

//   public constructor() {
//     super();
//     const urlAPI = process.env.DOCTOR ? process.env.DOCTOR : '';
//     this.urlBase = `${process.env.RCP}${urlAPI}`;
//     this.urlCreate = `${this.urlBase}create/`;
//     this.urlList = `${this.urlBase}all/`;
//     this.urlUpdate = this.urlBase;
//   }
// }

// @injectable()
export class DoctorSpecialityService
  implements IToRead<DoctorSpecialityResponse> {
  public httpClient: HTTPClient;
  urlList: string;
  urlBase: string;

  public constructor(httpClient: HTTPClient) {
    const urlAPI = process.env.DOCTOR_SPECIALITY
      ? process.env.DOCTOR_SPECIALITY
      : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlList = `${this.urlBase}all/`;
    this.httpClient = httpClient;
  }
  async findByParameters(
    queryParameters: object
  ): Promise<DoctorSpecialityResponse[]> {
    const response = await this.httpClient.GET(this.urlBase, queryParameters);
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    const data: DoctorSpecialityResponse[] = await response.json();
    return data;
  }

  async getAll(): Promise<DoctorSpecialityResponse[]> {
    throw new Error('Method not implemented.');
  }
  async getById(id: number): Promise<DoctorSpecialityResponse | null> {
    throw new Error('Method not implemented.');
  }
}
