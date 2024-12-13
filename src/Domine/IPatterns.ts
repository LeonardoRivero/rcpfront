import { GenericService } from 'src/Application/Repositories/Interface';
import { IPermission, ITableOptions } from './ICommons';
import { NotificationType, ModalType } from './Types';
import { BiologicalSexResponse, CountryResponse, EthicityResponse, GenderResponse, HealthInsuranceResponse, DocumentTypeResponse, KindDisabilityResponse, MedicalOfficeResponse, OcupationResponse, PhoneCodeResponse, ZoneStayResponse, AuthResponse, SpecialityResponse, PaymentOptionsResponse, MedicalEntryResponse, AllergieResponse, KinshipResponse, AttentionScheduleMedicalResponse, PatientResponse } from './Responses';
import { DIVIPOLADTO } from './DTOs';
import { IGlobalState, IStorePermissions, IStoreUser } from './IStores';


type Subscription<S> = (state: S) => void;

export abstract class Bloc<S> {
  protected mediator: IMediatorUseCases | null;
  private internalState: S;
  private listeners: Subscription<S>[] = [];
  private observers: Bloc<any>[] = [];

  constructor(initalState: S, mediator?: IMediatorUseCases) {
    this.internalState = initalState;
    this.mediator = mediator || null;
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

  public setMediator(mediator: IMediatorUseCases): void {
    this.mediator = mediator;
  }

  public handleNotification<T>(subject: Subject, data: T): void {
    return
  };
}

export abstract class Controller {
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

export interface IHandleGlobalState {
  store: IGlobalState;
  createStore(): object;
  getAllCountries(): Promise<CountryResponse[]>
  getAllOcupation(): Promise<OcupationResponse[]>
  getAllHealthEntity(): Promise<HealthInsuranceResponse[]>
  getAllCities(): Promise<DIVIPOLADTO>
  getAllEthnicity(): Promise<EthicityResponse[]>
  getAllKindDisability(): Promise<KindDisabilityResponse[]>
  getAllPhoneCodes(): Promise<PhoneCodeResponse[]>
  getAllBiologicalSex(): Promise<BiologicalSexResponse[]>
  getAllZoneStay(): Promise<ZoneStayResponse[]>
  getAllDocumentType(): Promise<DocumentTypeResponse[]>
  getAllGender(): Promise<GenderResponse[]>
  getAllSpecialities(): Promise<SpecialityResponse[]>
  getAllPaymentOptions(): Promise<PaymentOptionsResponse[]>
  getAllMedicalEntry(): Promise<MedicalEntryResponse[]>
  getAllAllergies(): Promise<AllergieResponse[]>
  getAllKinship(): Promise<KinshipResponse[]>
  saveInfoMedicalOffice(medicalOffice: MedicalOfficeResponse[]): void
  refecthEvents(): void
}

export interface IHandleUserState {
  store: IStoreUser
  createStore(): object;
  saveInfoUser(infoAuthentication: AuthResponse): void
  saveEmailUser(email: string): void
  getInfoUser(): AuthResponse
  setStrategy(strategy: StrategyUser): void
  executeStrategy(): Promise<void>
  setRole(role: string[]): void
}
export interface Notificator {
  show(title?: string, message?: string): Promise<boolean>;
  setType(type: NotificationType): void;
  setTime(timerMs: number): void;
}

export interface IFactoryMethodNotifications {
  createNotificator(notificationType: ModalType): Notificator;
}

export interface ICommand {
  execute(): Promise<object | null | void | boolean>;
}

export interface HandlerEvent<RequestInfo> extends ICommand {
  type: 'hasChange' | 'click' | 'submit' | 'check' | 'redirect';
  controller: Controller;
  data: RequestInfo;
}

export interface IUseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
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

export class BasePermission implements IPermission {
  canCreate = true;
  canDelete = false;
  canUpdate = true;
  canGet = true;
}
export interface StrategyUser {
  // store: IStoreUser | undefined;
  userName: string
  setPermission(store: IStoreUser | undefined): Promise<void>;
}
export interface HTTPClient {
  // handlerUserState: IHandleUserState
  GET(path: string, queryparams?: object): Promise<Response>;
  POST(path: string, body: unknown): Promise<Response>;
  PUT(path: string, body: unknown): Promise<Response>;
  DELETE(path: string): Promise<Response>;
  logout(): Promise<Response>
  refreshToken(refresh_token: string): Promise<Response>
}

export interface Subject {
  attach(observer: Bloc<unknown>): void
  detach(observer: Bloc<unknown>): void
  notify<T>(data: T): void
}
export interface Observer {
  handleNotification(subject: Subject, data: object): void;
}

export interface IMediatorUseCases {
  getAllDocumentType(): Promise<DocumentTypeResponse[]>
  getAllGender(): Promise<GenderResponse[]>
  getMedicalOfficeBelongToUser(request: string): Promise<MedicalOfficeResponse[]>
  getAttentionMedicalOffice(request: number): Promise<AttentionScheduleMedicalResponse | null>
  getSpecialityBelongToMedicalOffice(request: number): Promise<SpecialityResponse[]>
  findPatientByIdentification(request: string): Promise<PatientResponse | null>
}

