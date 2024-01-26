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
import { FactoryNotifactors } from 'src/Adapters/Creators/Factories';
import {
  DoctorSpecialityService,
  FindPatientByIdentificationUseCase,
  GenderService,
  GetPhysicalExamBySpecialityUseCase,
  InsuranceService,
  PhysicalExamService,
} from 'src/Application/Services';
import { FindScheduleByIdentificationPatientUseCase } from 'src/Application/Services/ScheduleService';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { ClientAPI } from './Utilities/HttpClientAPI';
import { AppointmentListBloc } from 'src/Adapters/AppointmentListController';
import { IDTypesService } from 'src/Application/Services/IDTypeService';

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
  const insuranceService = new InsuranceService();
  const idTypesService = new IDTypesService();
  const genderService = new GenderService();
  return new PatientFormBloc(
    notificator,
    insuranceService,
    idTypesService,
    genderService
  );
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
};
