import { IKeyEmailRegistration, IUser } from 'src/Domine/ModelsDB';
import { RegisterResponse } from 'src/Domine/Responses';
import { login } from 'src/Domine/types';
import { DELETE, GET, POST, PUT } from 'src/Infraestructure/Utilities/Request';
import { EndPoints } from '../Utilities';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';

export interface IRepository<T1, T2> {
  getById(id: number): Promise<T2 | null>;
  getAll(): Promise<T2[] | null>;
  create(entity: T1): Promise<T2 | null>;
  update(entity: Partial<T1>): Promise<T2 | null>;
  delete(id: number): Promise<boolean>;
  findByParameters(parameters: object): Promise<T2[]>;
}
// export interface IUserRepository<T1, T2> extends IRepository<T1, T2> {
//   register(entity: T1): Promise<RegisterResponse | null>;
//   login(data: login): Promise<Response>;
//   logout(): Promise<Response>;
//   refreshToken(refresh_token: string): Promise<Response>;
//   validateToken(access_token: string): Promise<Response>;
//   confirmEmailRegistration(key: IKeyEmailRegistration): Promise<Response>;
// }

export abstract class AbstractRepository<T1> {
  abstract url: string;
  abstract urlWithParameters: string;
  public async getById(id: number): Promise<Response> {
    try {
      const urlBase = EndPoints.buildFullUrl(this.url);
      const fullUrl = `${urlBase}${id}/`;
      return await GET(fullUrl);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  public async getAll(): Promise<Response> {
    try {
      const urlBase = EndPoints.buildFullUrl(this.url);
      return await GET(urlBase);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  public async create(entity: T1): Promise<Response> {
    try {
      const urlBase = EndPoints.buildFullUrl(this.url);
      return await POST(urlBase, entity);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  public async update(entity: Partial<T1>, id: number): Promise<Response> {
    try {
      const url = EndPoints.urlByUpdateOrDelete(this.url, id);
      return await PUT(url, entity);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  public async delete(id: number): Promise<boolean> {
    try {
      const url = EndPoints.urlByUpdateOrDelete(this.url, id);
      const response = await DELETE(url);
      if (response.status == HttpStatusCodes.NO_CONTENT) {
        return true;
      }
      return false;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  public async findByParameters(parameters: object): Promise<Response> {
    try {
      const urlBase = EndPoints.buildFullUrl(this.url);
      const url = EndPoints.urlQueryParameter(urlBase, parameters);
      return await GET(url);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
}

export abstract class UserRepositori extends AbstractRepository<IUser> {
  abstract login(data: login): Promise<Response>;
  abstract logout(): Promise<Response>;
  abstract refreshToken(refresh_token: string): Promise<Response>;
  abstract validateToken(access_token: string): Promise<Response>;
  abstract confirmEmailRegistration(
    key: IKeyEmailRegistration
  ): Promise<Response>;
}
