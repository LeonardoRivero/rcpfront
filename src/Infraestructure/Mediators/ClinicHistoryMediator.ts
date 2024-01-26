import { defineStore } from 'pinia';
import {
  DxMainCodeService,
  PathologicalHistoryService,
} from 'src/Application/Services';
import { RelationCodeService } from 'src/Application/Services/RelationCodeService';
import { Bloc, IControllersMediator } from 'src/Domine/IPatterns';
import { IStoreClinicHistory } from 'src/Domine/IStores';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  AppointmentResponse,
  DXMainCodeResponse,
  DoctorResponse,
  PathologicalHistoryResponse,
  PatientResponse,
  RelationCodeResponse,
} from 'src/Domine/Responses';

export interface ActionsScheduleMediator {
  getAllPathologies(): Promise<Array<PathologicalHistoryResponse>>;
  getAllDxMainCodes(): Promise<Array<DXMainCodeResponse>>;
  getAllRelationCode(): Promise<Array<RelationCodeResponse>>;
}
export class ClinicHistoryMediator
  implements IControllersMediator, ActionsScheduleMediator
{
  private controllers: Bloc<any>[] = [];
  public store: IStoreClinicHistory;
  private static instance: ClinicHistoryMediator;

  private constructor() {
    this.store = this.createStore();
  }
  public createStore(): IStoreClinicHistory {
    const store = defineStore({
      id: 'useStoreClinicHistory',
      state: (): IStoreClinicHistory => ({
        currentDoctor: {} as DoctorResponse,
        currentAppointment: {} as AppointmentResponse,
        allPathologies: <Array<PathologicalHistoryResponse>>[],
        currentSchedule: null,
        examParameterResult: [],
        allDxMainCodes: [],
        allRelationCodes: [],
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
      if (controller !== sender) {
        controller.receiveData(this);
      }
    }
  }

  getHistoryPatient() {
    console.log('va a obtener la hisotria');
  }

  getStore(): IStoreClinicHistory {
    return this.store;
  }

  async getAllPathologies(): Promise<Array<PathologicalHistoryResponse>> {
    if (this.store.allPathologies.length != 0) {
      return this.store.allPathologies;
    }
    const service = new PathologicalHistoryService();
    const response = await service.getAll();
    this.store.allPathologies = response;
    return response;
  }

  async getAllDxMainCodes(): Promise<DXMainCodeResponse[]> {
    if (this.store.allDxMainCodes.length != 0) {
      return this.store.allDxMainCodes;
    }
    const service = new DxMainCodeService();
    const response = await service.getAll();
    this.store.allDxMainCodes = response;
    return response;
  }

  async getAllRelationCode(): Promise<RelationCodeResponse[]> {
    if (this.store.allRelationCodes.length != 0) {
      return this.store.allRelationCodes;
    }
    const service = new RelationCodeService();
    const response = await service.getAll();
    this.store.allRelationCodes = response;
    return response;
  }
}
