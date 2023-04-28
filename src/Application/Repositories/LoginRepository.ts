import { IUser } from 'src/Domine/ModelsDB';
import { POST } from 'src/Infraestructure/Utilities/Request';
import { IUserRepository } from './Interface';
import { TokenJWT, UserResponse } from 'src/Domine/Responses';
import { EndPoints } from '../Utilities/EndPoints';
import { login } from 'src/Domine/types';
import { Cookies } from 'quasar';

export class UserRepository implements IUserRepository<UserResponse> {
  private endpoint = EndPoints.getInstance();

  async register(entity: IUser): Promise<UserResponse | null> {
    const url = this.endpoint.createUser;
    try {
      const response = await POST(url, entity);
      if (!response.ok) return null;
      const data: UserResponse = await response.json();
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async login(payload: login): Promise<TokenJWT | null> {
    const url = this.endpoint.login;
    try {
      const response = await POST(url, payload);
      console.log(response);
      if (!response.ok) return null;
      const data: TokenJWT = await response.json();
      // Cookies.set('token', data.access_token, { httpOnly: true, secure: true });
      console.log({ data });
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
}
