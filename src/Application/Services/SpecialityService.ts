import { ISpeciality } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { SpecialityRepository } from '../Repositories/SettingsRepository';
import { SpecialityResponse } from 'src/Domine/Responses';

export class SpecialityService {
  private repository: IRepository<ISpeciality, SpecialityResponse>;
  public constructor() {
    this.repository = SpecialityRepository.getInstance();
    return;
  }
  public async save(payload: ISpeciality): Promise<SpecialityResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: ISpeciality
  ): Promise<SpecialityResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }

  public async getAll(): Promise<Array<SpecialityResponse>> {
    const response = await this.repository.getAll();
    if (response == null) return [];
    return response;
  }

  public setRepository(
    repository: IRepository<ISpeciality, SpecialityResponse>
  ) {
    this.repository = repository;
  }
}
