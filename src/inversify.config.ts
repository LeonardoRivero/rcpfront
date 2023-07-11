import { Container } from 'inversify';
import { Repository, SpecialityRepository } from 'src/Application/Repositories';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { ISpeciality } from 'src/Domine/ModelsDB';

const container = new Container();
container
  .bind<Repository<ISpeciality>>('SpecialityRepository')
  .to(SpecialityRepository);
container.bind<SpecialityService>('SpecialityService').to(SpecialityService);

export default container;
