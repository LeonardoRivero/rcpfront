import { GenderResponse } from 'src/Domine/Responses';
import { HTTPClient, IToRead, IUseCase } from 'src/Domine/IPatterns';
// import container from 'src/inversify.config';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';

export class GenderService implements IToRead<GenderResponse> {
  public urlList: string;
  public urlBase: string;
  public httpClient: HTTPClient;
  public constructor() {
    const urlAPI = process.env.GENDER ? process.env.GENDER : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlList = `${this.urlBase}list/`;
    // this.httpClient = container.get<HTTPClient>('HTTPClient');
    this.httpClient = {} as HTTPClient;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<GenderResponse[]> {
    throw new Error('Method not implemented.' + { queryParameters });
  }

  public async getAll(): Promise<Array<GenderResponse>> {
    const response = await this.httpClient.GET(this.urlList);
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    const data: GenderResponse[] = await response.json();
    return data;
  }

  public async getById(id: number): Promise<GenderResponse | null> {
    throw new Error('Method not implemented.' + { id });
  }
}


export class GetAllGenderUseCase implements IUseCase<void, GenderResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.GENDER}`;
  }
  async execute(): Promise<GenderResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
