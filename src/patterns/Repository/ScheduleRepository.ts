import {
  EventScheduleRequest,
  EventScheduleResponse,
} from 'src/models/ICommons';

import { EndPoints, Messages } from 'src/scripts/Constants';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { DELETE, GET, handleResponse, POST, PUT } from 'src/scripts/Request';
import { IRepository } from './Interface';

const endpoint = EndPoints.getInstance();
const messages = Messages.getInstance();
type EventSchedule = EventScheduleRequest | EventScheduleResponse | null;

export class ScheduleRepository implements IRepository<EventSchedule> {
  async getById(id: number): Promise<EventScheduleResponse | null> {
    const url = endpoint.updateOrGetScheduleById(id);
    try {
      const response = await GET(url);
      if (!response.ok) return null;
      if (response.status == HttpStatusCodes.NOT_FOUND) return null;
      if (response.status == HttpStatusCodes.BAD_REQUEST) return null;

      const data = (await response.parsedBody) as EventScheduleResponse;
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

  async create(
    entity: EventScheduleRequest
  ): Promise<EventScheduleResponse | null> {
    const url = endpoint.getORcreateSchedule;
    try {
      const response = await POST(url, entity);
      if (!response.ok) return null;
      handleResponse(response);
      if (response.status == HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      const data = (await response.parsedBody) as EventScheduleResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  async update(
    entity: Partial<EventScheduleRequest>
  ): Promise<EventScheduleResponse | null> {
    if (entity.id == null) {
      return null;
    }

    try {
      const url = endpoint.updateOrGetScheduleById(entity.id);
      const response = await PUT(url, entity);
      if (!response.ok) return null;
      if (response.status == HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      handleResponse(response, messages.updateSuccesfully);
      const data = (await response.parsedBody) as EventScheduleResponse;
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
  ): Promise<Array<EventScheduleResponse> | null> {
    const urlBase = endpoint.getORcreateConsult;
    const url = endpoint.urlQueryParameter(urlBase, parameters);
    const response = await GET(url);
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      return [];
    }
    const data = (await response.parsedBody) as Array<EventScheduleResponse>;
    return data;
  }
}
