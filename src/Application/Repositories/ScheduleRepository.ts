import { EndPoints, Messages } from 'src/Application/Utilities';
import HttpStatusCodes from 'src/Application/Utilities/HttpStatusCodes';
import {
  DELETE,
  GET,
  handleResponse,
  POST,
  PUT,
} from 'src/Infraestructure/Utilities/Request';
import { IRepository } from './Interface';
import { EventSchedule } from 'src/Domine/ModelsDB';
import { EventScheduleResponse } from 'src/Domine/Responses';

const endpoint = EndPoints.getInstance();
const messages = Messages.getInstance();
// type EventSchedule = EventScheduleRequest | EventScheduleResponse | null;

export class ScheduleRepository
  implements IRepository<EventSchedule, EventScheduleResponse>
{
  public async getById(id: number): Promise<EventScheduleResponse | null> {
    const url = endpoint.updateOrGetScheduleById(id);
    try {
      const response = await GET<EventScheduleResponse>(url);
      if (!response.ok) return null;
      if (response.status == HttpStatusCodes.NOT_FOUND) return null;
      if (response.status == HttpStatusCodes.BAD_REQUEST) return null;

      const data = await response.json();
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  async getAll(): Promise<EventScheduleResponse[] | null> {
    const url = endpoint.getORcreateSchedule;
    try {
      throw Error(`Error in ${Object.name} `);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  async create(entity: EventSchedule): Promise<EventScheduleResponse | null> {
    const url = endpoint.getORcreateSchedule;
    try {
      const response = await POST<EventScheduleResponse>(url, entity);
      if (!response.ok) return null;
      handleResponse(response);
      if (response.status == HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  async update(
    entity: Partial<EventSchedule>
  ): Promise<EventScheduleResponse | null> {
    if (entity.id == null) {
      return null;
    }

    try {
      const url = endpoint.updateOrGetScheduleById(entity.id);
      const response = await PUT<EventScheduleResponse>(url, entity);
      if (!response.ok) return null;
      if (response.status == HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      handleResponse(response, messages.updateSuccesfully);
      const data = await response.json();
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name}:${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    const url = endpoint.updateOrGetScheduleById(id);
    const response = await DELETE(url);
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      return true;
    }
    return false;
  }

  async findByParameters(
    parameters: object
  ): Promise<Array<EventScheduleResponse>> {
    const urlBase = endpoint.getORcreateSchedule;
    const url = endpoint.urlQueryParameter(urlBase, parameters);
    const response = await GET<EventScheduleResponse>(url);
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      return [];
    }
    const data: EventScheduleResponse[] = [await response.json()];
    return data;
  }
}
