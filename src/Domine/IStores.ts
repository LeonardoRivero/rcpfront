import { ISpeciality } from './ModelsDB';
import {
  AppointmentResponse,
  DoctorResponse,
  EventScheduleResponse,
  PathologicalHistoryResponse,
  PatientResponse,
  RelationCodeResponse,
  SpecialityResponse,
} from './Responses';

export interface IStoreClinicHistory {
  speciality: ISpeciality;
  currentDoctor: DoctorResponse;
  currentAppointment: AppointmentResponse;
  currentPatient: PatientResponse;
  currentSchedule:EventScheduleResponse|null
}

// export interface IStorePathologicalHistory {
//   allPathologies: Array<PathologicalHistoryResponse>;
// }

export interface IStoreSettings {
  allSpecialities: Array<SpecialityResponse>;
  allPathologies: Array<PathologicalHistoryResponse>;
  allRelationCode: Array<RelationCodeResponse>;
}
