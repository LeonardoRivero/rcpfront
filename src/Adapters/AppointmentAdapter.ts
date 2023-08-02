import { IAppointment } from 'src/Domine/ModelsDB';
import { Messages } from 'src/Application/Utilities/Messages';
import { ModalType, Notificator } from 'src/Domine/IPatterns';
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
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

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
  }

  public async searchByPatientId(
    patientId: number
  ): Promise<AppointmentResponse | null> {
    if (patientId == 0) {
      this.notifySweetAlert.setType('error');
      this.notifySweetAlert.show(undefined, Messages.searchIncorrect);
      return null;
    }

    let queryParameters = new Object();
    queryParameters = { patientId: patientId };
    const response = await this.service.findByParameters(queryParameters);
    const appointment = response.pop();
    if (appointment === undefined) return null;
    return appointment;
  }

  public async getById(id: number): Promise<AppointmentResponse | null> {
    const response = await this.service.getById(id);
    return response;
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
      this.notifySweetAlert.show(undefined, Messages.errorMessage);
    }
    return response;
  }

  public async save(
    payload: IAppointment
  ): Promise<AppointmentResponse | null> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.newRegister
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
      Messages.appointmentNotFound
    );
    if (confirm == false) {
      return;
    }

    routerInstance.push('/appointment');
    return;
  }
}
