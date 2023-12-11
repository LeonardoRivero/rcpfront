import { defineStore } from 'pinia';
import { Messages } from 'src/Application/Utilities';
import {
  Controller,
  IControllersMediator,
  Notificator,
} from 'src/Domine/IPatterns';
import { IStoreSettings } from 'src/Domine/IStores';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  DXMainCodeResponse,
  Group,
  HealthInsuranceResponse,
  IDTypeResponse,
  PathologicalHistoryResponse,
  PatientResponse,
  RelationCodeResponse,
  SpecialityResponse,
} from 'src/Domine/Responses';
import { routerInstance } from 'src/boot/globalRouter';
import { FactoryNotifactors } from 'src/Adapters/Creators/Factories';
import { PatientService } from 'src/Application/Services';
import { ModalType } from 'src/Domine/Types';

export class PatientMediator implements IControllersMediator {
  private controllers: Controller[] = [];
  public store: IStoreSettings;
  private static instance: PatientMediator;
  private service = new PatientService();
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

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

  public add(controller: Controller): void {
    const isExist = this.controllers.includes(controller);
    if (isExist) {
      return;
    }
    controller.setMediator(this);
    this.controllers.push(controller);
  }

  public notify(data: IStoreSettings, sender: Controller): void {
    for (const controller of this.controllers) {
      if (controller !== sender) {
        controller.receiveData(this);
      }
    }
  }

  public clearAll() {
    for (const controller of this.controllers) {
      controller.clear();
    }
  }

  public async searchByIdentificacion(
    identification: string
  ): Promise<PatientResponse | null> {
    const response = await this.service.findByIdentification(identification);
    return response;
  }

  public async patientNotFound(): Promise<void> {
    this.notifySweetAlert.setType('error');
    const confirm = await this.notifySweetAlert.show(
      'Error',
      Messages.notFoundInfoPatient
    );
    if (confirm == false) {
      return;
    }

    routerInstance.push('/patient');
    return;
  }
}
