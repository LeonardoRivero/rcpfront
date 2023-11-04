import { Container } from 'inversify';
import {
  CountryRepository,
  GenericService,
  MedicalOfficeRepository,
  RegionRepository,
  Repository,
  SpecialityRepository,
  SubRegionRepository,
} from 'src/Application/Repositories';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  CountryService,
  RegionService,
  SubRegionService,
} from './Application/Services/GeographicCollectionService';
import {
  CountryResponse,
  MedicalOfficeResponse,
  RegionResponse,
  SubRegionResponse,
} from './Domine/Responses';
import { MedicalOfficeService } from './Application/Services/MedicalOfficeService';
import { ClientAPI } from './Infraestructure/ClientsAPI/SettingClientsAPI';
import { HTTPClient } from './Domine/IPatterns';

const container = new Container();
container.bind<HTTPClient>('HTTPClient').to(ClientAPI);

container
  .bind<Repository<ISpeciality>>('SpecialityRepository')
  .to(SpecialityRepository);
container.bind<SpecialityService>('SpecialityService').to(SpecialityService);

container
  .bind<Repository<CountryResponse>>('CountryRepository')
  .to(CountryRepository);
container.bind<CountryService>('CountryService').to(CountryService);

container
  .bind<Repository<SubRegionResponse>>('SubRegionRepository')
  .to(SubRegionRepository);
container.bind<SubRegionService>('SubRegionService').to(SubRegionService);

container
  .bind<Repository<MedicalOfficeResponse>>('MedicalOfficeRepository')
  .to(MedicalOfficeRepository);
container
  .bind<MedicalOfficeService>('MedicalOfficeService')
  .to(MedicalOfficeService);

container
  .bind<Repository<RegionResponse>>('RegionRepository')
  .to(RegionRepository);
container.bind<RegionService>('RegionService').to(RegionService);

export default container;
