import { IAppointment, ISpeciality } from 'src/Domine/ModelsDB';
import { Messages } from 'src/Application/Utilities/Messages';
import {
  Controller,
  IControllersMediator,
  Notificator,
} from 'src/Domine/IPatterns';
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
import { ModalType } from 'src/Domine/Types';
import { CreateCommand } from 'src/Application/Commands';

export class AppointmentAdapter extends Controller {
  public state: AppointmentState;
  private service = new AppointmentService();
  private static instance: AppointmentAdapter;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

  private constructor(store: AppointmentState) {
    super();
    this.state = store;
  }

  receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    this.state.currentAppointment = {} as IAppointment;
    // this.state.currentPatient = {} as PatientResponse;
    // this.state.currentHealthInsurance = null;
    // this.state.speciality = {} as ISpeciality;
    this.state.identificationPatient = '';
    this.state.schedule = {} as EventScheduleResponse;
  }

  public static getInstance(state: AppointmentState): AppointmentAdapter {
    if (!AppointmentAdapter.instance) {
      AppointmentAdapter.instance = new AppointmentAdapter(state);
    }
    return AppointmentAdapter.instance;
  }

  public paymentIsCash(isCash: boolean) {
    if (isCash) {
      this.state.currentAppointment.codeTransaction = null;
    }
  }

  public calculateAmountPaid() {
    if (this.state.currentAppointment.price == undefined) {
      this.state.currentAppointment.price = 0;
    }
    if (this.state.currentAppointment.copayment == undefined) {
      this.state.currentAppointment.copayment = 0;
    }
    // if (this.state.schedule.patient.insurance == null) return;

    this.state.currentAppointment.amountPaid = this.service.calculateAmountPaid(
      this.state.schedule.patient.insurance,
      this.state.currentAppointment
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

    const queryParameters = { patientId: patientId };
    const response = await this.service.findByParameters(queryParameters);
    const appointment = response.pop();
    if (appointment === undefined) return null;
    return appointment;
  }

  public async getById(id: number): Promise<AppointmentResponse | null> {
    const response = await this.service.getById(id);
    return response;
  }

  public async saveOrUpdate(): Promise<AppointmentResponse | null> {
    if (!this.state.currentAppointment) return null;

    let response = null;
    let payload: IAppointment | null;
    if (this.state.currentAppointment.id == undefined) {
      payload = {
        price: this.state.currentAppointment.price,
        copayment: this.state.currentAppointment.copayment,
        amountPaid: this.state.currentAppointment.amountPaid,
        date: new Date().toJSON(),
        authorizationNumber: this.state.currentAppointment.authorizationNumber,
        patientStatus: this.state.currentAppointment.patientStatus,
        reasonConsult: this.state.currentAppointment.reasonConsult,
        schedule: this.state.currentAppointment.schedule,
        patient: this.state.schedule.patient.id,
        doctor: this.state.schedule.doctor.user.id,
        paymentMethod: this.state.currentAppointment.paymentMethod,
        codeTransaction: this.state.currentAppointment.codeTransaction,
        isPrivate: this.state.currentAppointment.isPrivate,
      };
      response = await this.service.save(payload);
    }

    if (response === null) {
      this.notifySweetAlert.setType('error');
      this.notifySweetAlert.show(undefined, Messages.errorMessage);
    }
    return response;
  }

  public async showModalConfirmation(): Promise<boolean> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.newRegister
    );
    return confirm;
  }

  public responseToEntity(response: EventScheduleResponse) {
    // this.store.currentAppointment = {
    //   id: response.id,
    //   copayment: 45455,
    //   amountPaid: 678,
    //   date: 'hola',
    //   authorizationNumber: '54',
    //   patientStatus: 44,
    //   reasonConsult: 44,
    //   schedule: 44,
    //   patient: 44,
    //   doctor: 44,
    //   paymentMethod: 22,
    //   codeTransaction: '444',
    // } as IAppointment;
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
