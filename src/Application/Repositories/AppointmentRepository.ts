import { IAppointment, IPaymentOptions } from 'src/Domine/ModelsDB';
import { EndPoints, Messages } from 'src/Application/Utilities';
import HttpStatusCodes from 'src/Application/Utilities/HttpStatusCodes';
import { GET, handleResponse } from 'src/Infraestructure/Utilities/Request';
import { IRepository } from './Interface';
import {
  AppointmentResponse,
  PaymentOptionsResponse,
} from 'src/Domine/Responses';

const endpoint = EndPoints.getInstance();
const messages = Messages.getInstance();
// type IAppointment = IAppointmentRequest | IAppointmentResponse | null;
export class AppointmentRepository
  implements IRepository<IAppointment, AppointmentResponse>
{
  async getById(id: number): Promise<AppointmentResponse | null> {
    const url = endpoint.updateOrGetAppointmentByScheduleId(id);
    try {
      const response = await GET(url);
      if (!response.ok) return null;
      if (response.status == HttpStatusCodes.NOT_FOUND) return null;
      if (response.status == HttpStatusCodes.BAD_REQUEST) return null;

      const data = (await response.parsedBody) as AppointmentResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  async getAll(): Promise<AppointmentResponse[] | null> {
    const url = endpoint.getORcreateConsult;
    try {
      throw Error(`Error in ${Object.name} `);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  create(entity: IAppointment): Promise<AppointmentResponse | null> {
    throw new Error('Method not implemented.');
  }

  update(entity: Partial<IAppointment>): Promise<AppointmentResponse | null> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findByParameters(
    parameters: object
  ): Promise<Array<AppointmentResponse>> {
    const urlBase = endpoint.getORcreateConsult;
    const url = endpoint.urlQueryParameter(urlBase, parameters);
    const response = await GET(url);
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      return [];
    }
    const data = (await response.parsedBody) as Array<AppointmentResponse>;
    return data;
  }
}

export class PaymentOptionsRepository
  implements IRepository<IPaymentOptions, PaymentOptionsResponse>
{
  getById(id: number): Promise<PaymentOptionsResponse | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<PaymentOptionsResponse[] | null> {
    const url = endpoint.getAllPaymentOptions;
    try {
      const response = await GET<Array<PaymentOptionsResponse>>(url);
      if (!response.ok || response.status == HttpStatusCodes.BAD_REQUEST)
        return null;
      const data = response.parsedBody as Array<PaymentOptionsResponse>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  create(entity: IPaymentOptions): Promise<PaymentOptionsResponse | null> {
    throw new Error('Method not implemented.');
  }
  update(
    entity: Partial<IPaymentOptions>
  ): Promise<PaymentOptionsResponse | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByParameters(parameters: object): Promise<PaymentOptionsResponse[]> {
    throw new Error('Method not implemented.');
  }
}
