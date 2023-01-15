import { defineStore } from 'pinia';
import { QForm } from 'quasar';
import {
  IAppointment,
  IDoctor,
  IHealthInsurance,
  IPatientStatus,
  IReasonConsult,
  ISpeciality,
} from 'src/Domine/ModelsDB';
import { PatientResponse } from 'src/Domine/Responses';

export interface IStoreAppointment {
  form: QForm | null;
  identificationPatient: string;
  currentPatientStatus: IPatientStatus | null;
  currentHealthInsurance: IHealthInsurance;
  reasonConsult: IReasonConsult | null;
  speciality: ISpeciality;
  currentDoctor: IDoctor;
  currentAppointment: IAppointment;
  currentPatient: PatientResponse;
}

export const useStoreAppointments = defineStore({
  id: 'useStoreAppointment',
  state: () =>
    ({
      form: null,
      identificationPatient: '',
      currentPatientStatus: null,
      currentHealthInsurance: {} as IHealthInsurance,
      reasonConsult: null,
      speciality: {} as ISpeciality,
      currentDoctor: {} as IDoctor,
      currentAppointment: {} as IAppointment,
      currentPatient: {} as PatientResponse,
    } as IStoreAppointment),
});
