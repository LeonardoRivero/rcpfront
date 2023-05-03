import { IUser } from 'src/Domine/ModelsDB';
import { POST } from 'src/Infraestructure/Utilities/Request';
import { IUserRepository } from './Interface';
import { UserResponse } from 'src/Domine/Responses';
import { EndPoints } from '../Utilities/EndPoints';
import { login } from 'src/Domine/types';

export class UserRepository implements IUserRepository<IUser, UserResponse> {
  private endpoint = EndPoints.getInstance();
  getById(id: number): Promise<UserResponse | null> {
    throw new Error('Method not implemented.' + id);
  }
  getAll(): Promise<UserResponse[] | null> {
    throw new Error('Method not implemented.');
  }
  create(entity: IUser): Promise<UserResponse | null> {
    throw new Error('Method not implemented.' + entity);
  }
  update(entity: Partial<IUser>): Promise<UserResponse | null> {
    throw new Error('Method not implemented.' + entity);
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + id);
  }
  findByParameters(parameters: object): Promise<UserResponse[]> {
    throw new Error('Method not implemented.' + parameters);
  }

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

  public async login(payload: login): Promise<Response> {
    const url = this.endpoint.login;
    try {
      const response = await POST(url, payload);
      console.log(response);
      // if (response.status == HttpStatusCode.UNAUTHORIZED) return null;
      // if (!response.ok) return null;
      // const data: TokenJWT = await response.json();
      // console.log({ data });
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async refreshToken(payload: string): Promise<Response> {
    const url = this.endpoint.refresh_token;
    try {
      const response = await POST(url, payload);
      console.log(response);
      // if (response.status == HttpStatusCode.UNAUTHORIZED) return null;
      // if (!response.ok) return null;
      // const data: TokenJWT = await response.json();
      // console.log({ data });
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async validateToken(access_token: string) {
    const url = this.endpoint.validate_token;
    try {
      const response = await POST(url, access_token);
      console.log(response);
      // if (response.status == HttpStatusCode.UNAUTHORIZED) return null;
      // if (!response.ok) return null;
      // const data: TokenJWT = await response.json();
      // console.log({ data });
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
}
