import { Container } from 'inversify';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import {
  CountryService,
  RegionService,
  SubRegionService,
} from './Application/Services/GeographicCollectionService';
import { MedicalOfficeService } from './Application/Services/MedicalOfficeService';
import { ClientAPI } from './Infraestructure/Utilities/HttpClientAPI';
import {
  HTTPClient,
  IControllersMediator,
  IFactoryMethodNotifications,
  IToRead,
  Bloc,
  UseCase,
} from './Domine/IPatterns';
import { PaymentOptionsService } from './Application/Services/PaymentOptionsService';
import { IPaymentOptionsService } from './Domine/IServices';
import { GenericService } from './Application/Repositories';
import {
  CountryResponse,
  DoctorSpecialityResponse,
  EventScheduleResponse,
  PatientResponse,
  RegionResponse,
  SpecialityResponse,
  SubRegionResponse,
} from './Domine/Responses';
import { ISpeciality } from './Domine/ModelsDB';
import { FactoryNotifactors } from './Adapters/Creators/Factories';
import { DoctorSpecialityService } from './Application/Services/DoctorService';
import { ClinicHistoryMediator } from './Infraestructure/Mediators';
import { InfoPatientState } from './Domine/IStates';
import { FindPatientByIdentificationUseCase } from './Application/Services';
import { FindScheduleByIdentificationPatientUseCase } from './Application/Services/ScheduleService';
import { InforPatientPanelBloc } from './Adapters/ClinicHistoryController';

const container = new Container();
container.bind<HTTPClient>('HTTPClient').to(ClientAPI);
container
  .bind<GenericService<ISpeciality, SpecialityResponse>>('SpecialityService')
  .to(SpecialityService)
  .inSingletonScope();
container
  .bind<GenericService<any, CountryResponse>>('CountryService')
  .to(CountryService)
  .inSingletonScope();
container
  .bind<GenericService<any, SubRegionResponse>>('SubRegionService')
  .to(SubRegionService);
container
  .bind<GenericService<any, RegionResponse>>('RegionService')
  .to(RegionService)
  .inSingletonScope();
container
  .bind<MedicalOfficeService>('MedicalOfficeService')
  .to(MedicalOfficeService);

container
  .bind<IFactoryMethodNotifications>('FactoryNotifactors')
  .to(FactoryNotifactors)
  .inSingletonScope();

container
  .bind<IToRead<DoctorSpecialityResponse>>('DoctorSpecialityService')
  .to(DoctorSpecialityService)
  .inSingletonScope();

container
  .bind<IControllersMediator>('ClinicHistoryMediator')
  .to(ClinicHistoryMediator)
  .inSingletonScope();

container
  .bind<UseCase<string, EventScheduleResponse | null>>(
    'FindScheduleByIdentificationPatientUseCase'
  )
  .to(FindScheduleByIdentificationPatientUseCase);

container
  .bind<UseCase<string, PatientResponse | null>>(
    'FindPatientByIdentificationUseCase'
  )
  .to(FindPatientByIdentificationUseCase)
  .inSingletonScope();

export default container;
