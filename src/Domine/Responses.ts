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
  date: string | Date;
  authorizationNumber: string;
  patientStatus: PatientResponse;
  reasonConsult: ReasonConsultResponse;
  schedule: EventScheduleResponse;
  patient: PatientResponse;
  doctor: DoctorResponse;
  paymentMethod: PaymentOptionsResponse;
  codeTransaction: string;
}
export interface EventScheduleResponse {
  id: number;
  title: string;
  start: string;
  end: string;
  patient: PatientResponse;
  speciality: SpecialityResponse;
  doctor: DoctorResponse;
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
  dateBirth: string | Date;
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
