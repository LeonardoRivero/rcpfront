import { IAppointment } from 'src/Domine/Request';
import {
  AppointmentResponse,
  HealthInsuranceResponse,
  PaginationAppointmentResponse,
} from 'src/Domine/Responses';
import { GenericService } from '../Repositories';
import { HTTPClient, IToRead, IUseCase, UseCase } from 'src/Domine/IPatterns';
// import 'reflect-metadata';
// import { inject, injectable } from 'inversify';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';
import { IPaginationDataTable } from 'src/Domine/ICommons';
// export class AppointmentService extends GenericService<
//   IAppointment,
//   AppointmentResponse
// > {
//   urlCreate: string;
//   urlList: string;
//   urlBase: string;
//   urlUpdate: string;
//   public constructor() {
//     super();
//     const urlAPI = process.env.CONSULT ? process.env.CONSULT : '';
//     this.urlBase = `${process.env.RCP}${urlAPI}`;
//     this.urlCreate = `${this.urlBase}create/`;
//     this.urlList = `${this.urlBase}list/`;
//     this.urlUpdate = this.urlBase;
//   }
// }

// @injectable()
export class PaginationAppointmentService
  implements IToRead<PaginationAppointmentResponse> {
  urlList: string;
  urlBase: string;
  httpClient: HTTPClient;

  public constructor(httpClient: HTTPClient) {
    const urlAPI = process.env.CONSULT ? process.env.CONSULT : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlList = `${this.urlBase}list/`;
    this.httpClient = httpClient;
  }
  getAll(): Promise<PaginationAppointmentResponse[]> {
    throw new Error('Method not implemented.');
  }
  getById(id: number): Promise<PaginationAppointmentResponse | null> {
    throw new Error('Method not implemented.');
  }
  async findByParameters(
    queryParameters: object
  ): Promise<PaginationAppointmentResponse[]> {
    const response = await this.httpClient.GET(this.urlBase, queryParameters);
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    const data: PaginationAppointmentResponse = await response.json();
    return [data];
  }
}
export class ListAppointmentByPaginationUseCase
  implements UseCase<void, PaginationAppointmentResponse> {
  private pagination: IPaginationDataTable;
  GenericService: GenericService<IAppointment, AppointmentResponse>;
  constructor(pagination: IPaginationDataTable) {
    this.GenericService = new AppointmentService();
    this.pagination = pagination;
  }
  async execute(): Promise<PaginationAppointmentResponse> {
    const response = await this.GenericService.httpClient.GET(
      this.GenericService.urlList,
      {
        page: this.pagination.page,
        page_size: this.pagination.rowsPerPage,
      }
    );
    const data: PaginationAppointmentResponse = await response.json();
    return data;
  }
}
