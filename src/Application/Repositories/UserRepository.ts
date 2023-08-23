import { IKeyEmailRegistration, ILogin, IUser } from 'src/Domine/ModelsDB';
import { POST } from 'src/Infraestructure/Utilities/Request';
import { LoginRepository, Repository } from './Interface';
import 'reflect-metadata';
import { injectable } from 'inversify';
// import { RegisterResponse, UserResponse } from 'src/Domine/Responses';
// import { EndPoints } from '../Utilities/EndPoints';

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
@injectable()
export class UserRepository extends Repository<IUser> {
  url: string;
  urlWithParameters: string;

  public constructor() {
    super();
    const urlAPI = process.env.USER ? process.env.USER : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }

  public override async create(entity: IUser): Promise<Response> {
    const urlRegister = process.env.REGISTRATION
      ? process.env.REGISTRATION
      : '';
    const url = `${process.env.RCP}${urlRegister}`;
    try {
      return await POST(url, entity);
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  // public async login(payload: ILogin): Promise<Response> {
  //   // const url = EndPoints.buildFullUrl(process.env.LOGIN);
  //   const url = `${process.env.RCP}${process.env.LOGIN}`;
  //   try {
  //     const response = await POST(url, payload);
  //     return response;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }

  // public async logout(): Promise<Response> {
  //   // const url = EndPoints.buildFullUrl(process.env.LOGOUT);
  //   const url = `${process.env.RCP}${process.env.LOGOUT}`;
  //   try {
  //     const response = await POST(url, null);
  //     return response;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }

  // public async refreshToken(payload: string): Promise<Response> {
  //   // const url = EndPoints.buildFullUrl(process.env.REFRESH_TOKEN);
  //   const url = `${process.env.RCP}${process.env.REFRESH_TOKEN}`;
  //   try {
  //     const response = await POST(url, payload);
  //     return response;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }

  // public async validateToken(access_token: string) {
  //   // const url = EndPoints.buildFullUrl(process.env.VERIFY_TOKEN);
  //   const url = `${process.env.RCP}${process.env.VERIFY_TOKEN}`;
  //   try {
  //     const response = await POST(url, access_token);
  //     return response;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }

  // public async confirmEmailRegistration(
  //   key: IKeyEmailRegistration
  // ): Promise<Response> {
  //   // const url = EndPoints.buildFullUrl(process.env.CONFIRM_EMAIL_REGISTRATION);
  //   const url = `${process.env.RCP}${process.env.CONFIRM_EMAIL_REGISTRATION}`;
  //   try {
  //     return await POST(url, key);
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }
}

export class GroupsRepository extends Repository<null> {
  url: string;
  urlWithParameters: string;
  private static instance: GroupsRepository;

  public constructor() {
    super();
    const urlAPI = process.env.GROUPS ? process.env.GROUPS : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }
  public static getInstance(): GroupsRepository {
    if (!GroupsRepository.instance) {
      GroupsRepository.instance = new GroupsRepository();
    }
    return GroupsRepository.instance;
  }
  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }
  // public async getAll(): Promise<Group[] | null> {
  //   const url = EndPoints.buildFullUrl(process.env.GROUPS);
  //   try {
  //     const response = await GET(url);
  //     if (!response.ok || response.status == HttpStatusCodes.BAD_REQUEST)
  //       return null;
  //     return await response.json();
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }
  public override async create(entity: null): Promise<Response> {
    throw new Error('Method not implemented.');
  }
  public override async update(entity: null): Promise<Response> {
    throw new Error('Method not implemented.');
  }
  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
  public override async findByParameters(
    parameters: object
  ): Promise<Response> {
    throw new Error('Method not implemented.');
  }
}
