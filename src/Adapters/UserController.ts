import { IDoctor, IUser } from 'src/Domine/ModelsDB';
import { Messages } from 'src/Application/Utilities/Messages';
import { Group, UserResponse } from 'src/Domine/Responses';
import { ChangePasswordState, UserState } from 'src/Domine/IStates';
import {
  Controller,
  ICommand,
  IControllersMediator,
  IFactoryMethodNotifications,
  Notificator,
} from 'src/Domine/IPatterns';
import {
  DoctorStrategy,
  SecretaryStrategy,
  StrategyUser,
} from 'src/Domine/StrategyUser';
import { EditCommand, InsertCommand } from 'src/Application/Commands';
import { FactoryNotifactors } from '../Infraestructure/Utilities/Factories';
import { ModalType } from 'src/Domine/Types';
import { GroupUser } from 'src/Application/Utilities';
import { DoctorService } from 'src/Application/Services';
export class UserController extends Controller {
  public state: UserState;
  private static instance: UserController;
  private saveCommand: ICommand | undefined;
  private updateCommand: ICommand | undefined;
  private findByParametersCommand: ICommand | undefined;
  private creatorNotificator: IFactoryMethodNotifications;
  private notifyQuasar: Notificator;

  private profilesUser: Record<string, StrategyUser> = {
    Secretaria: new SecretaryStrategy(),
    Doctor: new DoctorStrategy(),
  };

  public constructor(
    state: UserState,
    creatorNotificator: IFactoryMethodNotifications
  ) {
    super();
    this.state = state;
    this.creatorNotificator = creatorNotificator;
    this.notifyQuasar = this.creatorNotificator.createNotificator(
      ModalType.NotifyQuasar
    );
    return;
  }

  // public static getInstance(state: UserState): UserController {
  //   if (!UserController.instance) {
  //     UserController.instance = new UserController(state);
  //   }
  //   return UserController.instance;
  // }

  public receiveData(mediator: IControllersMediator): void {
    return;
  }

  public clear(): void {
    this.state.user = {} as IUser;
    this.state.showSelectSpecialities = false;
  }

  public async saveOrUpdate(): Promise<UserResponse | null> {
    let response: UserResponse | null = null;
    if (
      this.isCommand(this.saveCommand) &&
      this.saveCommand instanceof InsertCommand
    ) {
      response = <UserResponse>await this.saveCommand.execute();
    }
    if (
      this.isCommand(this.updateCommand) &&
      this.saveCommand instanceof EditCommand
    ) {
      response = <UserResponse>await this.updateCommand.execute();
    }

    if (response === null) {
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, Messages.errorMessage);
    } else {
      this.saveProfileUser(response);
      this.notifyQuasar.setType('success');
      this.notifyQuasar.show(undefined, Messages.successMessage);
    }
    return response;
  }

  private async saveProfileUser(user: UserResponse) {
    console.log(user);
    if (user.groups[0].name == GroupUser.DOCTOR) {
      const service = new DoctorService();
      const payload: IDoctor = {
        codigo: '43433',
        user: user.id,
        speciality: this.state.specialities,
      };
      await service.create(payload);
    }
  }

  public async findByParameters() {
    if (this.isCommand(this.findByParametersCommand)) {
      this.findByParametersCommand.execute();
    }
  }

  public checkGroup(selectedGroups: number, allGroups: Array<Group>) {
    const group = allGroups.find((x) => x.id == selectedGroups)?.name;
    this.state.showSelectSpecialities = false;
    if (group == 'Doctor') {
      console.log(group);
      this.state.showSelectSpecialities = true;
    }
  }

  public setOnSave(command: ICommand): void {
    this.saveCommand = command;
  }

  public setOnUpdate(command: ICommand): void {
    this.updateCommand = command;
  }

  public setOnFindByParameters(command: ICommand): void {
    this.findByParametersCommand = command;
  }

  public resetAllCommand() {
    this.saveCommand = undefined;
    this.updateCommand = undefined;
    this.findByParametersCommand = undefined;
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
