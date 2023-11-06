import { ICommand, IToCreate, Notificator } from 'src/Domine/IPatterns';
import { GenericService, Service } from './Repositories/Interface';
import { IUser } from 'src/Domine/ModelsDB';
import { FactoryNotifactors } from 'src/Adapters/Creators/Factories';
import { ModalType } from 'src/Domine/Types';
import { Messages } from './Utilities';
import { IUserService } from 'src/Domine/ICommons';
import { RegisterResponse } from 'src/Domine/Responses';

export class CreateCommand implements ICommand {
  public payload: unknown;
  public service: Service<any, object>;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

  constructor(payload: unknown, service: Service<any, object>) {
    this.payload = payload;
    this.service = service;
  }

  async execute(): Promise<object | null> {
    this.notifySweetAlert.setType('question');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.newRegister
    );
    if (confirm === false) {
      return null;
    }
    const response = await this.service.save(this.payload);
    return response;
  }
}

export class UpdateCommand implements ICommand {
  public payload: unknown;
  public service: Service<any, object>;
  constructor(payload: unknown, service: Service<any, object>) {
    this.payload = payload;
    this.service = service;
  }
  async execute(): Promise<object | null> {
    const response = await this.service.update(this.payload);
    return response;
  }
}

export class FindByParametersCommand implements ICommand {
  public parameters: object;
  public service: Service<any, object>;
  constructor(parameters: object, service: Service<any, object>) {
    this.parameters = parameters;
    this.service = service;
  }
  execute(): Promise<object | null> {
    const response = this.service.findByParameters(this.parameters);
    return response;
  }
}
export class RegisterUserCommand implements ICommand {
  public payload: IUser;
  public service: IUserService;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

  private notifyQuasar: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.NotifyQuasar);

  constructor(payload: IUser, service: IUserService) {
    this.payload = payload;
    this.service = service;
  }
  async execute(): Promise<RegisterResponse | null> {
    this.notifySweetAlert.setType('question');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.newRegister
    );
    if (confirm === false) {
      return null;
    }
    const response = await this.service.register(this.payload);
    if (response == null) {
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, 'Ocurrio un error en la operacion.');
    }
    if (response != null) {
      this.notifyQuasar.setType('success');
      this.notifyQuasar.show(undefined, response.detail);
    }
    return response;
  }
}

export class InsertCommand implements ICommand {
  public payload: object;
  public service: GenericService<any, any>;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

  constructor(payload: object, service: GenericService<any, any>) {
    this.payload = payload;
    this.service = service;
  }
  async execute(): Promise<object | null> {
    this.notifySweetAlert.setType('question');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.newRegister
    );
    if (confirm === false) {
      return null;
    }
    const response = await this.service.create(this.payload);
    return response;
  }
}

export class EditCommand implements ICommand {
  public payload: unknown;
  public service: GenericService<any, any>;
  public id: number;
  constructor(payload: unknown, id: number, service: GenericService<any, any>) {
    this.payload = payload;
    this.service = service;
    this.id = id;
  }
  async execute(): Promise<object | null> {
    const response = await this.service.update(this.payload, this.id);
    return response;
  }
}
