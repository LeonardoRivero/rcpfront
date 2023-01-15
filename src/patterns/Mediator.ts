import { defineStore, Store } from 'pinia';
import { IDXMainCodeResponse, ISpeciality } from 'src/Domine/models/IConsults';
import { useStoreSettings } from 'src/Infraestructure/stores/storeSettings';
import {
  DxMainCodeRepository,
  SpecialityRepository,
} from '../Application/Repositories/SettingsRepository';
import modalService from 'src/services/ModalService';
import { Messages } from 'src/Application/Utilities/Constants';
import { QForm } from 'quasar';

interface Mediator {
  notify(sender: object, event: string): void;
}
interface BaseService {
  store: Store;
}
export class Test implements BaseService {
  setStore(): void {
    throw new Error('Method not implemented.');
  }
}
export class BaseComponent {
  protected mediator: Mediator;

  constructor(mediator?: Mediator) {
    this.mediator = mediator!;
  }

  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }
}
