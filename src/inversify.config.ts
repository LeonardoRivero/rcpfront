import { Container } from 'inversify';
import { Repository } from 'src/Application/Repositories';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  CountryService,
  RegionService,
  SubRegionService,
} from './Application/Services/GeographicCollectionService';
import { MedicalOfficeResponse } from './Domine/Responses';
import { MedicalOfficeService } from './Application/Services/MedicalOfficeService';
import { ClientAPI } from './Infraestructure/Utilities/HttpClientAPI';
import { HTTPClient } from './Domine/IPatterns';

const container = new Container();
container.bind<HTTPClient>('HTTPClient').to(ClientAPI);
container.bind<SpecialityService>('SpecialityService').to(SpecialityService);

container.bind<CountryService>('CountryService').to(CountryService);

container.bind<SubRegionService>('SubRegionService').to(SubRegionService);

// container
//   .bind<Repository<MedicalOfficeResponse>>('MedicalOfficeRepository')
//   .to(MedicalOfficeRepository);
container
  .bind<MedicalOfficeService>('MedicalOfficeService')
  .to(MedicalOfficeService);

container.bind<RegionService>('RegionService').to(RegionService);

export default container;
