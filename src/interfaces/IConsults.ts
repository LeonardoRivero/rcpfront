import { IPatientResponse } from 'src/interfaces/IPatients';
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
  speciality: number;
}
export interface IDoctorResponse {
  id?: number;
  codigo: string;
  name: string;
  lastName: string;
  speciality: ISpeciality;
}
export interface IConsultRequest {
  id?: number;
  price?: number;
  copayment?: number;
  amountPaid?: number;
  date: string;
  authorizationNumber?: number;
  patientStatus?: number;
  reasonConsult?: number;
  dxMainCode?: number;
  patient?: number;
  doctor?: number;
}
export interface IConsultResponse {
  id?: number;
  price: number;
  copayment: number;
  amountPaid: number;
  date: string;
  authorizationNumber: number;
  patientStatus?: IPatientStatus;
  reasonConsult?: IReasonConsult;
  dxMainCode?: IDXMainCodeResponse;
  patient?: IPatientResponse;
  doctor?: IDoctorResponse;
}
