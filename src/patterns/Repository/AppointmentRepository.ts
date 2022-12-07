import {
  IAppointmentRequest,
  IAppointmentResponse,
} from 'src/models/IConsults';
import { EndPoints, Messages } from 'src/scripts/Constants';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { GET, handleResponse } from 'src/scripts/Request';
import { IRepository } from './Interface';

const endpoint = EndPoints.getInstance();
const messages = Messages.getInstance();
type IAppointment = IAppointmentRequest | IAppointmentResponse | null;
export class AppointmentRepository implements IRepository<IAppointment> {
  async getById(id: number): Promise<IAppointment | null> {
    const url = endpoint.updateOrGetAppointmentByScheduleId(id);
    try {
      const response = await GET(url);
      if (!response.ok) return null;
      if (response.status == HttpStatusCodes.NOT_FOUND) return null;
      if (response.status == HttpStatusCodes.BAD_REQUEST) return null;

      const data = (await response.parsedBody) as IAppointmentResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  async getAll(): Promise<IAppointmentResponse[] | null> {
    const url = endpoint.getORcreateConsult;
    try {
      throw Error(`Error in ${Object.name} `);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  create(entity: IAppointmentRequest): Promise<IAppointmentResponse | null> {
    throw new Error('Method not implemented.');
  }

  update(
    entity: Partial<IAppointmentRequest>
  ): Promise<IAppointmentResponse | null> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findByParameters(
    parameters: object
  ): Promise<Array<IAppointmentResponse> | null> {
    const urlBase = endpoint.getORcreateConsult;
    const url = endpoint.urlQueryParameter(urlBase, parameters);
    const response = await GET(url);
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      return [];
    }
    const data = (await response.parsedBody) as Array<IAppointmentResponse>;
    return data;
  }
}
