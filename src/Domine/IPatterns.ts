import { GenericService } from 'src/Application/Repositories/Interface';
import { ITableOptions } from './ICommons';
import { NotificationType, ModalType, ServicesType } from './Types';

export abstract class Controller {
  abstract receiveData(data: IControllersMediator): void;
  abstract clear(): void;
  abstract state: object;
  protected factoryService: IFactoryService | undefined;
  protected mediator: IControllersMediator;

  constructor(
    mediator?: IControllersMediator,
    factoryService?: IFactoryService
  ) {
    this.mediator = mediator!;
    this.factoryService = factoryService;
  }

  public setMediator(mediator: IControllersMediator): void {
    this.mediator = mediator;
  }

  public isCommand(object: unknown): object is ICommand {
    return object !== undefined;
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

export interface IFactoryService {
  createService(serviceType: ServicesType): GenericService<unknown, unknown>;
}

export interface ICommand {
  execute(): Promise<object | null>;
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
    this.table.tableProps.selection = 'none';
  }
  public hasSearchField() {
    this.table.enableSearch = true;
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
