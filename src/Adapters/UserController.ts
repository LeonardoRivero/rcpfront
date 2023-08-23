import { ILogin } from 'src/Domine/ModelsDB';

import { Group, RegisterResponse, UserResponse } from 'src/Domine/Responses';
import { ChangePasswordState, UserState } from 'src/Domine/IStates';
import {
  Controller,
  ICommand,
  IControllersMediator,
} from 'src/Domine/IPatterns';
import { UserService } from 'src/Application/Services/UserService';
import {
  DoctorStrategy,
  SecretaryStrategy,
  StrategyUser,
} from 'src/Domine/StrategyUser';
export class UserController extends Controller {
  public state: UserState;
  private service = new UserService();
  private static instance: UserController;
  private saveCommand: ICommand | undefined;
  private updateCommand: ICommand | undefined;
  private findByParametersCommand: ICommand | undefined;

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

  public async saveOrUpdate(): Promise<UserResponse | null> {
    if (this.isCommand(this.saveCommand)) {
      const response = <UserResponse>await this.saveCommand.execute();
      return response;
    }
    if (this.isCommand(this.updateCommand)) {
      const response = <UserResponse>await this.updateCommand.execute();
      return response;
    }
    return null;
    // if (this.state.user.id == undefined) {
    //   delete this.state.user['id'];
    //   return await this.save(this.state.user);
    // }
    // if (this.state.user.id != undefined) {
    //   return await this.update(this.state.user);
    // }
    // return null;
  }

  public async findByParameters() {
    if (this.isCommand(this.findByParametersCommand)) {
      this.findByParametersCommand.execute();
    }
  }
  // private async save(payload: IUser): Promise<RegisterResponse | null> {
  //   this.notifySweetAlert.setType('question');
  //   const confirm = await this.notifySweetAlert.show(
  //     'Atención',
  //     Messages.newRegister
  //   );
  //   if (confirm === false) {
  //     return null;
  //   }
  //   console.log({ payload });
  //   const response = await this.service.register(payload);
  //   if (response == null) {
  //     this.notifyQuasar.setType('error');
  //     this.notifyQuasar.show(undefined, 'Ocurrio un error en la operacion.');
  //   }
  //   if (response != null) {
  //     this.notifyQuasar.setType('success');
  //     this.notifyQuasar.show(undefined, response.detail);
  //   }
  //   return response;
  // }

  // private async update(payload: IUser): Promise<RegisterResponse | null> {
  //   this.notifySweetAlert.setType('question');
  //   const confirm = await this.notifySweetAlert.show(
  //     'Atención',
  //     Messages.updateRegister
  //   );
  //   if (confirm === false) {
  //     return null;
  //   }
  //   const response = await this.service.register(payload);
  //   return null;
  // }

  public async login(payload: ILogin) {
    // const response = await this.service.login(payload);
    throw new Error('verificar en login UserController');
  }

  public checkGroup(selectedGroups: number, allGroups: Array<Group>) {
    const group = allGroups.find((x) => x.id == selectedGroups)?.name;
    if (group == 'Doctor') {
      console.log(group);
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

  private isCommand(object: any): object is ICommand {
    return object.execute !== undefined;
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
