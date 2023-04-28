import { TokenJWT } from 'src/Domine/Responses';
import { login } from 'src/Domine/types';

export interface IRepository<T1, T2> {
  getById(id: number): Promise<T2 | null>;
  getAll(): Promise<T2[] | null>;
  create(entity: T1): Promise<T2 | null>;
  update(entity: Partial<T1>): Promise<T2 | null>;
  delete(id: number): Promise<boolean>;
  findByParameters(parameters: object): Promise<T2[]>;
}
export interface IUserRepository<T> {
  login(data: login): Promise<TokenJWT | null>;
  register(entity: object): Promise<T | null>;
}
