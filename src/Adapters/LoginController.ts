import { GenericService } from 'src/Application/Repositories';
import {
  EnableProfileUserUseCase,
  UserService,
} from 'src/Application/Services/UserService';
import HttpStatusCode from 'src/Application/Utilities/HttpStatusCodes';
import {
  Controller,
  IControllersMediator,
  IFactoryMethodNotifications,
  Notificator,
} from 'src/Domine/IPatterns';
import { LoginState } from 'src/Domine/IStates';
import { IKeyEmailRegistration, ILogin, IUser } from 'src/Domine/ModelsDB';
import { UserResponse } from 'src/Domine/Responses';
import { FactoryNotifactors } from '../Infraestructure/Utilities/Factories';
import { ModalType } from 'src/Domine/Types';

export class LoginController extends Controller {
  state: LoginState;
  private service: GenericService<IUser, UserResponse>;
  private notifySweetAlert: Notificator;

  constructor(
    state: LoginState,
    factoryNotificator: IFactoryMethodNotifications
  ) {
    super();
    this.state = state;
    this.service = new UserService();
    this.notifySweetAlert = factoryNotificator.createNotificator(
      ModalType.DrawAttention
    );
  }

  receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  async login(): Promise<void> {
    try {
      const payload: ILogin = {
        email: this.state.email,
        password: this.state.password,
      };
      const response = await this.service.login(payload);
      if (response == null) return;
      const enableProfileUserUseCase = new EnableProfileUserUseCase(
        this.service,
        this.mediator
      );
      await enableProfileUserUseCase.execute(response);
    } catch (ex: any) {
      const messageError = (ex as Error).message;
      this.state.labelMessage = messageError;
    }
  }

  async confirmEmail(key: IKeyEmailRegistration): Promise<void> {
    const response = await this.service.confirmEmailRegistration(key);
    if (response.status != HttpStatusCode.OK) {
      this.notifySweetAlert.setType('error');
      await this.notifySweetAlert.show(
        undefined,
        'No fue posible verificar su email.'
      );
      return;
    }
    this.notifySweetAlert.setType('success');
    this.notifySweetAlert.show(undefined, 'Email verificado correctamente');
  }
}
