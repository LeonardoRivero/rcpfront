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
import {
  DoctorResponse,
  HealthInsuranceResponse,
  PatientResponse,
  PatientStatusResponse,
  PaymentOptionsResponse,
  ReasonConsultResponse,
} from 'src/Domine/Responses';

export interface IStoreAppointment {
  form: QForm | null;
  identificationPatient: string;
  currentPatientStatus: IPatientStatus | null;
  currentHealthInsurance: HealthInsuranceResponse | null;
  reasonConsult: IReasonConsult | null;
  speciality: ISpeciality;
  currentDoctor: DoctorResponse;
  currentAppointment: IAppointment;
  currentPatient: PatientResponse;
  currentPaymentOption: PaymentOptionsResponse | null;
  allPaymentOptions: Array<PaymentOptionsResponse>;
  allReasonConsult: Array<ReasonConsultResponse>;
  allPatientStatus: Array<PatientStatusResponse>;
}

export const useStoreAppointments = defineStore({
  id: 'useStoreAppointment',
  state: (): IStoreAppointment => ({
    form: null,
    identificationPatient: '',
    currentPatientStatus: null,
    currentHealthInsurance: null,
    reasonConsult: null,
    speciality: {} as ISpeciality,
    currentDoctor: {} as DoctorResponse,
    currentAppointment: {} as IAppointment,
    currentPatient: {} as PatientResponse,
    allPaymentOptions: [],
    allReasonConsult: [],
    allPatientStatus: [],
    currentPaymentOption: null,
  }),
});
