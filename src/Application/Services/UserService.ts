import { IKeyEmailRegistration, ILogin, IUser } from 'src/Domine/ModelsDB';
import { IUserRepository, UserRepositori } from '../Repositories/Interface';
import { UserRepo, UserRepository } from '../Repositories/UserRepository';
import {
  AuthResponse,
  RefreshTokenResponse,
  RegisterResponse,
  UserResponse,
} from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

type responses = UserResponse | RegisterResponse;
export abstract class LoginService {
  public userRepository: UserRepositori;
  private token: AuthResponse | null;
  public constructor() {
    this.userRepository = new UserRepo();
    this.token = null;
  }

  public async login(payload: ILogin): Promise<AuthResponse | null> {
    const response: Response = await this.userRepository.login(payload);
    this.token = await response.json();
    console.log(this.token, response);
    if (response.status == HttpStatusCode.FORBIDDEN) {
      await this.refresh();
    }
    if (response.status == HttpStatusCode.OK) {
      return this.token;
    }
    if (response.status == HttpStatusCode.BAD_REQUEST) {
      return null;
    }
    if (this.token?.user.first_time) {
      console.log('debe cambiar el password');
    }
    return null;
  }

  public async refresh(): Promise<void> {
    if (this.token == null) {
      throw Error('Impossible refresh token');
    }
    const tokenValidated = await this.userRepository.validateToken(
      this.token.access_token
    );
    if (tokenValidated.status == HttpStatusCode.OK) {
      return;
    }
    const response = await this.userRepository.refreshToken(
      this.token.refresh_token
    );
    if (response.status != HttpStatusCode.OK) {
      throw new Error('Impossible refresh token');
    }
    const data: RefreshTokenResponse = await response.json();
    this.token.access_token = data.access;
    console.log({ data });
  }

  public async logout(): Promise<void> {
    await this.userRepository.logout();
  }
}

export class UserService extends LoginService {
  public constructor() {
    super();
  }

  public async register(user: IUser): Promise<RegisterResponse | null> {
    console.log('consumir servicio register');
    const response = await this.userRepository.create(user);
    if (response.status != HttpStatusCode.OK) {
      return null;
    }
    const data: RegisterResponse = await response.json();
    return data;
  }

  public async confirmEmailRegistration(
    key: IKeyEmailRegistration
  ): Promise<Response> {
    return await this.userRepository.confirmEmailRegistration(key);
  }

  public async changePassword(user: IUser): Promise<void> {
    if (user.id == undefined) {
      throw Error('userId is undefined');
    }
    const response = await this.userRepository.update(user, user.id);
    const data = await response.json();
  }
}
