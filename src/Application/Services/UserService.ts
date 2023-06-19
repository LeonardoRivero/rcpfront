import { ILogin, IUser } from 'src/Domine/ModelsDB';
import { IUserRepository } from '../Repositories/Interface';
import { UserRepository } from '../Repositories/UserRepository';
import {
  AuthResponse,
  RefreshTokenResponse,
  RegisterResponse,
  UserResponse,
} from 'src/Domine/Responses';
import { login } from 'src/Domine/types';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

type responses = UserResponse | RegisterResponse;
export abstract class LoginService {
  public userRepository: IUserRepository<IUser, responses>;
  private token: AuthResponse | null;
  public constructor() {
    this.userRepository = new UserRepository();
    this.token = null;
  }

  public async login(payload: ILogin): Promise<AuthResponse | null> {
    const response: Response = await this.userRepository.login(payload);
    this.token = await response.json();
    console.log(this.token);
    if (response.status == HttpStatusCode.FORBIDDEN) {
      await this.refresh();
    }
    if (response.status == HttpStatusCode.OK) {
      return this.token;
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
    return await this.userRepository.create(user);
  }
}
