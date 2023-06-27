import { IPermission } from './ICommons';
import { ISpeciality, IUser } from './ModelsDB';
import {
  AppointmentResponse,
  DXMainCodeResponse,
  DoctorResponse,
  EventScheduleResponse,
  Group,
  PathologicalHistoryResponse,
  PatientResponse,
  RelationCodeResponse,
  SpecialityResponse,
  AuthResponse,
  UserResponse,
  HealthInsuranceResponse,
  IDTypeResponse,
} from './Responses';

export interface IStoreClinicHistory {
  speciality: ISpeciality;
  currentDoctor: DoctorResponse;
  currentAppointment: AppointmentResponse;
  currentPatient: PatientResponse;
  currentSchedule: EventScheduleResponse | null;
}

// export interface IStorePathologicalHistory {
//   allPathologies: Array<PathologicalHistoryResponse>;
// }

export interface IStoreSettings {
  allSpecialities: Array<SpecialityResponse>;
  allPathologies: Array<PathologicalHistoryResponse>;
  allRelationCode: Array<RelationCodeResponse>;
  allInsurance: Array<HealthInsuranceResponse>;
  allIdTypes: Array<IDTypeResponse>;
  currentSpeciality: ISpeciality;
  currentDxMainCode: DXMainCodeResponse | null;
  allGroups: Array<Group>;
}

export interface IStoreUser {
  user: IUser;
  token: AuthResponse;
  isAuthenticated: boolean;
  changePassword: boolean;
}

export interface IStorePermissions {
  userData: UserResponse;
  specialities: IPermission;
  dxMainCode: IPermission;
  relationCode: IPermission;
  healthInsurances: IPermission;
  doctors: IPermission;
  patients: IPermission;
  patientStatus: IPermission;
  reasonConsult: IPermission;
  paymentOptions: IPermission;
}

export interface IStoreSchedule {
  dateSchedule: string | Date;
  card: boolean;
}
