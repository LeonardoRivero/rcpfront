import { ILogin, IUser } from 'src/Domine/ModelsDB';
import { Messages } from 'src/Application/Utilities/Messages';
import { RegisterResponse } from 'src/Domine/Responses';
import { ChangePasswordState, UserState } from 'src/Domine/IStates';
import {
  Controller,
  IControllersMediator,
  Notificator,
} from 'src/Domine/IPatterns';
import { UserService } from 'src/Application/Services/UserService';
import {
  DoctorStrategy,
  SecretaryStrategy,
  StrategyUser,
} from 'src/Domine/StrategyUser';
import { FactoryNotifactors } from './Creators/Factories';
import { ModalType } from 'src/Domine/Types';
export class UserController extends Controller {
  public state: UserState;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);
  private notifyQuasar: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.NotifyQuasar);
  private service = new UserService();
  private static instance: UserController;
  private profilesUser: Record<string, StrategyUser> = {
    Secretaria: new SecretaryStrategy(),
    Doctor: new DoctorStrategy(),
  };

  private constructor(state: UserState) {
    super();
    this.state = state;
    return;
  }

  public static getInstance(state: UserState): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController(state);
    }
    return UserController.instance;
  }

  public receiveData(mediator: IControllersMediator): void {
    return;
  }

  public clear(): void {
    throw new Error('Method not implemented.');
  }

  public async saveOrUpdate(): Promise<RegisterResponse | null> {
    if (this.state.user.id == undefined) {
      delete this.state.user['id'];
      this.state.user.first_time = true;
      return await this.save(this.state.user);
    }
    if (this.state.user.id != undefined) {
      return await this.update(this.state.user);
    }
    return null;
  }

  private async save(payload: IUser): Promise<RegisterResponse | null> {
    this.notifySweetAlert.setType('question');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.newRegister
    );
    if (confirm === false) {
      return null;
    }
    console.log({ payload });
    const response = await this.service.register(payload);
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

  private async update(payload: IUser): Promise<RegisterResponse | null> {
    this.notifySweetAlert.setType('question');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.updateRegister
    );
    if (confirm === false) {
      return null;
    }
    const response = await this.service.register(payload);
    return null;
  }

  public async login(payload: ILogin) {
    const response = await this.service.login(payload);
  }
}

export class ChangePasswordController extends Controller {
  private static instance: ChangePasswordController;
  public state: ChangePasswordState;
  private constructor(state: ChangePasswordState) {
    super();
    this.state = state;
  }

  public static getInstance(
    state: ChangePasswordState
  ): ChangePasswordController {
    if (!ChangePasswordController.instance) {
      ChangePasswordController.instance = new ChangePasswordController(state);
    }
    return ChangePasswordController.instance;
  }

  receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  save(): void {
    if (this.state.newPassword != this.state.confirmPassword) {
      throw new EvalError(
        'Las nuevas credenciales no coinciden en su verificacion.'
      );
    }
    console.log('todo paso bien');
  }
}
