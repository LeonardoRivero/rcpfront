import { IExam, Permission } from './ModelsDB';
export interface SpecialityResponse {
  id: number;
  description: string;
  code: number;
}
export interface DXMainCodeResponse {
  id: number;
  CUP: string;
  description: string;
  speciality: SpecialityResponse;
}
export interface RelationCodeResponse {
  id: number;
  description: string;
  code: string;
  dxmaincode: DXMainCodeResponse;
}
export interface DoctorResponse {
  id: number;
  codigo: string;
  name: string;
  lastName: string;
  speciality: Array<SpecialityResponse>;
}
export interface PhysicalExamResponse {
  id: number;
  description: string;
  speciality: SpecialityResponse;
  active: boolean;
}
export interface PatientStatusResponse {
  id: number;
  code: string;
  description: string;
}
export interface ReasonConsultResponse {
  id: number;
  abbreviation: string;
}
export interface AppointmentResponse {
  id: number;
  price: number;
  copayment: number;
  amountPaid: number;
  date: string;
  authorizationNumber: string;
  patientStatus: PatientResponse;
  reasonConsult: ReasonConsultResponse;
  schedule: EventScheduleResponse;
  patient: PatientResponse;
  doctor: DoctorResponse;
  paymentMethod: PaymentOptionsResponse;
  codeTransaction: string;
  isPrivate: boolean;
}
export interface EventScheduleResponse {
  id: number;
  title: string;
  start: string;
  end: string;
  patient: PatientResponse;
  speciality: SpecialityResponse;
  doctor: DoctorSpecialityResponse;
  observations: string;
}
export interface GenderResponse {
  id: number;
  nameGender: string;
}
export interface HealthInsuranceResponse {
  id: number;
  nameInsurance: string;
  entityCode: string;
  takeCopayment: boolean;
}
export interface IDTypeResponse {
  id: number;
  description: string;
  abbreviation: string;
}
export interface PatientResponse {
  id: number;
  name: string;
  lastName: string;
  IDType: IDTypeResponse;
  identification: number;
  dateBirth: string;
  phoneNumber: number;
  insurance: HealthInsuranceResponse;
  gender: GenderResponse;
  email: string;
}
export interface PaymentOptionsResponse {
  id: number;
  description: string;
  code: string;
}
export interface PathologicalHistoryResponse {
  id: number;
  description: string;
}
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  first_time: boolean;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  groups: Array<Group>;
}

export interface RegisterResponse {
  detail: string;
}
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserResponse;
  groups: Array<Group>;
}

export interface RefreshTokenResponse {
  access: string;
  access_token_expiration: Date;
}

export interface Group {
  id: number;
  name: string;
  permissions: Array<Permission>;
}

export interface PhysicalExamResultResponse {
  _id: string;
  date_exam: string | Date;
  patient_id: number;
  result: Array<IExam>;
}

export interface DoctorSpecialityResponse {
  codigo: string;
  user: UserBase;
}

export interface UserBase {
  id: number;
  first_name: string;
  last_name: string;
}
