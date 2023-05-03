import { IAppointment } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  HealthInsuranceResponse,
} from 'src/Domine/Responses';
import { AppointmentRepository, IRepository } from '../Repositories';

export class AppointmentService {
  private repository: IRepository<IAppointment, AppointmentResponse>;
  public constructor() {
    this.repository = new AppointmentRepository();
    return;
  }
  public async save(
    payload: IAppointment
  ): Promise<AppointmentResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: IAppointment
  ): Promise<AppointmentResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<AppointmentResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response == null || response.length === 0) return [];
    return response;
  }

  public async getAll(): Promise<Array<AppointmentResponse>> {
    const response = await this.repository.getAll();
    if (response == null) return [];
    return response;
  }

  public async getById(id: number): Promise<AppointmentResponse | null> {
    const response = await this.repository.getById(id);
    return response;
  }

  public setRepository(
    repository: IRepository<IAppointment, AppointmentResponse>
  ) {
    this.repository = repository;
  }
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
