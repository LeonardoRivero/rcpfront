import { EventSchedule } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { EventScheduleResponse } from 'src/Domine/Responses';
import { ScheduleRepository } from '../Repositories';

export class ScheduleService {
  private repository: IRepository<EventSchedule, EventScheduleResponse>;
  public constructor() {
    this.repository = new ScheduleRepository();
    return;
  }
  public async save(
    payload: EventSchedule
  ): Promise<EventScheduleResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: EventSchedule
  ): Promise<EventScheduleResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }

  public async getById(id: number): Promise<EventScheduleResponse | null> {
    const response = await this.repository.getById(id);
    return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<EventScheduleResponse> | EventScheduleResponse> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response == null) return [];
    return response;
  }

  public async delete(id: number): Promise<boolean> {
    const response = await this.repository.delete(id);
    return response;
  }

  public setRepository(
    repository: IRepository<EventSchedule, EventScheduleResponse>
  ) {
    this.repository = repository;
  }
}
