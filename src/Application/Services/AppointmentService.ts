import { IAppointment } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  HealthInsuranceResponse,
} from 'src/Domine/Responses';
import { GenericService } from '../Repositories';
import { IToCreate, IToRead, IToUpdate, UseCase } from 'src/Domine/IPatterns';

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
}

export class CalculateAmountPaidAppointment
  implements UseCase<IAppointment, number>
{
  public GenericService: GenericService<IAppointment, AppointmentResponse>;
  private insurance: HealthInsuranceResponse;
  constructor(insurance: HealthInsuranceResponse) {
    this.GenericService = new AppointmentService();
    this.insurance = insurance;
  }

  execute(appointment: IAppointment): number {
    if (this.insurance.takeCopayment == true) {
      return +appointment.price - +appointment.copayment;
    }
    return appointment.price;
  }
}
