export abstract class Controller {
  abstract sendData(data: unknown): void;
  abstract receiveData<T>(data: T): void;
  abstract clear(): void;
  abstract state: object;
  protected mediator: IControllersMediator;

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
}
