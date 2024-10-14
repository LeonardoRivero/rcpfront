import { IUser } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { AuthResponse, UserResponse } from 'src/Domine/Responses';
// import 'reflect-metadata';
// import { injectable } from 'inversify';
import { IControllersMediator, UseCase } from 'src/Domine/IPatterns';
import {
  ContextUser,
  DoctorStrategy,
  SecretaryStrategy,
  StrategyUser,
} from 'src/Domine/StrategyUser';
import { routerInstance } from 'src/boot/globalRouter';
import { IStoreUser } from 'src/Domine/IStores';

// @injectable()
export class UserService extends GenericService<IUser, UserResponse> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  public constructor() {
    super();
    const urlRegister = process.env.REGISTRATION
      ? process.env.REGISTRATION
      : '';
    this.urlCreate = `${process.env.RCP}${urlRegister}`;
    this.urlList = '';
    const urlAPI = process.env.USER ? process.env.USER : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlUpdate = '';
  }

  public override async create(user: IUser): Promise<UserResponse | null> {
    const response = await this.httpClient.POST(this.urlCreate, user);
    if (!response.ok) {
      return null;
    }
    const url = `${this.urlBase}filter/`;
    const responseUser = await this.httpClient.GET(url, {
      email: user.email,
    });
    if (!responseUser.ok) {
      return null;
    }
    const data: UserResponse = await responseUser.json();
    return data;
  }
}

export class EnableProfileUserUseCase implements UseCase<AuthResponse, void> {
  public GenericService: GenericService<IUser, UserResponse>;

  private mediator: IControllersMediator;

  private profilesUser: Record<string, StrategyUser> = {
    Secretaria: new SecretaryStrategy(),
    Doctor: new DoctorStrategy(),
  };

  constructor(
    genericService: GenericService<IUser, UserResponse>,
    mediator: IControllersMediator
  ) {
    this.GenericService = genericService;
    this.mediator = mediator;
  }

  async execute(response: AuthResponse) {
    const namegroup = 'Secretaria';
    const strategy = this.profilesUser[namegroup];
    const contextUser = ContextUser.getInstance(strategy);
    contextUser.setUserData(response.user);
    await contextUser.execute();
    const store = <IStoreUser>this.mediator.getStore();
    store.isAuthenticated = true;
    routerInstance.push('/index');
  }
}
