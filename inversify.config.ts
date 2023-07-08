import { Container } from 'inversify';
import { Repository, SpecialityRepository } from 'src/Application/Repositories';
import { ISpeciality } from 'src/Domine/ModelsDB';

const container = new Container();
container
  .bind<Repository<ISpeciality>>(Repository<ISpeciality>)
  .to(SpecialityRepository);

export default container;
