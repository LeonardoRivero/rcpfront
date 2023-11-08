import { GenericService } from 'src/Application/Repositories/Interface';
import { ITableOptions } from './ICommons';
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

  public isCommand(object: any): object is ICommand {
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

// export interface AbstractFactory<T extends { id?: number | undefined }, T2> {
//   createController(): any;
//   createService(): GenericService<T, T2>;
// }

// export abstract class DxMainCodeAbstractController extends Controller {
//   abstract add(): void;
//   abstract dxMainCodeChanged(val: DXMainCodeResponse): void;
// }

export interface ICommand {
  execute(): Promise<object | null>;
}

export abstract class Builder {
  public abstract table: ITableOptions;
  public abstract setData(
    columns: any[],
    rows: any[],
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
