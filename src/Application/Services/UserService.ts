import { IUser } from 'src/Domine/ModelsDB';
import { IUserRepository } from '../Repositories/Interface';
import { UserRepository } from '../Repositories/LoginRepository';
import { TokenJWT, UserResponse } from 'src/Domine/Responses';
import { login } from 'src/Domine/types';

export class UserService {
  private repository: IUserRepository<UserResponse>;
  public constructor() {
    this.repository = new UserRepository();
    return;
  }
  // public async save(payload: IUser): Promise<UserResponse | null> {
  //   const response = await this.repository.create(payload);
  //   return response;
  // }

  // public async update(payload: IUser): Promise<SpecialityResponse | null> {
  //   const response = await this.repository.update(payload);
  //   return response;
  // }

  // public async getAll(): Promise<Array<UserResponse>> {
  //   const response = await this.repository.getAll();
  //   if (response == null) return [];
  //   return response;
  // }

  public async login(payload: login): Promise<TokenJWT | null> {
    const response = await this.repository.login(payload);
    return response;
  }

  public register(payload: IUser) {
    throw new Error();
  }
}
