import {
  IExam,
  IKeyEmailRegistration,
  ILogin,
  IUser,
} from 'src/Domine/ModelsDB';
import { PhysicalExamResultResponse } from 'src/Domine/Responses';
import { DELETE, GET, POST, PUT } from 'src/Infraestructure/Utilities/Request';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { routerInstance } from 'src/boot/globalRouter';

import { LoginService, UserService } from '../Services/UserService';
import {
  HTTPClient,
  IToCreate,
  IToRead,
  IToUpdate,
} from 'src/Domine/IPatterns';
import { ClientAPI } from 'src/Infraestructure/Utilities/HttpClientAPI';
// export interface IRepository<T1, T2> {
//   getById(id: number): Promise<T2 | null>;
//   getAll(): Promise<T2[] | null>;
//   create(entity: T1): Promise<T2 | null>;
//   update(entity: Partial<T1>): Promise<T2 | null>;
//   delete(id: number): Promise<boolean>;
//   findByParameters(parameters: object): Promise<T2[]>;
// }
// export interface IUserRepository<T1, T2> extends IRepository<T1, T2> {
//   register(entity: T1): Promise<RegisterResponse | null>;
//   login(data: login): Promise<Response>;
//   logout(): Promise<Response>;
//   refreshToken(refresh_token: string): Promise<Response>;
//   validateToken(access_token: string): Promise<Response>;
//   confirmEmailRegistration(key: IKeyEmailRegistration): Promise<Response>;
// }

@injectable()
export abstract class LoginRepository {
  public httpClient: HTTPClient;
  public constructor() {
    this.httpClient = new ClientAPI();
  }
  async login(data: ILogin): Promise<Response> {
    // const url = EndPoints.buildFullUrl(process.env.LOGIN);
    const url = `${process.env.RCP}${process.env.LOGIN}`;
    try {
      const response = await this.httpClient.POST(url, data);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async logout(): Promise<Response> {
    // const url = EndPoints.buildFullUrl(process.env.LOGOUT);
    const url = `${process.env.RCP}${process.env.LOGOUT}`;
    try {
      const response = await this.httpClient.POST(url, null);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async refreshToken(refresh_token: string): Promise<Response> {
    // const url = EndPoints.buildFullUrl(process.env.REFRESH_TOKEN);
    const url = `${process.env.RCP}${process.env.REFRESH_TOKEN}`;
    try {
      const response = await this.httpClient.POST(url, refresh_token);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async validateToken(access_token: string): Promise<Response> {
    // const url = EndPoints.buildFullUrl(process.env.VERIFY_TOKEN);
    const url = `${process.env.RCP}${process.env.VERIFY_TOKEN}`;
    try {
      const response = await this.httpClient.POST(url, access_token);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async confirmEmailRegistration(
    key: IKeyEmailRegistration
  ): Promise<Response> {
    // const url = EndPoints.buildFullUrl(process.env.CONFIRM_EMAIL_REGISTRATION);
    const url = `${process.env.RCP}${process.env.CONFIRM_EMAIL_REGISTRATION}`;
    try {
      return await this.httpClient.POST(url, key);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
}

@injectable()
export abstract class Repository<T1> extends LoginRepository {
  abstract url: string;
  abstract urlWithParameters: string;
  public async getById(id: number): Promise<Response> {
    try {
      // const urlBase = EndPoints.buildFullUrl(this.url);
      // const fullUrl = `${this.url}${id}/`;
      if (Number.isNaN(id)) {
        throw new URIError('id is Nan');
      }
      if (this.url == undefined) {
        throw new URIError('url is undefined');
      }
      const fullUrl = this.url.replace('all', id.toString());
      return await GET(fullUrl);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async getAll(): Promise<Response> {
    try {
      // const urlBase = EndPoints.buildFullUrl(this.url);
      if (this.url == undefined) {
        throw new URIError('url is undefined');
      }
      return await GET(this.url);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async create(entity: T1): Promise<Response> {
    try {
      // const urlBase = EndPoints.buildFullUrl(this.url);
      if (this.url == undefined) {
        throw new URIError('url is undefined');
      }
      return await POST(this.url, entity);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async update(entity: Partial<T1>, id: number): Promise<Response> {
    try {
      if (this.url == undefined) {
        throw new URIError('url is undefined');
      }
      const urlFixed = this.url.replace('all', id.toString());
      // const url = EndPoints.urlByUpdateOrDelete(urlFixed, id);
      return await PUT(urlFixed, entity);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      if (this.url == undefined) {
        throw new URIError('url is undefined');
      }
      const urlFixed = this.url.replace('all', id.toString());
      // const url = EndPoints.urlByUpdateOrDelete(this.url, id);
      const response = await DELETE(urlFixed);
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
      // const urlBase = EndPoints.buildFullUrl(this.url);
      // const url = EndPoints.urlQueryParameter(this.url, parameters);
      const url = this.urlQueryParameter(this.url, parameters);
      return await GET(url);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public urlQueryParameter(urlBase: string, parameters: object): string {
    urlBase = urlBase.concat('?');
    for (const [key, value] of Object.entries(parameters)) {
      urlBase = urlBase.concat(key, '=', value, '&');
    }
    const fullUrl = urlBase.slice(0, -1);
    return fullUrl;
  }
}

@injectable()
export abstract class Service<T extends { id?: number }, T2> {
  abstract repository: Repository<T>;

  public async save(payload: T): Promise<T2 | null> {
    const response = await this.repository.create(payload);
    if (!response.ok) return null;
    return await response.json();
  }

  public async update(payload: T): Promise<T2 | null> {
    if (payload.id == null) {
      throw EvalError('id is null or undefined');
    }
    const response = await this.repository.update(payload, payload.id);
    if (!response.ok || response.status === HttpStatusCodes.BAD_REQUEST)
      return null;
    return await response.json();
  }

  public async getAll(): Promise<Array<T2>> {
    const response = await this.repository.getAll();
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
    }
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    return await response.json();
  }

  public async findByParameters(queryParameters: object): Promise<Array<T2>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    const data: T2[] = await response.json();
    return data;
  }

  public async getById(id: number): Promise<T2 | null> {
    const response = await this.repository.getById(id);
    if (!response.ok) return null;
    return await response.json();
  }
}

@injectable()
export abstract class GenericService<T extends { id?: number }, T2>
  extends LoginRepository
  implements IToCreate<T, T2>, IToRead<T2>, IToUpdate<T, T2>
{
  abstract urlCreate: string;
  abstract urlList: string;
  abstract urlBase: string;
  abstract urlUpdate: string;

  public constructor() {
    super();
  }

  public async create(entity: T): Promise<T2 | null> {
    const response = await this.httpClient.POST(this.urlCreate, entity);
    if (!response.ok) return null;
    return await response.json();
  }

  public async update(payload: T, id: number): Promise<T2 | null> {
    const urlUpdate = `${this.urlUpdate}${id}/`;
    if (id == null) {
      throw EvalError('id is null or undefined');
    }
    const response = await this.httpClient.PUT(urlUpdate, payload);
    if (!response.ok || response.status === HttpStatusCodes.BAD_REQUEST)
      return null;
    return await response.json();
  }

  public async getAll(): Promise<Array<T2>> {
    const response = await this.httpClient.GET(this.urlList);
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
    }
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    return await response.json();
  }

  public async findByParameters(queryParameters: object): Promise<Array<T2>> {
    const response = await this.httpClient.GET(this.urlBase, queryParameters);
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    const data: T2[] = await response.json();
    return data;
  }

  public async getById(id: number): Promise<T2 | null> {
    const urlById = `${this.urlBase}${id}`;
    const response = await this.httpClient.GET(urlById);
    if (!response.ok) return null;
    return await response.json();
  }
}

export abstract class PhysicalExamResultAbstract extends Service<
  IExam,
  PhysicalExamResultResponse
> {
  abstract findHistoryPatient(
    doc: string
  ): Promise<Array<PhysicalExamResultResponse>>;
}
