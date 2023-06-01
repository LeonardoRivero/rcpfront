import { IAppointment } from 'src/Domine/ModelsDB';
import { Messages } from 'src/Application/Utilities/Messages';
import { Notificator } from 'src/Domine/IPatterns';
import { FactoryNotifactors } from './Creators/Factories';
import { AppointmentState } from 'src/Domine/IStates';
import { AppointmentService } from 'src/Application/Services';
import {
  AppointmentResponse,
  DoctorResponse,
  EventScheduleResponse,
  PatientResponse,
} from 'src/Domine/Responses';
import { routerInstance } from 'src/boot/globalRouter';

export class AppointmentAdapter {
  private store: AppointmentState;
  private service = new AppointmentService();
  private static instance: AppointmentAdapter;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator('sweetAlert');
  private message = Messages.getInstance();

  private constructor(store: AppointmentState) {
    this.store = store;
    return;
  }

  public static getInstance(state: AppointmentState): AppointmentAdapter {
    if (!AppointmentAdapter.instance) {
      AppointmentAdapter.instance = new AppointmentAdapter(state);
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
      this.notifySweetAlert.setType('error');
      this.notifySweetAlert.show(undefined, this.message.searchIncorrect);
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
    //   this.this.notification.setMessage(this.message.patientNotSchedule);
    //   this.this.notification.showWarning();
    //   return;
    // }

    // if (schedule.length == 0) {
    //   const confirm = await this.serviceModal.showModal(
    //     'Atención',
    //     this.message.patientNotSchedule
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

  public async getById(id: number): Promise<AppointmentResponse | null> {
    const response = await this.service.getById(id);
    return response;
    // const entity = this.responseToEntity(response);
    // this.store.currentAppointment = entity;
  }

  public async saveOrUpdate(
    appointment: IAppointment,
    patient: PatientResponse,
    doctor: DoctorResponse
  ): Promise<AppointmentResponse | null> {
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
      this.notifySweetAlert.setType('error');
      this.notifySweetAlert.show(undefined, this.message.errorMessage);
    }
    return response;
  }

  public async save(
    payload: IAppointment
  ): Promise<AppointmentResponse | null> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      this.message.newRegister
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

  public async appointmentNotFound(): Promise<void> {
    this.notifySweetAlert.setType('error');
    const confirm = await this.notifySweetAlert.show(
      'Error',
      this.message.appointmentNotFound
    );
    if (confirm == false) {
      return;
    }

    routerInstance.push('/appointment');
    return;
  }
}
