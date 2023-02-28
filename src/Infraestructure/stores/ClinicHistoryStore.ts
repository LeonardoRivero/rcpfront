import { defineStore } from 'pinia';
import { IStoreClinicHistory } from 'src/Domine/IStores';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  DoctorResponse,
  PatientResponse,
} from 'src/Domine/Responses';

export const useStoreClinicHistory = defineStore({
  id: 'useStoreClinicHistory',
  state: (): IStoreClinicHistory => ({
    speciality: {} as ISpeciality,
    currentDoctor: {} as DoctorResponse,
    currentAppointment: {} as AppointmentResponse,
    currentPatient: {} as PatientResponse,
  }),
});
