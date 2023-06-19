import { IUser } from 'src/Domine/ModelsDB';
import { Messages } from 'src/Application/Utilities/Messages';
import { RegisterResponse, SpecialityResponse } from 'src/Domine/Responses';
import { UserState } from 'src/Domine/IStates';
import {
  Controller,
  IControllersMediator,
  Notificator,
  StrategyUser,
} from 'src/Domine/IPatterns';
import { UserService } from 'src/Application/Services/UserService';
import { DoctorStrategy, SecretaryStrategy } from 'src/Domine/StrategyUser';
import { login } from 'src/Domine/types';
import { FactoryNotifactors } from './Creators/Factories';
export class UserController extends Controller {
  public state: UserState;
  private messages = Messages.getInstance();
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator('sweetAlert');
  private notifyQuasar: Notificator =
    FactoryNotifactors.getInstance().createNotificator('notifyQuasar');
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

  public sendData(data: unknown): void {
    // this.mediator.handleData();
  }
  public receiveData(mediator: IControllersMediator): void {
    return;
  }

  public clear(): void {
    throw new Error('Method not implemented.');
  }

  public async saveOrUpdate(): Promise<void> {
    if (this.state.user.id == undefined) {
      delete this.state.user['id'];
      this.state.user.first_time = true;
      await this.save(this.state.user);
    }
    if (this.state.user.id != undefined) {
      await this.update(this.state.user);
    }
  }

  private async save(payload: IUser): Promise<RegisterResponse | null> {
    this.notifySweetAlert.setType('question');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      this.messages.newRegister
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

  private async update(payload: IUser): Promise<SpecialityResponse | null> {
    this.notifySweetAlert.setType('question');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      this.messages.updateRegister
    );
    if (confirm === false) {
      return null;
    }
    const response = await this.service.register(payload);
    return null;
  }
  public async login(payload: login) {
    const response = await this.service.login(payload);
  }
}
