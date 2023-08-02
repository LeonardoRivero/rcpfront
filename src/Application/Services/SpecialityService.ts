import { ISpeciality } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { SpecialityResponse } from 'src/Domine/Responses';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';

@injectable()
export class SpecialityService extends Service<
  ISpeciality,
  SpecialityResponse
> {
  public repository: Repository<ISpeciality>;
  public constructor(
    @inject('SpecialityRepository')
    repository: Repository<ISpeciality>
  ) {
    super();
    this.repository = repository;
    return;
  }
}
