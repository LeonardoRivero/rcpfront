import { Messages } from 'src/Application/Utilities';
import { routerInstance } from 'src/boot/globalRouter';
import {
  Bloc,
  IFactoryMethodNotifications,
  IHandleGlobalState,
  IHandleUserState,
  IUseCase,
  Notificator,
} from 'src/Domine/IPatterns';
import { LoginState } from 'src/Domine/IStates';
import { ConfirmEmailRequest, LoginRequest } from 'src/Domine/Request';
import { AuthResponse } from 'src/Domine/Responses';
import { ModalType } from 'src/Domine/Types';


export class LoginBloc extends Bloc<LoginState> {
  private notifySweetAlert: Notificator;
  private sweetAlertModal: Notificator;
  constructor(
    factoryNotificator: IFactoryMethodNotifications,
    private loginUseCase: IUseCase<LoginRequest, AuthResponse | null>,
    private confirEmailUseCase: IUseCase<ConfirmEmailRequest, boolean>,
  ) {
    const state: LoginState = {
      email: '',
      password: '',
      labelMessage: '',
    };
    super(state);
    this.notifySweetAlert = factoryNotificator.createNotificator(
      ModalType.DrawAttention
    );
    this.sweetAlertModal = factoryNotificator.createNotificator(
      ModalType.SweetAlert
    );
  }

  async login(handleUserState: IHandleUserState, handleGlobalState: IHandleGlobalState): Promise<AuthResponse | null> {
    try {
      const payload: LoginRequest = {
        Email: this.state.email,
        Password: this.state.password,
        RememberMe: false
      };

      const response = await this.loginUseCase.execute(payload);
      if (response == null) {
        throw new ErrorEvent(Messages.errorMessage)
      }

      if (response.isFirstLogin) {
        handleUserState.saveEmailUser(payload.Email)
      }

      handleUserState.saveInfoUser(response)
      console.log(response.roles);
      handleUserState.setRole(response.roles)
      handleUserState.executeStrategy()
      const medicalOffice = await this.mediator?.getMedicalOfficeBelongToUser(response.userId) ?? []
      console.log(medicalOffice);
      handleGlobalState.saveInfoMedicalOffice(medicalOffice)
      return response
    } catch (ex: any) {
      const messageError = (ex as Error).message;
      this.changeState({ ...this.state, labelMessage: messageError })
      return null
    }
  }

  async confirmEmail(userId: string, token: string): Promise<void> {
    const request: ConfirmEmailRequest = {
      token,
      userId
    }
    const response = await this.confirEmailUseCase.execute(request);
    if (!response) {
      this.notifySweetAlert.setType('error');
      await this.notifySweetAlert.show(undefined, Messages.failedConfirmEmail);
      return;
    }
    this.sweetAlertModal.setType('success');
    await this.sweetAlertModal.show(undefined, Messages.sucessConfirmEmail);
    routerInstance.push('/')
  }
}
