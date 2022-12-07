import { IDoctorResponse, ISpeciality } from './IConsults';
import { IPatientRequest, IPatientResponse } from './IPatients';

export interface IQueryParameters {
  parameter: string;
  value: string;
}
export interface Forms {
  visible: boolean;
  title: string;
  data: object;
}
export interface EventScheduleRequest {
  id?: number;
  title: string;
  start: string;
  end: string;
  patient: number;
  speciality: number;
  doctor: number;
}
export interface EventScheduleResponse {
  id?: number;
  title: string;
  start: string;
  end: string;
  patient: IPatientResponse;
  speciality: ISpeciality;
  doctor: IDoctorResponse;
}
export interface IColumnsDataTable {
  name: string;
  required?: boolean;
  label: string;
  align?: string;
  field: string;
  sortable: boolean;
  style?: string;
}
