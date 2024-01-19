import { defineStore } from 'pinia';
import { PathologicalHistoryService } from 'src/Application/Services';
import { Bloc, Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { IStoreClinicHistory } from 'src/Domine/IStores';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  DoctorResponse,
  PathologicalHistoryResponse,
  PatientResponse,
} from 'src/Domine/Responses';
import { injectable } from 'inversify';

export interface ActionsScheduleMediator {
  getAllPathologies(): Promise<Array<PathologicalHistoryResponse>>;
}
@injectable()
export class ClinicHistoryMediator
  implements IControllersMediator, ActionsScheduleMediator
{
  private controllers: Bloc<any>[] = [];
  public stores: IStoreClinicHistory;

  public constructor() {
    this.stores = this.createStore();
  }
  public createStore(): IStoreClinicHistory {
    const store = defineStore({
      id: 'useStoreClinicHistory',
      state: (): IStoreClinicHistory => ({
        speciality: {} as ISpeciality,
        currentDoctor: {} as DoctorResponse,
        currentAppointment: {} as AppointmentResponse,
        allPathologies: <Array<PathologicalHistoryResponse>>[],
        currentPatient: {} as PatientResponse,
        currentSchedule: null,
      }),
    });
    return store();
  }

  public add(controller: Bloc<any>): void {
    const isExist = this.controllers.includes(controller);
    if (isExist) {
      return;
    }
    controller.setMediator(this);
    this.controllers.push(controller);
  }

  public notify(store: IStoreClinicHistory, sender: Bloc<any>): void {
    for (const controller of this.controllers) {
      controller.receiveData(this);
    }
  }

  public getHistoryPatient() {
    console.log('va a obtener la hisotria');
  }
  public getStore(): IStoreClinicHistory {
    return this.stores;
  }

  public async getAllPathologies(): Promise<
    Array<PathologicalHistoryResponse>
  > {
    if (this.stores.allPathologies.length != 0) {
      return this.stores.allPathologies;
    }
    const service = new PathologicalHistoryService();
    const response = await service.getAll();
    this.stores.allPathologies = response;
    return response;
  }
}
