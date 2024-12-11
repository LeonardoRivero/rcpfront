import { AddAdmissionRequest, FilterScheduleRequest } from 'src/Domine/Request';
// import { Messages } from 'src/Application/Utilities/Messages';
import {
  Bloc,
  IFactoryMethodNotifications,
  IHandleGlobalState,
  IHandleUserState,
  IMediatorUseCases,
  IUseCase,
  Notificator,
} from 'src/Domine/IPatterns';
import { AdmissionState } from 'src/Domine/IStates';
import {
  EventScheduleResponse,
  PatientResponse,
  ScheduleResponse,
} from 'src/Domine/Responses';
import { ModalType } from 'src/Domine/Types';
import { Messages } from 'src/Application/Utilities';
import { routerInstance } from 'src/boot/globalRouter';
import { CalculateAmountPaidAppointmentUseCase } from 'src/Application/UseCases/AdmissionUseCases';
import { ShowModalNewRegister } from 'src/Application/Commands';
import { IHelpers } from 'src/Domine/ICommons';
// import { NotFoundElementNotify } from './Commands';
// import { FindScheduleByIdentificationPatientUseCase } from 'src/Application/Services/ScheduleService';
// import { InsertCommand } from 'src/Application/Commands';
// import { FindPatientByIdentificationUseCase } from 'src/Application/UseCases/PatientUseCases';

export class AdmissionsBloc extends Bloc<AdmissionState> {
  // public state: AppointmentState;
  // private service = new AppointmentService();
  private calculeAmountPaidUseCase =
    new CalculateAmountPaidAppointmentUseCase();
  // private paymentOptionIsCashUseCase = new PaymentOptionIsCashUseCase();
  // private static instance: AppointmentAdapter;
  // private notificator: IFactoryMethodNotifications;
  private notifySweetAlert: Notificator;
  private notifyQuasar: Notificator;
  private showModalNewPatient: IUseCase<ModalType, boolean>;

  constructor(
    private factoryNotificator: IFactoryMethodNotifications,
    private mediatorUseCases: IMediatorUseCases,
    private findPatientByIdentificationUseCase: IUseCase<
      string,
      PatientResponse | null
    >,
    private findScheduleForPatientUseCase: IUseCase<
      FilterScheduleRequest,
      ScheduleResponse | null
    >,
    private paymentOptionsIsCashUseCase: IUseCase<number, boolean>,
    private helper: IHelpers,
    private createAdmissionUseCase: IUseCase<
      AddAdmissionRequest,
      [string, boolean]
    >
  ) {
    const state: AdmissionState = {
      identificationPatient: '',
      reasonConsult: null,
      currentAppointment: { isParticular: false } as AddAdmissionRequest,
      allPaymentOptions: [],
      allReasonConsult: [],
      allPatientStatus: [],
      start: '',
      end: '',
      schedule: {
        patient: {},
        speciality: {},
        doctor: {},
        end: '',
        start: '',
        healthEntity: {},
      } as ScheduleResponse,
      disableCodeTransaction: false,
      disableButtonSave: true,
      patient: null,
      amount: null,
      copayment: null,
      price: null,
      showSkeleton: true,
    };
    super(state, mediatorUseCases);
    // this.state = store;
    // this.notificator = factoryNotify;
    this.notifySweetAlert = factoryNotificator.createNotificator(
      ModalType.SweetAlert
    );
    this.notifyQuasar = this.factoryNotificator.createNotificator(
      ModalType.NotifyQuasar
    );
    this.showModalNewPatient = new ShowModalNewRegister(factoryNotificator);
  }

  // receiveData(data: IControllersMediator): void {
  //   throw new Error('Method not implemented.');
  // }

  public async clear(): Promise<void> {
    const state = {
      currentAppointment: { isParticular: false } as AddAdmissionRequest,
    } as AdmissionState;
    this.changeState({ ...state });
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
    const appointment = this.state.currentAppointment;
    appointment.appointmentPrice = this.helper.getValueFromString(this.state.price);
    appointment.copayment = appointment.isParticular ? 0 : this.helper.getValueFromString(this.state.copayment);
    const amountToPaid = this.calculeAmountPaidUseCase.execute(this.state.currentAppointment);

    this.changeState({
      ...this.state,
      amount: this.helper.formatToMoneyString(amountToPaid.toString()),
      price: this.helper.formatToMoneyString(
        appointment.appointmentPrice.toString()
      ),
      copayment: this.helper.formatToMoneyString(
        appointment.copayment.toString()
      ),
      currentAppointment: {
        ...this.state.currentAppointment,
        amountPaid: amountToPaid,
        copayment: appointment.isParticular ? 0 : appointment.copayment,
      },
    });
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

  public async saveOrUpdate(handleUserState: IHandleUserState): Promise<void> {
    let description = '';
    let sucess = false;
    const payload: AddAdmissionRequest = {
      appointmentPrice: this.state.currentAppointment.appointmentPrice,
      copayment: this.state.currentAppointment.copayment,
      amountPaid: this.state.currentAppointment.amountPaid,
      authorizationNumber: this.state.currentAppointment.authorizationNumber,
      medicalEntryId: this.state.currentAppointment.medicalEntryId,
      scheduleId: this.state.schedule.id,
      patientId: this.state.schedule.patient.id,
      doctorId: this.state.schedule.doctor.id,
      paymentMethodId: this.state.currentAppointment.paymentMethodId,
      transactionCode: this.state.currentAppointment.transactionCode,
      isParticular: this.state.currentAppointment.isParticular,
      userId: handleUserState.getInfoUser().userId,
    };

    if (this.state.currentAppointment.id == undefined) {
      delete this.state.currentAppointment['id'];
      const confirm: boolean = await this.showModalNewPatient.execute(
        ModalType.SweetAlert
      );
      if (!confirm) return;
      const [message, wasSucess] = await this.createAdmissionUseCase.execute(
        payload
      );
      description = message;
      sucess = wasSucess;
    }

    if (sucess) {
      this.notifyQuasar.setType('success');
      this.notifyQuasar.show('', description);
      routerInstance.push('/index');
      return;
    }
    this.notifyQuasar.setType('error');
    this.notifyQuasar.show('', description);
    return;
  }
  // private async showModalConfirmation(): Promise<boolean> {
  //   const confirm = await this.notifySweetAlert.show(
  //     'Atención',
  //     Messages.newRegister
  //   );
  //   return confirm;
  // }

  public async changedPaymentMethod(val: number) {
    const isCash = await this.paymentOptionsIsCashUseCase.execute(val);
    this.changeState({
      ...this.state,
      disableCodeTransaction: isCash,
      currentAppointment: {
        ...this.state.currentAppointment,
        transactionCode: isCash
          ? null
          : this.state.currentAppointment.transactionCode,
      },
    });
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

  public async patientWasScheduled(medicalOfficeId: number): Promise<void> {
    const response = await this.findPatientByIdentificationUseCase.execute(
      this.state.identificationPatient
    );
    this.notifySweetAlert.setType('error');
    if (response === null) {
      this.changeState({ ...this.state, disableButtonSave: true });
      const confirm = await this.notifySweetAlert.show(
        'Error',
        Messages.notFoundInfoPatient
      );
      if (confirm) {
        routerInstance.push('/patient');
      }
      return;
    }

    this.changeState({
      ...this.state,
      patient: response,
      showSkeleton: false,
    });

    const request: FilterScheduleRequest = {
      identificationPatient: this.state.identificationPatient,
      medicalOfficeId: medicalOfficeId,
    };
    const schedule = await this.findScheduleForPatientUseCase.execute(request);
    if (schedule === null) {
      this.changeState({ ...this.state, disableButtonSave: true });
      const confirm = await this.notifySweetAlert.show(
        'Error',
        Messages.patientNotSchedule
      );
      if (confirm) {
        routerInstance.push('/schedule');
      }
      return;
    }
    this.changeState({ ...this.state, schedule: schedule, disableButtonSave: false });
  }

  async loadInitialData(handleGlobalState: IHandleGlobalState): Promise<void> {
    const allPaymentOptions = await handleGlobalState.getAllPaymentOptions();
    const allMedicalEntry = await handleGlobalState.getAllMedicalEntry();
    this.changeState({
      ...this.state,
      allPaymentOptions: allPaymentOptions,
      allReasonConsult: allMedicalEntry,
    });
  }
}
