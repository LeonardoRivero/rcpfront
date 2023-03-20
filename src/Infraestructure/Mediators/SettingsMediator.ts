import { defineStore } from 'pinia';
import { PathologicalHistoryService } from 'src/Application/Services';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { IStoreSettings } from 'src/Domine/IStores';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  DXMainCodeResponse,
  PathologicalHistoryResponse,
  RelationCodeResponse,
  SpecialityResponse,
} from 'src/Domine/Responses';

export class SettingsMediator implements IControllersMediator {
  private controllers: Controller[] = [];
  public store: IStoreSettings;
  private static instance: SettingsMediator;
  private service = new PathologicalHistoryService();
  private serviceSpeciality = new SpecialityService();

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

  public static getInstance(): SettingsMediator {
    if (!SettingsMediator.instance) {
      SettingsMediator.instance = new SettingsMediator();
    }
    return SettingsMediator.instance;
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

  public async getAllPathologies() {
    if (this.store.allPathologies.length != 0) {
      return this.store.allPathologies;
    }
    const response = await this.service.getAll();
    this.store.allPathologies = response;
    return response;
  }

  public async getAllSpecialities(): Promise<Array<SpecialityResponse>> {
    if (this.store.allSpecialities.length != 0) {
      return this.store.allSpecialities;
    }
    const response = await this.serviceSpeciality.getAll();
    this.store.allSpecialities = response;
    return response;
  }
}
