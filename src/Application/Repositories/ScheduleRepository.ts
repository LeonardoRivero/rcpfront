import { Repository } from './Interface';
import { EventSchedule } from 'src/Domine/ModelsDB';
export class ScheduleRepository extends Repository<EventSchedule> {
  url: string;
  urlWithParameters: string;

  public constructor() {
    super();
    this.url = process.env.SCHEDULE ? process.env.SCHEDULE : '';
    this.urlWithParameters = '';
  }

  // public async getById(id: number): Promise<EventScheduleResponse | null> {
  //   const url = endpoint.updateOrGetScheduleById(id);
  //   try {
  //     const response = await GET(url);
  //     if (!response.ok) return null;
  //     if (response.status == HttpStatusCodes.NOT_FOUND) return null;
  //     if (response.status == HttpStatusCodes.BAD_REQUEST) return null;

  //     const data: EventScheduleResponse = await response.json();
  //     return data;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }

  public override async getAll(): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  // async create(entity: EventSchedule): Promise<EventScheduleResponse | null> {
  //   const url = EndPoints.buildFullUrl(process.env.SCHEDULE);
  //   try {
  //     const response = await POST(url, entity);
  //     if (!response.ok) return null;
  //     handleResponse(response);
  //     if (response.status == HttpStatusCodes.BAD_REQUEST) {
  //       return null;
  //     }
  //     const data: EventScheduleResponse = await response.json();
  //     return data;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }

  // async update(
  //   entity: Partial<EventSchedule>
  // ): Promise<EventScheduleResponse | null> {
  //   if (entity.id == null) {
  //     return null;
  //   }

  //   try {
  //     const url = endpoint.updateOrGetScheduleById(entity.id);
  //     const response = await PUT(url, entity);
  //     if (!response.ok) return null;
  //     if (response.status == HttpStatusCodes.BAD_REQUEST) {
  //       return null;
  //     }
  //     handleResponse(response, messages.updateSuccesfully);
  //     const data: EventScheduleResponse = await response.json();
  //     return data;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name}:${error}`);
  //   }
  // }

  // async delete(id: number): Promise<boolean> {
  //   const url = endpoint.updateOrGetScheduleById(id);
  //   const response = await DELETE(url);
  //   if (response.status == HttpStatusCodes.NO_CONTENT) {
  //     return true;
  //   }
  //   return false;
  // }

  // async findByParameters(
  //   parameters: object
  // ): Promise<Array<EventScheduleResponse>> {
  //   const urlBase = EndPoints.buildFullUrl(process.env.SCHEDULE);
  //   const url = EndPoints.urlQueryParameter(urlBase, parameters);
  //   const response = await GET(url);
  //   if (response.status == HttpStatusCodes.NO_CONTENT) {
  //     return [];
  //   }
  //   const data: EventScheduleResponse[] = await response.json();
  //   return data;
  // }
}
