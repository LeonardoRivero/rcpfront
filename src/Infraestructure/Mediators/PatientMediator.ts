import { defineStore } from 'pinia';
import {
  Controller,
  IControllersMediator,
} from 'src/Domine/IPatterns';
import { IStoreSettings } from 'src/Domine/IStores';
import {
  DXMainCodeResponse,
  Group,
  HealthInsuranceResponse,
  IDTypeResponse,
  PathologicalHistoryResponse,
  RelationCodeResponse,
  SpecialityResponse,
} from 'src/Domine/Responses';

export class PatientMediator {
  private controllers: Controller[] = [];
  public store: IStoreSettings;
  private static instance: PatientMediator;

  private constructor() {
    this.store = this.createStore();
  }

  public createStore() {
    const store = defineStore({
      id: 'useStoreSettings',
      state: (): IStoreSettings => ({
        allSpecialities: <Array<SpecialityResponse>>[],
        allPathologies: <Array<PathologicalHistoryResponse>>[],
        allRelationCode: <Array<RelationCodeResponse>>[],
        currentSpeciality: {} as SpecialityResponse,
        currentDxMainCode: {} as DXMainCodeResponse,
        allInsurance: <Array<HealthInsuranceResponse>>[],
        allGroups: <Array<Group>>[],
        allIdTypes: <Array<IDTypeResponse>>[],
      }),
    });
    return store();
  }

  public getStore(): IStoreSettings {
    return this.store;
  }

  public static getInstance(): PatientMediator {
    if (!PatientMediator.instance) {
      PatientMediator.instance = new PatientMediator();
    }
    return PatientMediator.instance;
  }

  // public add(controller: Controller): void {
  //   const isExist = this.controllers.includes(controller);
  //   if (isExist) {
  //     return;
  //   }
  //   controller.setMediator(this);
  //   this.controllers.push(controller);
  // }

  // public notify(data: IStoreSettings, sender: Controller): void {
  //   for (const controller of this.controllers) {
  //     if (controller !== sender) {
  //       controller.receiveData(this);
  //     }
  //   }
  // }

  // public clearAll() {
  //   for (const controller of this.controllers) {
  //     controller.clear();
  //   }
  // }

  // public async searchByIdentificacion(
  //   identification: string
  // ): Promise<PatientResponse | null> {
  //   const findPatientUseCase = FindPatientByIdentificationUseCase.getInstance();
  //   const response = await findPatientUseCase.execute(identification);
  //   return response;
  // }

  // public async patientNotFound(): Promise<void> {
  //   throw new Error(
  //     'Aca hay algo raro... utilizar otro objeto que ya se definio para eso'
  //   );
  //   // this.notifySweetAlert.setType('error');
  //   // const confirm = await this.notifySweetAlert.show(
  //   //   'Error',
  //   //   Messages.notFoundInfoPatient
  //   // );
  //   // if (confirm == false) {
  //   //   return;
  //   // }

  //   // routerInstance.push('/patient');
  //   // return;
  // }
}
