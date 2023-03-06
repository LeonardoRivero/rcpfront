export abstract class Controller {
  abstract sendData(data: unknown): void;
  abstract receiveData<T>(data: T): void;
  abstract clear(): void;
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
  handleData(): void;
  notify(data: object): void;
  createStore(): object;
}
