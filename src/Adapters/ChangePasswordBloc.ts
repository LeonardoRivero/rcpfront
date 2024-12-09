import { Messages } from 'src/Application/Utilities';
import { Bloc, IHandleUserState, IUseCase } from 'src/Domine/IPatterns';
import { ChangePasswordState } from 'src/Domine/IStates';
import { ChangePasswordRequest } from 'src/Domine/Request';
import { ResponseData } from 'src/Domine/Responses';

export class ChangePasswordBloc extends Bloc<ChangePasswordState> {
  private initialState: ChangePasswordState = {} as ChangePasswordState
  constructor(private changePasswordUseCase: IUseCase<ChangePasswordRequest, ResponseData<boolean>>
  ) {
    const state: ChangePasswordState = {
      newPassword: '',
      currentPassword: '',
      confirmPassword: '',
      visible: true,
      message: ''
    };
    super(state);
  }

  public clear(): void {
    this.changeState({ ...this.initialState, })
  }

  async save(handleGlobalState: IHandleUserState): Promise<boolean> {
    if (this.state.newPassword != this.state.confirmPassword) {
      this.changeState({ ...this.state, message: Messages.invalidConfirmCredentials })
      return false
    }

    const payload: ChangePasswordRequest = {
      CurrentPassword: this.state.currentPassword,
      NewPassword: this.state.newPassword,
      UserId: handleGlobalState.store.token.userId
    }

    const response = await this.changePasswordUseCase.execute(payload)
    if (!response.result) {
      this.changeState({ ...this.state, message: response.description })
    }
    return response.result
  }
}
