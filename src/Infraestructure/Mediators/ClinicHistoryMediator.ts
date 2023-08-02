import { defineStore } from 'pinia';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { IStoreClinicHistory } from 'src/Domine/IStores';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  DoctorResponse,
  PatientResponse,
} from 'src/Domine/Responses';

export class ClinicHistoryMediator implements IControllersMediator {
  private controllers: Controller[] = [];
  public stores: IStoreClinicHistory;
  private static instance: ClinicHistoryMediator;

  private constructor() {
    this.stores = this.createStore();
  }
  public createStore(): IStoreClinicHistory {
    const store = defineStore({
      id: 'useStoreClinicHistory',
      state: (): IStoreClinicHistory => ({
        speciality: {} as ISpeciality,
        currentDoctor: {} as DoctorResponse,
        currentAppointment: {} as AppointmentResponse,
        currentPatient: {} as PatientResponse,
        currentSchedule: null,
      }),
    });
    return store();
  }

  public static getInstance(): ClinicHistoryMediator {
    if (!ClinicHistoryMediator.instance) {
      ClinicHistoryMediator.instance = new ClinicHistoryMediator();
    }
    return ClinicHistoryMediator.instance;
  }

  public add(controller: Controller): void {
    const isExist = this.controllers.includes(controller);
    if (isExist) {
      return;
    }
    controller.setMediator(this);
    this.controllers.push(controller);
  }

  public notify(store: IStoreClinicHistory, sender: Controller): void {
    for (const controller of this.controllers) {
      controller.receiveData(this);
    }
  }

  public getStore(): IStoreClinicHistory {
    return this.stores;
  }
}
