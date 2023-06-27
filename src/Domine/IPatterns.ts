import { IStorePermissions } from './IStores';

export abstract class Controller {
  abstract sendData(data: unknown): void;
  abstract receiveData(data: IControllersMediator): void;
  abstract clear(): void;
  abstract state: object;
  protected mediator: IControllersMediator;
  public metodoPrueba(): void {
    console.log('este es el metodo de prueba');
  }

  constructor(mediator?: IControllersMediator) {
    this.mediator = mediator!;
  }

  public setMediator(mediator: IControllersMediator): void {
    this.mediator = mediator;
  }
}

export interface IControllersMediator {
  add(subscriber: Controller): void;
  handleData(state: object): void;
  notify(data: object, sender: Controller): void;
  createStore(): object;
  getStore(): object;
}

export interface StrategyUser {
  store: IStorePermissions | undefined;
  setPermission(): Promise<void>;
}

export type ModalType =
  | 'sweetAlert'
  | 'notifyQuasar'
  | 'modalQuasar'
  | 'drawAttention';
export type NotificationType =
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'question';

export interface Notificator {
  show(title?: string, message?: string): Promise<boolean>;
  setType(type: NotificationType): void;
  setTime(timerMs: number): void;
}
export interface IFactoryMethodNotifications {
  createNotificator(notificationType: ModalType): Notificator;
}
