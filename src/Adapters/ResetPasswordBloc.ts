import { Messages } from 'src/Application/Utilities';
import { routerInstance } from 'src/boot/globalRouter';
import { Bloc, IFactoryMethodNotifications, IUseCase, Notificator } from 'src/Domine/IPatterns';
import { ResetPasswordState } from 'src/Domine/IStates';
import { ForgetPasswordRequest, NewPasswordRequest } from 'src/Domine/Request';
import { ModalType } from 'src/Domine/Types';

export class ResetPasswordBloc extends Bloc<ResetPasswordState> {
  private drawAttention: Notificator;
  constructor(
    private resetPasswordUseCase: IUseCase<NewPasswordRequest, boolean>,
    private factoryNotificator: IFactoryMethodNotifications,
  ) {
    const state: ResetPasswordState = {
      newPassword: '',
      confirmPassword: '',
      visible: true,
      message: ''
    };
    super(state);
    this.drawAttention = this.factoryNotificator.createNotificator(
      ModalType.DrawAttention
    );
  }

  async resetPassword(userId: string, token: string): Promise<boolean> {
    if (this.state.newPassword != this.state.confirmPassword) {
      this.changeState({ ...this.state, message: Messages.invalidConfirmCredentials })
      return false
    }
    const request: NewPasswordRequest = {
      newPassword: this.state.newPassword,
      token: token, userId: userId
    }
    const wasSucess = await this.resetPasswordUseCase.execute(request)
    if (wasSucess) {
      this.drawAttention.setType('success')
      this.drawAttention.show(undefined, Messages.resetEmailSucess)
      routerInstance.push('/')
      return true
    }

    this.drawAttention.setType('error')
    this.drawAttention.show(undefined, Messages.invalidResetCredentials)
    return false
  }
}
