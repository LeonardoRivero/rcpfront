import { ChangePasswordRequest, ConfirmEmailRequest, ForgetPasswordRequest, NewPasswordRequest, RegisterUserRequest } from 'src/Domine/Request';
import { AuthResponse, ResponseData, RoleResponse } from 'src/Domine/Responses';
import { HTTPClient, IUseCase, } from 'src/Domine/IPatterns';

import { LoginRequest } from 'src/Domine/Request';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

export class CreateUserUseCase implements IUseCase<RegisterUserRequest, Response> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.REGISTRATION}`;
  }

  public async execute(user: RegisterUserRequest): Promise<Response> {
    const response = await this.httpClient.POST(this.url, user);
    return response;
  }
}

export class LoginUseCase implements IUseCase<LoginRequest, AuthResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.LOGIN}`;
  }

  async execute(payload: LoginRequest): Promise<AuthResponse | null> {
    const response = await this.httpClient.POST(this.url, payload);
    console.log(response);
    if (!response.ok && response.status !== HttpStatusCode.FOUND) {
      return null;
    }
    const loginResponse: ResponseData<AuthResponse> = await response.json();
    return loginResponse.result;
  }

}

export class ChangePasswordUseCase implements IUseCase<ChangePasswordRequest, ResponseData<boolean>> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.CHANGE_PASSWORD}`;
  }

  async execute(payload: ChangePasswordRequest | undefined): Promise<ResponseData<boolean>> {
    const response = await this.httpClient.POST(this.url, payload);
    return response.json()
  }
}

export class GetAllGroupsUseCase implements IUseCase<string, RoleResponse[]> {
  private url: string

  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.GROUPS}`;
  }

  async execute(userId: string): Promise<RoleResponse[]> {
    this.url = `${this.url}${userId}`
    const response = await this.httpClient.GET(this.url);
    if (!response.ok) {
      return [];
    }
    const roleResponse: ResponseData<RoleResponse[]> = await response.json();
    return roleResponse.result;
  }
}

export class ConfirmEmailUseCase implements IUseCase<ConfirmEmailRequest, boolean> {
  private url: string

  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.CONFIRM_EMAIL_REGISTRATION}`;
  }

  async execute(request: ConfirmEmailRequest): Promise<boolean> {
    const params = { userId: request.userId, token: request.token }
    const response = await this.httpClient.GET(this.url, params);
    const roleResponse: ResponseData<boolean> = await response.json();
    return roleResponse.result;
  }
}

export class ForgetPasswordUseCase implements IUseCase<ForgetPasswordRequest, boolean> {
  private url: string

  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.FORGET_PASSWORD}`;
  }

  async execute(request: ForgetPasswordRequest): Promise<boolean> {
    const payload = { email: request.email }
    const response = await this.httpClient.POST(this.url, payload);
    const roleResponse: ResponseData<boolean> = await response.json();
    return roleResponse.result;
  }
}

export class ResetPasswordUseCase implements IUseCase<NewPasswordRequest, boolean> {
  private url: string

  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.RESET_PASSWORD}`;
  }

  async execute(request: NewPasswordRequest): Promise<boolean> {
    const response = await this.httpClient.POST(this.url, request);
    const roleResponse: ResponseData<boolean> = await response.json();
    return roleResponse.result;
  }
}
// export class EnableProfileUserUseCase implements UseCase<AuthResponse, void> {
//   public GenericService: GenericService<IUser, UserResponse>;

//   private mediator: IControllersMediator;

//   private profilesUser: Record<string, StrategyUser> = {
//     Secretaria: new SecretaryStrategy(),
//     Doctor: new DoctorStrategy(),
//   };

//   constructor(
//     genericService: GenericService<IUser, UserResponse>,
//     mediator: IControllersMediator
//   ) {
//     this.GenericService = genericService;
//     this.mediator = mediator;
//   }

//   async execute(response: AuthResponse) {
//     const namegroup = 'Secretaria';
//     const strategy = this.profilesUser[namegroup];
//     const contextUser = ContextUser.getInstance(strategy);
//     // contextUser.setUserData(response.user);
//     await contextUser.execute();
//     const store = <IStoreUser>this.mediator.getStore();
//     store.isAuthenticated = true;
//     routerInstance.push('/index');
//   }
// }
