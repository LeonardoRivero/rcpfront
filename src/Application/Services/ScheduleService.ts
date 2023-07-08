import { EventSchedule } from 'src/Domine/ModelsDB';
import { Repository } from '../Repositories/Interface';
import { EventScheduleResponse } from 'src/Domine/Responses';
import { ScheduleRepository } from '../Repositories';

export class ScheduleService {
  private repository: Repository<EventSchedule>;
  public constructor() {
    this.repository = new ScheduleRepository();
    return;
  }
  public async save(
    payload: EventSchedule
  ): Promise<EventScheduleResponse | null> {
    const response = await this.repository.create(payload);
    if (!response.ok) return null;
    return await response.json();
  }

  public async update(
    payload: EventSchedule
  ): Promise<EventScheduleResponse | null> {
    if (payload.id == null) {
      throw EvalError('id is null or undefined');
    }
    const response = await this.repository.update(payload, payload.id);
    if (!response.ok) return null;
    return await response.json();
  }

  public async getById(id: number): Promise<EventScheduleResponse | null> {
    const response = await this.repository.getById(id);
    if (!response.ok) return null;
    return await response.json();
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<EventScheduleResponse> | EventScheduleResponse> {
    const response = await this.repository.findByParameters(queryParameters);
    if (!response.ok) return [];
    return await response.json();
  }

  public async delete(id: number): Promise<boolean> {
    const response = await this.repository.delete(id);
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
    return register;
  }
}
