import { IAppointment } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  HealthInsuranceResponse,
  PaginationAppointmentResponse,
} from 'src/Domine/Responses';
import { GenericService } from '../Repositories';
import {
  HTTPClient,
  IToCreate,
  IToRead,
  IToUpdate,
  UseCase,
} from 'src/Domine/IPatterns';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';
import { IPaginationDataTable } from 'src/Domine/ICommons';
export class AppointmentService extends GenericService<
  IAppointment,
  AppointmentResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  public constructor() {
    super();
    const urlAPI = process.env.CONSULT ? process.env.CONSULT : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlCreate = `${this.urlBase}create/`;
    this.urlList = `${this.urlBase}list/`;
    this.urlUpdate = this.urlBase;
  }
}

export class CalculateAmountPaidAppointmentUseCase
  implements UseCase<IAppointment, number>
{
  public GenericService: GenericService<IAppointment, AppointmentResponse>;
  public insurance: HealthInsuranceResponse | undefined;
  constructor() {
    this.GenericService = new AppointmentService();
  }

  execute(appointment: IAppointment): number {
    if (this.insurance == undefined) {
      throw new EvalError('Insurance is undefined');
    }
    if (this.insurance.takeCopayment == true) {
      return +appointment.price - +appointment.copayment;
    }
    return appointment.price;
  }
}
@injectable()
export class PaginationAppointmentService
  implements IToRead<PaginationAppointmentResponse>
{
  urlList: string;
  urlBase: string;
  httpClient: HTTPClient;

  public constructor(@inject('HTTPClient') httpClient: HTTPClient) {
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
  implements UseCase<void, PaginationAppointmentResponse>
{
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
