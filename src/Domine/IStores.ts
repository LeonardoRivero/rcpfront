import { CalendarOptions } from '@fullcalendar/vue3';
import { IPermission } from './ICommons';
import { IExam, IUser } from './ModelsDB';
import {
  AppointmentResponse,
  DXMainCodeResponse,
  DoctorResponse,
  EventScheduleResponse,
  Group,
  PathologicalHistoryResponse,
  RelationCodeResponse,
  SpecialityResponse,
  AuthResponse,
  UserResponse,
  HealthInsuranceResponse,
  IDTypeResponse,
  PaymentOptionsResponse,
  ReasonConsultResponse,
  PatientStatusResponse,
} from './Responses';
import FullCalendar from '@fullcalendar/vue3/dist/FullCalendar';

export interface IStoreClinicHistory {
  currentDoctor: DoctorResponse;
  currentAppointment: AppointmentResponse;
  currentSchedule: EventScheduleResponse | null;
  allPathologies: Array<PathologicalHistoryResponse>;
  allDxMainCodes: Array<DXMainCodeResponse>;
  allRelationCodes: Array<RelationCodeResponse>;
  examParameterResult: Array<IExam>;
}

export interface IStorePathologicalHistory {
  allPathologies: Array<PathologicalHistoryResponse>;
}

export interface IStoreSettings {
  allSpecialities: Array<SpecialityResponse>;
  allPathologies: Array<PathologicalHistoryResponse>;
  allRelationCode: Array<RelationCodeResponse>;
  allInsurance: Array<HealthInsuranceResponse>;
  allIdTypes: Array<IDTypeResponse>;
  currentSpeciality: SpecialityResponse;
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
  dateSchedule: string;
  card: boolean;
  allSpecialities: Array<SpecialityResponse>;
  calendar: InstanceType<typeof FullCalendar>;
  calOptions: CalendarOptions;
  scheduleId: number | null;
}
export interface IStoreAppointment {
  allPaymentOptions: Array<PaymentOptionsResponse>;
  allReasonConsult: Array<ReasonConsultResponse>;
  allPatientStatus: Array<PatientStatusResponse>;
}
