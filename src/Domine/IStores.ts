import { ISpeciality } from './ModelsDB';
import {
  AppointmentResponse,
  DoctorResponse,
  PathologicalHistoryResponse,
  PatientResponse,
} from './Responses';

export interface IStoreClinicHistory {
  speciality: ISpeciality;
  currentDoctor: DoctorResponse;
  currentAppointment: AppointmentResponse;
  currentPatient: PatientResponse;
}

export interface IStorePathologicalHistory {
  allPathologies: Array<PathologicalHistoryResponse>;
}
