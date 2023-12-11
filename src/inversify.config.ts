import { Container } from 'inversify';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import {
  CountryService,
  RegionService,
  SubRegionService,
} from './Application/Services/GeographicCollectionService';
import { MedicalOfficeService } from './Application/Services/MedicalOfficeService';
import { ClientAPI } from './Infraestructure/Utilities/HttpClientAPI';
import { HTTPClient } from './Domine/IPatterns';
import { PaymentOptionsService } from './Application/Services/PaymentOptionsService';
import { IPatientService, IPaymentOptionsService } from './Domine/IServices';

const container = new Container();
container.bind<HTTPClient>('HTTPClient').to(ClientAPI);
container.bind<SpecialityService>('SpecialityService').to(SpecialityService);
container.bind<CountryService>('CountryService').to(CountryService);
container.bind<SubRegionService>('SubRegionService').to(SubRegionService);
container.bind<RegionService>('RegionService').to(RegionService);
container
  .bind<MedicalOfficeService>('MedicalOfficeService')
  .to(MedicalOfficeService);

container
  .bind<IPaymentOptionsService>('PaymentOptionsService')
  .to(PaymentOptionsService);
// container
//   .bind<IPatientService>('PaymentOptionsService')
//   .to(PatientService);
export default container;
