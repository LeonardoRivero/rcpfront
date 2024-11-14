import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { AddEventToScheduleRequest } from 'src/Domine/Request';
import { ResponseData, ScheduleResponse } from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';
import { OPTIONS_HOURS, OPTIONS_MINUTES } from '../Utilities/Constants';
import { Messages } from '../Utilities/Messages';

export class AddEventScheduleUseCase implements IUseCase<AddEventToScheduleRequest, ScheduleResponse | null> {
  private url: string
  private optionsHours = OPTIONS_HOURS;
  private optionsMinutes = OPTIONS_MINUTES;

  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.SCHEDULE}`;
  }

  async execute(payload: AddEventToScheduleRequest): Promise<ScheduleResponse | null> {
    const dateIsValid = this.validateDate(payload.start)
    payload.start = new Date(payload.start).toISOString()
    if (dateIsValid === false) {
      throw new Error(Messages.dateOrHourNotValid);
    }

    const response = await this.httpClient.POST(this.url, payload);
    const doctorResponse: ResponseData<ScheduleResponse> = await response.json();
    if (!response.ok && response.status !== HttpStatusCode.FOUND) {
      throw new Error(doctorResponse.description)
    }
    return doctorResponse.result;
  }

  private validateDate(dateString: string): boolean {
    if (!this.isValidDate(dateString)) {
      return false;
    }
    const timeStamp = Date.now();
    const dateSchedule = new Date(dateString).getTime();
    if (dateSchedule < timeStamp) {
      return false;
    }
    if (dateSchedule > timeStamp) {
      return this.hourIsInRangeAllowed(dateString);
    }

    const hourIsGreater = this.hourGreater(dateString);
    if (hourIsGreater) {
      const response = this.hourIsInRangeAllowed(dateString);
      return response;
    }
    return false;
  }

  private hourIsInRangeAllowed(dateString: string): boolean {
    if (!this.isValidDate(dateString)) {
      return false;
    }

    const dateFormated = new Date(dateString);
    const hour = dateFormated.getHours();
    const minutes = dateFormated.getMinutes();

    if (this.optionsHours.includes(hour) && this.optionsMinutes.includes(minutes)
    ) {
      return true;
    }

    return false;
  }

  private hourGreater(dateString: string): boolean {
    if (!this.isValidDate(dateString)) {
      return false;
    }

    const dateFormated = new Date(dateString);
    const hour = dateFormated.getHours();
    const minutes = dateFormated.getMinutes();
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();

    if (this.optionsHours.includes(hour) && this.optionsMinutes.includes(minutes) && hour >= currentHour) {
      if (minutes > currentMinutes) {
        return true;
      }
      return false;
    }

    return false;
  }

  public isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}

export class GetByIdScheduleUseCase implements IUseCase<string, ScheduleResponse | null> {
  private url: string

  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.SCHEDULE}`;
  }

  async execute(id: string): Promise<ScheduleResponse | null> {
    const response = await this.httpClient.GET(`${this.url}${id}`);
    if (!response.ok || response.status == HttpStatusCode.NO_CONTENT) {
      return null;
    }
    const schedule: ResponseData<ScheduleResponse> = await response.json();
    return schedule.result;
  }
}


export class UpdateScheduleUseCase implements IUseCase<AddEventToScheduleRequest, ScheduleResponse | null> {
  private url: string

  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.SCHEDULE}`;
  }

  async execute(request: AddEventToScheduleRequest): Promise<ScheduleResponse | null> {
    request.start = new Date(request.start).toISOString()
    const response = await this.httpClient.PUT(`${this.url}${request.id}`, request);
    if (!response.ok || response.status == HttpStatusCode.NO_CONTENT) {
      return null;
    }
    const schedule: ResponseData<ScheduleResponse> = await response.json();
    return schedule.result;
  }
}
