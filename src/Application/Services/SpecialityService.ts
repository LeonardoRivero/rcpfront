import { ISpeciality } from 'src/Domine/ModelsDB';
import { Repository } from '../Repositories/Interface';
import { SpecialityResponse } from 'src/Domine/Responses';
import { UserService } from './UserService';
import { routerInstance } from 'src/boot/globalRouter';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import container from 'app/inversify.config';

@injectable()
export class SpecialityService extends UserService {
  private repository: Repository<ISpeciality>;
  public constructor(@inject(Repository) repository: Repository<ISpeciality>) {
    super();
    this.repository = repository;
    return;
  }
  public async save(payload: ISpeciality): Promise<SpecialityResponse | null> {
    const response = await this.repository.create(payload);
    if (!response.ok) return null;
    return await response.json();
  }

  public async update(
    payload: ISpeciality
  ): Promise<SpecialityResponse | null> {
    if (payload.id == null) {
      throw EvalError('id is null or undefined');
    }
    const response = await this.repository.update(payload, payload.id);
    if (!response.ok) return null;
    return await response.json();
  }

  public async getAll(): Promise<Array<SpecialityResponse>> {
    const response = await this.repository.getAll();
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
    }
    if (
      response.status == HttpStatusCodes.UNAUTHORIZED ||
      response.status == HttpStatusCodes.FORBIDDEN
    ) {
      return <Array<SpecialityResponse>>[];
    }
    if (response == null) return [];
    return await response.json();
  }
}
