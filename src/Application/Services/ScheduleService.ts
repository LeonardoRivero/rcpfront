import { EventSchedule } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { EventScheduleResponse } from 'src/Domine/Responses';

export class ScheduleService extends GenericService<
  EventSchedule,
  EventScheduleResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  public constructor() {
    super();
    this.urlBase = process.env.SCHEDULE ? process.env.SCHEDULE : '';
    this.urlCreate = `${process.env.RCP}${this.urlBase}all`;
    this.urlList = `${process.env.RCP}${this.urlBase}list`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }
  public override async getAll(): Promise<Array<EventScheduleResponse>> {
    throw new Error('Method not implemented.');
  }

  public async delete(id: number): Promise<boolean> {
    const response = await this.delete(id);
    return response;
  }

  public async findByIdentificationPatient(
    identification: string
  ): Promise<EventScheduleResponse | null> {
    const queryParameters = { patientIdentification: identification };
    const response = await this.findByParameters(queryParameters);
    let register = undefined;
    if (Array.isArray(response)) {
      register = response.pop();
    }
    if (register === undefined) {
      return null;
    }
    return await this.getById(register.id);
  }
}
