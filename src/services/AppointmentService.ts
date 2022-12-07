import { ref } from 'vue';
import { QForm, date } from 'quasar';
import { defineStore } from 'pinia';
import { useStoreAppointment } from 'src/stores/storeAppointment';
import { patientService, useStorePatient } from './PatientService';
import {
  IAppointmentRequest,
  IAppointmentResponse,
  IDoctorResponse,
  IPatientStatus,
  IReasonConsult,
  ISpeciality,
} from 'src/models/IConsults';
import { IHealthInsurance, IPatientResponse } from 'src/models/IPatients';
import { Messages } from 'src/scripts/Constants';
import * as Constants from 'src/scripts/Constants';
import { Notification } from 'src/scripts/Notifications';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import modalService from './ModalService';
// import { Validators } from 'src/scripts/Helpers';
import { routerInstance } from 'src/boot/globalRouter';
import { useStoreSchedule } from 'src/stores/storeSchedule';
import { EventScheduleResponse } from 'src/models/ICommons';
import { HttpResponse } from 'src/scripts/Request';
import { PatientRepository } from 'src/patterns/Repository/PatientRepository';
import { AppointmentRepository } from 'src/patterns/Repository/AppointmentRepository';
import { ScheduleRepository } from 'src/patterns/Repository/ScheduleRepository';

// const store = useStoreAppointment();
const storeSchedule = useStoreSchedule();
// const storePatients = useStorePatients();
const notification = new Notification();
const message = Messages.getInstance();
const serviceModal = modalService();

interface IStoreAppointment {
  form: QForm | null;
  identificationPatient: string;
  currentPatientStatus: IPatientStatus | null;
  currentHealthInsurance: IHealthInsurance;
  reasonConsult: IReasonConsult | null;
  speciality: ISpeciality;
  currentDoctor: IDoctorResponse;
  currentAppointment: IAppointmentRequest;
  currentPatient: IPatientResponse;
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
      currentDoctor: {} as IDoctorResponse,
      currentAppointment: {} as IAppointmentRequest,
      currentPatient: {} as IPatientResponse,
    } as IStoreAppointment),
});
export class appointmentServices {
  private store = useStoreAppointments();
  private storePatient = useStorePatient();
  private repositoryPatient = new PatientRepository();
  private repository = new AppointmentRepository();
  private repositorySchedule = new ScheduleRepository();
  private servicePatient = patientService.getInstance();

  constructor() {
    return;
  }

  public calculateAmountPaid() {
    if (this.store.currentAppointment.price == undefined) {
      this.store.currentAppointment.price = 0;
    }
    if (this.store.currentAppointment.copayment == undefined) {
      this.store.currentAppointment.copayment = 0;
    }

    this.store.currentAppointment.amountPaid =
      +this.store.currentAppointment.price +
      +this.store.currentAppointment.copayment;
  }

  // public patientStatusChanged(val: IPatientStatus): void {
  //   this.store.currentPatientsStatus = val;
  // }

  public async searchPatient(): Promise<void> {
    if (this.store.identificationPatient === '') {
      notification.setMessage(message.searchIncorrect);
      notification.showError();
      return;
    }

    let queryParameters = new Object();
    queryParameters = { identification: this.store.currentPatient };
    const patient = await this.repositoryPatient.findByParameters(
      queryParameters
    );
    if (patient === null) {
      storeSchedule.card = false;
      this.storePatient.currentPatient = {
        identification: parseInt(this.store.identificationPatient),
      } as IPatientResponse;
      await this.servicePatient.patientNotFound();
      return;
    }

    queryParameters = {
      patientIdentification: this.store.identificationPatient,
    };
    const schedule = await this.repositorySchedule.findByParameters(
      queryParameters
    );
    if (schedule === null) {
      notification.setMessage(message.patientNotSchedule);
      notification.showWarning();
      return;
    }

    if (schedule.length == 0) {
      const confirm = await serviceModal.showModal(
        'Atención',
        message.patientNotSchedule
      );
      if (confirm == false) {
        return;
      }

      routerInstance.push('/schedule');
      return;
    }

    const lastSchedule = schedule.pop();
    if (lastSchedule == undefined || !lastSchedule.id) return;

    this.store.currentAppointment.schedule = lastSchedule.id;
    this.store.currentAppointment.date = date.formatDate(
      lastSchedule.start,
      Constants.FORMAT_DATETIME
    );
    this.store.currentPatient = lastSchedule.patient as IPatientResponse;
    this.store.currentHealthInsurance = lastSchedule.patient
      .insurance as IHealthInsurance;
    this.store.speciality = lastSchedule.speciality;
    this.store.currentDoctor = lastSchedule.doctor;
  }

  public async processRequest(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) {
      return;
    }

    if (!this.store.currentAppointment) return;

    let response = null;

    if (this.store.currentAppointment.id == undefined) {
      const payload = {
        copayment: this.store.currentAppointment.copayment,
        amountPaid: this.store.currentAppointment.amountPaid,
        date: this.store.currentAppointment.date,
        authorizationNumber: this.store.currentAppointment.authorizationNumber,
        patientStatus: this.store.currentPatientStatus?.id,
        reasonConsult: this.store.reasonConsult?.id,
        price: this.store.currentAppointment.price,
        schedule: this.store.currentAppointment.schedule,
        patient: this.store.currentPatient.id,
        doctor: this.store.currentDoctor.id,
      } as IAppointmentRequest;
      response = this.save(payload);
    }

    if (response === null) {
      notification.setMessage(message.errorMessage);
      notification.showError();
      return;
    }
  }

  public async save(
    payload: IAppointmentRequest
  ): Promise<IAppointmentResponse | null> {
    const confirm = await serviceModal.showModal(
      'Atención',
      message.newRegister
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.repository.create(payload);
    return response;
  }
}

// export function appointmentService() {
//   const { currentAppointment, currentPatient } = storeToRefs(store);
//   // const timeStamp = Date.now();
//   // const formattedDate = ref(
//   //   date.formatDate(timeStamp, Constants.FORMAT_DATETIME)
//   // );

//   // currentAppointment.value.date = formattedDate.value;
//   const formAppointment = ref<QForm | null>(null);
//   const identificationPatient = ref<string>('');
//   const currentPatientStatus = ref<IPatientStatus>();
//   const currentHealthInsurance = ref<IHealthInsurance>({} as IHealthInsurance);
//   const reasonConsult = ref<IReasonConsult>();
//   const speciality = ref<ISpeciality>({} as ISpeciality);
//   const currentDoctor = ref<IDoctorResponse>({} as IDoctorResponse);

//   // function calculateAmountPaid(val: IAppointmentRequest) {
//   //   if (currentAppointment.value.price == undefined) {
//   //     currentAppointment.value.price = 0;
//   //   }
//   //   if (currentAppointment.value.copayment == undefined) {
//   //     currentAppointment.value.copayment = 0;
//   //   }

//   //   currentAppointment.value.amountPaid =
//   //     +currentAppointment.value.price + +currentAppointment.value.copayment;
//   // }
//   function patientStatusChanged(val: IPatientStatus): void {
//     currentPatientStatus.value = val;
//   }
//   async function searchPatient(): Promise<void> {
//     if (identificationPatient.value === '') {
//       notification.setMessage(message.searchIncorrect);
//       notification.showError();
//       return;
//     }
//     let response = {} as HttpResponse<unknown>;
//     response = await storePatients.getPatientByIdentification(
//       identificationPatient.value
//     );
//     if (response.status == HttpStatusCodes.NO_CONTENT) {
//       storeSchedule.card = false;
//       const confirm = await serviceModal.showModal(
//         'Atención',
//         message.notFoundInfoPatient
//       );
//       if (confirm == false) {
//         return;
//       }

//       storePatients.currentPatient = {
//         identification: parseInt(identificationPatient.value),
//       } as IPatientResponse;
//       routerInstance.push('/patient');
//       return;
//     }
//     response = await storeSchedule.getScheduleByPatientIdentification(
//       identificationPatient.value
//     );
//     if (response.status == HttpStatusCodes.NO_CONTENT) {
//       notification.setMessage(message.patientNotSchedule);
//       notification.showWarning();
//       return;
//     }

//     const data = (await response.parsedBody) as Array<EventScheduleResponse>;

//     if (data.length == 0) {
//       const confirm = await serviceModal.showModal(
//         'Atención',
//         message.patientNotSchedule
//       );
//       if (confirm == false) {
//         return;
//       }
//       routerInstance.push('/schedule');
//       return;
//     }

//     const lastSchedule = data.pop();
//     if (lastSchedule == undefined || !lastSchedule.id) return;
//     currentAppointment.value.schedule = lastSchedule.id;
//     currentAppointment.value.date = date.formatDate(
//       lastSchedule.start,
//       Constants.FORMAT_DATETIME
//     );
//     currentPatient.value = lastSchedule.patient as IPatientResponse;
//     currentHealthInsurance.value = lastSchedule.patient
//       .insurance as IHealthInsurance;
//     speciality.value = lastSchedule.speciality;
//     currentDoctor.value = lastSchedule.doctor;
//   }
//   async function confirmChanges(): Promise<void> {
//     const isValid = await formAppointment.value?.validate();
//     if (isValid == false) {
//       return;
//     }
//     // const dateIsValid = validator.dateGreater(currentAppointment.value.date);
//     // if (dateIsValid === false) {
//     //   notification.setMessage(message.dateOrHourNotValid);
//     //   notification.showError();
//     //   return;
//     // }

//     // const responsePatient = await storePatients.getPatientByIdentification(
//     //   identificationPatient.value
//     // );
//     // const patient = (await responsePatient.parsedBody) as IPatientResponse;
//     if (!currentAppointment.value) return;
//     let confirmCreate = false;
//     if (currentAppointment.value.id == undefined) {
//       confirmCreate = await serviceModal.showModal(
//         'Atención',
//         message.newRegister
//       );
//       if (confirmCreate === false) {
//         return;
//       }
//     }

//     if (confirmCreate == true) {
//       const payload = {
//         copayment: currentAppointment.value.copayment,
//         amountPaid: currentAppointment.value.amountPaid,
//         date: currentAppointment.value.date,
//         authorizationNumber: currentAppointment.value.authorizationNumber,
//         patientStatus: currentPatientStatus.value?.id,
//         reasonConsult: reasonConsult.value?.id,
//         price: currentAppointment.value.price,
//         schedule: currentAppointment.value.schedule,
//         patient: currentPatient.value.id,
//         doctor: currentDoctor.value.id,
//       } as IAppointmentRequest;
//       const responseCreate = await store.createAppointment(payload);
//       if (
//         responseCreate == null ||
//         responseCreate.status == HttpStatusCodes.BAD_REQUEST
//       ) {
//         notification.setMessage(message.errorMessage);
//         notification.showError();
//         return;
//       }
//     }

//     if (currentAppointment.value.id != undefined) {
//       // const payload = {
//       //   id: data.id,
//       //   name: data.name,
//       //   lastName: data.lastName,
//       //   IDType: idType.value?.id,
//       //   identification: data.identification,
//       //   dateBirth: data.dateBirth,
//       //   phoneNumber: data.phoneNumber,
//       //   insurance: insurance.value?.id,
//       //   gender: gender.value?.id,
//       //   email: data.email,
//       // } as IPatientRequest;
//       // store.updateRelationCode(payload);
//     }
//   }

//   return {
//     // Properties
//     formAppointment,
//     reasonConsult,
//     currentPatient,
//     currentAppointment,
//     currentPatientStatus,
//     currentHealthInsurance,
//     identificationPatient,
//     speciality,
//     // Metodos
//     confirmChanges,
//     calculateAmountPaid,
//     patientStatusChanged,
//     searchPatient,
//   };
// }
