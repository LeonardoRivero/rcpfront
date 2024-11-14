import { AddAdmissionRequest } from 'src/Domine/Request';
// import { Messages } from 'src/Application/Utilities/Messages';
import {
  Bloc,
  IFactoryMethodNotifications,
  IHandleGlobalState,
  IMediatorUseCases,
  Notificator,
} from 'src/Domine/IPatterns';
import { AdmissionState, } from 'src/Domine/IStates';
import {
  AppointmentService,
  CalculateAmountPaidAppointmentUseCase,
} from 'src/Application/Services';
import {
  AppointmentResponse,
  EventScheduleResponse,
} from 'src/Domine/Responses';
import { ModalType } from 'src/Domine/Types';
import { PaymentOptionIsCashUseCase } from 'src/Application/Services/PaymentOptionsService';
// import { NotFoundElementNotify } from './Commands';
// import { FindScheduleByIdentificationPatientUseCase } from 'src/Application/Services/ScheduleService';
// import { InsertCommand } from 'src/Application/Commands';
// import { FindPatientByIdentificationUseCase } from 'src/Application/UseCases/PatientUseCases';

export class AdmissionsBloc extends Bloc<AdmissionState> {
  // public state: AppointmentState;
  private service = new AppointmentService();
  private calculeAmountPaidUseCase =
    new CalculateAmountPaidAppointmentUseCase();
  private paymentOptionIsCashUseCase = new PaymentOptionIsCashUseCase();
  // private static instance: AppointmentAdapter;
  // private notificator: IFactoryMethodNotifications;
  private notifySweetAlert: Notificator;

  constructor(
    private factoryNotificator: IFactoryMethodNotifications,
    private mediatorUseCases: IMediatorUseCases,
  ) {
    const state: AdmissionState = {
      identificationPatient: '',
      reasonConsult: null,
      currentAppointment: { isPrivate: false } as AddAdmissionRequest,
      allPaymentOptions: [],
      allReasonConsult: [],
      allPatientStatus: [],
      start: '',
      end: '',
      // schedule: {
      //   patient: { insurance: {} },
      //   speciality: {},
      //   doctor: {},
      //   end: '',
      //   start: '',
      // } as EventScheduleResponse,
      disableCodeTransaction: false,
      disableButtonSave: false,
    };
    super(state, mediatorUseCases);
    // this.state = store;
    // this.notificator = factoryNotify;
    this.notifySweetAlert = factoryNotificator.createNotificator(
      ModalType.SweetAlert
    );
  }

  // receiveData(data: IControllersMediator): void {
  //   throw new Error('Method not implemented.');
  // }

  public async clear(): Promise<void> {
    this.state.currentAppointment = {} as AddAdmissionRequest;
    // this.state.currentPatient = {} as PatientResponse;
    // this.state.currentHealthInsurance = null;
    // this.state.speciality = {} as ISpeciality;
    // this.state.identificationPatient = '';
    // this.state.schedule = {
    //   patient: { insurance: {} },
    //   speciality: {},
    //   doctor: {},
    //   end: '',
    //   start: '',
    // } as EventScheduleResponse;
  }

  // public static getInstance(
  //   state: AppointmentState,
  //   factoryNotify: IFactoryMethodNotifications
  // ): AppointmentAdapter {
  //   if (!AppointmentAdapter.instance) {
  //     AppointmentAdapter.instance = new AppointmentAdapter(
  //       state,
  //       factoryNotify
  //     );
  //   }
  //   return AppointmentAdapter.instance;
  // }

  public paymentIsCash(isCash: boolean) {
    // if (isCash) {
    //   this.state.currentAppointment.codeTransaction = null;
    // }
  }

  public calculateAmountPaid() {
    // if (this.state.currentAppointment.price == undefined) {
    //   this.state.currentAppointment.price = 0;
    // }
    // if (this.state.currentAppointment.copayment == undefined) {
    //   this.state.currentAppointment.copayment = 0;
    // }
    // this.calculeAmountPaidUseCase.insurance =
    //   this.state.schedule.patient.insurance;
    // this.state.currentAppointment.amountPaid =
    //   this.calculeAmountPaidUseCase.execute(this.state.currentAppointment);
  }

  // public async searchByPatientId(
  //   patientId: number
  // ): Promise<AppointmentResponse | null> {
  //   if (patientId == 0) {
  //     this.notifySweetAlert.setType('error');
  //     this.notifySweetAlert.show(undefined, Messages.searchIncorrect);
  //     return null;
  //   }

  //   const queryParameters = { patientId: patientId };
  //   const response = await this.service.findByParameters(queryParameters);
  //   const appointment = response.pop();
  //   if (appointment === undefined) return null;
  //   return appointment;
  // }

  // public async getById(id: number): Promise<AppointmentResponse | null> {
  //   const response = await this.service.getById(id);
  //   return response;
  // }

  public async saveOrUpdate(): Promise<AppointmentResponse | null> {
    // if (!this.state.currentAppointment) return null;
    // let response: AppointmentResponse | null = null;
    // let payload: IAppointment;
    // if (this.state.currentAppointment.id == undefined) {
    //   delete this.state.currentAppointment['id'];
    //   payload = {
    //     price: this.state.currentAppointment.price,
    //     copayment: this.state.currentAppointment.copayment,
    //     amountPaid: this.state.currentAppointment.amountPaid,
    //     date: new Date().toJSON(),
    //     authorizationNumber: this.state.currentAppointment.authorizationNumber,
    //     patientStatus: this.state.currentAppointment.patientStatus,
    //     reasonConsult: this.state.currentAppointment.reasonConsult,
    //     schedule: this.state.currentAppointment.schedule,
    //     patient: this.state.schedule.patient.id,
    //     doctor: this.state.schedule.doctor.id,
    //     paymentMethod: this.state.currentAppointment.paymentMethod,
    //     codeTransaction: this.state.currentAppointment.codeTransaction,
    //     isPrivate: this.state.currentAppointment.isPrivate,
    //   };

    //   const insertCommand = new InsertCommand(payload, this.service);
    //   response = <AppointmentResponse | null>await insertCommand.execute();
    //   insertCommand.showNotification(response);
    // }
    // if (response != null) {
    //   this.clear();
    // }
    // return response;
    return null;
  }

  // private async showModalConfirmation(): Promise<boolean> {
  //   const confirm = await this.notifySweetAlert.show(
  //     'Atención',
  //     Messages.newRegister
  //   );
  //   return confirm;
  // }

  public async changedPaymentMethod(val: number) {
    const isCash = await this.paymentOptionIsCashUseCase.execute(val);
    this.state.disableCodeTransaction = isCash;
    this.paymentIsCash(isCash);
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
    // this.notifySweetAlert.setType('error');
    // const confirm = await this.notifySweetAlert.show(
    //   'Error',
    //   Messages.appointmentNotFound
    // );
    // if (confirm == false) {
    //   return;
    // }

    // routerInstance.push('/appointment');

    // const notFound = new NotFoundElementNotify(
    //   Messages.appointmentNotFound,
    //   this.notificator,
    //   '/appointment'
    // );
    // await notFound.execute();
  }

  private setInfoSchedule(schedule: EventScheduleResponse) {
    // this.state.schedule = schedule;
    // this.state.currentAppointment.schedule = schedule.id;
    // this.state.schedule.start = new Date(schedule.start).toLocaleString();
    // this.state.schedule.end = new Date(schedule.end).toLocaleString();
    // this.state.disableButtonSave = false;
  }

  public async patientWasScheduled(): Promise<void> {
    // const findPatientUseCase = new FindPatientByIdentificationUseCase({} as HTTPClient);
    // const response = await findPatientUseCase.execute(
    //   this.state.identificationPatient
    // );

    // if (response === null) {
    //   const notFound = new NotFoundElementNotify(
    //     Messages.notFoundInfoPatient,
    //     this.notificator,
    //     '/patient'
    //   );
    //   await notFound.execute();

    //   return;
    // }
    // const findScheduleByIdentificationPatient =
    //   new FindScheduleByIdentificationPatientUseCase();
    // const schedule = await findScheduleByIdentificationPatient.execute(
    //   this.state.identificationPatient
    // );

    // if (schedule === null) {
    //   const notFound = new NotFoundElementNotify(
    //     Messages.patientNotSchedule,
    //     this.notificator,
    //     '/schedule'
    //   );
    //   await notFound.execute();
    //   return;
    // }
    // this.setInfoSchedule(schedule);
  }

  async loadInitialData(handleGlobalState: IHandleGlobalState): Promise<void> {
    const allPaymentOptions = await handleGlobalState.getAllPaymentOptions();

    this.changeState({
      ...this.state,
      allPaymentOptions: allPaymentOptions
    });
  }
}
