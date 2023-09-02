import { StoreGeneric, defineStore } from 'pinia';
import { PaymentOptionsService } from 'src/Application/Services/PaymentOptionsService';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { IStoreAppointment } from 'src/Domine/IStores';
import { PaymentOptionsResponse } from 'src/Domine/Responses';

export class AppointmentMediator implements IControllersMediator {
  public store: StoreGeneric;
  private static instance: AppointmentMediator;
  servicePaymentOptions = PaymentOptionsService.getInstance();

  private constructor() {
    this.store = this.createStore();
  }

  public static getInstance(): AppointmentMediator {
    if (!AppointmentMediator.instance) {
      AppointmentMediator.instance = new AppointmentMediator();
    }
    return AppointmentMediator.instance;
  }
  add(controller: Controller): void {
    throw new Error('Method not implemented.');
  }
  notify(data: object, sender: Controller): void {
    throw new Error('Method not implemented.');
  }
  createStore(): StoreGeneric {
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
  getStore(): object {
    throw new Error('Method not implemented.');
  }

  async getAllPaymentOptions(): Promise<Array<PaymentOptionsResponse>> {
    if (this.store.allPaymentOptions.length == 0) {
      this.store.allPaymentOptions = await this.servicePaymentOptions.getAll();
    }
    return this.store.allPaymentOptions;
  }
}
