import { StoreGeneric, defineStore } from 'pinia';
import { PatientStatusService } from 'src/Application/Services';
import { PaymentOptionsService } from 'src/Application/Services/PaymentOptionsService';
import { ReasonConsultService } from 'src/Application/Services/ReasonConsultService';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { IStoreAppointment } from 'src/Domine/IStores';
import {
  PatientStatusResponse,
  PaymentOptionsResponse,
  ReasonConsultResponse,
} from 'src/Domine/Responses';

export class AppointmentMediator implements IControllersMediator {
  public store: StoreGeneric;
  private static instance: AppointmentMediator;
  private servicePaymentOptions = new PaymentOptionsService();
  private serviceReasonConsult = ReasonConsultService.getInstance();
  private servicePatientStatus = PatientStatusService.getInstance();

  private constructor() {
    this.store = this.createStore();
  }

  public static getInstance(): AppointmentMediator {
    if (!AppointmentMediator.instance) {
      AppointmentMediator.instance = new AppointmentMediator();
    }
    return AppointmentMediator.instance;
  }

  public add(controller: Controller): void {
    throw new Error('Method not implemented.');
  }

  public notify(data: object, sender: Controller): void {
    throw new Error('Method not implemented.');
  }

  public createStore(): StoreGeneric {
    const store = defineStore({
      id: 'useStoreAppointment',
      state: (): IStoreAppointment => ({
        allPaymentOptions: [],
        allReasonConsult: [],
        allPatientStatus: [],
      }),
    });
    return store();
  }

  public getStore(): StoreGeneric {
    return this.store;
  }

  public async getAllPaymentOptions(): Promise<Array<PaymentOptionsResponse>> {
    if (this.store.allPaymentOptions.length == 0) {
      this.store.allPaymentOptions = await this.servicePaymentOptions.getAll();
    }
    return this.store.allPaymentOptions;
  }

  public async getAllReasonConsult(): Promise<Array<ReasonConsultResponse>> {
    if (this.store.allReasonConsult.length == 0) {
      this.store.allReasonConsult = await this.serviceReasonConsult.getAll();
    }
    return this.store.allReasonConsult;
  }

  public async getAllPatientStatus(): Promise<Array<PatientStatusResponse>> {
    if (this.store.allPatientStatus.length == 0) {
      this.store.allPatientStatus = await this.servicePatientStatus.getAll();
    }
    return this.store.allPatientStatus;
  }
}
