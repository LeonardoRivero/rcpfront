import { defineStore } from 'pinia';
import { Messages } from 'src/Application/Utilities';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { IStoreSettings } from 'src/Domine/IStores';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  DXMainCodeResponse,
  PathologicalHistoryResponse,
  PatientResponse,
  RelationCodeResponse,
  SpecialityResponse,
} from 'src/Domine/Responses';
import { routerInstance } from 'src/boot/globalRouter';
import { Modal } from '../Utilities/Modal';
import { PatientService } from 'src/Application/Services';

export class PatientMediator implements IControllersMediator {
  private controllers: Controller[] = [];
  public store: IStoreSettings;
  private static instance: PatientMediator;
  private service = new PatientService();
  private serviceModal = new Modal();
  private messages = Messages.getInstance();

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
        currentSpeciality: {} as ISpeciality,
        currentDxMainCode: {} as DXMainCodeResponse,
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

  public handleData(): void {
    // for (const controller of this.controllers) {
    //   controller.receiveData(this.store);
    // }
    // this.notify(this.store);
  }

  public async searchByIdentificacion(
    identification: string
  ): Promise<PatientResponse | null> {
    const response = await this.service.findByIdentification(identification);
    return response;
  }

  public async patientNotFound(): Promise<void> {
    const confirm = await this.serviceModal.showModal(
      'Error',
      this.messages.notFoundInfoPatient,
      'error'
    );
    if (confirm == false) {
      return;
    }

    routerInstance.push('/patient');
    return;
  }
}
