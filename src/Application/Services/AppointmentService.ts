import { IAppointment } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  HealthInsuranceResponse,
} from 'src/Domine/Responses';
import { GenericService } from '../Repositories';

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
    this.urlCreate = `${this.urlBase}all/`;
    this.urlList = `${this.urlBase}all/`;
    this.urlUpdate = this.urlBase;
  }
  // public async save(
  //   payload: IAppointment
  // ): Promise<AppointmentResponse | null> {
  //   const response = await this.repository.create(payload);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public async update(
  //   payload: IAppointment
  // ): Promise<AppointmentResponse | null> {
  //   if (payload.id == undefined) {
  //     throw EvalError('id is undefined');
  //   }
  //   const response = await this.repository.update(payload, payload.id);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public async findByParameters(
  //   queryParameters: object
  // ): Promise<Array<AppointmentResponse>> {
  //   const response = await this.repository.findByParameters(queryParameters);
  //   if (!response.ok) return [];
  //   const data: AppointmentResponse[] = await response.json();
  //   return data;
  // }

  // public async getAll(): Promise<Array<AppointmentResponse>> {
  //   const response = await this.repository.getAll();
  //   if (response == null) return [];
  //   return await response.json();
  // }

  // public async getById(id: number): Promise<AppointmentResponse | null> {
  //   const response = await this.repository.getById(id);
  //   return await response.json();
  // }

  public calculateAmountPaid(
    insurance: HealthInsuranceResponse,
    appointment: IAppointment
  ): number {
    if (insurance.takeCopayment == true) {
      return +appointment.price - +appointment.copayment;
    }
    return appointment.price;
  }
}
