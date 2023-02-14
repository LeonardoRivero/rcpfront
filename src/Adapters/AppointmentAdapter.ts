import { IAppointment } from 'src/Domine/ModelsDB';
import { Messages } from 'src/Application/Utilities/Messages';
import { Notification } from 'src/Infraestructure/Utilities/Notifications';
import modalService from './ModalService';
import { IStoreAppointment } from 'src/Infraestructure/stores/Appointment/AppointmentStore';
import { AppointmentService } from 'src/Application/Services';
import {
  AppointmentResponse,
  DoctorResponse,
  EventScheduleResponse,
  PatientResponse,
} from 'src/Domine/Responses';

const notification = new Notification();
const message = Messages.getInstance();
const serviceModal = modalService();

export class AppointmentAdapter {
  private store: IStoreAppointment;
  private service = new AppointmentService();
  private static instance: AppointmentAdapter;

  private constructor(store: IStoreAppointment) {
    this.store = store;
    return;
  }

  public static getInstance(store: IStoreAppointment): AppointmentAdapter {
    if (!AppointmentAdapter.instance) {
      AppointmentAdapter.instance = new AppointmentAdapter(store);
    }
    return AppointmentAdapter.instance;
  }

  public paymentIsCash(isCash: boolean) {
    if (isCash) {
      this.store.currentAppointment.codeTransaction = null;
    }
  }

  public calculateAmountPaid() {
    if (this.store.currentAppointment.price == undefined) {
      this.store.currentAppointment.price = 0;
    }
    if (
      this.store.currentAppointment.copayment == undefined ||
      this.store.currentHealthInsurance?.nameInsurance == 'Particular'
    ) {
      this.store.currentAppointment.copayment = 0;
    }
    if (this.store.currentHealthInsurance == null) return;

    this.store.currentAppointment.amountPaid = this.service.calculateAmountPaid(
      this.store.currentHealthInsurance,
      this.store.currentAppointment
    );
    // if (this.store.currentHealthInsurance.takeCopayment == true) {
    //   this.store.currentAppointment.amountPaid =
    //     +this.store.currentAppointment.price -
    //     +this.store.currentAppointment.copayment;
    //   return;
    // }
    // this.store.currentAppointment.amountPaid =
    //   this.store.currentAppointment.price;
  }
  public async searchByPatientId(
    patientId: number
  ): Promise<AppointmentResponse | null> {
    if (patientId == 0) {
      notification.setMessage(message.searchIncorrect);
      notification.showError();
      return null;
    }

    let queryParameters = new Object();
    queryParameters = { patientId: patientId };
    const response = await this.service.findByParameters(queryParameters);
    const appointment = response.pop();
    if (appointment === undefined) return null;
    return appointment;
    // if (patient === null) {
    //   storeSchedule.card = false;
    //   this.storePatient.currentPatient = {
    //     identification: parseInt(this.store.identificationPatient),
    //   } as IPatient;
    //   await this.servicePatient.patientNotFound();
    //   return;
    // }

    // queryParameters = {
    //   patientIdentification: this.store.identificationPatient,
    // };
    // const schedule = await this.repositorySchedule.findByParameters(
    //   queryParameters
    // );
    // if (schedule === null) {
    //   notification.setMessage(message.patientNotSchedule);
    //   notification.showWarning();
    //   return;
    // }

    // if (schedule.length == 0) {
    //   const confirm = await serviceModal.showModal(
    //     'Atención',
    //     message.patientNotSchedule
    //   );
    //   if (confirm == false) {
    //     return;
    //   }

    //   routerInstance.push('/schedule');
    //   return;
    // }

    // const lastSchedule = schedule.pop();
    // if (lastSchedule == undefined || !lastSchedule.id) return;

    // this.store.currentAppointment.schedule = lastSchedule.id;
    // this.store.currentAppointment.date = date.formatDate(
    //   lastSchedule.start,
    //   Constants.FORMAT_DATETIME
    // );
    // this.store.currentPatient = lastSchedule.patient as IPatient;
    // this.store.currentHealthInsurance = lastSchedule.patient
    //   .insurance as IHealthInsurance;
    // this.store.speciality = lastSchedule.speciality;
    // this.store.currentDoctor = lastSchedule.doctor;
  }

  public async getById(id: number) {
    const response = await this.service.getById(id);
    if (response == null) {
      return;
    }
    // const entity = this.responseToEntity(response);
    // this.store.currentAppointment = entity;
  }

  public async saveOrUpdate(
    appointment: IAppointment,
    patient: PatientResponse,
    doctor: DoctorResponse
  ): Promise<AppointmentResponse | null> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) {
      return null;
    }

    if (!this.store.currentAppointment) return null;

    let response = null;
    let payload: IAppointment | null;
    if (appointment.id == undefined) {
      payload = {
        copayment: appointment.copayment,
        amountPaid: appointment.amountPaid,
        date: new Date().toJSON(),
        authorizationNumber: appointment.authorizationNumber,
        patientStatus: appointment.patientStatus,
        reasonConsult: appointment.reasonConsult,
        price: appointment.price,
        schedule: appointment.schedule,
        patient: patient.id,
        doctor: doctor.id,
        paymentMethod: appointment.paymentMethod,
        codeTransaction: appointment.codeTransaction,
      };
      response = await this.save(payload);
    }

    if (response === null) {
      notification.setMessage(message.errorMessage);
      notification.showError();
    }
    return response;
  }

  public async save(
    payload: IAppointment
  ): Promise<AppointmentResponse | null> {
    const confirm = await serviceModal.showModal(
      'Atención',
      message.newRegister
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.service.save(payload);
    return response;
  }

  public responseToEntity(response: EventScheduleResponse) {
    this.store.currentAppointment = {
      id: response.id,
      copayment: 45455,
      amountPaid: 678,
      date: 'hola',
      authorizationNumber: '54',
      patientStatus: 44,
      reasonConsult: 44,
      schedule: 44,
      patient: 44,
      doctor: 44,
      paymentMethod: 22,
      codeTransaction: '444',
    } as IAppointment;
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
