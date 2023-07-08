import { IKeyEmailRegistration, IUser } from 'src/Domine/ModelsDB';
import { POST } from 'src/Infraestructure/Utilities/Request';
import { LoginRepository } from './Interface';
// import { RegisterResponse, UserResponse } from 'src/Domine/Responses';
import { EndPoints } from '../Utilities/EndPoints';
import { login } from 'src/Domine/types';

// export class UserRepository implements IUserRepository<IUser, UserResponse> {
//   getById(id: number): Promise<UserResponse | null> {
//     throw new Error('Method not implemented.');
//   }
//   getAll(): Promise<UserResponse[] | null> {
//     throw new Error('Method not implemented.');
//   }
//   update(entity: Partial<IUser>): Promise<UserResponse | null> {
//     throw new Error('Method not implemented.');
//   }
//   delete(id: number): Promise<boolean> {
//     throw new Error('Method not implemented.');
//   }
//   findByParameters(parameters: object): Promise<UserResponse[]> {
//     throw new Error('Method not implemented.');
//   }
//   create(entity: IUser): Promise<UserResponse | null> {
//     throw new Error('Method not implemented.');
//   }

//   async register(entity: IUser): Promise<RegisterResponse | null> {
//     const url = EndPoints.buildFullUrl(process.env.REGISTRATION);
//     try {
//       const response = await POST(url, entity);
//       if (!response.ok) return null;
//       const data: RegisterResponse = await response.json();
//       return data;
//     } catch (error) {
//       throw Error(`Error in ${Object.name} : ${error}`);
//     }
//   }

//   public async login(payload: login): Promise<Response> {
//     const url = EndPoints.buildFullUrl(process.env.LOGIN);
//     try {
//       const response = await POST(url, payload);
//       // if (response.status == HttpStatusCode.UNAUTHORIZED) return null;
//       // if (!response.ok) return null;
//       // const data: TokenJWT = await response.json();
//       // console.log({ data });
//       return response;
//     } catch (error) {
//       throw Error(`Error in ${Object.name} : ${error}`);
//     }
//   }

//   public async refreshToken(payload: string): Promise<Response> {
//     const url = EndPoints.buildFullUrl(process.env.REFRESH_TOKEN);
//     try {
//       const response = await POST(url, payload);
//       console.log(response);
//       // if (response.status == HttpStatusCode.UNAUTHORIZED) return null;
//       // if (!response.ok) return null;
//       // const data: TokenJWT = await response.json();
//       // console.log({ data });
//       return response;
//     } catch (error) {
//       throw Error(`Error in ${Object.name} : ${error}`);
//     }
//   }

//   public async validateToken(access_token: string) {
//     const url = EndPoints.buildFullUrl(process.env.VERIFY_TOKEN);
//     try {
//       const response = await POST(url, access_token);
//       console.log(response);
//       // if (response.status == HttpStatusCode.UNAUTHORIZED) return null;
//       // if (!response.ok) return null;
//       // const data: TokenJWT = await response.json();
//       // console.log({ data });
//       return response;
//     } catch (error) {
//       throw Error(`Error in ${Object.name} : ${error}`);
//     }
//   }

//   public async logout(): Promise<Response> {
//     const url = EndPoints.buildFullUrl(process.env.LOGOUT);
//     try {
//       const response = await POST(url, null);
//       return response;
//     } catch (error) {
//       throw Error(`Error in ${Object.name} : ${error}`);
//     }
//   }

//   public async confirmEmailRegistration(
//     key: IKeyEmailRegistration
//   ): Promise<Response> {
//     const url = EndPoints.buildFullUrl(process.env.CONFIRM_EMAIL_REGISTRATION);
//     try {
//       return await POST(url, key);
//     } catch (error) {
//       throw Error(`Error in ${Object.name} : ${error}`);
//     }
//   }
// }

export class UserRepository extends LoginRepository {
  url: string;
  urlWithParameters: string;

  public constructor() {
    super();
    this.url = process.env.USER ? process.env.USER : '';
    this.urlWithParameters = '';
  }

  public override async create(entity: IUser): Promise<Response> {
    const url = EndPoints.buildFullUrl(process.env.REGISTRATION);
    try {
      return await POST(url, entity);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async login(payload: login): Promise<Response> {
    const url = EndPoints.buildFullUrl(process.env.LOGIN);
    try {
      const response = await POST(url, payload);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async logout(): Promise<Response> {
    const url = EndPoints.buildFullUrl(process.env.LOGOUT);
    try {
      const response = await POST(url, null);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async refreshToken(payload: string): Promise<Response> {
    const url = EndPoints.buildFullUrl(process.env.REFRESH_TOKEN);
    try {
      const response = await POST(url, payload);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async validateToken(access_token: string) {
    const url = EndPoints.buildFullUrl(process.env.VERIFY_TOKEN);
    try {
      const response = await POST(url, access_token);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  public async confirmEmailRegistration(
    key: IKeyEmailRegistration
  ): Promise<Response> {
    const url = EndPoints.buildFullUrl(process.env.CONFIRM_EMAIL_REGISTRATION);
    try {
      return await POST(url, key);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
}
