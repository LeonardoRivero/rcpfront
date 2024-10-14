import {
  ICommand,
  IFactoryMethodNotifications,
  Notificator,
} from 'src/Domine/IPatterns';
import { GenericService } from './Repositories/Interface';
import { IUser } from 'src/Domine/Request';
import { ModalType } from 'src/Domine/Types';
import { Messages } from './Utilities';
import { IUserService } from 'src/Domine/ICommons';
import { RegisterResponse } from 'src/Domine/Responses';

import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { PatientResponse } from 'src/Domine/Responses';
import { IPatient } from 'src/Domine/Request';
// import container from 'src/inversify.config';

// export class CreateCommand implements ICommand {
//   public payload: unknown;
//   public service: Service<any, object>;
//   private notifySweetAlert: Notificator =
//     FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

//   constructor(payload: unknown, service: Service<any, object>) {
//     this.payload = payload;
//     this.service = service;
//   }

//   async execute(): Promise<object | null> {
//     this.notifySweetAlert.setType('question');
//     const confirm = await this.notifySweetAlert.show(
//       'Atención',
//       Messages.newRegister
//     );
//     if (confirm === false) {
//       return null;
//     }
//     const response = await this.service.save(this.payload);
//     return response;
//   }
// }

// export class UpdateCommand implements ICommand {
//   public payload: unknown;
//   public service: Service<any, object>;
//   constructor(payload: unknown, service: Service<any, object>) {
//     this.payload = payload;
//     this.service = service;
//   }
//   async execute(): Promise<object | null> {
//     const response = await this.service.update(this.payload);
//     return response;
//   }
// }

export class FindByParametersCommand implements ICommand {
  public parameters: object;
  public service: GenericService<any, any>;
  constructor(parameters: object, service: GenericService<any, object>) {
    this.parameters = parameters;
    this.service = service;
  }
  async execute(): Promise<Array<object> | null> {
    const response = await this.service.findByParameters(this.parameters);
    return response;
  }
}

export class RegisterUserCommand implements ICommand {
  public payload: IUser;
  public service: IUserService;
  creatorNotificator = {} as IFactoryMethodNotifications;
  private notifySweetAlert: Notificator =
    this.creatorNotificator.createNotificator(ModalType.SweetAlert);

  private notifyQuasar: Notificator = this.creatorNotificator.createNotificator(
    ModalType.NotifyQuasar
  );

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
  private creatorNotificator = {} as IFactoryMethodNotifications;
  private notifySweetAlert: Notificator =
    this.creatorNotificator.createNotificator(ModalType.SweetAlert);
  private notifyQuasar: Notificator = this.creatorNotificator.createNotificator(
    ModalType.NotifyQuasar
  );

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

  public showNotification(response: object | null): void {
    if (response == null) {
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, Messages.errorMessage);
      return;
    }
    this.notifyQuasar.setType('success');
    this.notifyQuasar.show(undefined, Messages.successMessage);
  }
}

export class EditCommand implements ICommand {
  public payload: object;
  public service: GenericService<any, any>;
  public id: number;
  creatorNotificator = {} as IFactoryMethodNotifications;
  private notifySweetAlert: Notificator =
    this.creatorNotificator.createNotificator(ModalType.SweetAlert);

  private notifyQuasar: Notificator = this.creatorNotificator.createNotificator(
    ModalType.NotifyQuasar
  );

  constructor(payload: object, id: number, service: GenericService<any, any>) {
    this.payload = payload;
    this.service = service;
    this.id = id;
  }

  async execute(): Promise<object | null> {
    this.notifySweetAlert.setType('question');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.updateRegister
    );
    if (confirm === false) {
      return null;
    }
    const response = await this.service.update(this.payload, this.id);
    return response;
  }
  public showNotification(response: object | null): void {
    if (response == null) {
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, Messages.errorMessage);
      return;
    }
    this.notifyQuasar.setType('success');
    this.notifyQuasar.show(undefined, Messages.updateSuccesfully);
  }
}

export class ShowModalNewRegister implements IUseCase<ModalType, boolean> {
  public constructor(private factoryNotifications: IFactoryMethodNotifications) {
  }

  async execute(modalType: ModalType): Promise<boolean> {
    const notifyQuasar: Notificator = this.factoryNotifications.createNotificator(modalType);
    notifyQuasar.setType('question');
    return await notifyQuasar.show('Atención', Messages.newRegister);
  }
}
