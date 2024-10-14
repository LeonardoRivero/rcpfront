import {
  DxMainCodeBloc,
  InforPatientPanelBloc,
  MedicalProcedureBloc,
  PatientFormBloc,
  PreliminaryDataBloc,
  RelationCodeBloc,
  ScheduleFormBloc,
  SpecialityFormBloc,
} from 'src/Adapters';
import { FactoryNotifactors } from 'src/Infraestructure/Utilities/Factories';
import {
  DoctorSpecialityService,
  FindPatientByIdentificationUseCase,
  GetPhysicalExamBySpecialityUseCase,
  PatientService,
  PhysicalExamService,
} from 'src/Application/Services';
import { FindScheduleByIdentificationPatientUseCase } from 'src/Application/Services/ScheduleService';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { ClientAPI } from './Utilities/HttpClientAPI';
import { AppointmentListBloc } from 'src/Adapters/AppointmentListController';
import { MediatorUseCases } from 'src/Application/UseCases/MediatorUseCases';
import { IHandleGlobalState } from 'src/Domine/IPatterns';
import { HandleGlobalState } from './HandleGlobalState';
import { CreatePatientUseCase } from 'src/Application/UseCases/PatientUseCases';

const notificator = new FactoryNotifactors();
const HttpClientAPI = new ClientAPI();
const findPatientByIdentificationUseCase =
  new FindPatientByIdentificationUseCase(HttpClientAPI);

function provideInfoPatientPanelPloc(): InforPatientPanelBloc {
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

function provideMedicalProcedureBloc(): MedicalProcedureBloc {
  const getPhysicalExamBySpecilityUseCase =
    new GetPhysicalExamBySpecialityUseCase();
  return new MedicalProcedureBloc(getPhysicalExamBySpecilityUseCase);
}

function provideDxMainCodeBloc(): DxMainCodeBloc {
  return new DxMainCodeBloc();
}

function provideRelationCodeBloc(): RelationCodeBloc {
  return new RelationCodeBloc();
}

function providePatientFormBloc(): PatientFormBloc {
  const patientService = new PatientService(HttpClientAPI);
  const mediatorUseCases = new MediatorUseCases(HttpClientAPI)
  const createPatientUseCase = new CreatePatientUseCase(HttpClientAPI)
  return new PatientFormBloc(
    notificator,
    patientService,
    findPatientByIdentificationUseCase,
    createPatientUseCase,
    mediatorUseCases
  );
}

function provideHandleGlobalState(): IHandleGlobalState {
  return HandleGlobalState.getInstance(HttpClientAPI);
}
export const dependenciesLocator = {
  provideInfoPatientPanelPloc,
  providePreliminaryDataBloc,
  provideSpecialityBloc,
  provideScheduleBloc,
  provideAppointmentListBloc,
  provideMedicalProcedureBloc,
  provideDxMainCodeBloc,
  provideRelationCodeBloc,
  providePatientFormBloc,
  provideHandleGlobalState
};
