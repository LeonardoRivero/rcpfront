import { IUser } from 'src/Domine/ModelsDB';
import { IUserRepository } from '../Repositories/Interface';
import { UserRepository } from '../Repositories/UserRepository';
import {
  AuthResponse,
  RefreshTokenResponse,
  UserResponse,
} from 'src/Domine/Responses';
import { login } from 'src/Domine/types';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

export abstract class LoginService {
  private userRepository: IUserRepository<IUser, UserResponse>;
  private token: AuthResponse | null;
  public constructor() {
    this.userRepository = new UserRepository();
    this.token = null;
    return;
  }

  public async login(payload: login): Promise<AuthResponse | null> {
    const response: Response = await this.userRepository.login(payload);
    const data: AuthResponse = await response.json();
    console.log({ data });
    this.token = data;
    // if (response.status == HttpStatusCode.FORBIDDEN) {
    //   response = await this.refresh();
    // }
    if (response.status == HttpStatusCode.OK) {
      return data;
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
    const data: RefreshTokenResponse = await response.json();
    this.token.access_token = data.access;
    console.log({ data });
  }
}

export class UserService extends LoginService {
  public async saveOrUpdate(
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    console.log('consumir servicio register', email, password, confirmPassword);
  }
}
