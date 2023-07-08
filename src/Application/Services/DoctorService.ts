import { DoctorRepository } from '../Repositories/SettingsRepository';
import { Repository } from '../Repositories/Interface';
import { IDoctor } from 'src/Domine/ModelsDB';
import { DoctorResponse } from 'src/Domine/Responses';

export class DoctorService {
  private repository: Repository<IDoctor>;
  public constructor() {
    this.repository = DoctorRepository.getInstance();
    return;
  }
  public async save(payload: IDoctor): Promise<DoctorResponse | null> {
    const response = await this.repository.create(payload);
    if (!response.ok) return null;
    return await response.json();
  }

  public async update(payload: IDoctor): Promise<DoctorResponse | null> {
    if (payload.id == undefined) {
      throw EvalError('id is undefined');
    }
    const response = await this.repository.update(payload, payload.id);
    if (!response.ok) return null;
    return await response.json();
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<DoctorResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (!response.ok) return [];
    return await response.json();
  }

  public async getAll(): Promise<Array<DoctorResponse>> {
    const response = await this.repository.getAll();
    if (!response.ok) return [];
    return await response.json();
  }

  public async getById(id: number): Promise<DoctorResponse | null> {
    const response = await this.repository.getById(id);
    if (!response.ok) return null;
    return await response.json();
  }
}
