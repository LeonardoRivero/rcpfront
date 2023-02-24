import { defineStore } from 'pinia';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  DoctorResponse,
  PatientResponse,
} from 'src/Domine/Responses';

export interface IStoreClinicHistory {
  speciality: ISpeciality;
  currentDoctor: DoctorResponse;
  currentAppointment: AppointmentResponse;
  currentPatient: PatientResponse;
}

export const useStoreClinicHistory = defineStore({
  id: 'useStoreClinicHistory',
  state: (): IStoreClinicHistory => ({
    speciality: {} as ISpeciality,
    currentDoctor: {} as DoctorResponse,
    currentAppointment: {} as AppointmentResponse,
    currentPatient: {} as PatientResponse,
  }),
});
