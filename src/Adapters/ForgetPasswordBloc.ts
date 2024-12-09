import { Messages } from 'src/Application/Utilities';
import { Bloc, IFactoryMethodNotifications, IUseCase, Notificator } from 'src/Domine/IPatterns';
import { ForgetPasswordRequest } from 'src/Domine/Request';
import { ModalType } from 'src/Domine/Types';

export class ForgetPasswordBloc extends Bloc<null> {
  private drawAttention: Notificator;
  constructor(
    private forgetPasswordUseCase: IUseCase<ForgetPasswordRequest, boolean>,
    private factoryNotificator: IFactoryMethodNotifications,
  ) {
    super(null);
    this.drawAttention = this.factoryNotificator.createNotificator(
      ModalType.DrawAttention
    );
  }

  async send(email: string): Promise<void> {
    const request: ForgetPasswordRequest = { email }
    const wasSucess = await this.forgetPasswordUseCase.execute(request)
    if (wasSucess) {
      this.drawAttention.setType('success')
      this.drawAttention.show(undefined, Messages.verifyEmailSucess)
      return
    }

    this.drawAttention.setType('error')
    this.drawAttention.show(undefined, Messages.failedConfirmEmail)
  }
}
