import { UserState } from 'src/Domine/IStates';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { Group } from 'src/Domine/Responses';

export class UsersController extends Controller {
  public state: UserState;
  private allGroups: Array<Group>;
  private static instance: UsersController;
  private constructor(state: UserState) {
    super();
    this.state = state;
    this.allGroups = [];
    return;
  }

  public clear(): void {
    throw new Error('Method not implemented.');
  }
  public sendData(data: unknown): void {
    // this.mediator.handleData();
    throw new Error('Method not implemented.' + { data });
  }
  public receiveData(mediator: IControllersMediator): void {
    throw new Error('Method not implemented.' + { mediator });
  }

  public static getInstance(state: UserState): UsersController {
    if (!UsersController.instance) {
      UsersController.instance = new UsersController(state);
    }
    return UsersController.instance;
  }

  public async saveOrUpdate(
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    console.log('consumir servicio register', email, password);
  }
}
