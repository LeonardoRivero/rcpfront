import {
  InforPatientPanelBloc,
  PreliminaryDataBloc,
  ScheduleFormBloc,
  SpecialityFormBloc,
} from 'src/Adapters';
import { FactoryNotifactors } from 'src/Adapters/Creators/Factories';
import {
  DoctorSpecialityService,
  FindPatientByIdentificationUseCase,
  PhysicalExamService,
} from 'src/Application/Services';
import { FindScheduleByIdentificationPatientUseCase } from 'src/Application/Services/ScheduleService';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { ClientAPI } from './Utilities/HttpClientAPI';
import { AppointmentListBloc } from 'src/Adapters/AppointmentListController';

const notificator = new FactoryNotifactors();
const HttpClientAPI = new ClientAPI();
function provideInfoPatientPanelPloc(): InforPatientPanelBloc {
  const findPatientByIdentificationUseCase =
    new FindPatientByIdentificationUseCase();
  const findScheduleByIdentificationPatientUseCase =
    new FindScheduleByIdentificationPatientUseCase();

  const productsPloc = new InforPatientPanelBloc(
    findPatientByIdentificationUseCase,
    findScheduleByIdentificationPatientUseCase,
    notificator
  );

  return productsPloc;
}

function providePreliminaryDataBloc(): PreliminaryDataBloc {
  const physicalExamService = PhysicalExamService.getInstance();
  return new PreliminaryDataBloc(physicalExamService);
}

function provideSpecialityBloc(): SpecialityFormBloc {
  const specialityService = new SpecialityService();
  return new SpecialityFormBloc(specialityService);
}

function provideScheduleBloc(): ScheduleFormBloc {
  const doctorSpecialityService = new DoctorSpecialityService(HttpClientAPI);
  return new ScheduleFormBloc(notificator, doctorSpecialityService);
}

function provideAppointmentListBloc(): AppointmentListBloc {
  return new AppointmentListBloc();
}
export const dependenciesLocator = {
  provideInfoPatientPanelPloc,
  providePreliminaryDataBloc,
  provideSpecialityBloc,
  provideScheduleBloc,
  provideAppointmentListBloc,
};
