import { AddEventToScheduleRequest } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { ScheduleResponse } from 'src/Domine/Responses';
import { UseCase } from 'src/Domine/IPatterns';
import HttpStatusCode from '../Utilities/HttpStatusCodes';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';
// import { injectable } from 'inversify';

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
    const urlAPI = process.env.SCHEDULE ? process.env.SCHEDULE : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlCreate = `${process.env.RCP}${urlAPI}create/`;
    this.urlList = `${process.env.RCP}${urlAPI}list`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }
  public override async getAll(): Promise<Array<EventScheduleResponse>> {
    throw new Error('Method not implemented.');
  }
}

// @injectable()
export class FindScheduleByIdentificationPatientUseCase
  implements UseCase<string, ScheduleResponse | null> {
  GenericService: GenericService<EventSchedule, EventScheduleResponse>;
  constructor() {
    this.GenericService = new ScheduleService();
  }

  async execute(
    identification: string | undefined
  ): Promise<ScheduleResponse | null> {
    const queryParameters = { patientIdentification: identification };
    const url = this.GenericService.urlBase + 'filter/';
    let response: Array<EventScheduleResponse>;
    // const response = await this.GenericService.findByParameters(
    //   queryParameters
    // );

    const request = await this.GenericService.httpClient.GET(
      url,
      queryParameters
    );
    if (!request.ok || request.status == HttpStatusCodes.NO_CONTENT) {
      response = [];
    } else {
      response = await request.json();
    }

    let register = undefined;
    if (Array.isArray(response)) {
      register = response.pop();
    }
    if (register === undefined) {
      return null;
    }
    return await this.GenericService.getById(register.id);
  }
}

export class DeleteScheduleUseCase implements UseCase<number, boolean> {
  GenericService: GenericService<EventSchedule, EventScheduleResponse>;

  constructor() {
    this.GenericService = new ScheduleService();
  }
  async execute(id: number): Promise<boolean> {
    const url = `${this.GenericService.urlBase}${id.toString()}`;
    const response = await this.GenericService.httpClient.DELETE(url);
    if (response.status === HttpStatusCode.NO_CONTENT) return true;
    return false;
  }
}
