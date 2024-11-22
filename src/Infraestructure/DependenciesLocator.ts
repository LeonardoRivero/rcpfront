import {
  AdmissionsBloc,
  AppointmentBloc,
  DxMainCodeBloc,
  InfoPatientPanelBloc,
  PatientFormBloc,
  RelationCodeBloc,
  ScheduleFormBloc,
} from 'src/Adapters';
import { FactoryNotifactors } from 'src/Infraestructure/Utilities/Factories';
import {
  DoctorSpecialityService,
} from 'src/Application/Services';
import { ClientAPI } from './Utilities/HttpClientAPI';
import { MediatorUseCases } from 'src/Application/UseCases/MediatorUseCases';
import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';
import { HandleGlobalState } from './HandleGlobalState';
import {
  CreatePatientUseCase, FindPatientByIdentificationUseCase,
  UpdatePatientUseCase
} from 'src/Application/UseCases/PatientUseCases';
import { MedicalOfficeBloc } from 'src/Adapters/MedicalOfficeBloc';
import {
  CreateMedicalOfficeUseCase,
  UpdateMedicalOfficeUseCase
} from 'src/Application/UseCases/MedicalOfficeUseCase';
import { LoginBloc } from 'src/Adapters/LoginBloc';
import {
  ChangePasswordUseCase, ConfirmEmailUseCase,
  CreateUserUseCase, GetAllGroupsUseCase, LoginUseCase
} from 'src/Application/UseCases/UserUseCase';
import { ChangePasswordBloc } from 'src/Adapters/ChangePasswordBloc';
import { RegisterUserBloc } from 'src/Adapters/RegisterUserBloc';
import { CreateDoctorUseCase, GetDoctorBelongToMedicalOffice, GetDoctorByUserIdUseCase } from 'src/Application/UseCases/DoctorUseCase';
import { CreateSecretaryUseCase } from 'src/Application/UseCases/SecretaryUseCase';
import { UserContext } from './Mediators/UserContext';
import { AddEventScheduleUseCase, FindScheduleForPatientUseCase, GetByIdScheduleUseCase, GetScheduleForMedicalOfficeUseCase, UpdateScheduleUseCase } from 'src/Application/UseCases/ScheduleUseCases';
import { GetSpecialityBelongToMedicalOfficeUseCase } from 'src/Application/UseCases/SpecialityUseCases';
import { PaymentOptionIsCashUseCase } from 'src/Application/UseCases/PaymentOptionsUseCases';
import { Helpers } from './Utilities/Helpers';
import { CreateAdmissionUseCase } from 'src/Application/UseCases/AdmissionUseCases';
import { IndexBloc } from 'src/Adapters/IndexBloc';
import { GetByFilterCIE10UseCase } from 'src/Application/UseCases/CIE10UseCases';

const notificator = new FactoryNotifactors();
const HttpClientAPI = new ClientAPI();
const findPatientByIdentificationUseCase = new FindPatientByIdentificationUseCase(HttpClientAPI);
const mediatorUseCases = new MediatorUseCases(HttpClientAPI)
const findScheduleForPatientUseCase = new FindScheduleForPatientUseCase(HttpClientAPI)
const helper = new Helpers()
function provideInfoPatientPanelPloc(): InfoPatientPanelBloc {
  const findScheduleByIdentificationPatientUseCase = new FindScheduleForPatientUseCase(HttpClientAPI);

  const productsPloc = InfoPatientPanelBloc.getInstance(
    findPatientByIdentificationUseCase,
    findScheduleByIdentificationPatientUseCase,
    notificator, helper
  );

  return productsPloc;
}

function provideAppointmentBloc(): AppointmentBloc {
  // const physicalExamService = PhysicalExamService.getInstance();
  const getByFilterCIE10UseCase = new GetByFilterCIE10UseCase(HttpClientAPI)
  return new AppointmentBloc(getByFilterCIE10UseCase);
}


function provideScheduleBloc(): ScheduleFormBloc {
  const doctorSpecialityService = new DoctorSpecialityService(HttpClientAPI);
  const getDoctorBelongToMedicalOfficeUseCase = new GetDoctorBelongToMedicalOffice(HttpClientAPI)
  const addEventScheduleUseCase = new AddEventScheduleUseCase(HttpClientAPI)
  const getByIdScheduleUseCase = new GetByIdScheduleUseCase(HttpClientAPI)
  const updateScheduleUseCase = new UpdateScheduleUseCase(HttpClientAPI)
  const getSpecialityBelongToMedicalOfficeUseCase = new GetSpecialityBelongToMedicalOfficeUseCase(HttpClientAPI)

  return ScheduleFormBloc.getInstance(notificator, doctorSpecialityService, findPatientByIdentificationUseCase,
    getDoctorBelongToMedicalOfficeUseCase, addEventScheduleUseCase, getByIdScheduleUseCase, updateScheduleUseCase,
    getSpecialityBelongToMedicalOfficeUseCase, findScheduleForPatientUseCase);
}

function provideAdmissionBloc(): AdmissionsBloc {
  const handleGlobalState = provideHandleGlobalState();
  const paymentOptionIsCashUseCase = new PaymentOptionIsCashUseCase(handleGlobalState)
  const createAdmissionUseCase = new CreateAdmissionUseCase(HttpClientAPI)
  return new AdmissionsBloc(notificator, mediatorUseCases, findPatientByIdentificationUseCase,
    findScheduleForPatientUseCase, paymentOptionIsCashUseCase, helper, createAdmissionUseCase);
}

// function provideMedicalProcedureBloc(): MedicalProcedureBloc {
//   const getPhysicalExamBySpecilityUseCase =
//     new GetPhysicalExamBySpecialityUseCase();
//   return new MedicalProcedureBloc(getPhysicalExamBySpecilityUseCase);
// }

function provideDxMainCodeBloc(): DxMainCodeBloc {
  return new DxMainCodeBloc();
}

function provideRelationCodeBloc(): RelationCodeBloc {
  return new RelationCodeBloc();
}

function providePatientFormBloc(): PatientFormBloc {
  const createPatientUseCase = new CreatePatientUseCase(HttpClientAPI)
  const updatePatientUseCase = new UpdatePatientUseCase(HttpClientAPI)
  return new PatientFormBloc(
    notificator,
    findPatientByIdentificationUseCase,
    createPatientUseCase,
    mediatorUseCases,
    updatePatientUseCase
  );
}

function provideMedicalOfficeBloc(): MedicalOfficeBloc {
  const createMedicalOfficeUseCase = new CreateMedicalOfficeUseCase(HttpClientAPI)
  const updateMedicalOfficeUseCase = new UpdateMedicalOfficeUseCase(HttpClientAPI)
  const getDoctorByUserIdUseCase = new GetDoctorByUserIdUseCase(HttpClientAPI)
  return new MedicalOfficeBloc(notificator, createMedicalOfficeUseCase,
    updateMedicalOfficeUseCase, getDoctorByUserIdUseCase);
}

function provideLoginBloc(): LoginBloc {
  const loginUseCase = new LoginUseCase(HttpClientAPI)
  const confirEmailUseCase = new ConfirmEmailUseCase(HttpClientAPI)
  const loginBloc = new LoginBloc(notificator, loginUseCase, confirEmailUseCase)
  loginBloc.setMediator(mediatorUseCases)
  return loginBloc;
}

function provideChangePasswordBloc(): ChangePasswordBloc {
  const changePasswordUseCase = new ChangePasswordUseCase(HttpClientAPI)
  return new ChangePasswordBloc(changePasswordUseCase);
}

function provideRegisterUserBloc(): RegisterUserBloc {
  const getAllRolesUseCase = new GetAllGroupsUseCase(HttpClientAPI)
  const registerUserCase = new CreateUserUseCase(HttpClientAPI)
  const createDoctorCase = new CreateDoctorUseCase(HttpClientAPI)
  const createSecretaryUseCase = new CreateSecretaryUseCase(HttpClientAPI)
  return new RegisterUserBloc(notificator, getAllRolesUseCase, registerUserCase, createDoctorCase, createSecretaryUseCase, mediatorUseCases);
}

function provideHandleGlobalState(): IHandleGlobalState {
  return HandleGlobalState.getInstance(HttpClientAPI);
}

function provideHandleUserState(): IHandleUserState {
  const instance = UserContext.getInstance(HttpClientAPI)
  // HttpClientAPI.handlerUserState = instance
  return instance;
}

function provideIndexBloc(): IndexBloc {
  const getScheduleForMedicalOffice = new GetScheduleForMedicalOfficeUseCase(HttpClientAPI)
  return new IndexBloc(getScheduleForMedicalOffice)
}

export const dependenciesLocator = {
  provideInfoPatientPanelPloc,
  provideAppointmentBloc,
  provideScheduleBloc,
  provideAdmissionBloc,
  // provideMedicalProcedureBloc,
  provideDxMainCodeBloc,
  provideRelationCodeBloc,
  providePatientFormBloc,
  provideMedicalOfficeBloc,
  provideHandleGlobalState,
  provideHandleUserState,
  provideLoginBloc,
  provideChangePasswordBloc,
  provideRegisterUserBloc,
  provideIndexBloc
};
