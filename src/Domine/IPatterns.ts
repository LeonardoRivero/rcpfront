import { GenericService } from 'src/Application/Repositories/Interface';
import { IColumnsDataTable, ITableOptions } from './ICommons';
import { NotificationType, ModalType, ServicesType } from './Types';
import { injectable } from 'inversify';

type Subscription<S> = (state: S) => void;

@injectable()
export abstract class Bloc<S> {
  abstract receiveData(data: IControllersMediator): void;
  abstract clear(): void;
  protected mediator: IControllersMediator;
  private internalState: S;
  private listeners: Subscription<S>[] = [];

  constructor(initalState: S, mediator?: IControllersMediator) {
    this.internalState = initalState;
    this.mediator = mediator!;
  }

  public get state(): S {
    return this.internalState;
  }

  public changeState(state: S) {
    this.internalState = state;

    if (this.listeners.length > 0) {
      this.listeners.forEach((listener) => listener(this.state));
    }
  }

  public subscribe(listener: Subscription<S>) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: Subscription<S>) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  public setMediator(mediator: IControllersMediator): void {
    this.mediator = mediator;
  }

  public isCommand(object: unknown): object is ICommand {
    return object !== undefined;
  }
}

@injectable()
export abstract class Controller {
  abstract receiveData(data: IControllersMediator): void;
  abstract clear(): void;
  abstract state: object;
  protected mediator: IControllersMediator;

  constructor(mediator?: IControllersMediator) {
    this.mediator = mediator!;
  }

  public setMediator(mediator: IControllersMediator): void {
    this.mediator = mediator;
  }

  public isCommand(object: unknown): object is ICommand {
    return object !== undefined;
  }
}

export interface IControllersMediator {
  add(subscriber: Bloc<any>): void;
  notify(data: object, sender: Bloc<any>): void;
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

export interface IFactoryService {
  createService(serviceType: ServicesType): GenericService<unknown, unknown>;
}

export interface ICommand {
  execute(): Promise<object | null | void | boolean>;
}

export interface HandlerEvent<RequestInfo> extends ICommand {
  type: 'hasChange' | 'click' | 'submit' | 'check' | 'redirect';
  controller: Controller;
  data: RequestInfo;
}

export interface UseCase<IRequest, IResponse> {
  GenericService:
    | GenericService<unknown, unknown>
    | IToRead<unknown>
    | IToCreate<unknown, unknown>
    | IToUpdate<unknown, unknown>;
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}

export abstract class Builder {
  public abstract table: ITableOptions;
  public abstract setData(
    columns: unknown[],
    rows: unknown[],
    title: string | undefined
  ): void;
  public abstract getResult(): ITableOptions;
  public setSelectionRow() {
    this.table.selectionRow = 'none';
  }
  public hasSearchField() {
    this.table.enableSearch = true;
  }
  public showButtonActions() {
    this.table.showButtonActions = true;
  }
}

export interface IToCreate<T, T2> {
  urlCreate: string;
  create(entity: T): Promise<T2 | null>;
}

export interface IToRead<T> {
  urlList: string;
  urlBase: string;
  getAll(): Promise<Array<T>>;
  getById(id: number): Promise<T | null>;
  findByParameters(queryParameters: object): Promise<Array<T>>;
}

export interface IToUpdate<T, T2> {
  urlUpdate: string;
  update(payload: T, id: number): Promise<T | null | T2>;
}

export interface IToDelete {
  urlDelete: string;
  delete(id: number): Promise<object | null>;
}

export interface HTTPClient {
  GET(path: string, queryparams?: object): Promise<Response>;
  POST(path: string, body: unknown): Promise<Response>;
  PUT(path: string, body: unknown): Promise<Response>;
  DELETE(path: string): Promise<Response>;
}

export abstract class Subject {
  attach(observer: Observer): void {
    return;
  }
  detach(observer: Observer): void {
    return;
  }
  notify(data: object): void {
    return;
  }
}
export interface Observer {
  handleNotification(subject: Subject, data: object): void;
}
