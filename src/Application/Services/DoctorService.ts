import { DoctorRepository } from '../Repositories/SettingsRepository';
import { IRepository } from '../Repositories/Interface';
import { IDoctor } from 'src/Domine/ModelsDB';
import { DoctorResponse } from 'src/Domine/Responses';

export class DoctorService {
  private repository: IRepository<IDoctor, DoctorResponse>;
  public constructor() {
    this.repository = DoctorRepository.getInstance();
    return;
  }
  public async save(payload: IDoctor): Promise<DoctorResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(payload: IDoctor): Promise<DoctorResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<DoctorResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response == null || response.length === 0) return [];
    return response;
  }

  public async getAll(): Promise<Array<DoctorResponse>> {
    const response = await this.repository.getAll();
    if (response == null) return [];
    return response;
  }

  public async getById(id: number): Promise<DoctorResponse | null> {
    const response = await this.repository.getById(id);
    return response;
  }

  public setRepository(repository: IRepository<IDoctor, DoctorResponse>) {
    this.repository = repository;
  }
}
