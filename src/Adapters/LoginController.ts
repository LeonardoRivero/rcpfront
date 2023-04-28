import { LoginState } from 'src/Domine/IStates';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { routerInstance } from 'src/boot/globalRouter';
import { IUser } from 'src/Domine/ModelsDB';
import { UserService } from 'src/Application/Services/UserService';
import { login } from 'src/Domine/types';
import { SettingsMediator } from '../Infraestructure/Mediators';

export class LoginController extends Controller {
  public state: LoginState;
  private static instance: LoginController;
  private service = new UserService();
  private constructor(state: LoginState) {
    super();
    this.state = state;
    return;
  }

  public static getInstance(state: LoginState): LoginController {
    if (!LoginController.instance) {
      LoginController.instance = new LoginController(state);
    }
    LoginController.instance.state = state;
    console.log(LoginController.instance.state);
    return LoginController.instance;
  }

  public sendData(data: unknown): void {
    // this.mediator.handleData();
    throw new Error('Method not implemented.' + { data });
  }

  public receiveData(mediator: IControllersMediator): void {
    throw new Error('Method not implemented.' + { mediator });
  }

  public clear(): void {
    this.state.email = '';
    this.state.password = '';
    // this.state.register = !this.state.register;
    // this.state.title = this.state.register ? 'Registro' : 'Bienvenido';
  }

  public async login(username: string, password: string): Promise<void> {
    // console.log('consumir servicio login', email, password);
    // console.log(routerInstance.currentRoute.value);
    //
    const data: login = { email: username, password: password };
    const response = await this.service.login(data);
    if (response != null) {
      const mediator = SettingsMediator.getInstance();
      const example = await mediator.getAllSpecialities();
      console.log(example);
      // routerInstance.push('/index');
      return;
    }
    this.state.labelMessage =
      'Las credenciales proporcionadas no son validas intentelo de nuevo';
  }

  public register(dataUser: IUser) {
    const response = this.service.register(dataUser);
  }
}
