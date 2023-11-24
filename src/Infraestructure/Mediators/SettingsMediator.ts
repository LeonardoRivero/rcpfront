import { defineStore } from 'pinia';
import { IDTypesRepository } from 'src/Application/Repositories';
import { GroupsService } from 'src/Application/Repositories/UserRepository';
import {
  InsuranceService,
  PathologicalHistoryService,
} from 'src/Application/Services';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { IStoreSettings } from 'src/Domine/IStores';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  DXMainCodeResponse,
  PathologicalHistoryResponse,
  RelationCodeResponse,
  SpecialityResponse,
  Group,
  HealthInsuranceResponse,
  IDTypeResponse,
} from 'src/Domine/Responses';
import container from 'src/inversify.config';

export class SettingsMediator implements IControllersMediator {
  private controllers: Controller[] = [];
  public store: IStoreSettings;
  private static instance: SettingsMediator;
  private service = new PathologicalHistoryService();
  private serviceSpeciality =
    container.get<SpecialityService>('SpecialityService');
  private serviceHealthInsurance = new InsuranceService();

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
        allIdTypes: <Array<IDTypeResponse>>[],
        currentSpeciality: {} as SpecialityResponse,
        currentDxMainCode: {} as DXMainCodeResponse,
        allGroups: <Array<Group>>[],
        allInsurance: <Array<HealthInsuranceResponse>>[],
      }),
      // persist: true,
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

  public async getAllPathologies() {
    if (this.store.allPathologies.length != 0) {
      return this.store.allPathologies;
    }
    const response = await this.service.getAll();
    this.store.allPathologies = response;
    return response;
  }

  public async getAllSpecialities(): Promise<Array<SpecialityResponse>> {
    if (this.store.allSpecialities.length > 0) {
      return this.store.allSpecialities;
    }
    const response = await this.serviceSpeciality.getAll();
    this.store.allSpecialities = response;
    return response;
  }

  public async getAllGroups(): Promise<Group[]> {
    const groupRepository = GroupsService.getInstance();
    const data = await groupRepository.getAll();
    // if (!response.ok) {
    //   return [];
    // }
    // const data: Group[] = await response.json();
    return data;
    // if(this.store.allGroups.length == 0){
    //   preguntar al this.mediator por los grupos
    //   return respuesta del mediador
    // }
    // return this.allGroups
  }

  public async getAllIdTypes(): Promise<Array<IDTypeResponse>> {
    if (this.store.allIdTypes.length != 0) {
      return this.store.allIdTypes;
    }
    const idTypesRepository = new IDTypesRepository();
    const response = await idTypesRepository.getAll();
    if (!response.ok) {
      return <Array<IDTypeResponse>>[];
    }
    this.store.allIdTypes = await response.json();
    return this.store.allIdTypes;
  }
  public async getAllInsurance(): Promise<Array<HealthInsuranceResponse>> {
    if (this.store.allInsurance.length > 0) {
      return this.store.allInsurance;
    }
    const response = await this.serviceHealthInsurance.getAll();
    this.store.allInsurance = response;
    return response;
  }

  // public async addToArrayDefault(
  //   item: HealthInsuranceResponse
  // ): Promise<Array<HealthInsuranceResponse>> {
  //   if (this.store.allInsurance.length == 0) {
  //     await this.getAllInsurance();
  //   }
  //   const particular = this.store.allInsurance.filter(
  //     (x) => x.nameInsurance == 'Particular'
  //   );
  //   particular.push(item);
  //   return particular;
  // }
}
