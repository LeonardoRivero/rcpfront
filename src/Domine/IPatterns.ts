import { NotificationType, ModalType } from './Types';
export abstract class Controller {
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
  notify(data: object, sender: Controller): void;
  createStore(): object;
  getStore(): object;
}

export interface Notificator {
  show(title?: string, message?: string): Promise<boolean>;
  setType(type: NotificationType): void;
  setTime(timerMs: number): void;
}

export interface IFactoryMethodNotifications {
  createNotificator(notificationType: ModalType): Notificator;
}

// export interface AbstractFactory<T extends { id?: number | undefined }, T2> {
//   createRepository(): Repository<T>;
//   createController(): any;
//   createService(): Service<T, T2>;
// }

// export abstract class DxMainCodeAbstractController extends Controller {
//   abstract add(): void;
//   abstract dxMainCodeChanged(val: DXMainCodeResponse): void;
// }

export interface ICommand {
  execute(): Promise<object | null>;
}
