import { IPatientResponse } from 'src/interfaces/IPatients';
import { EventScheduleResponse } from './ICommons';
export interface IPatientStatus {
  id?: number;
  code: string;
  description: string;
}
export interface ISpeciality {
  id?: number;
  description: string;
}
export interface IReasonConsult {
  id?: number;
  abbreviation: string;
}
export interface IDXMainCodeRequest {
  id?: number;
  CUP: string;
  description: string;
  speciality: number;
}
export interface IDXMainCodeResponse {
  id?: number;
  CUP: string;
  description: string;
  speciality: ISpeciality;
}
export interface IRelationCodeRequest {
  id?: number;
  description: string;
  code: string;
  dxmaincode: number;
}
export interface IRelationCodeResponse {
  id?: number;
  description: string;
  code: string;
  dxmaincode: IDXMainCodeResponse;
}
export interface IDoctorRequest {
  id?: number;
  codigo: string;
  name: string;
  lastName: string;
  speciality: Array<number>;
}
export interface IDoctorResponse {
  id?: number;
  codigo: string;
  name: string;
  lastName: string;
  speciality: ISpeciality;
}
export interface IAppointmentRequest {
  id?: number;
  price: number;
  copayment: number;
  amountPaid: number;
  date: string;
  authorizationNumber: string;
  patientStatus: number;
  reasonConsult: number;
  schedule: number;
  patient: number;
  doctor: number;
}
export interface IAppointmentResponse {
  id?: number;
  price: number;
  copayment: number;
  amountPaid: number;
  date: string;
  authorizationNumber: number;
  patientStatus: IPatientStatus;
  reasonConsult: IReasonConsult;
  schedule: EventScheduleResponse;
  patient: IPatientResponse;
  doctor: IDoctorResponse;
}
export interface IPhysicalExamRequest {
  id?: number;
  description: string;
  speciality: number;
  active: boolean;
}
export interface IPhysicalExamResponse {
  id?: number;
  description: string;
  speciality: ISpeciality;
  active: boolean;
}
