import { LoginRepository } from './Interface';
// import 'reflect-metadata';
import { IToRead } from 'src/Domine/IPatterns';
import { Group } from 'src/Domine/Responses';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';
import { routerInstance } from 'src/boot/globalRouter';

export class GroupsService extends LoginRepository implements IToRead<Group> {
  private static instance: GroupsService;
  urlList: string;
  urlBase: string;

  public constructor() {
    super();
    const urlAPI = process.env.GROUPS ? process.env.GROUPS : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlList = `${this.urlBase}list`;
  }
  async findByParameters(queryParameters: object): Promise<Group[]> {
    throw new Error('Method not implemented.' + { queryParameters });
  }

  public static getInstance(): GroupsService {
    if (!GroupsService.instance) {
      GroupsService.instance = new GroupsService();
    }
    return GroupsService.instance;
  }

  public async getById(id: number): Promise<Group | null> {
    const urlById = `${this.urlBase}${id}`;
    const response = await this.httpClient.GET(urlById);
    if (!response.ok) return null;
    return await response.json();
  }

  public async getAll(): Promise<Group[]> {
    const response = await this.httpClient.GET(this.urlList);
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
    }
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    return await response.json();
  }
}
